import React from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import {
  MapPin,
  Building2,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Power,
} from "lucide-react";

const EmployeeCard = ({ employee, onEdit, onDelete, onStatusChange }) => {
     
  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/employees/${employee._id}`);

      toast.success("Employee deleted successfully");

      onDelete();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.error || error.message
      );
    }
  };

  const isActive = employee.status === "ACTIVE";

  const fullName = `${employee.firstName || ""} ${
    employee.lastName || ""
  }`.trim();

  const initials = `${employee.firstName?.[0] || ""}${
    employee.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* ================= HEADER ================= */}
      <div
        className={`relative h-28 overflow-hidden ${
          isActive
            ? "bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500"
            : "bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700"
        }`}
      >

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-10 w-40 h-40 rounded-full bg-white/10" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold ${
              isActive
                ? "bg-green-400/20 border-green-200/30 text-white"
                : "bg-slate-900/20 border-white/20 text-white"
            }`}
          >

            <span
              className={`relative flex h-2.5 w-2.5 ${
                isActive ? "bg-green-400" : "bg-slate-300"
              } rounded-full`}
            >
              {isActive && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75 animate-ping" />
              )}
            </span>

            {isActive ? "ACTIVE" : "INACTIVE"}

          </div>

        </div>

      </div>

      {/* ================= AVATAR ================= */}
      <div className="relative px-5">

        <div className="absolute -top-12 left-5">

          <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl">

            <div
              className={`w-full h-full rounded-xl flex items-center justify-center ${
                isActive
                  ? "bg-gradient-to-br from-indigo-100 to-blue-100"
                  : "bg-slate-100"
              }`}
            >

              <span
                className={`text-2xl font-bold ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-500"
                }`}
              >
                {initials}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ================= CONTENT ================= */}
      <div className="pt-16 px-5 pb-5">

        {/* Name */}
        <div className="mb-5">

          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">

              <h3 className="text-xl font-bold text-slate-900 truncate">
                {fullName || "Unknown Employee"}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Employee
              </p>

            </div>

          </div>

        </div>

        {/* ================= CONTACT ================= */}
        <div className="space-y-2.5 mb-5">

          {employee.email && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">

              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Mail
                  size={15}
                  className="text-indigo-600"
                />
              </div>

              <span className="truncate">
                {employee.email}
              </span>

            </div>
          )}

          {employee.phone && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">

              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Phone
                  size={15}
                  className="text-blue-600"
                />
              </div>

              <span>
                {employee.phone}
              </span>

            </div>
          )}

        </div>

        {/* ================= SITES ================= */}
        <div className="mb-5">

          <div className="flex items-center gap-2 mb-2.5">

            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <MapPin
                size={14}
                className="text-indigo-600"
              />
            </div>

            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sites
            </span>

          </div>

          <div className="flex flex-wrap gap-2">

            {employee.sites?.length > 0 ? (
              employee.sites.map((site, index) => (
                <span
                  key={`${site}-${index}`}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium"
                >
                  {site}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">
                No site assigned
              </span>
            )}

          </div>

        </div>

        {/* ================= BRANCHES ================= */}
        <div className="mb-5">

          <div className="flex items-center gap-2 mb-2.5">

            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Building2
                size={14}
                className="text-blue-600"
              />
            </div>

            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Branches
            </span>

          </div>

          <div className="flex flex-wrap gap-2">

            {employee.branchName?.length > 0 ? (
              employee.branchName.map((branch, index) => (
                <span
                  key={`${branch}-${index}`}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium"
                >
                  {branch}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">
                No branch assigned
              </span>
            )}

          </div>

        </div>

        {/* ================= STATUS ACTION ================= */}
 

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-sm transition-all"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-sm transition-all"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default EmployeeCard;