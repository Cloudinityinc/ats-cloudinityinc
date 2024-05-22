import React from "react";
import loginImg from "../assets/CloudinityLogo.png";

const Header = () => {
  return (
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mx-auto p-4">
        {/* Logo on the left */}
        <div className="flex items-center space-x-3">
          <img src={loginImg} className="h-8" alt="Logo" />
        </div>

        {/* Centered text */}
        <div className="flex-grow text-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ATS-Cloudinity
          </span>
        </div>

        {/* Empty div for balancing flex space */}
        <div
          className="flex items-center space-x-3"
          style={{ visibility: "hidden" }}
        >
          <img src={loginImg} className="h-8" alt="Invisible Logo" />
        </div>
      </div>
    </nav>
  );
};

export default Header;
