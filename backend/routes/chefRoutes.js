const express = require("express");
const router = express.Router();
const {
  getChefs,
  createChef,
  updateChef,
  deleteChef,
  uploadChefImage,
} = require("../controllers/chefController");

// Route lấy tất cả chefs
router.get("/", getChefs);

// Thêm chef mới (có upload ảnh)
router.post("/", uploadChefImage, createChef);

// Cập nhật chef (có upload ảnh mới)
router.put("/:id", uploadChefImage, updateChef);

// Xóa chef
router.delete("/:id", deleteChef);

module.exports = router;
