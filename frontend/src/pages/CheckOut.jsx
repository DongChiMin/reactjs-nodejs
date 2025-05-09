import React, { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import Table from "../components/Table";
import CustomForm from "../components/CustomForm";
import PageHeader from "../components/PageHeader/PageHeader";
import img1 from "../assets/images/menus/menu-slider-1.jpg";

import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CheckOut() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
  });

  //các giá trị trong bảng, giá trị hàng hóa
  const selectedData = items
    .filter((item) => selectedItems.includes(item._id))
    .map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }));

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Unit Price ($)",
      accessor: "price",
      cell: (value) => `$${value.toFixed(2)}`,
    },
    {
      header: "Subtotal ($)",
      accessor: "total",
      cell: (value) => `$${value.toFixed(2)}`,
    },
  ];

  const totalAmount = items
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const fields = [
    {
      name: "customerName",
      label: "Full Name",
      type: "text",
      placeholder: "",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "",
      required: true,
    },
    {
      name: "emailAddress",
      label: "Email Address",
      type: "text",
      placeholder: "",
      required: true,
    },
    {
      name: "address",
      label: "Delivery Address",
      type: "text",
      placeholder: "Street, district, city...",
      required: true,
    },
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "select",
      options: [
        { label: "Cash on Delivery (COD)", value: "cod" },
        { label: "VNPay", value: "vnpay" },
      ],
      required: true,
    },
    {
      name: "note",
      label: "Additional Notes",
      type: "text",
      placeholder: "E.g. Deliver after 6 PM, no chili...",
      required: false,
    },
    {
      name: "agreeTerms",
      label: "I agree to the terms and conditions",
      type: "checkbox",
      required: true,
    },
  ];

  const handleSubmit = async (data) => {
    console.log("Form data:", data);

    const confirm = window.confirm("Are you sure you want to place the order?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to place an order.");
        return;
      }

      const order = {
        ...data,
        items: items
          .filter((item) => selectedItems.includes(item._id))
          .map((item) => ({
            menuItemId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        totalPrice: totalAmount,
        createdAt: new Date().toISOString(),
      };
      const token = localStorage.getItem("token");

      if (data.paymentMethod === "vnpay") {
        // Gọi API create_payment_url để lấy URL thanh toán
        const response = await axios.post(
          "http://localhost:3001/api/payment/create_payment_url",
          {
            amount: totalAmount,
            paymentMethod: "vnpay",
          }
        );

        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        }
      } else {
        await axios.post("http://localhost:3001/api/orders/add", order);

        const cart = JSON.parse(localStorage.getItem("cart")) || {};
        if (cart.items) {
          cart.items = cart.items.filter(
            (item) => !selectedItems.includes(item._id)
          );
          localStorage.setItem("cart", JSON.stringify(cart));
        }

        window.dispatchEvent(new Event("cartUpdated"));

        alert("Đặt hàng thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    }
  };

  const handleSelect = (itemId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId];

      console.log("Danh sách món đã chọn:", newSelected);
      return newSelected;
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3001/api/auth/user/info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setFormData({
          customerName: user.username || "",
          phoneNumber: user.phone || "",
          emailAddress: user.email || "",
          address: user.address || "",
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
      };
      setItems(savedCart.items);
    };

    fetchUserInfo();
    loadCart();
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const updateCart = (updatedItems) => {
    setItems(updatedItems);
    const updatedCart = {
      cartId: "67fb8e201f70bf74520565e7",
      items: updatedItems,
    };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedItems = items.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQuantity = (id) => {
    const updatedItems = items.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedItems);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const deleteItem = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      const updatedItems = items.filter((item) => item._id !== id);
      updateCart(updatedItems);
    }
  };

  return (
    <>
      <PageHeader
        backgroundType={"image"}
        backgroundSrc={img1}
        h2Title={""}
        title={"Check out"}
        subTitle={""}
        height="20vh"
        titleSize="8rem"
      />
      <div className="section">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <h2
                  className="fw-bold text-center"
                  style={{ fontSize: "35px" }}
                >
                  1. Select your stuffs to checkout
                </h2>

                {items.length === 0 ? (
                  <div>
                    <p
                      className="text-center mt-4 p-3 rounded"
                      style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        border: "1px solid #f5c6cb",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Your cart is currently empty. Please add some items to
                      proceed with checkout.
                    </p>
                    <div
                      className="d-flex justify-content-center"
                      style={{ gap: "40px" }}
                    >
                      <Link to="/menus">
                        <button>Go to menus</button>
                      </Link>
                      <Link to="/shop">
                        <button>Go to shop</button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      maxHeight: "75vh",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      paddingRight: "10px",
                    }}
                  >
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="form-check d-flex align-items-start mb-3"
                      >
                        <div className="ms-3 w-100">
                          <CartItem
                            item={item}
                            onIncrease={increaseQuantity}
                            onDecrease={decreaseQuantity}
                            onDelete={deleteItem}
                            extraElement={
                              <button
                                onClick={() => handleSelect(item._id)}
                                className={`btn-select ${
                                  selectedItems.includes(item._id)
                                    ? "selected"
                                    : ""
                                }`}
                              >
                                {selectedItems.includes(item._id)
                                  ? "Selected"
                                  : "Unselect"}
                              </button>
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-8">
                <div className="card">
                  <div className="card-body">
                    <div className=" d-flex justify-content-center align-items-center">
                      <h2 style={{ fontSize: "35px" }}>2. Review Your Order</h2>
                    </div>
                    <ul>
                      <li>
                        <Table columns={columns} data={selectedData} />
                      </li>
                      <li>
                        <h2 style={{ fontSize: "18px", marginTop: "20px" }}>
                          Total: ${totalAmount.toFixed(2)}
                        </h2>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-12" style={{ paddingTop: "100px" }}>
                  {selectedItems.length > 0 ? (
                    <>
                      <h2 className="text-center" style={{ fontSize: "35px" }}>
                        3. Billing details
                      </h2>
                      <CustomForm
                        fields={fields}
                        initialValues={{
                          customerName: formData.customerName,
                          phoneNumber: formData.phoneNumber,
                          emailAddress: formData.emailAddress,
                          address: formData.address,
                        }}
                        onSubmit={handleSubmit}
                        buttonText="Place Order"
                      />
                    </>
                  ) : (
                    <p
                      className="text-center mt-4 p-3 rounded"
                      style={{
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        border: "1px solid #ffeeba",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Please select at least one item to proceed with checkout.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-4"></div>
        </div>
      </div>
    </>
  );
}

export default CheckOut;
