import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import * as bootstrap from "bootstrap";
import imageCompression from "browser-image-compression";

function AdminChefs() {
  const [chefs, setChefs] = useState([]);
  const [newChef, setNewChef] = useState({
    name: "",
    specialty: "",
    experience: "",
    contact: "",
    awards: "",
    description: "",
    imageBuffer: null,
    fileName: "",
    previewUrl: "",
  });
  const [editChef, setEditChef] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const chefsPerPage = 5; // Số chef mỗi trang
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/chefs");
      // Thêm server host nếu imageUrl thiếu
      const chefsWithFullImage = response.data.map((chef) => ({
        ...chef,
        imageUrl: chef.imageUrl
          ? `http://localhost:3001/uploads/${chef.imageUrl}`
          : null,
      }));
      setChefs(chefsWithFullImage);
    } catch (err) {
      console.error("Error fetching chefs:", err);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Khi search, reset về trang 1
  }, [searchKeyword]);

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newChef.name);
      formData.append("specialty", newChef.specialty);
      formData.append("experience", newChef.experience);
      formData.append("contact", newChef.contact);
      formData.append("awards", newChef.awards);
      formData.append("description", newChef.description);

      if (newChef.file) {
        formData.append("image", newChef.file); // ảnh upload
      }

      await axios.post("http://localhost:3001/api/chefs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Chef created successfully");
      setNewChef({
        name: "",
        specialty: "",
        experience: "",
        contact: "",
        awards: "",
        description: "",
        imageBuffer: null,
        file: null,
        fileName: "",
        previewUrl: "",
      });
      fetchChefs();
      bootstrap.Modal.getInstance(
        document.getElementById("addChefModal")
      ).hide();
    } catch (err) {
      console.error("Error creating chef:", err);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editChef.name);
      formData.append("specialty", editChef.specialty);
      formData.append("experience", editChef.experience);
      formData.append("contact", editChef.contact);
      formData.append("awards", editChef.awards);
      formData.append("description", editChef.description);

      if (editChef.file) {
        formData.append("image", editChef.file); // nếu có chọn ảnh mới
      }

      await axios.put(
        `http://localhost:3001/api/chefs/${editChef._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Chef updated successfully");
      setEditChef(null);
      fetchChefs();
      bootstrap.Modal.getInstance(
        document.getElementById("editChefModal")
      ).hide();
    } catch (err) {
      console.error("Error updating chef:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this chef?")) {
      try {
        await axios.delete(`http://localhost:3001/api/chefs/${id}`);
        alert("Chef deleted successfully");
        fetchChefs();
      } catch (err) {
        console.error("Error deleting chef:", err);
      }
    }
  };

  // Filter chefs theo keyword
  const filteredChefs = chefs.filter(
    (chef) =>
      chef.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chef.specialty.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Phân trang
  const indexOfLastChef = currentPage * chefsPerPage;
  const indexOfFirstChef = indexOfLastChef - chefsPerPage;
  const currentChefs = filteredChefs.slice(indexOfFirstChef, indexOfLastChef);
  const totalPages = Math.ceil(filteredChefs.length / chefsPerPage);

  return (
    <div className="container">
      <h2 className="text-center mb-3">Manage Chefs</h2>
      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name or specialty..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button
          onClick={() => {
            setNewChef({
              name: "",
              specialty: "",
              experience: "",
              contact: "",
              awards: "",
              description: "",
              imageBuffer: null,
              file: null,
              fileName: "",
              previewUrl: "",
            });
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            new Modal(document.getElementById("addChefModal")).show();
          }}
        >
          Add Chef
        </button>
      </div>
      {/* Danh sách chef */}
      <div className="card">
        <div className="card-body">
          <span style={{ fontWeight: "bold", fontSize: "20px" }}>
            Chefs List
          </span>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Contact</th>
                <th>Awards</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentChefs.map((chef) => (
                <tr key={chef._id}>
                  <td>{chef.name}</td>
                  <td>{chef.specialty}</td>
                  <td>{chef.experience} years</td>
                  <td>+{chef.contact}</td>
                  <td>
                    {chef.awards
                      ?.split("\n") // Nếu bạn lưu bằng dấu xuống dòng, hoặc dùng .split(',') nếu phân cách bằng dấu phẩy
                      .map((award, idx) => (
                        <div key={idx}>{award}</div>
                      ))}
                  </td>
                  <td>{chef.description}</td>
                  <td>
                    <button
                      className="btn-select selected"
                      onClick={() => {
                        setEditChef({
                          ...chef,
                          previewUrl: chef.imageUrl, // Lưu imageUrl vào previewUrl nếu chưa upload mới
                          file: null, // reset file mới
                        });
                        new Modal(
                          document.getElementById("editChefModal")
                        ).show();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-select"
                      onClick={() => handleDelete(chef._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentChefs.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    {searchKeyword
                      ? "No matching chefs found."
                      : "No chefs available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}

          {filteredChefs.length > 0 && (
            <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
              <button
                className=""
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                className=""
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Thêm Chef */}
      <div className="modal fade" id="addChefModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Chef</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {[
                "name",
                "specialty",
                "experience",
                "contact",
                "awards",
                "description",
              ].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>

                  {["description", "awards"].includes(field) ? (
                    <textarea
                      className="form-control"
                      value={newChef[field]}
                      onChange={(e) =>
                        setNewChef({ ...newChef, [field]: e.target.value })
                      }
                    />
                  ) : field === "contact" ? (
                    <div className="input-group">
                      <span className="input-group-text">+</span>
                      <input
                        className="form-control"
                        type="number"
                        value={newChef[field]}
                        onChange={(e) =>
                          setNewChef({
                            ...newChef,
                            [field]: e.target.value.replace(/^\+/, ""),
                          })
                        }
                      />
                    </div>
                  ) : (
                    <input
                      className="form-control"
                      type={field === "experience" ? "number" : "text"}
                      value={newChef[field]}
                      onChange={(e) =>
                        setNewChef({ ...newChef, [field]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}
              {/* Upload Image */}
              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewChef((prev) => ({
                        ...prev,
                        file: file,
                        previewUrl: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />
                {newChef.previewUrl && (
                  <img
                    src={newChef.previewUrl}
                    alt="Preview"
                    className="img-thumbnail mt-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button data-bs-dismiss="modal">Cancel</button>
              <button onClick={handleCreate}>Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa Chef */}
      <div className="modal fade" id="editChefModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            {editChef && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Chef</h5>
                  <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  {[
                    "name",
                    "specialty",
                    "experience",
                    "contact",
                    "awards",
                    "description",
                  ].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>

                      {["description", "awards"].includes(field) ? (
                        <textarea
                          className="form-control"
                          value={editChef[field]}
                          onChange={(e) =>
                            setEditChef({
                              ...editChef,
                              [field]: e.target.value,
                            })
                          }
                        />
                      ) : field === "contact" ? (
                        <div className="input-group">
                          <span className="input-group-text">+</span>
                          <input
                            className="form-control"
                            type="number"
                            value={editChef[field]}
                            onChange={(e) =>
                              setEditChef({
                                ...editChef,
                                [field]: e.target.value.replace(/^\+/, ""),
                              })
                            }
                          />
                        </div>
                      ) : (
                        <input
                          className="form-control"
                          type={field === "experience" ? "number" : "text"}
                          value={editChef[field]}
                          onChange={(e) =>
                            setEditChef({
                              ...editChef,
                              [field]: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>
                  ))}
                  {/* Upload New Image */}
                  <div className="mb-3">
                    <label className="form-label">
                      Change Image (Optional)
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditChef((prev) => ({
                            ...prev,
                            file: file,
                            previewUrl: URL.createObjectURL(file),
                          }));
                        }
                      }}
                    />
                    {editChef.previewUrl && (
                      <img
                        src={editChef.previewUrl}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button data-bs-dismiss="modal">Cancel</button>
                  <button onClick={handleSave}>Save</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChefs;
