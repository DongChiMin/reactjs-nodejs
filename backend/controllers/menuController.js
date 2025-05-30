const Menu = require("../models/menuModel");
const { saveImageToUploads } = require("./uploadController");
const path = require('path'); 
const fs = require('fs');
// Lấy danh sách menu
exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.find(); 
    res.json(menus); 
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy menu theo ID
exports.getMenuById = async (req, res) => {
  const { id } = req.params; 

  try {
    const menu = await Menu.findById(id); 

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menu); 
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Lấy menu theo Category
exports.getMenuByCategory = async (req, res) => {
  const { category } = req.params; 

  try {
    const menus = await Menu.find({ category }).limit(4); 

    if (menus.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menus); 
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Cập nhật món ăn
exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, imageBuffer, fileName, mimeType } = req.body;

  try {
    const menu = await Menu.findById(id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    // Cập nhật thông tin cơ bản
    menu.name = name || menu.name;
    menu.description = description || menu.description;
    menu.price = price || menu.price;
    menu.category = category || menu.category;

    // Nếu có ảnh mới thì lưu lại
    if (imageBuffer && fileName && mimeType) {
      // Xóa ảnh cũ nếu có
      if (menu.imageUrl) {
        const oldPath = path.join(__dirname, `../${menu.imageUrl}`);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const newImageUrl = saveImageToUploads(imageBuffer, fileName, mimeType, category);
      if (!newImageUrl) return res.status(500).json({ message: "Error saving image" });
      menu.imageUrl = newImageUrl;
    }

    await menu.save();
    res.json({ message: "Menu updated successfully", menu });
  } catch (err) {
    console.error("Update menu error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Xóa món ăn
exports.deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
   
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Xác định đường dẫn ảnh cần xóa
    const imagePath = path.join(__dirname, `../${menu.imageUrl}`);
    console.log("Image path:", imagePath); 

    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); 
      console.log("Image deleted successfully"); 
    } else {
      console.log("Image not found at path:", imagePath); 
    }

    
    await Menu.findByIdAndDelete(id);

   
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Tạo một món ăn mới
exports.createMenu = async (req, res) => {
  try {
    const { name, description, price, category, imageBuffer, fileName, mimeType } = req.body;

    
    if (!name || !description || !price || !category || !imageBuffer || !fileName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Lưu ảnh và lấy URL
    const imageUrl = saveImageToUploads(imageBuffer, fileName, mimeType, category);
    
    if (!imageUrl) {
      return res.status(500).json({ message: "Error saving image" });
    }

    
    const menu = new Menu({
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl, 
    });

   
    await menu.save();

    
    res.status(201).json({ message: "Menu created successfully", menu });

  } catch (err) {
    console.error("Error creating menu:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};