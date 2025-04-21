import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminChefs from "../pages/admin/AdminChefs";
import AdminMenus from "../pages/admin/AdminMenus";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../layouts/AdminLayout";
import React from "react";
import { Navigate } from "react-router-dom";

// Danh sách các route admin
const adminRoutes = [
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },
  {
    path: "/admin/chefs",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminChefs />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  },
  {
    path: "/admin/menus",
    element: (
      <AdminRouteWrapper>
        <AdminLayout>
          <AdminMenus />
        </AdminLayout>
      </AdminRouteWrapper>
    ),
  }
];

function AdminRouteWrapper({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default adminRoutes;
