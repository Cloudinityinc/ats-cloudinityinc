// import React, { useState } from "react";
// import { CognitoUser } from "amazon-cognito-identity-js";
// import userPool from "../CognitoConfig.js";

// const ConfirmAccount = () => {
//   const [username, setUsername] = useState("");
//   const [code, setCode] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const userData = {
//       Username: username,
//       Pool: userPool,
//     };

//     const cognitoUser = new CognitoUser(userData);
//     cognitoUser.confirmRegistration(code, true, (error, result) => {
//       if (error) {
//         setMessage(error.message || JSON.stringify(error));
//         return;
//       }
//       setMessage("Account confirmed successfully.");
//       // Redirect to login page or similar
//     });
//   };

//   return (
//     <div>
//       <h1>Confirm Account</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//         />
//         <input
//           type="text"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           placeholder="Verification Code"
//         />
//         <button type="submit">Confirm</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default ConfirmAccount;

//Main-Working
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { CognitoUser } from "amazon-cognito-identity-js";
// import userPool from "../CognitoConfig.js";

// const VerifyOTP = () => {
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const username = location.state?.username; // Get the username passed from the Signup component

//   const verifyUser = async () => {
//     const userData = {
//       Username: username,
//       Pool: userPool,
//     };
//     const cognitoUser = new CognitoUser(userData);

//     cognitoUser.confirmRegistration(otp, true, (err) => {
//       if (err) {
//         setError(err.message || JSON.stringify(err));
//         return;
//       }
//       navigate("/login"); // Redirect to login page after successful verification
//     });
//   };

//   return (
//     <div>
//       <h1>Verify OTP</h1>
//       <input
//         type="text"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         placeholder="Enter OTP"
//       />
//       <button onClick={verifyUser}>Verify</button>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default VerifyOTP;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CognitoUser } from "amazon-cognito-identity-js";
import userPool from "../CognitoConfig";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username; // Get the username passed from the Signup component

  const handleInputChange = (event, index) => {
    const newOtp = [...otp];
    newOtp[index] = event.target.value;
    setOtp(newOtp);

    // Automatically focus next input field
    if (event.target.nextSibling && event.target.value) {
      event.target.nextSibling.focus();
    }
  };

  const verifyUser = async () => {
    const fullOtp = otp.join("");
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(fullOtp, true, (err) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }
      navigate("/login"); // Redirect to login page after successful verification
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {username}</p>
            </div>
          </div>

          <form action="" method="post">
            <div className="flex flex-col space-y-16">
              <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                {otp.map((value, index) => (
                  <div key={index} className="w-16 h-16">
                    <input
                      className="w-full h-full flex items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={verifyUser}
                    className="flex items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                  >
                    Verify Account
                  </button>
                </div>

                <div className="flex items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                  <p>Didn't receive code?</p>{" "}
                  <a className="text-blue-600" href="#">
                    Resend
                  </a>
                </div>
              </div>
            </div>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
