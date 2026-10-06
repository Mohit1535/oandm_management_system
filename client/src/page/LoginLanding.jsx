import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ShieldIcon,
  UserIcon,
  ArrowRightIcon,
} from "lucide-react";

import LoginLeftSide from "../component/LoginLeftSide";
import { useAuth } from "../context/authContext";
import Loading from "../component/Loading";

const LoginLanding = () => {

  const {loading,user}=useAuth
  if(loading) return <Loading/>
if(user) return < Navigate to="/"/>
  const [portalOptions] = useState([
    {
      to: "/login/admin",
      icon: ShieldIcon,
      title: "Admin Portal",
      description:
        "A centralized platform for managing operations, maintenance activities, complaints, employees, and site performance in real time.",
    },
    {
      to: "/login/employee",
      icon: UserIcon,
      title: "Employee Portal",
      description:
        "A unified platform enabling employees to manage tasks, track complaints, update work progress, and monitor site activities efficiently.",
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* Left Side */}
      <LoginLeftSide />

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50">

        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-5">
              🚀 Secure Access Portal
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Welcome Back
            </h2>

            <p className="text-slate-500 text-lg">
              Select your portal to securely access the O&M Management System.
            </p>
          </div>

          {/* Portal Cards */}
          <div className="space-y-6">

            {portalOptions.map((portal) => (
              <Link
                key={portal.to}
                to={portal.to}
                className="group block"
              >
                <div
                  className="
                  relative overflow-hidden
                  bg-white
                  border border-slate-200
                  rounded-3xl
                  p-6 md:p-7
                  shadow-sm
                  hover:shadow-2xl
                  hover:border-indigo-300
                  hover:-translate-y-2
                  transition-all duration-300"
                >

                  {/* Background Glow */}
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-100 opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-500"></div>

                  <div className="relative flex items-start gap-5">

                    {/* Icon */}
                    <div
                      className="
                      flex h-16 w-16 shrink-0 items-center justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-indigo-500
                      to-blue-600
                      text-white
                      shadow-lg"
                    >
                      <portal.icon size={30} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">

                      <div className="flex items-center justify-between">

                        <h3
                          className="
                          text-xl md:text-2xl
                          font-semibold
                          text-slate-800
                          group-hover:text-indigo-600
                          transition-colors"
                        >
                          {portal.title}
                        </h3>

                        <ArrowRightIcon
                          className="
                          w-6 h-6
                          text-slate-400
                          group-hover:text-indigo-600
                          group-hover:translate-x-2
                          transition-all duration-300"
                        />
                      </div>

                      <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-500">
                        {portal.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-indigo-600 font-medium text-sm">
                        Access Portal
                        <ArrowRightIcon size={16} />
                      </div>

                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Sundigo Solar Solutions Pvt. Ltd.
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Operations & Maintenance Management System
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginLanding;