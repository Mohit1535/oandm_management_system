import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MenuIcon,
  LayoutGridIcon,
  UserIcon,
  MessageSquareDashedIcon,
  SettingsIcon,
  XIcon,
  ChevronRightIcon,
  LogOutIcon,
  BuildingIcon,
  GitBranchIcon,
  BarcodeIcon,
} from "lucide-react";

import Loading from "./Loading.jsx";
import { useAuth } from "../context/authContext.jsx";
import api from "../api/axios.js";

const Sidebar = () => {
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout, loading } = useAuth();

  const role = user?.role || "EMPLOYEE";

  const { pathname } = useLocation();

  const navItems = [
    {
      icon: LayoutGridIcon,
      name: "Dashboard",
      href: "/dashboard",
    },
    ...(role === "ADMIN"
      ? [
          {
            icon: UserIcon,
            name: "Employees",
            href: "/employees",
          },
        ]
      : []),
    {
      icon: MessageSquareDashedIcon,
      name: "Complaints",
      href: "/complaints",
    },
    
...(role === "ADMIN"
      ? [
          {
            icon: BuildingIcon,
            name: "Sites",
            href: "/sites",
          },
               {
            icon: GitBranchIcon,
            name: "BranchNames",
            href: "/branches",
          },
        ]
      : []),

      {
        icon:BarcodeIcon,
        name:"Utr",
        href:"/utr"
      }
  ];

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile");
console.log(data)
        if (data?.firstName) {
          setUserName(
            `${data.firstName} ${data.lastName || ""}`.trim()
          );
          console.log(data.userName)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
  };

  const sideBarContent = (
    <>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/sundigo.png"
              alt="Sundigo"
              className="h-14 w-auto drop-shadow-[0_0_20px_rgba(99,102,241,0.35)]"
            />

            <div>
              <p className="font-semibold text-[13px] text-white tracking-wide">
                Operation & Maintenance
              </p>

              <p className="text-[11px] text-slate-400">
                Management System
              </p>
            </div>
          </div>

          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>

      {/* User Card */}
      {userName && (
        <div className="mx-3 mt-4 mb-2 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900"></div>
            </div>

            <div>
              <p className="font-semibold text-white">{userName}</p>

              <p className="text-xs text-slate-400">
                {role === "ADMIN" ? "Administrator" : "Employee"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Title */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          Navigation
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-2 overflow-y-auto">
        {loading ? (
          <div className="px-3 py-3 flex items-center gap-2 text-slate-500">
            <Loading />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
                )}

                <item.icon
                  className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                <span className="flex-1 text-sm font-medium">
                  {item.name}
                </span>

                {isActive && (
                  <ChevronRightIcon className="w-4 h-4 text-white" />
                )}
              </Link>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <p className="text-xs text-slate-300">System Status</p>

          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

            <span className="text-sm font-medium text-white">
              All Services Online
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300"
        >
          <LogOutIcon className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-xl shadow-lg border border-white/10 hover:bg-slate-800 transition-all duration-200"
      >
        <MenuIcon size={20} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col h-screen w-[280px] shrink-0 border-r border-white/10 text-white bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_35%),linear-gradient(to_bottom,#0f172a,#020617)]"
      >
        {sideBarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 text-white z-50 flex flex-col transform transition-transform duration-300 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_35%),linear-gradient(to_bottom,#0f172a,#020617)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sideBarContent}
      </aside>
    </>
  );
};

export default Sidebar;