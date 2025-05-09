const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");
// Lấy danh sách các đặt bàn (reservations) từ cơ sở dữ liệu
exports.getReservations = async (req, res) => {
  try {
    // Lấy các đặt bàn từ cơ sở dữ liệu
    const reservations = await Reservation.find();

    // Trả về danh sách các đơn đặt bàn
    res.json(reservations);
  } catch (err) {
    // Nếu có lỗi xảy ra, trả về thông báo lỗi
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

exports.getReservationByID = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    // Nếu ID không hợp lệ hoặc có lỗi truy vấn
    console.error("Error getting reservation:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while getting reservation",
      error: error.message,
    });
  }
};

//Tạo đơn đặt hàng mới
exports.addReservations = async (req, res) => {
  console.log(req.body);
  const {
    createdBy,
    customerName,
    emailAddress,
    phoneNumber,
    numberOfGuest,
    seatingArea,
    tableType,
    note,
    dateTime,
    // Lấy giá trị ngày từ người dùng
  } = req.body;

  try {
    // Chuyển đổi dateTime từ chuỗi sang đối tượng Date
    const date = new Date(dateTime); // Đây sẽ là một đối tượng Date hợp lệ trong MongoDB

    // Kiểm tra nếu dateTime không hợp lệ
    if (isNaN(date)) {
      return res.status(400).json({ message: "Invalid dateTime format" });
    }

    // Tạo đối tượng Reservation mới với dữ liệu từ formData
    const newReservation = new Reservation({
      createdBy,
      customerName,
      emailAddress,
      phoneNumber,
      numberOfGuest,
      seatingArea,
      tableType,
      note,
      dateTime: date, // Lưu vào MongoDB dưới dạng đối tượng Date
      createdAt: new Date(), // Thời gian tạo được lưu dưới dạng đối tượng Date
      status: "pending", // Trạng thái mặc định
    });

    // Lưu đối tượng vào MongoDB
    const savedReservation = await newReservation.save();

    // Chuyển đổi _id thành chuỗi nếu cần
    savedReservation._id = savedReservation._id.toString();

    // Trả về kết quả đã lưu dưới dạng JSON
    res.status(201).json(savedReservation);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(400).json({ message: "Error creating reservation", error });
  }
};

//Cập nhật lại reservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Loại bỏ các trường không được phép cập nhật
    const { _id, __v, createdAt, createdBy, ...updateData } = req.body;

    //Nếu cancel đơn này --> Xóa lịch sử booking bên table
    if (updateData.status.toLowerCase() == "cancelled") {
      const reservation = await Reservation.findById(id);

      if (reservation.selectedTable != null) {
        //Lấy table mà có chứa lịch sử đặt bàn là đơn đặt bàn này
        const table = await Table.findById(reservation.selectedTable._id);
        const bookingHistory = table.bookingHistory;

        //Duyệt mảng để tìm index
        const index = bookingHistory.findIndex((entry) =>
          entry.reservationId.equals(reservation._id)
        );

        if (index !== -1) {
          table.bookingHistory.splice(index, 1); // xoá 1 phần tử tại vị trí index
          await table.save(); // lưu lại table sau khi xoá
        }
      }
    }

    // Cập nhật chỉ với dữ liệu hợp lệ
    const updated = await Reservation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//confirm đơn đặt bàn
exports.confirmReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { selected } = req.body;

    if (!selected || !selected._id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bàn đã chọn",
      });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn đặt bàn",
      });
    }

    // ✅ Kiểm tra và cập nhật hoặc thêm mới trường `selectedTable`
    reservation.selectedTable = selected;

    // Cập nhật thêm status nếu muốn
    reservation.status = "confirmed";

    // Lưu vào DB
    const updatedReservation = await reservation.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật selectedTable thành công",
      data: updatedReservation,
    });
  } catch (error) {
    console.error("❌ Lỗi xác nhận đặt bàn:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật selectedTable",
    });
  }
};

// Xóa reservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    //Nếu đơn này đã confirm --> Bên table cũng có thông tin về đơn này --> Cần xóa
    if (reservation.selectedTable != null) {
      //Lấy table mà có chứa lịch sử đặt bàn là đơn đặt bàn này
      const table = await Table.findById(reservation.selectedTable._id);
      const bookingHistory = table.bookingHistory;

      //Duyệt mảng để tìm index
      const index = bookingHistory.findIndex((entry) =>
        entry.reservationId.equals(reservation._id)
      );

      if (index !== -1) {
        table.bookingHistory.splice(index, 1); // xoá 1 phần tử tại vị trí index
        await table.save(); // lưu lại table sau khi xoá
      }
    }

    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
      data: deletedReservation,
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting reservation",
    });
  }
};
