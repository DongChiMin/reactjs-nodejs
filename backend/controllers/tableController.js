const Table = require("../models/tableModel");
const Reservation = require("../models/reservationModel");

// Lấy danh sách tất cả các khu vực (seatingArea) không trùng lặp
// Thêm console.log để debug
exports.getSeatingAreas = async (req, res) => {
  try {
    const areas = await Table.aggregate([
      {
        $group: {
          _id: "$seatingArea",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // console.log("Kết quả aggregation:", areas);

    const areaNames = areas.map((area) => area._id).filter(Boolean);
    // console.log("Danh sách khu vực sau khi xử lý:", areaNames);

    res.status(200).json({
      success: true,
      data: areaNames,
    });
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
    });
  }
};

//Tạo bàn mới
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, seatingArea, tableType, capacity, note } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!tableNumber || !seatingArea || !tableType || !capacity) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Kiểm tra trùng tableNumber
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(409).json({ message: "Table number already exists." });
    }

    const newTable = new Table({
      tableNumber,
      seatingArea,
      tableType,
      capacity,
      note,
    });

    await newTable.save();

    res
      .status(201)
      .json({ message: "Table created successfully", data: newTable });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy số bàn tiếp theo (tìm số nhỏ nhất chưa tồn tại)
exports.getNextTableNumber = async (req, res) => {
  try {
    const tables = await Table.find({}, "tableNumber").sort("tableNumber");

    const usedNumbers = tables.map((t) => t.tableNumber).sort((a, b) => a - b);

    let nextNumber = 1;
    for (let i = 0; i < usedNumbers.length; i++) {
      if (usedNumbers[i] !== nextNumber) {
        break;
      }
      nextNumber++;
    }

    res.status(200).json({ nextTableNumber: nextNumber });
  } catch (error) {
    console.error("Lỗi khi lấy số bàn tiếp theo:", error);
    res.status(500).json({ error: "Không thể lấy số bàn tiếp theo" });
  }
};

//Lấy toàn bộ bàn
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 }); // sắp xếp theo số bàn tăng dần
    res.status(200).json({ success: true, data: tables });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bàn:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

//Thêm lịch sử đặt bàn vào bàn này theo id
exports.addNewReservation = async (req, res) => {
  try {
    const tableId = req.params.id;
    const { confirmReservationId, dateTime } = req.body;

    // Kiểm tra nếu không có thông tin xác nhận
    if (!confirmReservationId || !dateTime) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin xác nhận đơn đặt bàn",
      });
    }

    // Tìm bàn theo ID
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bàn",
      });
    }

    // Đảm bảo bookingHistory là mảng (nếu chưa có, khởi tạo mảng trống)
    table.bookingHistory = table.bookingHistory || [];

    // Convert thời gian nhận từ client thành kiểu Date
    const startTime = new Date(dateTime); // Thời gian bắt đầu giữ bàn
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Thời gian kết thúc (2 giờ sau)

    // Thêm thông tin vào lịch sử đặt bàn (bookingHistory)
    table.bookingHistory.push({
      reservationId: confirmReservationId, // ID của đơn đặt bàn
      startTime: startTime, // Thời gian bắt đầu giữ bàn
      endTime: endTime, // Thời gian kết thúc giữ bàn (2 giờ sau)
    });

    // 🔄 Sắp xếp lại lịch sử đặt bàn theo thứ tự thời gian tăng dần
    table.bookingHistory.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );

    // Cập nhật bàn và lưu vào cơ sở dữ liệu
    await table.save();

    return res.status(200).json({
      success: true,
      message: "Đặt bàn thành công và bàn đã bị khóa trong 2 giờ.",
    });
  } catch (error) {
    console.error("❌ Lỗi khi thêm đơn đặt bàn:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm đơn đặt bàn",
    });
  }
};

//Xóa bàn và sửa lịch sử đặt bàn liên quan đến bàn đó.
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ tham số URL

    const table = await Table.findById(id);

    //Note các đơn đặt bàn đã từng đặt bàn này để biết bàn này đã xóa
    for (let booking of table.bookingHistory) {
      // Tìm đơn đặt bàn dựa trên reservationId
      const reservation = await Reservation.findById(booking.reservationId);
      if (!reservation) {
        continue; // Nếu không tìm thấy đơn đặt bàn, tiếp tục với booking khác
      }

      // Cập nhật selectedTable.note thành "table deleted"
      reservation.set("selectedTable.note", `table #${id} deleted`);
      reservation.set("status", "table deleted");

      // Lưu lại thông tin đã cập nhật
      const updatedReservation = await reservation.save();
      // console.log("Dữ liệu mới của đơn", updatedReservation);
    }

    // Tìm bàn theo id và xóa
    tableToDelete = await Table.findByIdAndDelete(id);

    if (!tableToDelete) {
      return res.status(404).json({ message: "Table not found." });
    }

    res
      .status(200)
      .json({ message: "Table deleted successfully", data: table });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Cập nhật bàn: Chỉ sửa note và capacity
exports.updateTable = async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { capacity, note } = req.body;
    const tableId = req.params.id; // ID của bàn từ tham số URL

    // Kiểm tra xem có dữ liệu capacity và note trong yêu cầu không
    if (capacity === undefined || note === undefined) {
      return res
        .status(400)
        .json({ message: "Capacity and note are required" });
    }

    // Tìm bàn theo ID và cập nhật
    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      { capacity, note },
      { new: true } // Trả về tài nguyên đã được cập nhật
    );

    // Nếu không tìm thấy bàn với ID đó
    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Trả về dữ liệu bàn đã được cập nhật
    res.status(200).json(updatedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
