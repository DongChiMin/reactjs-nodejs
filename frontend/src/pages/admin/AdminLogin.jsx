import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        username,
        password,
      });

      if (response.data.role === "admin") {
        // Save token to localStorage
        localStorage.setItem("adminToken", response.data.token);
        navigate("/admin"); // Redirect to admin dashboard
      } else {
        setError("Access denied. Admins only.");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg p-5"
        style={{
          width: "500px",
          borderRadius: "15px",
          padding: "40px",
        }}
      >
        <h2 className="text-center mb-5" style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Admin Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label" style={{ fontSize: "1.2rem" }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ fontSize: "1rem", padding: "10px" }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label" style={{ fontSize: "1.2rem" }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ fontSize: "1rem", padding: "10px" }}
            />
          </div>
          {error && <p className="text-danger text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ fontSize: "1.2rem", padding: "10px" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;