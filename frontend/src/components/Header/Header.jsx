import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo-black.png";
import styles from "./Header.module.css";
import ButtonWhite from "../Buttons/ButtonWhite";

import CartItem from "../CartItem";

import { Offcanvas } from "bootstrap";

import React, { useEffect, useState } from "react";
import axios from "axios";

function Header() {
  const [items, setItems] = useState([]);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Fetch user information
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:3001/api/auth/user/info",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setIsLoggedIn(false);
    }
  };

  // Load user info on mount
  useEffect(() => {
    fetchUserInfo();

    // Listen for the "userLoggedIn" event
    const handleUserLoggedIn = () => {
      fetchUserInfo();
    };
    window.addEventListener("userLoggedIn", handleUserLoggedIn);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserLoggedIn);
    };
  }, []);

  // Start load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
      };
      setItems(savedCart.items);
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);
  // End load cart from localStorage

  // Start handle scroll to show/hide header
  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll down
        setHeaderVisible(false);
      } else {
        // Scroll up
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader, { passive: true });

    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);
  // End handle scroll to show/hide header

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {/* *****offcanvas sidebar start***** */}
      <div
        className="offcanvas offcanvas-start w-25 d-flex flex-column"
        tabIndex="-1"
        id="cartSideBar"
        aria-labelledby="offcanvasDemoLabel"
      >
        {/* Header */}
        <div className="offcanvas-header shadow" style={{ zIndex: "10" }}>
          <div>
            <h6 style={{ marginBottom: "0px" }}>Review your selected items</h6>
            <h1
              className="offcanvas-title"
              id="offcanvasDemoLabel"
              style={{ fontSize: "35px" }}
            >
              Your cart
            </h1>
          </div>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        {/* Body */}
        <div className="offcanvas-body flex-grow-1 overflow-auto">
          <div style={{ minHeight: "100%" }}>
            {items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onIncrease={(id) => {
                  const updatedItems = items.map((item) =>
                    item._id === id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  );
                  setItems(updatedItems);
                  localStorage.setItem(
                    "cart",
                    JSON.stringify({ items: updatedItems })
                  );
                  window.dispatchEvent(new Event("cartUpdated"));
                }}
                onDecrease={(id) => {
                  const updatedItems = items.map((item) =>
                    item._id === id && item.quantity > 1
                      ? { ...item, quantity: item.quantity - 1 }
                      : item
                  );
                  setItems(updatedItems);
                  localStorage.setItem(
                    "cart",
                    JSON.stringify({ items: updatedItems })
                  );
                  window.dispatchEvent(new Event("cartUpdated"));
                }}
                onDelete={(id) => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this item?"
                  );
                  if (confirmDelete) {
                    const updatedItems = items.filter(
                      (item) => item._id !== id
                    );
                    setItems(updatedItems);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify({ items: updatedItems })
                    );
                    window.dispatchEvent(new Event("cartUpdated"));
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="offcanvas-footer p-3 border-top shadow"
          style={{ flexShrink: 0, zIndex: 10 }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 fw-bold">Total:</p>
            <span className="fs-4 fw-bold">
              $
              {items
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString()}
            </span>
          </div>
          <Link to={"/check-out"}>
            <ButtonWhite
              buttontext={"Check Out"}
              className="w-100 mt-3 py-2"
              style={{ height: "40px", fontSize: "15px" }}
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </Link>
        </div>
      </div>
      {/* *****offcanvas sidebar end***** */}
      {/* *****Header start***** */}
      <header
        className={`d-flex align-items-center ${styles.header} ${
          headerVisible ? styles.visible : styles.hidden
        }`}
      >
        <div className="container-fluid">
          <div className="row justify-content-center">
            {/* Header Left */}
            <div
              className={
                "col-5 text-center  d-flex justify-content-between " +
                styles.nav
              }
            >
              <div>
                <ButtonWhite
                  buttontext={`Cart (${items.length})`}
                  type="button"
                  onClick={() => {
                    const offCanvas = new Offcanvas(
                      document.getElementById("cartSideBar")
                    );
                    offCanvas.show();
                  }}
                />
              </div>
              <ul className={styles.mainMenus}>
                {/* <li>
                  <Link to="/">Home</Link>
                </li> */}
                <li>
                  <Link to="/chefs">Chefs</Link>
                </li>
                <li>
                  <Link to="/menus">Menus</Link>
                </li>
              </ul>
            </div>

            {/* Header Center */}
            <div className={"col-2 text-center " + styles.center}>
              <Link to="/">
                <img src={logo} alt="logo-black" />
              </Link>
            </div>

            {/* Header Right */}
            <div
              className={
                "col-5 text-center d-flex justify-content-between " + styles.nav
              }
            >
              <div>
                <ul className={styles.mainMenus}>
                  <li>
                    <Link to="/shop">Shop</Link>
                  </li>
                  {/* <li>
                    <div className="dropdown">
                      <div
                        className={
                          styles.dropdownText + " dropdown-toggle text-dark"
                        }
                        data-bs-toggle="dropdown"
                        role="button"
                        style={{ cursor: "pointer" }}
                      >
                        Join with us
                      </div>
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="/register-class">
                            Register a cooking class
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/recuitment">
                            Recruitment
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li> */}
                  <li>
                    <Link to="/reservation">Book table</Link>
                  </li>
                </ul>
              </div>
              <div>
                {isLoggedIn ? (
                  <div
                    className="dropdown"
                    onMouseEnter={(e) => {
                      const button = e.currentTarget.querySelector("button");
                      const menu =
                        e.currentTarget.querySelector(".dropdown-menu");
                      button.classList.add("show");
                      menu.classList.add("show");
                    }}
                    onMouseLeave={(e) => {
                      const button = e.currentTarget.querySelector("button");
                      const menu =
                        e.currentTarget.querySelector(".dropdown-menu");
                      button.classList.remove("show");
                      menu.classList.remove("show");
                    }}
                  >
                    <button
                      className="btn dropdown-toggle p-0 border-0 bg-transparent"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          user?.avatar ||
                          "http://localhost:3001/uploads/default-avatar.png.jpeg"
                        }
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                      />
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="userDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/user-info">
                          User Info
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/edit-profile">
                          Edit Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/order-history">
                          Order History
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={handleLogout}
                          style={{ fontFamily: "JosefinSans" }}
                          to="/"
                        >
                          Log out
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <ButtonWhite
                    buttontext="Login"
                    onClick={() => navigate("/login")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className={styles.contentPadding}></div>
      {/* *****Header end***** */}
    </>
  );
}

export default Header;
