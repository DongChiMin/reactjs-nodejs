import React from "react";
import { Link, useNavigate } from "react-router-dom";
import adminAvatar from "../assets/images/chefs/chef-1.jpg";

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "#343a40",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top menu */}
        <div>
          <h2 style={{ fontSize: "45px", marginBottom: "20px" }}>Admin</h2>
          <div style={{ fontSize: "15px", marginBottom: "10px", opacity: 0.7 }}>
            HOME
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginBottom: "20px",
              fontSize: "15px",
            }}
          >
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <i
                  className="fas fa-tachometer-alt"
                  style={{ marginRight: "10px" }}
                ></i>
                Dashboard
              </Link>
            </li>
          </ul>

          <div style={{ fontSize: "15px", marginBottom: "10px", opacity: 0.7 }}>
            UTILITIES
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              marginBottom: "20px",
              fontSize: "15px",
            }}
          >
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/menus"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <i
                  className="fas fa-utensils"
                  style={{ marginRight: "10px" }}
                ></i>
                Manage Menus
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/chefs"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <i
                  className="fas fa-user-tie"
                  style={{ marginRight: "10px" }}
                ></i>
                Manage Chefs
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/orders"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <i
                  className="fas fa-shopping-cart"
                  style={{ marginRight: "10px" }}
                ></i>
                Manage Orders
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link
                to="/admin/reservations"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <i
                  className="fas fa-calendar-check"
                  style={{ marginRight: "10px" }}
                ></i>
                Manage Reservations
              </Link>
            </li>
          </ul>

          <div style={{ fontSize: "15px", marginBottom: "10px", opacity: 0.7 }}>
            AUTH
          </div>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "15px" }}>
            <li>
              {/* Logout button dưới cùng */}
              <div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "1px solid #fff",
                    color: "#fff",
                    padding: "10px 20px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="fas fa-sign-out-alt"
                    style={{ marginRight: "10px" }}
                  ></i>
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, background: "#f8f9fa" }}>
        {/* Nội dung động */}
        <div style={{ padding: "20px" }}>{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
