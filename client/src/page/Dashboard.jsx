
import React, { useEffect, useState } from "react";
import Loading from "../component/Loading.jsx";
import AdminDashboard from "../component/AdminDashboard.jsx";
import EmployeeDashboard from "../component/EmployeeDashboard.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { dummyAdminDashboardData } from "../assets.js";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);



    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");

        console.log("🔥 FULL DASHBOARD RESPONSE:", res);
        console.log("🔥 DASHBOARD DATA:", res.data);
        console.log("🔥 TOTAL BRANCH:", res.data?.totalBranch);
        console.log("🔥 TOTAL Sites:", res.data?.totalSites);


        setData(res.data);
        // setData(dummyAdminDashboardData);
      } catch (error) {
        console.error("🔥 DASHBOARD ERROR:", error);

        toast.error(
          error.response?.data?.error ||
            error.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
  fetchDashboard();

  
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />;
  }

  if (data.role === "EMPLOYEE") {
    return <EmployeeDashboard data={data} />;
  }

  return (
    <div className="p-6 text-red-500">
      Invalid dashboard role
    </div>
  );
};

export default Dashboard;
