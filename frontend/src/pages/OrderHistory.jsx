import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3001/api/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch order history:", err);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Order History</h2>
        {orders.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Email Address</th>
                <th>Address</th>
                <th>Payment Method</th>
                <th>Note</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.emailAddress}</td>
                  <td>{order.address}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.note || "N/A"}</td>
                  <td>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} - {item.quantity} x ${item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">You have no orders yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default OrderHistory;