import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-left"></div>

      <div className="login-form-container">
        <h2 className="login-title">Access Account</h2>
        <p className="login-subtitle">Your gateway to seamless solutions</p>

        <form className="login-form">
          <div className="input-group">
            <input type="text" placeholder="Email" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Enter your password" />
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
