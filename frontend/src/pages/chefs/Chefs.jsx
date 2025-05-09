import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import img1 from "../../assets/images/menus/menu-slider-1.jpg";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import styles from "./Chefs.module.css";

const UPLOAD_BASE = "http://localhost:3001/uploads/"; // URL gốc để serve static

function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/chefs")
      .then((res) => {
        const data = res.data.map((chef) => ({
          ...chef,
          // nếu backend lưu imageUrl = "chefs/xyz.png", thì prepend thư mục uploads
          imageUrl: chef.imageUrl ? `${UPLOAD_BASE}${chef.imageUrl}` : null,
        }));
        setChefs(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleOpenModal = (chef) => {
    setSelectedChef(chef);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChef(null);
  };

  return (
    <div>
      <PageHeader
        backgroundType="image"
        backgroundSrc={img1}
        h2Title=""
        title="Our Chefs"
        subTitle="Welcome to our delicious corner"
        height="65vh"
      />

      <div className="container py-5">
        <div className="row">
          {chefs.map((chef) => (
            <div className="col-md-3 mb-4" key={chef._id}>
              <div
                className={`card h-100 ${styles.chefCard}`}
                onClick={() => handleOpenModal(chef)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    chef.imageUrl ||
                    "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  className={`card-img-top ${styles.chefImg}`}
                  alt={chef.name}
                />
                <div className="card-body">
                  <h5 className={`card-title ${styles.chefName}`}>
                    {chef.name}
                  </h5>
                  <p className="card-text">Specialty: {chef.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChef?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", height: "400px" }}>
            {/* Ảnh bên trái */}
            <div
              style={{
                flex: 1,
                paddingRight: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  selectedChef?.imageUrl ||
                  "https://via.placeholder.com/400x400?text=No+Image"
                }
                alt={selectedChef?.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            </div>

            {/* Thông tin bên phải */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                borderLeft: "1px solid #ccc",
              }}
            >
              <p>
                <strong>Specialty:</strong> {selectedChef?.specialty}
              </p>
              <p>
                <strong>Experience:</strong> {selectedChef?.experience} years
              </p>
              <p>
                <strong>Contact:</strong> +{selectedChef?.contact}
              </p>
              <p>
                <strong>Awards:</strong>
              </p>
              <ul
                style={{
                  paddingLeft: "20px",
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                }}
              >
                {selectedChef?.awards
                  ?.split("\n")
                  .filter((a) => a.trim() !== "")
                  .map((award, i) => (
                    <li key={i} style={{ marginBottom: "4px" }}>
                      • {award}
                    </li>
                  ))}
              </ul>
              <p>
                <strong>Description:</strong> {selectedChef?.description}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Chefs;
