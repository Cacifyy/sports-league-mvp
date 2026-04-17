import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Standings from "./pages/Standings";
import AnimatedBackground from "./components/AnimatedBackground";

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedBackground />
      <nav style={{ position: "relative", zIndex: 10 }}>
        <NavLink to="/" className="logo">DODGECITY</NavLink>
        <div className="links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/standings" className={({ isActive }) => isActive ? "active" : ""}>Standings</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>
        </div>
      </nav>
      <div style={{ position: "relative", zIndex: 1 }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
