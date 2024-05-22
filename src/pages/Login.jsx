import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authenticateUser from "../authenticateUser";
import { IoMdRefreshCircle } from "react-icons/io";
import loginImg from "../assets/CloudinityLogo.png"; // Ensure the path is correct
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Load stored username and password from local storage
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const formInputChange = (formField, value) => {
    if (formField === "username") {
      setUsername(value);
      setUsernameErr("");
    } else if (formField === "password") {
      setPassword(value);
      setPasswordErr("");
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
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validation()) {
      try {
        const response = await authenticateUser(username, password);
        if (response.status === "success") {
          // Save credentials in local storage if remember me is checked
          if (rememberMe) {
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
          } else {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
          }
          navigate("/Dashboard");
          // navigate("/success");
        }
      } catch (err) {
        setError(err.message || "An error occurred during login");
      }
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  // const handleSignUpClick = () => {
  //   navigate("/signup");
  // };

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
              Login
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
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => formInputChange("password", e.target.value)}
                />
                {passwordErr && (
                  <p className="text-xs text-red-500">{passwordErr}</p>
                )}
              </div>
              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label htmlFor="remember" className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-black">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="flex items-center text-sm font-medium text-primary-600 hover:underline dark:text-black"
                >
                  Forgot password?
                  <IoMdRefreshCircle className="ml-1" />
                </Link>
              </div>
              <button
                type="submit"
                className="w-full mx-auto text-black bg-amber-300 hover:bg-amber-300 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-amber-300 dark:hover:bg-amber-300 dark:focus:ring-amber-400"
              >
                Login
              </button>
              {error && (
                <p className="text-center text-xs text-red-500">{error}</p>
              )}
              {/* Sign Up Link */}
              <p className="text-sm text-center font-light text-gray-500 dark:text-black">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
