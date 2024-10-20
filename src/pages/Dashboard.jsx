import React from "react";
import Sidebar from "../components/Sidebar"; // Adjust this import path to where your Sidebar component is located

const Dashboard = () => {
  return (
    <div className="dashboard flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1>Welcome to the Dashboard</h1>
        <p>
          This is a sample dashboard page. You can modify this page to suit your
          needs.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
