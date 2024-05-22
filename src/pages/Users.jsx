import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { IoSearch } from "react-icons/io5";

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
        console.log("Fetching data...");
        console.log("URL: ", process.env.REACT_APP_FETCH_DATA);
        const response = await fetch(process.env.REACT_APP_FETCH_DATA);

        console.log("Response:", response);
        if (!response.ok) {
          throw new Error("Data could not be fetched!");
        }
        console.log("Response OK");
        const result = await response.json(); // This is the outer JSON object
        console.log("Result Fetched:", result);
        if (result.body) {
          const actualData = JSON.parse(result.body); // Parse the stringified JSON array
          console.log("Parsed Data Array:", actualData);
          if (Array.isArray(actualData)) {
            setData(actualData);
          } else {
            console.error("Parsed data is not an array:", actualData);
          }
        } else {
          console.error("Response JSON does not contain 'body':", result);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

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

  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        return allColumns.some(
          (column) =>
            item[column] &&
            item[column]
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      })
    : [];

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
                  <td key={column} className="py-4 px-6">
                    {item[column]}
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
