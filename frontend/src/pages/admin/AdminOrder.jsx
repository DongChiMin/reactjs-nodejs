import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // Số đơn hàng mỗi trang

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/orders/getOrders"
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Khi search thì reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  // Filter orders theo search keyword
  const filteredOrders = orders.filter((order) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(keyword) ||
      order.phoneNumber.toLowerCase().includes(keyword) ||
      order.emailAddress.toLowerCase().includes(keyword) ||
      order.address.toLowerCase().includes(keyword)
    );
  });

  // Xử lý phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="container">
      <h2 className="text-center mb-3">Manage Orders</h2>

      {/* Search */}
      <div className="d-flex align-items-center justify-content-center gap-3 mb-2 text-center">
        <span style={{ fontWeight: "bold", marginRight: "10px" }}>Search:</span>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by customer, phone, email, address..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-striped mt-4">
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
              {currentOrders.map((order) => (
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
                  <td>${order.totalPrice}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  {console.log("Order object:", order)}
                </tr>
              ))}
              {currentOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    {searchKeyword
                      ? "No matching orders found."
                      : "No orders available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination buttons */}
          {filteredOrders.length > 0 && (
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
    </div>
  );
}

export default AdminOrders;
