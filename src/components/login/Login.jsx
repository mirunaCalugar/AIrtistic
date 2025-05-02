import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        // adjust route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>

      <div className="login-form-container">
        <h2 className="login-title">Access Account</h2>
        <p className="login-subtitle">Your gateway to seamless solutions</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <div className="input-group">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options">
            <a href="#" className="forgot-password">
              Forgot your password?
            </a>
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>

        <p className="signup-link">
          Need to create an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>

      <div className="login-right"></div>
    </div>
  );
};

export default Login;
