import React, { useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import loginImg from "../assets/CloudinityLogo.png"; // Ensure the path is correct
import { FaHome, FaUser } from "react-icons/fa";
import { SlLogout } from "react-icons/sl";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const Menu = [
    { title: "Home", path: "/Dashboard", icon: <FaHome /> },
    { title: "Candidates", path: "/users", icon: <FaUser /> },
    { title: "Logout", path: "/logout", icon: <SlLogout /> },
  ];

  return (
    <div
      className={`bg-dark-purple h-screen duration-300 relative ${
        open ? "w-72" : "w-20"
      } flex flex-col items-center`}
    >
      <BsArrowLeftShort
        className={`bg-white text-dark-purple text-3xl rounded-full absolute -right-3 top-9 border border-dark-purple cursor-pointer ${
          !open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      />
      <div
        className={`flex items-center w-full ${
          open ? "justify-start mt-9 ml-4" : "justify-center mt-9"
        }`}
      >
        <img
          src={loginImg}
          className={`transition-all duration-300 ${open ? "h-8" : "h-6"}`}
          alt="Logo"
        />
        {/* Conditionally render the "Dashboard" text based on `open` state */}
        {open && <span className="text-white ml-4 text-lg">Dashboard</span>}
      </div>
      <ul className="pt-2 w-full">
        {Menu.map((item, index) => (
          <Link key={index} to={item.path}>
            <li
              className={`text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md mt-2 ${
                !open && "justify-center"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {open && <span className="ml-2">{item.title}</span>}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
