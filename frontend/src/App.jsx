import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Appliances from "./pages/Appliances.jsx";
import Calculator from "./pages/Calculator.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <NavLink to="/" className="brand"><span className="brand-mark">H</span> Home Energy</NavLink>
          <nav>
            <NavLink to="/">Overview</NavLink>
            <NavLink to="/appliances">Appliances</NavLink>
            <NavLink to="/calculator">Room calculator</NavLink>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appliances" element={<Appliances />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
        <footer>Starter application · Irish market · Not an engineering design tool</footer>
      </div>
    </BrowserRouter>
  );
}
