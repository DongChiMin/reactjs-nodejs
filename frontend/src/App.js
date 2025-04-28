// Routes
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { routes } from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";

// Components
import Header from "./components/Header/Header";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <Router>
      <Routes>
        {[...routes, ...adminRoutes].map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
