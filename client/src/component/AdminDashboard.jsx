import {
  CircleCheckIcon,
  HardHatIcon,
  TriangleAlertIcon,
  UserIcon,
  XCircleIcon,
  TrendingUpIcon,
  GitBranchIcon,
} from "lucide-react";
import React from "react";

const AdminDashboard = ({ data}) => {
  const stats = [
    {
      icon: UserIcon,
      title: "Employees",
      value: data?.totalEmployees || 0,
      description: "Active Workforce",
      color:
        "from-blue-500/20 to-cyan-500/20 border-blue-200",
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      icon: HardHatIcon,
      title: "Sites",
      value: data?.totalSites || 0,
      description: "Operational Sites",
      color:
        "from-violet-500/20 to-purple-500/20 border-violet-200",
      iconColor: "text-violet-600 bg-violet-100",
    },


        {
      icon: GitBranchIcon,
      title: "BranchName",
      value: data?.totalBranches || 0,
      description: "Operational Branches",
      color:
        "from-violet-500/20 to-purple-500/20 border-violet-200",
      iconColor: "text-violet-600 bg-violet-100",
    },
    {
      icon: TriangleAlertIcon,
      title: "Complaints",
      value: data?.complaints || 0,
      description: "Total Complaints",
      color:
        "from-amber-500/20 to-orange-500/20 border-amber-200",
      iconColor: "text-amber-600 bg-amber-100",
    },
    {
      icon: CircleCheckIcon,
      title: "Solved",
      value: data?.solvedComplaints || 0,
      description: "Resolved Cases",
      color:
        "from-green-500/20 to-emerald-500/20 border-green-200",
      iconColor: "text-green-600 bg-green-100",
    },
    {
      icon: XCircleIcon,
      title: "Pending",
      value: data?.pendingComplaints || 0,
      description: "Need Attention",
      color:
        "from-rose-500/20 to-red-500/20 border-rose-200",
      iconColor: "text-rose-600 bg-rose-100",
    },
  ];


  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="mt-2 text-indigo-100">
            Here's what's happening across your
            organization today.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
              <TrendingUpIcon size={16} />
              <span className="text-sm">
                Performance Overview
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${item.color}
            backdrop-blur-xl p-6 shadow-sm hover:shadow-2xl
            hover:-translate-y-2 transition-all duration-300`}
          >
            {/* Decorative Glow */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl"></div>

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-4xl font-bold text-slate-800">
                  {item.value}
                </h2>

                <p className="mt-2 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>

              <div
                className={`rounded-2xl p-3 ${item.iconColor}
                shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary */}

    </div>
  );
};

export default AdminDashboard;