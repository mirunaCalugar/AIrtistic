import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import icon from "../../assets/logo.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" end className="brand-link">
          <img src={icon} alt="Logo" className="navbar-logo" />
          <span className="navbar-title">AIrtistic</span>
        </NavLink>
        <button className="mobile-toggle" onClick={toggleMobileMenu}>
          ☰
        </button>
      </div>

      {/* Desktop Links */}
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/chatAI"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            ChatAI
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Explore
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>
        </li>
        <li className="auth-buttons">
          {isLoggedIn ? (
            <button className="btn log-out" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <>
              <NavLink to="/signup">
                <button className="btn register">Sign Up</button>
              </NavLink>
              <NavLink to="/login">
                <button className="btn log-in">Log In</button>
              </NavLink>
            </>
          )}
        </li>
      </ul>

      {/* Mobile Links */}
      {mobileOpen && (
        <ul className="mobile-navbar-links">
          <li>
            <NavLink
              to="/"
              end
              onClick={toggleMobileMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chatAI"
              onClick={toggleMobileMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              ChatAI
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/explore"
              onClick={toggleMobileMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              onClick={toggleMobileMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Profile
            </NavLink>
          </li>
          <li className="auth-buttons">
            {isLoggedIn ? (
              <button
                className="btn log-out"
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
              >
                Log Out
              </button>
            ) : (
              <>
                <NavLink to="/register" onClick={toggleMobileMenu}>
                  <button className="btn register">Sign Up</button>
                </NavLink>
                <NavLink to="/login" onClick={toggleMobileMenu}>
                  <button className="btn log-in">Log In</button>
                </NavLink>
              </>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}
