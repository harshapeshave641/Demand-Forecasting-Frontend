import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleLogo from "./assets/google-logo.png";
import appleLogo from "./assets/apple-logo.png";
import { auth, googleProvider, signInWithPopup } from "./firebase";
import Modal from "./components/Modal"; // Import Modal

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setModal({ show: true, message: "Email and password are required!", type: "danger" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token); 
        setModal({ show: true, message: "Login successful!", type: "success" });
        setTimeout(() => {
          navigate("/dashboard"); 
        }, 150);
        window.location.reload();

      } else {
        setModal({ show: true, message: result.error || "Login failed!", type: "danger" });
      }
    } catch (error) {
      setModal({ show: true, message: "Network error! Try again.", type: "danger" });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google Sign-In Successful:", user);
    } catch (error) {
      setModal({ show: true, message: "Google Sign-In failed!", type: "danger" });
    }
  };

  return (
    <div className="container">
      {modal.show && <Modal message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />}

      <div className="form-container">
        <p className="welcome-back">Welcome back!</p>
        <p className="credentials-text">Enter your Credentials to access your account</p>

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />

          <div className="password-row">
            <label>Password</label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />

          <div className="terms">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember for 30 days</label>
          </div>

          <button className="signup-button" type="submit">Login</button>
        </form>

        <div className="or-divider">Or</div>

        <div className="social-login">
          <button className="google-login" onClick={handleGoogleSignIn}>
            <img src={googleLogo} alt="Google Logo" />
            Sign in with Google
          </button>
          <button className="apple-login">
            <img src={appleLogo} alt="Apple Logo" />
            Sign in with Apple
          </button>
        </div>

        <p className="signin-text">
          Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </div>

      <div className="image-container"></div>
    </div>
  );
};

export default SignIn;
