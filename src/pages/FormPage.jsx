import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const initialFormData = {
    FullName: "",
    // RequiredID: "",
    ReqId: "",
    ReqTitle: "",
    Role: "",
    ReqCreationDate: "",
    VendorID: "",
    ImmigrationStatus: "",
    ContractType: "",
    SubmissionDate: "",
    ReqSubmissionEndDate: "",
    CandidateCurrentLocation: "",
    ContactNumber: "",
    RecruiterName: "",
    State: "",
    SubmissionStatus: "",
    VendorRate: "",
    CandidatePayRate: "",
    BillRateMargin: "",
    BillRate: "",
    ResumeSource: "",
    EmailId: "",
    LinkedInID: "",
    EmployerInformation: "",
    ProfessionalReferences: "",
    DOB: "",
    ReqSkills: "",
    ResumeFormattingNeeded: "",
    FormattedBy: "",
    Resume: null,
    ResumeFileName: "", // Placeholder for the resume fileßƒ
  };
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const resumeInputRef = useRef(null);

  const recruiterName = process.env.REACT_APP_RECRUITER_NAME.split(",");
  const [selectedRecruiterName, setSelectedRecruiterName] = useState("");

  // const recruitingStatus = process.env.REACT_APP_RECRUITING_STATUS.split(",");
  // const [selectRecruitingStatus, setSelectRecruitingStatus] = useState("");

  const immigrationStatus = process.env.REACT_APP_IMMIGRATION_STATUS.split(",");
  const [selectImmigrationStatus, setSelectImmigrationStatus] = useState("");

  const contractType = process.env.REACT_APP_CONTRACT_TYPE.split(",");
  const [selectContractType, setSelectContractType] = useState("");

  const stateName = process.env.REACT_APP_STATE_NAME.split(",");
  const [selectStateName, setSelectStateName] = useState("");

  // const questionnaire = process.env.REACT_APP_QUESTIONNAIRE.split(",");
  // const [selectQuestionnaire, setSelectQuestionnaire] = useState("");

  const submissionStatus = process.env.REACT_APP_SUBMISSION_STATUS.split(",");
  const [selectSubmissionStatus, setSelectSubmissionStatus] = useState("");

  const formattingNeeded = process.env.REACT_APP_FOMATTING_NEEDED.split(",");
  const [selectResumeFormattingNeeded, setSelectResumeFormattingNeeded] =
    useState("");

  const [isImmigrationStatusDropdownOpen, setIsImmigrationStatusDropdownOpen] =
    useState(false);

  const [isContractTypeDropdownOpen, setIsContractTypeDropdownOpen] =
    useState(false);

  const [isRecruiterNameDropdownOpen, setIsRecruiterNameDropdownOpen] =
    useState(false);

  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);

  const [isSubmissionStatusDropdownOpen, setIsSubmissionStatusDropdownOpen] =
    useState(false);

  const [
    isResumeFormattingNeededDropdownOpen,
    setIsResumeFormattingNeededDropdownOpen,
  ] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("#dropdownHoverContainer")) {
        setIsImmigrationStatusDropdownOpen(false);
        setIsContractTypeDropdownOpen(false);
        setIsRecruiterNameDropdownOpen(false);
        setIsStateDropdownOpen(false);
        setIsSubmissionStatusDropdownOpen(false);
        setIsResumeFormattingNeededDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const pattern = /^\+?[1-9]\d{1,14}$/; // Basic international phone number pattern
    return pattern.test(phoneNumber);
  };

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    let newFormData = { ...formData };

    if (id === "Resume" && files) {
      const file = files[0];
      if (file) {
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.type) || file.size > 1024 * 1024 * 10) {
          setValidationErrors({
            ...validationErrors,
            Resume: "Only PDF or DOC files under 10MB are allowed.",
          });
        } else {
          // Generate the filename and store it in the formData
          const filename = `${newFormData.ReqId}_${newFormData.FullName}_${file.name}`;
          newFormData.Resume = file;
          newFormData.ResumeFileName = filename; // Store the generated filename

          let newErrors = { ...validationErrors };
          delete newErrors.Resume;
          setValidationErrors(newErrors);
        }
      }
    } else {
      newFormData[id] = value;
      let newErrors = { ...validationErrors };
      delete newErrors[id];
      setValidationErrors(newErrors);
    }

    // Automatically update Bill Rate Margin when Bill Rate or Vendor Rate changes
    if (id === "BillRate" || id === "VendorRate") {
      const billRate = parseFloat(newFormData.BillRate) || 0;
      const vendorRate = parseFloat(newFormData.VendorRate) || 0;
      const billRateMargin = billRate - vendorRate;

      // Update Bill Rate Margin in form data
      newFormData.BillRateMargin = billRateMargin.toString();
    }

    setFormData(newFormData);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Iterate over formData to check for empty fields
    Object.keys(formData).forEach((key) => {
      // Exclude the 'Resume' field from this check since it's handled separately
      if (key !== "Resume") {
        const value = formData[key];
        // Check if the field is either not set, an empty string, or (for dropdowns) the placeholder value
        if (!value || value === "" || value === "Select an option") {
          newErrors[key] = "This field is required.";
          isValid = false;
        }
      }
    });

    // Additional validation for EmailId
    if (formData.EmailId && !isValidEmail(formData.EmailId)) {
      newErrors.EmailId = "Invalid email format.";
      isValid = false;
    }

    if (formData.ContactNumber && !isValidPhoneNumber(formData.ContactNumber)) {
      newErrors.ContactNumber = "Invalid phone number format.";
      isValid = false;
    }

    // Check for resume upload
    if (!formData.Resume) {
      newErrors.Resume = "Please upload a resume.";
      isValid = false;
    }

    if (formData.BillRateMargin < 0) {
      newErrors.BillRateMargin =
        "Bill Rate Margin cannot be negative. Please check the Bill Rate and Vendor Rate.";
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  // const uploadResume = async (file) => {
  //   // const filename = encodeURIComponent(file.name);
  //   // // const uploadUrl = `${process.env.REACT_APP_API_URL}/${formData.ReqId}/${filename}`;
  //   // const uploadUrl = `${process.env.REACT_APP_API_URL}/${filename}`;
  //   const filename = `${formData.ReqId}_${formData.FullName}_${file.name}`;
  //   const uploadUrl = `${process.env.REACT_APP_API_URL}/${filename}`;

  //   const fileData = new FormData();
  //   fileData.append("file", file, filename);

  //   try {
  //     const response = await fetch(uploadUrl, {
  //       method: "POST",
  //       body: fileData,
  //       // body: JSON.stringify(data),
  //     });
  //     const data = await response.json();

  //     console.log("Server response:", data);

  //     if (!response.ok) {
  //       throw new Error(`Server responded with status: ${response.status}`);
  //     }

  //     // Since the server confirms success but doesn't provide a URL, log the success and maybe return a success message instead
  //     if (data.message === "File uploaded successfully") {
  //       console.log(data.message);
  //       // Return a static message or a mock URL, or adjust as needed
  //       return "Upload successful, no URL provided"; // Placeholder return value
  //     } else {
  //       throw new Error(
  //         "Unexpected server response, upload may not be successful."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Upload Error:", error);
  //     throw error;
  //   }
  // };

  const uploadResume = async (file) => {
    const filename = `${formData.ReqId}_${formData.FullName}_${file.name}`;
    const uploadUrl = `${process.env.REACT_APP_API_URL}/${filename}`;

    const fileData = new FormData();
    console.log("Uploading file:", file.name, file.size, file.type);
    fileData.append("file", file, filename);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: fileData,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      if (data.message === "File uploaded successfully") {
        console.log(data.message);
        return "Upload successful, no URL provided";
      } else {
        throw new Error(
          "Unexpected server response, upload may not be successful."
        );
      }
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  const submitForm = async () => {
    const submitUrl = process.env.REACT_APP_FORM_URL;
    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to submit form.");
      return await response.json(); // or handle success without expecting a return value
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  const handleDropdownChange = (e) => {
    console.log(e.target.id);
    const { id, value } = e.target; // `id` is "ImmigrationStatus", and `value` is the selected option's value
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value, // Dynamically updates the correct key in formData based on the dropdown's id
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (formData.Resume) {
        const resumeUrl = await uploadResume(formData.Resume);
        // Update formData with the resume URL for submission
        const updatedFormData = { ...formData, ResumeUrl: resumeUrl };
        await submitForm(updatedFormData);
        setShowPopup(true); // Show success message
        setFormData(initialFormData); // Reset form
      } else {
        // Handle the case where a resume is required but not uploaded
        throw new Error("Resume is required.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setFormData(initialFormData);
    setSelectedRecruiterName("");
    // setSelectRecruitingStatus("");
    setSelectImmigrationStatus("");
    setSelectContractType("");
    setSelectStateName("");
    // setSelectQuestionnaire("");
    setSelectSubmissionStatus("");
    setSelectResumeFormattingNeeded("");
    setValidationErrors({});
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
    navigate("/users");
  };

  return (
    <div>
      <Header />
      <section className="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800 mt-20">
        <h1 className="text-xl font-bold text-white capitalize dark:text-white">
          Employee Information Form
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="FullName"
              >
                Full Name
              </label>
              <input
                id="FullName"
                type="String"
                placeholder="Full Name"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.FullName}
              />
              {validationErrors.FullName && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.FullName}
                </p>
              )}
            </div>
            <div>
              <label className="text-white dark:text-gray-200" htmlFor="ReqId">
                Required ID
              </label>
              <input
                id="ReqId"
                type="number"
                placeholder="ID"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ReqId}
              />
              {validationErrors.ReqId && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ReqId}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="ReqTitle"
              >
                Required Title
              </label>
              <input
                id="ReqTitle"
                type="String"
                placeholder="Title"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ReqTitle}
              />
              {validationErrors.ReqTitle && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ReqTitle}
                </p>
              )}
            </div>
            <div>
              <label className="text-white dark:text-gray-200" htmlFor="Role">
                Role
              </label>
              <input
                id="Role"
                type="String"
                placeholder="Role"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.Role}
              />
              {validationErrors.Role && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.Role}
                </p>
              )}
            </div>
            {/* </div> */}
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="ReqCreationDate"
              >
                Required Creation Date
              </label>
              <input
                id="ReqCreationDate"
                // type="Number"
                type="Date"
                placeholder="MM/DD/YYYY"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ReqCreationDate}
              />
              {validationErrors.ReqCreationDate && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ReqCreationDate}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="VendorID"
              >
                Vendor ID
              </label>
              <input
                id="VendorID"
                type="String"
                placeholder="Vendor ID"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.VendorID}
              />
              {validationErrors.VendorID && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.VendorID}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="BillRate"
              >
                Bill Rate
              </label>
              <input
                id="BillRate"
                type="number"
                placeholder="Bill Rate"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.BillRate}
              />
              {validationErrors.BillRate && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.BillRate}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="ImmigrationStatus"
                className="text-white dark:text-gray-200 mr-4"
              >
                Immigration Status:
              </label>

              <div id="dropdownHoverContainer" className="relative">
                <button
                  onClick={() =>
                    setIsImmigrationStatusDropdownOpen(
                      !isImmigrationStatusDropdownOpen
                    )
                  }
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  {selectImmigrationStatus || "Select Option"}
                  <svg
                    className="w-10 h-5 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </button>

                {isImmigrationStatusDropdownOpen && (
                  <div className="absolute z-10 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      {immigrationStatus.map((status, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setSelectImmigrationStatus(status);
                              handleDropdownChange({
                                target: {
                                  id: "ImmigrationStatus",
                                  value: status,
                                },
                              });
                              setIsImmigrationStatusDropdownOpen(false);
                            }}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationErrors.ImmigrationStatus && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {validationErrors.ImmigrationStatus}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="ContractType"
                className="text-white dark:text-gray-200 mr-4"
              >
                Contract Type:
              </label>

              <div id="dropdownHoverContainer" className="relative">
                <button
                  onClick={() =>
                    setIsContractTypeDropdownOpen(!isContractTypeDropdownOpen)
                  }
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  {selectContractType || "Select Option"}
                  <svg
                    className="w-10 h-5 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </button>

                {isContractTypeDropdownOpen && (
                  <div className="absolute z-10 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      {contractType.map((status, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setSelectContractType(status);
                              handleDropdownChange({
                                target: {
                                  id: "ContractType",
                                  value: status,
                                },
                              });
                              setIsContractTypeDropdownOpen(false);
                            }}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationErrors.ContractType && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {validationErrors.ContractType}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="SubmissionDate"
              >
                Submission Date
              </label>
              <input
                id="SubmissionDate"
                type="Date"
                placeholder="MM/DD/YYYY"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.SubmissionDate}
              />
              {validationErrors.SubmissionDate && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.SubmissionDate}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="ReqSubmissionEndDate"
              >
                Required Submission end Date
              </label>
              <input
                id="ReqSubmissionEndDate"
                type="Date"
                placeholder="MM/DD/YYYY"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ReqSubmissionEndDate}
              />
              {validationErrors.ReqSubmissionEndDate && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ReqSubmissionEndDate}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="CandidateCurrentLocation"
              >
                Candidate Current Location
              </label>
              <input
                id="CandidateCurrentLocation"
                type="String"
                placeholder="Candidate Current Location"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.CandidateCurrentLocation}
              />
              {validationErrors.CandidateCurrentLocation && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.CandidateCurrentLocation}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="ContactNumber"
              >
                Contact Number
              </label>
              <input
                id="ContactNumber"
                type="number"
                placeholder="Contact Number"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ContactNumber}
              />
              {validationErrors.ContactNumber && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ContactNumber}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="RecruiterName"
                className="text-white dark:text-gray-200 mr-4"
              >
                Recruiter Name:
              </label>

              <div id="dropdownHoverContainer" className="relative">
                <button
                  onClick={() =>
                    setIsRecruiterNameDropdownOpen(!isRecruiterNameDropdownOpen)
                  }
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  {selectedRecruiterName || "Select Option"}
                  <svg
                    className="w-10 h-5 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </button>

                {isRecruiterNameDropdownOpen && (
                  <div className="absolute z-10 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      {recruiterName.map((status, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setSelectedRecruiterName(status);
                              handleDropdownChange({
                                target: {
                                  id: "RecruiterName",
                                  value: status,
                                },
                              });
                              setIsRecruiterNameDropdownOpen(false);
                            }}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationErrors.RecruiterName && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {validationErrors.RecruiterName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="State"
                className="text-white dark:text-gray-200 mr-4"
              >
                State:
              </label>

              <div id="dropdownHoverContainer" className="relative">
                <button
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  {selectStateName || "Select Option"}
                  <svg
                    className="w-10 h-5 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </button>

                {isStateDropdownOpen && (
                  <div className="absolute z-10 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      {stateName.map((status, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setSelectStateName(status);
                              handleDropdownChange({
                                target: {
                                  id: "State",
                                  value: status,
                                },
                              });
                              setIsStateDropdownOpen(false);
                            }}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationErrors.State && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {validationErrors.State}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="SubmissionStatus"
                className="text-white dark:text-gray-200 mr-4"
              >
                Submission Status:
              </label>

              <div id="dropdownHoverContainer" className="relative">
                <button
                  onClick={() =>
                    setIsSubmissionStatusDropdownOpen(
                      !isSubmissionStatusDropdownOpen
                    )
                  }
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  {selectSubmissionStatus || "Select Option"}
                  <svg
                    className="w-10 h-5 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </button>

                {isSubmissionStatusDropdownOpen && (
                  <div className="absolute z-10 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      {submissionStatus.map((status, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setSelectSubmissionStatus(status);
                              handleDropdownChange({
                                target: {
                                  id: "SubmissionStatus",
                                  value: status,
                                },
                              });
                              setIsSubmissionStatusDropdownOpen(false);
                            }}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationErrors.SubmissionStatus && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {validationErrors.SubmissionStatus}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="VendorRate"
              >
                Vendor Rate
              </label>
              <input
                id="VendorRate"
                type="number"
                placeholder="Vendor Rate "
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.VendorRate}
              />
              {validationErrors.VendorRate && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.VendorRate}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="CandidatePayRate"
              >
                Candidate Pay Rate
              </label>
              <input
                id="CandidatePayRate"
                type="number"
                placeholder="Candidate Pay Rate"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.CandidatePayRate}
              />
              {validationErrors.CandidatePayRate && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.CandidatePayRate}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="BillRateMargin"
              >
                Bill Rate Margin
              </label>
              <input
                id="BillRateMargin"
                type="number"
                placeholder="Bill Rate Margin"
                readOnly
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.BillRateMargin}
              />
              {validationErrors.BillRateMargin && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.BillRateMargin}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="ResumeSource"
              >
                Resume Source
              </label>
              <input
                id="ResumeSource"
                type="String"
                placeholder="Resume Source"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ResumeSource}
              />
              {validationErrors.ResumeSource && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ResumeSource}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="EmailId"
              >
                Email ID
              </label>
              <input
                id="EmailId"
                type="String"
                placeholder="Email ID"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.EmailId}
              />
              {validationErrors.EmailId && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.EmailId}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="LinkedInID"
              >
                LinkedIn ID
              </label>
              <input
                id="LinkedInID"
                type="String"
                placeholder="LinkedIn ID"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.LinkedInID}
              />
              {validationErrors.LinkedInID && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.LinkedInID}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="EmployerInformation"
              >
                Employer Information
              </label>
              <input
                id="EmployerInformation"
                type="String"
                placeholder="Employer Information"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.EmployerInformation}
              />
              {validationErrors.EmployerInformation && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.EmployerInformation}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="ProfessionalReferences"
              >
                Professional References
              </label>
              <input
                id="ProfessionalReferences"
                type="String"
                placeholder="Professional References "
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ProfessionalReferences}
              />
              {validationErrors.ProfessionalReferences && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ProfessionalReferences}
                </p>
              )}
            </div>
            <div>
              <label className="text-white dark:text-gray-200" htmlFor="DOB">
                DOB
              </label>
              <input
                id="DOB"
                type="Date"
                placeholder="MM/DD/YYYY"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.DOB}
              />
              {validationErrors.DOB && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.DOB}
                </p>
              )}
            </div>
            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="ReqSkills"
              >
                Required Skills
              </label>
              <input
                id="ReqSkills"
                type="String"
                placeholder="Required Skills"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.ReqSkills}
              />
              {validationErrors.ReqSkills && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.ReqSkills}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="ResumeFormattingNeeded"
                className="text-white dark:text-gray-200 mr-4"
              >
                Resume Formatting Needed?
              </label>

              <div id="dropdownHoverContainer" className="relative">
                <button
                  onClick={() =>
                    setIsResumeFormattingNeededDropdownOpen(
                      !isResumeFormattingNeededDropdownOpen
                    )
                  }
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  {selectResumeFormattingNeeded || "Select Option"}
                  <svg
                    className="w-10 h-5 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 8l4 4 4-4"
                    />
                  </svg>
                </button>

                {isResumeFormattingNeededDropdownOpen && (
                  <div className="absolute z-10 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                      {formattingNeeded.map((status, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setSelectResumeFormattingNeeded(status);
                              handleDropdownChange({
                                target: {
                                  id: "ResumeFormattingNeeded",
                                  value: status,
                                },
                              });
                              setIsResumeFormattingNeededDropdownOpen(false);
                            }}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validationErrors.ResumeFormattingNeeded && (
                  <p className="text-red-500 text-xs italic mt-2">
                    {validationErrors.ResumeFormattingNeeded}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="text-white dark:text-gray-200"
                htmlFor="FormattedBy"
              >
                Formatted By
              </label>
              <input
                id="FormattedBy"
                type="String"
                placeholder="Formated By"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                onChange={handleInputChange} // attach handleInputChange here
                value={formData.FormattedBy}
              />
              {validationErrors.FormattedBy && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors.FormattedBy}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="Resume"
                className="block text-sm font-medium text-white"
              >
                Resume
              </label>
              <input
                id="Resume"
                name="Resume"
                type="file"
                onChange={handleInputChange}
                ref={resumeInputRef}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              {validationErrors["Resume"] && (
                <p className="text-red-500 text-xs italic">
                  {validationErrors["Resume"]}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg mb-4">Submission Successful</h2>
            <p>Your form has been submitted successfully.</p>
            <button
              onClick={handleClosePopup}
              disabled={isSubmitting}
              className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default FormPage;
