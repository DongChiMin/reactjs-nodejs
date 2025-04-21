// Routes
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/global.css";

// Components
import Header from "./components/Header/Header";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {[...routes, ...adminRoutes].map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
