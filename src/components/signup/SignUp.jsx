import React, { useState } from "react";
import "./SignIn.css";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="signin-container">
      <div className="signin-form-section">
        <h2>Create an account</h2>
        <form className="signin-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" placeholder="John Doe" />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="example@example.com" />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "" : "👁"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "" : "👁"}
              </span>
            </div>
          </div>

          <button type="submit">Sign Up</button>
          <div className="divider">Or sign up with</div>
          <button className="google-signin">
            <span className="google-logo">G</span>
          </button>
        </form>
      </div>

      <div className="signin-illustration-section">
        {/* Poți folosi un SVG sau o imagine aici */}
      </div>
    </div>
  );
};

export default SignUp;
