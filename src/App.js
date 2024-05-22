// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import SignUp from "./pages/Signup.jsx";
// import FormPage from "./pages/FormPage.jsx";
// // import Dashboard from "./pages/Dashboard.jsx";
// import VerifyOTP from "./pages/VerifyOTP.jsx";
// import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";

// function App() {
//   return (
//     <BrowserRouter>
//       <Header />
//       <Routes>
//         {" "}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
//         <Route path="/success" element={<FormPage />} />
//         <Route path="/verify-otp" element={<VerifyOTP />} />
//         <Route path="/" element={<Login />} />
//       </Routes>
//       <Footer />
//     </BrowserRouter>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import FormPage from "./pages/FormPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VerifyOTP from "./pages/VerifyOTP.jsx";
import Users from "./pages/Users.jsx";
// import Header from "./components/Header.jsx";
// import Footer from "./components/Footer.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        {" "}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        {/* <Route index element={<Dashboard />} /> */}
        <Route path="/users" element={<Users />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/success" element={<FormPage />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/" element={<Login />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
