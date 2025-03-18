import React from "react";
import { Link } from "react-router-dom";
import googleLogo from "./assets/google-logo.png";
import appleLogo from "./assets/apple-logo.png";
import { auth, googleProvider, signInWithPopup } from "./firebase";

const SignIn = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google Sign-In Successful:", user);
      // Redirect or update state as needed
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <p className="welcome-back">Welcome back!</p>
        <p className="credentials-text">Enter your Credentials to access your account</p>
        <form>
          <label>Email address</label>
          <input type="email" placeholder="Enter your email" />

          <div className="password-row">
            <label>Password</label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          <input type="password" placeholder="Enter your password" />

          <div className="terms">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember for 30 days</label>
          </div>

          <button className="signup-button">Login</button>
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