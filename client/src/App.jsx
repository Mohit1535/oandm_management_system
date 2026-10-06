
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Loginform from "./component/Loginform";
import Layout from "./page/Layout";
import Employee from "./page/Employee";
import Setting from "./page/Setting";
import Complaint from "./page/Complaint";
import Dashboard from "./page/Dashboard";
import LoginLanding from "./page/LoginLanding";
import Site from "./page/Site.jsx";
import Branch from "./page/Branch.jsx";
import Utr from "./page/Utr.jsx";



const App = () => {
  return (
    <>
      <Toaster />

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<LoginLanding />}
        />

        <Route
          path="/login/admin"
          element={
            <Loginform
              title="Admin"
              subtitle="Welcome Admin, access your dashboard"
              role="ADMIN"
            />
          }
        />

        <Route
          path="/login/employee"
          element={
            <Loginform
              title="Employee"
              subtitle="Welcome Employee, access your profile"
              role="EMPLOYEE"
            />
          }
        />

        {/* Main Application */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/employees"
            element={<Employee />}
          />

          <Route
            path="/sites"
            element={<Site />}
          />



          <Route
            path="/complaints"
            element={<Complaint />}
          />


            <Route
            path="/branches"
            element={<Branch />}
          />


          <Route
            path="/settings"
            element={<Setting />}
          />


    <Route
            path="/utr"
            element={<Utr />}
          />
        </Route>

        {/* Any unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </>
  );
};

export default App;

