import React, { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "bootstrap";

//Components
import ReservationsModal from "./adminComponents/reservations/ViewReservations/ReservationsModal";
import AreasAndTables from "./adminComponents/reservations/AreasAndTables";
import AddTableModal from "./adminComponents/reservations/AddNewTable";

function AdminReservation() {
  //Lưu danh sách các bàn
  const [tables, setTables] = useState([]);
  //Lưu danh sách các đơn đặt bàn
  const [reservations, setReservations] = useState([]);

  //Lưu thông tin chi tiết của 1 đơn đặt bàn
  const [reservationDetail, setReservationDetail] = useState(null);

  useEffect(() => {
    fetchTables(); // Gọi fetchTables khi component load
    fetchReservations(); // Gọi fetchReservations khi component load
  }, []);

  //Start: Lấy dữ liệu từ CSDL
  //Lấy dữ liệu các bàn
  const fetchTables = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/tables/get/all"
      );
      setTables(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  //Lấy dữ liệu các đơn đặt bàn
  const fetchReservations = async () => {
    try {
      console.log("Đang lấy dữ liệu từ trang cha");
      const response = await axios.post(
        "http://localhost:3001/api/reservations/get"
      );
      setReservations(response.data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };
  //End: Lấy dữ liệu từ CSDL

  const handleReservationDetail = (detail) => {
    console.log(detail);
    setReservationDetail(detail);
  };

  //Thứ tự hiển thị modal
  useEffect(() => {
    // Lấy cả hai modal
    const detailModal = document.getElementById("detailReservationModal");
    const addModal = document.getElementById("addReservationModal");
    const confirmModal = document.getElementById("confirmReservationModal");

    const handleHidden = () => {
      // Khi một trong hai modal đóng, mở lại modal viewReservations
      const viewModalElement = document.getElementById("viewReservationsModal");
      if (viewModalElement) {
        const viewModal = new Modal(viewModalElement);
        viewModal.show();
      }
    };

    // Thêm event listener cho cả hai modal
    detailModal?.addEventListener("hidden.bs.modal", handleHidden);
    addModal?.addEventListener("hidden.bs.modal", handleHidden);
    confirmModal?.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      // Cleanup listener khi component unmount
      detailModal?.removeEventListener("hidden.bs.modal", handleHidden);
      addModal?.removeEventListener("hidden.bs.modal", handleHidden);
      confirmModal?.removeEventListener("hidden.bs.modal", handleHidden);
    };
  }, []);

  return (
    <main>
      {/* Modal xem các đơn đặt bàn  */}
      <ReservationsModal
        reservations={reservations}
        tables={tables}
        onReloadReservations={fetchReservations}
        onReloadTables={fetchTables}
      />

      {/* Modal Tạo bàn mới */}
      <AddTableModal
        tables={tables}
        onTableCreated={() => {
          fetchTables();
          fetchReservations();
        }}
      />

      {/* Giao diện start */}
      <div className="container">
        <h2 className="text-center mb-3">Manage Reservations</h2>

        <div className="row">
          <div className="col-9">
            <div className="card">
              <div className="card-body">
                <AreasAndTables
                  tables={tables}
                  reservations={reservations}
                  onTableUpdated={() => {
                    fetchTables();
                    fetchReservations();
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-3">
            {/* Thông tin về các bàn trong ngày đã chọn: có thể làm thống kê  */}
            <div>
              <div className="mb-5">
                <div className="card">
                  <div className="card-body">
                    <p className="mb-1 card-text">
                      Total tables: {tables.length}
                    </p>
                    <p className="mb-1 card-text">
                      Total reservations: {reservations.length}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                {/* Thêm bàn mới */}
                <button
                  className="mb-3"
                  onClick={() => {
                    const modal = new Modal(
                      document.getElementById("addTableModal")
                    );
                    modal.show();
                  }}
                >
                  Add new table
                </button>
                {/* Hiển thị danh sách các yêu cầu đặt bàn */}
                <button
                  onClick={() => {
                    const modal = new Modal(
                      document.getElementById("viewReservationsModal")
                    );
                    modal.show();
                  }}
                >
                  View Reservations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminReservation;
