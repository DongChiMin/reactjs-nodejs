import React, { useState, useEffect } from "react";
import axios from "axios";

function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/api/auth/user/info", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data;
        setFormData({
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
        setPreviewAvatar(user.avatar || "http://localhost:3001/uploads/default-avatar.png.jpeg");
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        alert("Failed to load user information. Please try again.");
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3001/api/auth/user/update",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);

        await axios.post("http://localhost:3001/api/auth/user/update-avatar", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Profile</h2>
      
      <div className="d-flex flex-wrap justify-content-center align-items-start">
        {/* Avatar bên trái */}
        <div className="text-center mb-4" style={{ minWidth: "250px" }}>
          <img
            src={previewAvatar}
            alt="Avatar Preview"
            className="rounded-circle"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
          <div className="mt-3">
            <label className="form-label">Change Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Form bên phải */}
        <form onSubmit={handleSubmit} className="flex-grow-1 ps-4" style={{ maxWidth: "600px" }}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
