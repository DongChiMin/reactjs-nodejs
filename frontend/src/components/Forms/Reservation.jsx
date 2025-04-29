import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Reservation.module.css";

function Reservation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
          name: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation Data:", formData);
    alert("Reservation submitted successfully!");
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12 text-center">
          <h4>Table Reservation</h4>
        </div>

        <div className="col-lg-6 col-sm-12">
          <fieldset>
            <input
              name="name"
              type="text"
              id="name"
              placeholder="Your Name*"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </fieldset>
        </div>

        <div className="col-lg-6 col-sm-12">
          <fieldset>
            <input
              name="email"
              type="text"
              id="email"
              pattern="[^ @]*@[^ @]*"
              placeholder="Your Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </fieldset>
        </div>

        <div className="col-lg-6 col-sm-12">
          <fieldset>
            <input
              name="phone"
              type="text"
              id="phone"
              placeholder="Phone Number*"
              value={formData.phone}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </fieldset>
        </div>

        <div className="col-md-6 col-sm-12">
          <fieldset>
            <select
              name="number-guests"
              id="number-guests"
              className={styles.select}
            >
              <option value="number-guests">Number Of Guests</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </fieldset>
        </div>

        <div className="col-lg-6">
          <fieldset>
            <input
              name="date"
              id="date"
              type="text"
              placeholder="dd/mm/yyyy"
              className={styles.input}
            />
          </fieldset>
        </div>

        <div className="col-md-6 col-sm-12">
          <fieldset>
            <select name="time" id="time" className={styles.select}>
              <option value="time">Time</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </fieldset>
        </div>

        <div className="col-lg-12">
          <fieldset>
            <textarea
              name="message"
              rows="6"
              id="message"
              placeholder="Message"
              required
              className={styles.textarea}
            ></textarea>
          </fieldset>
        </div>

        <div className="col-lg-12">
          <fieldset>
            <button type="submit" className={styles.button}>
              Make A Reservation
            </button>
          </fieldset>
        </div>
      </div>
    </form>
  );
}

export default Reservation;
