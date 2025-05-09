import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useEffect } from "react";

import { Modal } from "bootstrap";

const ReservationTable = ({ isInModal = false }) => {
  const [seatingAreas, setSeatingAreas] = useState([]);
  const [formData, setFormData] = useState({
    createdBy: "customer",
    customerName: "",
    emailAddress: "",
    phoneNumber: "",
    numberOfGuest: "",
    seatingArea: "", // Để chọn từ dropdown
    tableType: "",
    status: "pending",
    note: "",
    dateTime: "", // for date
    createdAt: new Date().toISOString(),
  });

  // Fetch seating areas when component mounts
  useEffect(() => {
    const fetchSeatingAreas = async () => {
      try {
        const areaRes = await axios.get(
          "http://localhost:3001/api/tables/get/seating-areas"
        );
        setSeatingAreas(areaRes.data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải khu vực ngồi:", error);
      }
    };

    fetchSeatingAreas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form Data Preview:", JSON.stringify(formData, null, 2));
      const response = await axios.post(
        "http://localhost:3001/api/reservations/add",
        {
          ...formData,
        }
      );
      console.log("Reservation Created:", response.data);

      if (isInModal) {
        Modal.getInstance(
          document.getElementById("addReservationModal")
        )?.hide();
      }

      setFormData({
        customerName: "",
        emailAddress: "",
        phoneNumber: "",
        numberOfGuest: "",
        seatingArea: "",
        status: "pending",
        note: "",
        dateTime: "",
        createdAt: new Date().toISOString(),
      });

      //Hiện lên màn hình thông báo đã tạo thành công
      alert(`Đã tạo mới thành công`);
    } catch (error) {
      console.error("Error:", error);
      alert(`Đã tạo mới thất bại`);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Guests</label>
          <input
            type="number"
            className="form-control"
            name="numberOfGuest"
            value={formData.numberOfGuest}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Seating Area</label>
          <select
            className="form-control"
            name="seatingArea"
            value={formData.seatingArea}
            onChange={handleChange}
            required
          >
            <option value="">----Select Area----</option>
            {seatingAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Table Type</label>
          <select
            className="form-control"
            name="tableType"
            value={formData.tableType}
            onChange={handleChange}
            required
          >
            <option value="">Select a table Type</option>
            <option value="Standard">Standard</option>
            <option value="Vip">Vip</option>
            <option value="Family">Family</option>
            <option value="Bar">Bar</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Note</label>
          <input
            type="text"
            className="form-control"
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Reservation Date</label>
          <TextField
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ReservationTable;
