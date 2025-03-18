import React from "react";
import { Link } from "react-router-dom";
import googleLogo from "./assets/google-logo.png";
import appleLogo from "./assets/apple-logo.png";

const SignUp = () => {
  return (
    <div className="container">
      <div className="form-container">
        <h2>Get Started Now</h2>
        <form>
          <label>Name</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email address</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <div className="terms">
            <input type="checkbox" id="terms" />
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
