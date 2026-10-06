import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar.jsx";
import { useAuth } from "../context/authContext.jsx";
import Loading from "../component/Loading.jsx";

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
