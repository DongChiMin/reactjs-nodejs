import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:3001/api/orders/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:3001/api/orders/stats-by-month", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyStats(res.data);
    };
    fetchMonthlyStats();
  }, []);

  if (!stats) return <div className="text-center mt-5">Loading statistics...</div>;

  const chartData = {
    labels: monthlyStats.map(
      (item) => `${item._id.month}/${item._id.year}`
    ),
    datasets: [
      {
        label: "Orders",
        data: monthlyStats.map((item) => item.totalOrders),
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.15)",
        fill: true,
        yAxisID: "y",
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: "#007bff",
        pointBorderColor: "#fff",
        borderWidth: 3,
      },
      {
        label: "Revenue",
        data: monthlyStats.map((item) => item.totalRevenue),
        borderColor: "#28a745",
        backgroundColor: "rgba(40,167,69,0.15)",
        fill: true,
        yAxisID: "y1",
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointBackgroundColor: "#28a745",
        pointBorderColor: "#fff",
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 16, weight: "bold" },
          color: "#333",
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Orders & Revenue by Month",
        font: { size: 22, weight: "bold" },
        color: "#222",
        padding: { top: 10, bottom: 30 },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#222",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#007bff",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            if (context.dataset.label === "Revenue") {
              return `Revenue: $${context.parsed.y.toLocaleString()}`;
            }
            return `Orders: ${context.parsed.y}`;
          }
        }
      },
      datalabels: {
        display: true,
      }
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: "Month/Year", font: { size: 16 } },
        ticks: { font: { size: 14 } }
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Orders", font: { size: 16 } },
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { font: { size: 14 } }
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: { display: true, text: "Revenue", font: { size: 16 } },
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 14 } }
      },
    },
  };

  // Card style
  const cardStyle = {
    borderRadius: "18px",
    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
    transition: "transform 0.2s",
    background: "#fff",
  };

  const cardHover = {
    transform: "translateY(-4px) scale(1.03)",
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)",
  };

  // Header gradient
  const headerStyle = {
    background: "linear-gradient(90deg, #007bff 0%, #28a745 100%)",
    color: "#fff",
    borderRadius: "18px",
    padding: "32px 0 24px 0",
    marginBottom: "32px",
    boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
    letterSpacing: "1px",
  };

  return (
    <div className="container py-4">
      <div style={headerStyle} className="text-center">
        <h1 style={{ fontWeight: 700, fontSize: "2.5rem" }}>Admin Dashboard</h1>
        <div style={{ fontSize: "1.2rem", opacity: 0.9 }}>Overview & Statistics</div>
      </div>
      <div className="row g-4 mb-2">
        <div className="col-md-3 col-6">
          <div className="card text-center h-100" style={cardStyle}>
            <div className="card-body">
              <div className="mb-2" style={{ fontSize: "2.5rem", color: "#007bff" }}>
                <i className="fa fa-shopping-cart"></i>
              </div>
              <h6 className="card-title">Total Orders</h6>
              <div className="fw-bold fs-3">{stats.totalOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card text-center h-100" style={cardStyle}>
            <div className="card-body">
              <div className="mb-2" style={{ fontSize: "2.5rem", color: "#28a745" }}>
                <i className="fa fa-dollar-sign"></i>
              </div>
              <h6 className="card-title">Total Revenue</h6>
              <div className="fw-bold fs-3">${Number(stats.totalRevenue).toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card text-center h-100" style={cardStyle}>
            <div className="card-body">
              <div className="mb-2" style={{ fontSize: "2.5rem", color: "#ffc107" }}>
                <i className="fa fa-users"></i>
              </div>
              <h6 className="card-title">Customers</h6>
              <div className="fw-bold fs-3">{stats.totalCustomers}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card text-center h-100" style={cardStyle}>
            <div className="card-body">
              <div className="mb-2" style={{ fontSize: "2.5rem", color: "#fd7e14" }}>
                <i className="fa fa-hourglass-half"></i>
              </div>
              <h6 className="card-title">Pending Orders</h6>
              <div className="fw-bold fs-3">{stats.pendingOrders}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-6">
          <div className="card text-center h-100" style={cardStyle}>
            <div className="card-body">
              <div className="mb-2" style={{ fontSize: "2.5rem", color: "#0dcaf0" }}>
                <i className="fa fa-truck"></i>
              </div>
              <h6 className="card-title">Delivering Orders</h6>
              <div className="fw-bold fs-3">{stats.deliveringOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-6">
          <div className="card text-center h-100" style={cardStyle}>
            <div className="card-body">
              <div className="mb-2" style={{ fontSize: "2.5rem", color: "#198754" }}>
                <i className="fa fa-check-circle"></i>
              </div>
              <h6 className="card-title">Completed Orders</h6>
              <div className="fw-bold fs-3">{stats.completedOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-12">
          <div className="card text-center h-100" style={cardStyle}>
            <div className="card-body">
              <div className="mb-2" style={{ fontSize: "2.5rem", color: "#dc3545" }}>
                <i className="fa fa-times-circle"></i>
              </div>
              <h6 className="card-title">Cancelled Orders</h6>
              <div className="fw-bold fs-3">{stats.cancelledOrders}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5 p-4 rounded-4 shadow" style={{ background: "#fff" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default AdminDashboard;