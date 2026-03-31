import { useState, useEffect } from "react";
import React from "react";
import { FaUserSecret, FaCheckCircle, FaHeart, FaCopy, FaTimes } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordFill, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { GiSmartphone } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi";
import { BiDonateHeart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./registration.css";

// ─────────────────────────────────────────────
// DUMMY CREDENTIALS
// ─────────────────────────────────────────────
const DUMMY_EMAIL = "demo@example.com";
const DUMMY_PASSWORD = "demo1234";

const Registerform = () => {
  const navlog = React.useRef("");
  const navigate = useNavigate();

  // ─── Popup States ───
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState({
    regPass: false,
    regConfirm: false,
    loginPass: false,
  });

  // ─── Particle effect ───
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 4,
    }));
    setParticles(generated);
  }, []);

  // ─── Slide Panel ───
  const onAddclick = () => {
    navlog.current.classList.add("sign-up-mode");
  };

  const onRemoveclick = () => {
    navlog.current.classList.remove("sign-up-mode");
  };

  // ─── Registration State ───
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

  // ─── Login State ───
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ─── Registration Handlers ───
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
    if (registerErrors[name]) {
      setRegisterErrors({ ...registerErrors, [name]: null });
    }
  };

  const validateRegister = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Name is required!";
    if (!data.email) {
      errors.email = "Email is required!";
    } else {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(data.email))
        errors.email = "This is not a valid email format!";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!data.password_confirmation) {
      errors.password_confirmation = "Confirm password is required!";
    } else if (data.password !== data.password_confirmation) {
      errors.password_confirmation = "Passwords do not match";
    }
    if (!data.phone) {
      errors.phone = "Mobile number is required!";
    } else if (data.phone.length !== 10) {
      errors.phone = "Please enter a valid 10 digit mobile number";
    }
    return errors;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterErrors({});
    const validationErrors = validateRegister(registerData);
    if (Object.keys(validationErrors).length > 0) {
      setRegisterErrors(validationErrors);
      return;
    }
    setRegisterLoading(true);
    try {
      const response = await authService.register(registerData);
      console.log("Registration successful:", response);
      setRegisterData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
      });
      onAddclick();
    } catch (err) {
      console.error("Registration failed:", err);
      setRegisterError(err.message || "Registration failed. Please try again.");
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

  // ─── Login Handlers ───
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    if (loginErrors[name]) {
      setLoginErrors({ ...loginErrors, [name]: null });
    }
  };

  const validateLogin = (data) => {
    const errors = {};
    if (!data.email) {
      errors.email = "Email is required!";
    } else {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!emailRegex.test(data.email))
        errors.email = "This is not a valid email format!";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }
    return errors;
  };

  const fillDummyCredentials = () => {
    setLoginData({
      email: DUMMY_EMAIL,
      password: DUMMY_PASSWORD,
    });
    setLoginErrors({});
    setLoginError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginErrors({});
    const validationErrors = validateLogin(loginData);
    if (Object.keys(validationErrors).length > 0) {
      setLoginErrors(validationErrors);
      return;
    }

    // ─── DUMMY LOGIN CHECK ───
    if (
      loginData.email === DUMMY_EMAIL &&
      loginData.password === DUMMY_PASSWORD
    ) {
      setLoginLoading(true);
      setTimeout(() => {
        setLoginLoading(false);
        localStorage.setItem("token", "dummy-token-12345");
        localStorage.setItem(
          "user",
          JSON.stringify({ name: "Demo User", email: DUMMY_EMAIL })
        );
        setShowSuccessPopup(true);
      }, 1500);
      return;
    }

    // ─── REAL API LOGIN ───
    setLoginLoading(true);
    try {
      const response = await authService.login(loginData);
      console.log("Login successful:", response);
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError(err.message || "Login failed. Please try again.");
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

  // ─── Popup Handlers ───
  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    setShowDonationPopup(true);
  };

  const handleDonationClose = () => {
    setShowDonationPopup(false);
    navigate("/dashboard");
  };

  const handleCopyGPay = () => {
    navigator.clipboard.writeText("8124829907");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="About">
      {/* Floating Particles */}
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>

      {/* ═══════════════ SUCCESS POPUP ═══════════════ */}
      {showSuccessPopup && (
        <div className="popup-overlay" onClick={handleSuccessClose}>
          <div className="popup-container success-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={handleSuccessClose}>
              <FaTimes />
            </button>
            <div className="popup-icon-wrapper success-icon-wrapper">
              <div className="popup-icon-ring"></div>
              <FaCheckCircle className="popup-icon success-icon" />
            </div>
            <h2 className="popup-title">Login Successful! 🎉</h2>
            <p className="popup-message">
              Welcome back! You have been successfully authenticated.
            </p>
            <div className="popup-confetti">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`confetti-piece confetti-${i}`} />
              ))}
            </div>
            <button className="popup-btn success-btn" onClick={handleSuccessClose}>
              <HiSparkles style={{ marginRight: 8 }} />
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ DONATION POPUP ═══════════════ */}
      {showDonationPopup && (
        <div className="popup-overlay" onClick={handleDonationClose}>
          <div className="popup-container donation-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={handleDonationClose}>
              <FaTimes />
            </button>
            <div className="popup-icon-wrapper donation-icon-wrapper">
              <BiDonateHeart className="popup-icon donation-icon" />
            </div>
            <h2 className="popup-title donation-title">
              <FaHeart className="heart-beat" /> Support Us
            </h2>
            <p className="popup-message">
              If you found this helpful, please consider supporting us with a
              small donation. Every contribution helps us keep building!
            </p>
            <div className="gpay-card">
              <div className="gpay-header">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png"
                  alt="GPay"
                  className="gpay-logo"
                />
                <span>Google Pay</span>
              </div>
              <div className="gpay-number-row">
                <span className="gpay-number">8124829907</span>
                <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopyGPay}
                >
                  <FaCopy />
                  {copied ? " Copied!" : " Copy"}
                </button>
              </div>
            </div>
            <p className="thank-you-text">
              🙏 Thank you for your generosity!
            </p>
            <button className="popup-btn donation-btn" onClick={handleDonationClose}>
              Continue to Dashboard →
            </button>
            <button className="skip-btn" onClick={handleDonationClose}>
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════ MAIN FORM ═══════════════ */}
      <div className="registor-signin" ref={navlog}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* ═══════ REGISTRATION FORM ═══════ */}
            <form className="sign-in-form" onSubmit={handleRegisterSubmit}>
              <h2 className="title-name">
                <HiSparkles className="title-sparkle" />
                Create Account
              </h2>
              <p className="title-subtitle">Join us and start your journey today</p>

              {registerError && (
                <div className="error-banner">
                  <span>⚠️</span> {registerError}
                </div>
              )}

              {/* NAME */}
              <div className={`input-field ${registerErrors.name ? "input-error" : ""}`}>
                <i><FaUserSecret /></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleRegisterChange}
                  value={registerData.name}
                  autoComplete="name"
                />
                {registerErrors.name && <span className="field-error">{registerErrors.name}</span>}
              </div>

              {/* EMAIL */}
              <div className={`input-field ${registerErrors.email ? "input-error" : ""}`}>
                <i><TfiEmail /></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleRegisterChange}
                  value={registerData.email}
                  autoComplete="email"
                />
                {registerErrors.email && <span className="field-error">{registerErrors.email}</span>}
              </div>

              {/* PASSWORD */}
              <div className={`input-field ${registerErrors.password ? "input-error" : ""}`}>
                <i><RiLockPasswordFill /></i>
                <input
                  type={showPassword.regPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleRegisterChange}
                  value={registerData.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePassword("regPass")}
                >
                  {showPassword.regPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
                {registerErrors.password && <span className="field-error">{registerErrors.password}</span>}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className={`input-field ${registerErrors.password_confirmation ? "input-error" : ""}`}>
                <i><RiLockPasswordFill /></i>
                <input
                  type={showPassword.regConfirm ? "text" : "password"}
                  name="password_confirmation"
                  placeholder="Confirm Password"
                  onChange={handleRegisterChange}
                  value={registerData.password_confirmation}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePassword("regConfirm")}
                >
                  {showPassword.regConfirm ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
                {registerErrors.password_confirmation && (
                  <span className="field-error">{registerErrors.password_confirmation}</span>
                )}
              </div>

              {/* PHONE */}
              <div className={`input-field ${registerErrors.phone ? "input-error" : ""}`}>
                <i><GiSmartphone /></i>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleRegisterChange}
                  value={registerData.phone}
                  maxLength={10}
                  autoComplete="tel"
                />
                {registerErrors.phone && <span className="field-error">{registerErrors.phone}</span>}
              </div>

              {/* SUBMIT */}
              <button
                className="btn-register solid"
                type="submit"
                disabled={registerLoading}
              >
                <span></span><span></span><span></span><span></span>
                {registerLoading ? (
                  <><div className="btn-spinner"></div> Creating Account...</>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* ═══════ LOGIN FORM ═══════ */}
            <form className="sign-up-form" onSubmit={handleLoginSubmit}>
              <h2 className="title-name">
                <HiSparkles className="title-sparkle" />
                Welcome Back
              </h2>
              <p className="title-subtitle">Sign in to continue your journey</p>


              {loginError && (
                <div className="error-banner">
                  <span>⚠️</span> {loginError}
                </div>
              )}

              {/* EMAIL */}
              <div className={`input-field ${loginErrors.email ? "input-error" : ""}`}>
                <i><TfiEmail /></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleLoginChange}
                  value={loginData.email}
                  autoComplete="email"
                />
                {loginErrors.email && <span className="field-error">{loginErrors.email}</span>}
              </div>

              {/* PASSWORD */}
              <div className={`input-field ${loginErrors.password ? "input-error" : ""}`}>
                <i><RiLockPasswordFill /></i>
                <input
                  type={showPassword.loginPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleLoginChange}
                  value={loginData.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePassword("loginPass")}
                >
                  {showPassword.loginPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
                {loginErrors.password && <span className="field-error">{loginErrors.password}</span>}
              </div>

              <div className="form-extras">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              {/* SUBMIT */}
              <button
                className="btn-register solid"
                type="submit"
                disabled={loginLoading}
              >
                <span></span><span></span><span></span><span></span>
                {loginLoading ? (
                  <><div className="btn-spinner"></div> Signing in...</>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ═══════ SLIDING PANELS ═══════ */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content-log">
              <h3>Already have an account?</h3>
              <p>
                Sign in with your credentials to access your dashboard and
                continue where you left off.
              </p>
              <button className="btn-log transparent" onClick={onAddclick}>
                Sign In
              </button>
            </div>
            <img alt="login illustration" className="image-log" src="/image/log.svg" />
          </div>
          <div className="panel right-panel">
            <div className="content-log">
              <h3>New here?</h3>
              <p>
                Create an account to get started! Join our community and unlock
                all features for free.
              </p>
              <button onClick={onRemoveclick} className="btn-log transparent">
                Sign Up
              </button>
            </div>
            <img
              alt="register illustration"
              className="image-log"
              src="/image/register.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registerform;