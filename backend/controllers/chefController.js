const Chef = require("../models/chefModel");
const multer = require("multer");
const path = require("path");

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/chefs"); // lưu vào thư mục uploads/chefs
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ví dụ: 168546468.png
  },
});

const upload = multer({ storage: storage });

exports.uploadChefImage = upload.single("image"); // middleware upload 1 file

// Lấy danh sách chefs
exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Thêm chef mới
exports.createChef = async (req, res) => {
  const { name, specialty, experience, contact, awards, description } =
    req.body;
  const imageUrl = req.file ? "chefs/" + req.file.filename : "";

  try {
    const newChef = new Chef({
      name,
      specialty,
      imageUrl,
      experience,
      contact,
      awards,
      description,
    });
    const savedChef = await newChef.save();
    res
      .status(201)
      .json({ message: "Chef created successfully", chef: savedChef });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Cập nhật thông tin chef
exports.updateChef = async (req, res) => {
  const { id } = req.params;
  const { name, specialty, experience, contact, awards, description } =
    req.body;
  const updateData = {
    name,
    specialty,
    experience,
    contact,
    awards,
    description,
  };

  if (req.file) {
    updateData.imageUrl = "chefs/" + req.file.filename;
  }

  try {
    const updatedChef = await Chef.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedChef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    res.json({ message: "Chef updated successfully", chef: updatedChef });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Xóa chef
exports.deleteChef = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedChef = await Chef.findByIdAndDelete(id);

    if (!deletedChef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    res.json({ message: "Chef deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
