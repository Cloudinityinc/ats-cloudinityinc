import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/cognitoService";
import loginImg from "../assets/CloudinityLogo.png";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const formInputChange = (formField, value) => {
    if (formField === "username") {
      setUsername(value);
      setUsernameErr("");
    } else if (formField === "password") {
      setPassword(value);
      setPasswordErr("");
    } else if (formField === "confirmPassword") {
      setConfirmPassword(value);
      setConfirmPasswordErr("");
    }
  };

  const validation = () => {
    let isValid = true;
    if (!username) {
      setUsernameErr("Username is required");
      isValid = false;
    }
    if (!password) {
      setPasswordErr("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordErr("Password must be at least 6 characters");
      isValid = false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordErr("Passwords must match");
      isValid = false;
    }
    return isValid;
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (validation()) {
  //     try {
  //       await registerUser(username, password);
  //       navigate("/login");
  //     } catch (err) {
  //       setError(err.message || "An error occurred during registration");
  //     }
  //   }
  // };

  // Inside your handleSubmit function in the Signup component
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validation()) {
      try {
        await registerUser(username, password);
        navigate("/verify-otp", { state: { username } }); // Redirect to OTP verification page
      } catch (err) {
        setError(err.message || "An error occurred during registration");
      }
    }
  };

  return (
    <section className="bg-sky-300 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full h-auto bg-blue-200 rounded-lg shadow dark:border sm:max-w-md md:mt-0 xl:p-0">
          <div className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img
              className="w-full h-48 object-contain"
              src={loginImg}
              alt="logo"
            />
          </div>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-3xl md:text-4xl text-center leading-normal font-bold text-orange-500">
              Signup
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="block w-full p-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg sm:text-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => formInputChange("username", e.target.value)}
                />
                {usernameErr && (
                  <p className="text-xs text-red-500">{usernameErr}</p>
                )}
              </div>
              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg sm:text-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => formInputChange("password", e.target.value)}
                />
                {passwordErr && (
                  <p className="text-xs text-red-500">{passwordErr}</p>
                )}
              </div>
              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg sm:text-sm focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Confirm Password"
                  required
                  value={confirmPassword}
                  onChange={(e) =>
                    formInputChange("confirmPassword", e.target.value)
                  }
                />
                {confirmPasswordErr && (
                  <p className="text-xs text-red-500">{confirmPasswordErr}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full mx-auto text-black bg-amber-300 hover:bg-amber-300 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-amber-300 dark:hover:bg-amber-300 dark:focus:ring-amber-400"
              >
                Register
              </button>
              {error && (
                <p className="text-center text-xs text-red-500">{error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
