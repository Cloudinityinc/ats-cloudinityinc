import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { IoSearch } from "react-icons/io5";
import axios from "axios";

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([
    "ReqId",
    "FullName",
    "ResumeFileName",
    "EmailId",
    "Role",
    "DOB",
    "ReqSkills",
    "ReqCreationDate",
    "ReqTitle",
    "ImmigrationStatus",
    "ContractType",
  ]);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const allColumns = [
    "ReqId",
    "FullName",
    "ResumeFileName",
    "EmailId",
    "Role",
    "DOB",
    "ReqSkills",
    "ReqCreationDate",
    "ReqTitle",
    "ImmigrationStatus",
    "ContractType",
    "SubmissionDate",
    "ReqSubmissionEndDate",
    "CandidateCurrentLocation",
    "ContactNumber",
    "RecruiterName",
    "State",
    "SubmissionStatus",
    "VendorRate",
    "CandidatePayRate",
    "BillRateMargin",
    "BillRate",
    "ResumeSource",
    "VendorID",
    "LinkedInID",
    "EmployerInformation",
    "ProfessionalReferences",
    "ResumeFormattingNeeded",
    "FormattedBy",
    "Date",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_FETCH_DATA);
        if (!response.ok) {
          throw new Error("Data could not be fetched!");
        }
        const result = await response.json();
        if (result.body) {
          const actualData = JSON.parse(result.body);
          setData(actualData);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const downloadFile = async (ResumeFileName) => {
    try {
      // Construct the URL with the base URL from the environment variable
      const apiUrl = `${
        process.env.REACT_APP_RESUME_DOWNLOAD
      }?guide=${encodeURIComponent(ResumeFileName)}`;

      // Fetch the presigned URL from your Lambda function
      const response = await axios.get(apiUrl);
      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch presigned URL: ${response.statusText}`
        );
      }
      const presignedUrl = response.data;

      // Using the presigned URL to initiate the download
      const result = await axios.get(presignedUrl, {
        responseType: "blob", // This ensures that the response is handled as a file
      });
      if (result.status !== 200) {
        throw new Error(`Failed to download file: ${result.statusText}`);
      }

      // Create a download link and click it programmatically
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", ResumeFileName); // Set the download attribute with filename
      document.body.appendChild(link);
      link.click();

      // Clean up and revoke the object URL
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Failed to download file: ${error.message}. Please try again.`);
    }
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const navigateToAddCandidate = () => {
    navigate("/success");
  };

  const filteredData = data.filter((item) =>
    allColumns.some(
      (column) =>
        item[column] &&
        item[column].toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg m-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Filter
            </button>
            <button
              onClick={navigateToAddCandidate}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Candidate
            </button>
            {isFilterVisible && (
              <div className="absolute z-10 bg-white p-4 shadow-lg rounded">
                {allColumns.map((column) => (
                  <div key={column}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column)}
                      onChange={() => toggleColumnVisibility(column)}
                    />{" "}
                    {column}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <IoSearch className="text-black-800 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {visibleColumns.map((column) => (
                <th key={column} scope="col" className="py-3 px-6">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {visibleColumns.map((column) => (
                  <td key={column} className="py-4 px-6 relative">
                    {column === "ResumeFileName" ? (
                      <div className="group">
                        <a
                          href="#/"
                          onClick={() => downloadFile(item[column])}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {item[column]}
                        </a>
                        <div className="hidden group-hover:block absolute z-20 w-48 p-2 bg-white border border-gray-300 shadow-lg">
                          <img
                            src={`path/to/preview/${item[column]}.jpg`}
                            alt="Resume Preview"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    ) : (
                      item[column]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
