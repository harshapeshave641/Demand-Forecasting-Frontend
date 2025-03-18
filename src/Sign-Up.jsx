import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
import googleLogo from "./assets/google-logo.png";
import appleLogo from "./assets/apple-logo.png";

const SignUp = () => {
  const navigate = useNavigate(); // 👈 Add this for redirection
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setModal({ show: true, message: "All fields are required!", type: "danger" });
      return;
    }

    if (formData.password.length < 6) {
      setModal({ show: true, message: "Password must be at least 6 characters long!", type: "danger" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setModal({ show: true, message: "Passwords do not match!", type: "danger" });
      return;
    }

    if (!formData.agreed) {
      setModal({ show: true, message: "You must agree to the terms & policy!", type: "danger" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setModal({ show: true, message: "Signup successful!", type: "success" });

        setTimeout(() => {
          setModal({ show: false, message: "", type: "" });
          navigate("/signin"); // 👈 Redirect after successful signup
        }, 2000); // 👈 Wait for 2 seconds before redirecting

        setFormData({ name: "", email: "", password: "", confirmPassword: "", agreed: false });
      } else {
        setModal({ show: true, message: result.error || "Signup failed!", type: "danger" });
      }
    } catch (error) {
      setModal({ show: true, message: "Network error! Try again.", type: "danger" });
    }
  };

  return (
    <div className="container">
      {modal.show && <Modal message={modal.message} type={modal.type} onClose={() => setModal({ ...modal, show: false })} />}

      <div className="form-container">
        <h2>Get Started Now</h2>
        <form onSubmit={handleSubmit}>
          <label>Organization Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" />

          <label>Email address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />

          <div className="terms">
            <input type="checkbox" id="terms" name="agreed" checked={formData.agreed} onChange={handleChange} />
            <label htmlFor="terms">
              I agree to the <a href="#">terms & policy</a>
            </label>
          </div>

          <button className="signup-button">Signup</button>
        </form>

        <div className="or-divider">Or</div>

        <div className="social-login">
          <button className="google-login">
            <img src={googleLogo} alt="Google Logo" />
            Sign in with Google
          </button>
          <button className="apple-login">
            <img src={appleLogo} alt="Apple Logo" />
            Sign in with Apple
          </button>
        </div>

        <p className="signin-text">
          Have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>

      <div className="image-container"></div>
    </div>
  );
};

export default SignUp;
