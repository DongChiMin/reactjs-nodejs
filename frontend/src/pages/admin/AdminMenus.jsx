import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const categories = ["drink", "mainCourse", "dessert", "appetizer"];

function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [editMenu, setEditMenu] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // ✅ thêm current page
  const menusPerPage = 5; // ✅ số lượng món ăn trên mỗi trang

  const [newMenu, setNewMenu] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    price: "",
    imageBuffer: null,
    fileName: "",
    previewUrl: "",
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/menus");
      setMenus(response.data);
    } catch (err) {
      console.error("Error fetching menus:", err);
    }
  };

  // Filter menus based on search keyword
  const filteredMenus = menus.filter(
    (menu) =>
      menu.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      menu.category?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      menu.description?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // ✅ Phân trang: Tính toán danh sách menu cần hiển thị
  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);

  const totalPages = Math.ceil(filteredMenus.length / menusPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        await axios.delete(`http://localhost:3001/api/menus/${id}`);
        alert("Menu deleted successfully");
        fetchMenus();
      } catch (err) {
        console.error("Error deleting menu:", err);
      }
    }
  };

  const handleEdit = (menu) => {
    setEditMenu(menu);
    setNewMenu({
      ...menu,
      previewUrl: menu.imageUrl || "",
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/api/menus/${editMenu._id}`, {
        ...editMenu,
        price: parseFloat(editMenu.price),
      });
      alert("Menu updated successfully");
      setEditMenu(null);
      fetchMenus();
    } catch (err) {
      console.error("Error updating menu:", err);
    }
  };

  const handleChange = (e) => {
    setEditMenu({ ...editMenu, [e.target.name]: e.target.value });
  };

  const handleNewMenuChange = (e) => {
    setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", newMenu.category);

    axios
      .post("http://localhost:3001/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { fileName, category, imageBuffer } = response.data;
        setNewMenu({
          ...newMenu,
          fileName,
          category,
          imageBuffer,
          previewUrl: URL.createObjectURL(file), // Hiển thị ảnh tạm thời
        });
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
      });
  };

  const handleCreateMenu = () => {
    const { name, description, price, category, fileName, imageBuffer } =
      newMenu;

    axios
      .post("http://localhost:3001/api/menus", {
        name,
        description,
        price,
        category,
        fileName,
        imageBuffer,
      })
      .then((res) => {
        alert("Menu created successfully");
        setNewMenu({
          name: "",
          description: "",
          imageUrl: "",
          category: "",
          price: "",
          imageBuffer: null,
          fileName: "",
          previewUrl: "",
        });
        fetchMenus();
      })
      .catch((err) => {
        console.error("Error creating menu:", err);
      });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="container">
      {/* //Modal add new */}
      <div className="modal fade" id="addNewMenu">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* <!-- Modal Header --> */}
            <div className="modal-header">
              <h4 className="modal-title" style={{ fontSize: "30px" }}>
                Add new dish to menu
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* <!-- Modal body --> */}
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newMenu.name}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newMenu.description}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="form-control"
                  />
                  {newMenu.previewUrl && (
                    <img
                      src={newMenu.previewUrl}
                      alt="Preview"
                      style={{
                        width: "100px",
                        marginTop: "10px",
                        border: "1px solid #ccc",
                      }}
                    />
                  )}
                </div>
                <div className="mb-3">
                  <label>Category</label>
                  <select
                    name="category"
                    value={newMenu.category}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newMenu.price}
                    onChange={handleNewMenuChange}
                    className="form-control"
                  />
                </div>

                <div className=" d-flex justify-content-between  mt-5">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn-select"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateMenu}
                    className="btn-select selected"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>

            {/* <!-- Modal footer --> */}
          </div>
        </div>
      </div>

      <h2 className="text-center mb-3">Manage Menus</h2>

      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, category or description..."
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1); // ✅ reset về page 1 khi tìm kiếm
          }}
        />

        <button
          onClick={() => {
            const modal = new Modal(document.getElementById("addNewMenu"));
            modal.show();
          }}
        >
          Add menu
        </button>
      </div>

      <div>
        {/* Menu Table */}
        <div className="card">
          <div className="card-body">
            <div>
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                Menus List
              </span>
            </div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                 {currentMenus.map((menu) => (
                  <tr key={menu._id}>
                    <td>{menu.name}</td>
                    <td>{menu.description}</td>
                    <td>{menu.category}</td>
                    <td>
                      ${menu.price ? Number(menu.price).toFixed(2) : "0.00"}
                    </td>
                    <td>
                      <button
                        className="btn-select selected"
                        data-bs-toggle="modal"
                        data-bs-target="#editMenuModal"
                        onClick={() => setEditMenu(menu)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-select"
                        onClick={() => handleDelete(menu._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                        {/* ✅ Thêm phân trang */}

                        <div className="d-flex justify-content-center align-items-center mt-3 gap-3">

            <button
              className=""
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className=""
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            </div>
          </div>
        </div>

        {/* Edit Menu Modal */}

        <div
          className="modal fade"
          id="editMenuModal"
          tabIndex="-1"
          aria-labelledby="editMenuModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content ">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ fontSize: "30px" }}
                  id="editMenuModalLabel"
                >
                  Edit Menu
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {editMenu && (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editMenu.name}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        value={editMenu.description}
                        onChange={handleChange}
                        className="form-control"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="text"
                        name="imageUrl"
                        value={editMenu.imageUrl}
                        onChange={handleChange}
                        className="form-control"
                      />
                      {editMenu.imageUrl && (
                        <img
                          src={`http://localhost:3001${editMenu.imageUrl}`}
                          alt="Preview"
                          style={{
                            width: "100px",
                            marginTop: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        name="category"
                        value={editMenu.category}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={editMenu.price}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-select"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-select selected"
                  onClick={handleSave}
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMenus;
