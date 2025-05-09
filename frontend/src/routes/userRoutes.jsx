import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Pages
import Home from "../pages/Home";
import Menus from "../pages/Menus";
import Blogs from "../pages/Blogs";
import Chefs from "../pages/chefs/Chefs";
import RegisterClass from "../pages/RegisterClass";
import Recruitment from "../pages/Recuitment";
import Shop from "../pages/Shop";
import Detail from "../pages/Detail";
import CheckOut from "../pages/CheckOut";
import Login from "../pages/Login";
import Test from "../pages/test";
import Register from "../pages/Register";
import EditProfile from "../pages/user/EditProfile";
import UserInfo from "../pages/user/UserInfo";
// Layout
import UserLayout from "../layouts/UserLayout";
import Reservation from "../pages/Reservation";

const routes = [
  {
    path: "/",
    element: (
      <UserLayout>
        <Home />
      </UserLayout>
    ),
  },
  {
    path: "/menus",
    element: (
      <UserLayout>
        <Menus />
      </UserLayout>
    ),
  },
  {
    path: "/blogs",
    element: (
      <UserLayout>
        <Blogs />
      </UserLayout>
    ),
  },
  {
    path: "/chefs",
    element: (
      <UserLayout>
        <Chefs />
      </UserLayout>
    ),
  },
  {
    path: "/recruitment",
    element: (
      <UserLayout>
        <Recruitment />
      </UserLayout>
    ),
  },
  {
    path: "/shop",
    element: (
      <UserLayout>
        <Shop />
      </UserLayout>
    ),
  },
  {
    path: "/recuitment",
    element: (
      <UserLayout>
        <Recruitment />
      </UserLayout>
    ),
  },
  {
    path: "/register-class",
    element: (
      <UserLayout>
        <RegisterClass />
      </UserLayout>
    ),
  },
  {
    path: "/detail",
    element: (
      <UserLayout>
        <Detail />
      </UserLayout>
    ),
  },
  {
    path: "/detail/:id",
    element: (
      <UserLayout>
        <Detail />
      </UserLayout>
    ),
  },
  {
    path: "/check-out",
    element: (
      <UserLayout>
        <CheckOut />
      </UserLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <UserLayout>
        <Login />
      </UserLayout>
    ),
  },
  {
    path: "/reservation",
    element: (
      <UserLayout>
        <Reservation />
      </UserLayout>
    ),
  },
  {
    path: "/test",
    element: (
      <UserLayout>
        <Test />
      </UserLayout>
    ),
  },
  {
    path: "/register",
    element: (
      <UserLayout>
        <Register />
      </UserLayout>
    ),
  },
  {
    path: "/edit-profile",
    element: (
      <UserLayout>
        <EditProfile />
      </UserLayout>
    ),
  },
  {
    path: "/user-info",
    element: (
      <UserLayout>
        <UserInfo />
      </UserLayout>
    ),
  },
];

function UserRoutes() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export { routes, UserRoutes };
