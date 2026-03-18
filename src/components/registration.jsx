import { useState } from "react";
import React from "react";
import { FaUserSecret } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordFill } from "react-icons/ri";
import { GiSmartphone } from "react-icons/gi";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MdDoubleArrow } from "react-icons/md";
import authService from "../services/authService";
import "./registration.css";

const Registerform = () => {
  // ─────────────────────────────────────────────
  // REF FOR SLIDING PANEL ANIMATION
  // ─────────────────────────────────────────────
  const navlog = React.useRef("");

  const onAddclick = () => {
    navlog.current.classList.add("sign-up-mode");
  };

  const onRemoveclick = () => {
    navlog.current.classList.remove("sign-up-mode");
  };

  // ─────────────────────────────────────────────
  // NAVIGATION HOOK
  // ─────────────────────────────────────────────
  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // REGISTRATION STATE
  // ─────────────────────────────────────────────
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
  });

  const [registerErrors, setRegisterErrors] = useState({});
  const [registerError, setRegisterError] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  // ─────────────────────────────────────────────
  // LOGIN STATE
  // ─────────────────────────────────────────────
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [loginErrors, setLoginErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ─────────────────────────────────────────────
  // REGISTRATION HANDLERS
  // ─────────────────────────────────────────────
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });

    // Clear field error when user starts typing
    if (registerErrors[name]) {
      setRegisterErrors({
        ...registerErrors,
        [name]: null,
      });
    }
  };

  // Client-side validation for registration
  const validateRegister = (data) => {
    const errors = {};

    // Name validation
    if (!data.name) {
      errors.name = "Name is required!";
    }

    // Email validation
    if (!data.email) {
      errors.email = "Email is required!";
    } else {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "This is not a valid email format!";
      }
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } 

    // Confirm password validation
    if (!data.password_confirmation) {
      errors.password_confirmation = "Confirm password is required!";
    } else if (data.password !== data.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }

    // Phone number validation
    if (!data.phone) {
      errors.phone = "Mobile number is required!";
    } else if (data.phone.length !== 10) {
      errors.phone = "Please enter a valid 10 digit mobile number";
    }

    return errors;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setRegisterError("");
    setRegisterErrors({});

    // Run client-side validation first
    const validationErrors = validateRegister(registerData);

    if (Object.keys(validationErrors).length > 0) {
      setRegisterErrors(validationErrors);
      return; // Stop here if validation fails
    }

    // Validation passed, proceed with API call
    setRegisterLoading(true);

    try {
      const response = await authService.register(registerData);
      console.log("Registration successful:", response);
      alert("Registration Successful!");

      // Clear form
      setRegisterData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
      });

      // Switch to login panel
      onAddclick();
    } catch (err) {
      console.error("Registration failed:", err);
      setRegisterError(
        err.message || "Registration failed. Please try again."
      );

      // Handle server-side validation errors from Laravel
      if (err.errors) {
        const errors = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = err.errors[key][0];
        });
        setRegisterErrors(errors);
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // LOGIN HANDLERS
  // ─────────────────────────────────────────────
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });

    // Clear field error when user starts typing
    if (loginErrors[name]) {
      setLoginErrors({
        ...loginErrors,
        [name]: null,
      });
    }
  };

  // Client-side validation for login
  const validateLogin = (data) => {
    const errors = {};

    if (!data.email) {
      errors.email = "Email is required!";
    } else {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(data.email)) {
        errors.email = "This is not a valid email format!";
      }
    }

    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }

    return errors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setLoginError("");
    setLoginErrors({});

    // Run client-side validation first
    const validationErrors = validateLogin(loginData);

    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      return; // Stop here if validation fails
    }

    // Validation passed, proceed with API call
    setLoginLoading(true);

    try {
      const response = await authService.login(loginData);
      console.log("Login successful:", response);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError(err.message || "Login failed. Please try again.");

      // Handle server-side validation errors
      if (err.errors) {
        const errors = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = err.errors[key][0];
        });
        setLoginErrors(errors);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // RENDER - SAME OLD UI LAYOUT
  // ─────────────────────────────────────────────
  return (
    <div className="About">

      <div className="registor-signin" ref={navlog}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* ═══════════════════════════════════ */}
            {/* REGISTRATION FORM (sign-in-form)    */}
            {/* ═══════════════════════════════════ */}
            <form className="sign-in-form" onSubmit={handleRegisterSubmit}>
              <h2 className="title-name">Registration</h2>

              {/* General error message */}
              {registerError && (
                <div
                  style={{
                    backgroundColor: "#fee",
                    color: "#c33",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "16px",
                    border: "1px solid #fcc",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {registerError}
                </div>
              )}

              {/* NAME */}
              <div className="input-field">
                <i>
                  <FaUserSecret />
                </i>
                <input
                  type="text"
                  name="name"
                  placeholder="UserName"
                  onChange={handleRegisterChange}
                  value={registerData.name}
                />
                <span>{registerErrors.name}</span>
              </div>

              {/* EMAIL */}
              <div className="input-field">
                <i>
                  <TfiEmail />
                </i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleRegisterChange}
                  value={registerData.email}
                />
                <span>{registerErrors.email}</span>
              </div>

              {/* PASSWORD */}
              <div className="input-field">
                <i>
                  <RiLockPasswordFill />
                </i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleRegisterChange}
                  value={registerData.password}
                />
                <span>{registerErrors.password}</span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="input-field">
                <i>
                  <RiLockPasswordFill />
                </i>
                <input
                  type="password"
                  name="password_confirmation"
                  placeholder="Confirm Password"
                  onChange={handleRegisterChange}
                  value={registerData.password_confirmation}
                />
                <span>{registerErrors.password_confirmation}</span>
              </div>

              {/* PHONE NUMBER */}
              <div className="input-field">
                <i>
                  <GiSmartphone />
                </i>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleRegisterChange}
                  value={registerData.phone}
                />
                <span>{registerErrors.phone}</span>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                className="btn-register solid"
                type="submit"
                disabled={registerLoading}
                style={{ opacity: registerLoading ? 0.7 : 1 }}
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                {registerLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {/* ═══════════════════════════════════ */}
            {/* LOGIN FORM (sign-up-form)           */}
            {/* ═══════════════════════════════════ */}
            <form className="sign-up-form" onSubmit={handleLoginSubmit}>
              <h2 className="title-name">Sign In</h2>

              {/* General error message */}
              {loginError && (
                <div
                  style={{
                    backgroundColor: "#fee",
                    color: "#c33",
                    padding: "10px",
                    borderRadius: "4px",
                    marginBottom: "16px",
                    border: "1px solid #fcc",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {loginError}
                </div>
              )}

              {/* EMAIL */}
              <div className="input-field">
                <i>
                  <TfiEmail />
                </i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleLoginChange}
                  value={loginData.email}
                />
                <span>{loginErrors.email}</span>
              </div>

              {/* PASSWORD */}
              <div className="input-field">
                <i>
                  <RiLockPasswordFill />
                </i>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleLoginChange}
                  value={loginData.password}
                />
                <span>{loginErrors.password}</span>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                className="btn-register solid"
                type="submit"
                disabled={loginLoading}
                style={{ opacity: loginLoading ? 0.7 : 1 }}
              >
                {loginLoading ? "Logging in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>

        {/* ═══════════════════════════════════ */}
        {/* SLIDING PANELS - UNCHANGED         */}
        {/* ═══════════════════════════════════ */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content-log">
              <h3>New here ?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Debitis, ex ratione. Aliquid!
              </p>
              <button
                className="btn-log transparent"
                onClick={onAddclick}
              >
                Sign up
              </button>
            </div>
            <img alt="" className="image-log" src={`/image/log.svg`} />
          </div>
          <div className="panel right-panel">
            <div className="content-log">
              <h3>One of us ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Nostrum laboriosam ad deleniti.
              </p>
              <button
                onClick={onRemoveclick}
                className="btn-log transparent"
              >
                Sign in
              </button>
            </div>
            <img
              alt=""
              className="image-log"
              src={`/image/register.svg`}
            />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Registerform;