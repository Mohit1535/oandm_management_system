import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const EmployeeForm = ({ onSuccess, onCancel, initialData }) => {
  const isEditMode = !!initialData;

  const [sites, setSites] = useState([]);
  const [branch, setBranch] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  // Multi-select dropdown states
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  // Selected sites
  const [selectedSites, setSelectedSites] = useState(
    Array.isArray(initialData?.sites)
      ? initialData.sites
      : initialData?.sites
        ? [initialData.sites]
        : []
  );

  // Selected branches
  const [selectedBranches, setSelectedBranches] = useState(
    Array.isArray(initialData?.branchName)
      ? initialData.branchName
      : initialData?.branchName
        ? [initialData.branchName]
        : []
  );



  const navigate = useNavigate();

  const loading = false;

  // =========================
  // FETCH BRANCHES
  // =========================

  const fetchBranches = async () => {
    try {
      const res = await api.get("/branch");

      setBranch(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message
      );
    }
  };

  // =========================
  // FETCH SITES
  // =========================

  const fetchSites = async () => {
    try {
      const res = await api.get("/sites");

      setSites(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message
      );
    }
  };

  // =========================
  // LOAD SITES & BRANCHES
  // =========================

  useEffect(() => {
    fetchBranches();
    fetchSites();
  }, []);

  // =========================
  // SITE SELECTION
  // =========================

  const handleSiteSelect = (siteName) => {
    setSelectedSites((prev) => {
      if (prev.includes(siteName)) {
        return prev.filter((site) => site !== siteName);
      }

      return [...prev, siteName];
    });
  };

  // =========================
  // BRANCH SELECTION
  // =========================

  const handleBranchSelect = (branchName) => {
    setSelectedBranches((prev) => {
      if (prev.includes(branchName)) {
        return prev.filter((branch) => branch !== branchName);
      }

      return [...prev, branchName];
    });
  };

  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Password blank hai to remove kar do
    if (!formData.get("password")) {
      formData.delete("password");
    }

    // Remove old values
    formData.delete("sites");
    formData.delete("branchName");

    // Add selected sites
    selectedSites.forEach((site) => {
      formData.append("sites", site);
    });

    // Add selected branches
    selectedBranches.forEach((branchName) => {
      formData.append("branchName", branchName);
    });

    // Debug
    console.log("SELECTED SITES:", selectedSites);
    console.log("SELECTED BRANCHES:", selectedBranches);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const url = isEditMode
        ? `/employees/${initialData._id}`
        : "/employees";

      const method = isEditMode ? "put" : "post";

      await api[method](url, formData);

      toast.success(
        isEditMode
          ? "Employee updated successfully"
          : "Employee created successfully"
      );

      onSuccess
        ? onSuccess()
        : navigate("/employees");

    } catch (error) {
      console.log(
        "EMPLOYEE ERROR:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.error ||
        error.message ||
        "Something went wrong"
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 max-h-[80vh] overflow-y-auto"
      >

        {/* ========================= */}
        {/* PERSONAL INFORMATION */}
        {/* ========================= */}

        <div className="border rounded-xl p-6">

          <h3 className="text-lg font-semibold text-slate-700 border-b pb-3 mb-6">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* First Name */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                defaultValue={initialData?.firstName}

                
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Last Name */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                defaultValue={initialData?.lastName}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Contact No.
              </label>

              <input
                type="text"
                name="phone"
                defaultValue={initialData?.phone}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Email */}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Email
              </label>

              <input
                name="email"
                type="email"
                defaultValue={initialData?.email}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

          </div>
        </div>


        {/* ========================= */}
        {/* EMPLOYMENT DETAILS */}
        {/* ========================= */}

        <div className="border rounded-xl p-6">

          <h3 className="text-lg font-semibold text-slate-700 border-b pb-3 mb-6">
            Employment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* ========================= */}
            {/* SITE MULTI SELECT */}
            {/* ========================= */}

            <div className="relative">

              <label className="block mb-2 text-sm font-medium">
                Site Allocated
              </label>

              <button
                type="button"
                onClick={() =>
                  setSiteDropdownOpen(!siteDropdownOpen)
                }
                className="w-full border rounded-lg px-4 py-2 bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 outline-none"
              >

                <span className="truncate">
                  {selectedSites.length > 0
                    ? selectedSites.join(", ")
                    : "Select Sites"}
                </span>

                <span className="ml-2">
                  ▼
                </span>

              </button>

              {siteDropdownOpen && (

                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">

                  {sites.length === 0 ? (

                    <p className="px-4 py-3 text-sm text-gray-500">
                      No sites available
                    </p>

                  ) : (

                    sites.map((site) => (

                      <label
                        key={site._id}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >

                        <input
                          type="checkbox"
                          checked={selectedSites.includes(
                            site.siteName
                          )}
                          onChange={() =>
                            handleSiteSelect(
                              site.siteName
                            )
                          }
                        />

                        <span>
                          {site.siteName}
                        </span>

                      </label>

                    ))

                  )}

                </div>

              )}

              {selectedSites.length > 0 && (

                <p className="text-xs text-blue-600 mt-1">
                  {selectedSites.length} site
                  {selectedSites.length > 1 ? "s" : ""}
                  {" selected"}
                </p>

              )}

            </div>


            {/* ========================= */}
            {/* BRANCH MULTI SELECT */}
            {/* ========================= */}

            <div className="relative">

              <label className="block mb-2 text-sm font-medium">
                Branch Name
              </label>

              <button
                type="button"
                onClick={() =>
                  setBranchDropdownOpen(
                    !branchDropdownOpen
                  )
                }
                className="w-full border rounded-lg px-4 py-2 bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 outline-none"
              >

                <span className="truncate">
                  {selectedBranches.length > 0
                    ? selectedBranches.join(", ")
                    : "Select Branches"}
                </span>

                <span className="ml-2">
                  ▼
                </span>

              </button>

              {branchDropdownOpen && (

                <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">

                  {branch.length === 0 ? (

                    <p className="px-4 py-3 text-sm text-gray-500">
                      No branches available
                    </p>

                  ) : (

                    branch.map((item) => (

                      <label
                        key={item._id}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >

                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(
                            item.branchName
                          )}
                          onChange={() =>
                            handleBranchSelect(
                              item.branchName
                            )
                          }
                        />

                        <span>
                          {item.branchName}
                        </span>

                      </label>

                    ))

                  )}

                </div>

              )}

              {selectedBranches.length > 0 && (

                <p className="text-xs text-blue-600 mt-1">
                  {selectedBranches.length} branch
                  {selectedBranches.length > 1 ? "es" : ""}
                  {" selected"}
                </p>

              )}

            </div>

          </div>
        </div>


        {/* ========================= */}
        {/* ACCOUNT INFORMATION */}
        {/* ========================= */}

        <div className="border rounded-xl p-6">

          <h3 className="text-lg font-semibold text-slate-700 border-b pb-3 mb-6">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Username */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                Username
              </label>

              <input
                name="userName"
                type="text"
                defaultValue={initialData?.userId?.userName}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>


            {/* Password */}

            <div>

              <label className="block mb-2 text-sm font-medium">
                {isEditMode
                  ? "Change Password"
                  : "Temporary Password"}
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder={
                    isEditMode
                      ? "Leave blank to keep current"
                      : "Enter password"
                  }
                  className="w-full border rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >

                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}

                </button>

              </div>

            </div>

          </div>
        </div>


        {/* ========================= */}
        {/* SYSTEM ROLE */}
        {/* ========================= */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  {/* System Role */}
  <div className="border rounded-xl p-6">

    <h3 className="text-lg font-semibold text-slate-700 border-b pb-3 mb-6">
      System Role
    </h3>

    <select
      name="role"
      defaultValue={initialData?.userId?.role || "EMPLOYEE"}
      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="EMPLOYEE">
        Employee
      </option>

      <option value="ADMIN">
        Admin
      </option>
    </select>

  </div>


  {/* Employee Status */}
  <div className="border rounded-xl p-6">

    <h3 className="text-lg font-semibold text-slate-700 border-b pb-3 mb-6">
      Employee Status
    </h3>

    <select
      name="status"
      defaultValue={initialData?.status || "ACTIVE"}
      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="ACTIVE">
        Active
      </option>

      <option value="INACTIVE">
        Inactive
      </option>
    </select>

  </div>

</div>


        {/* ========================= */}
        {/* BUTTONS */}
        {/* ========================= */}

        <div className="flex justify-end gap-4 pt-4">

          <button
            onClick={() =>
              onCancel
                ? onCancel()
                : navigate(-1)
            }
            type="button"
            className="px-6 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60"
          >

            {loading && <Loading />}

            {isEditMode
              ? "Update Employee"
              : "Create Employee"}

          </button>

        </div>

      </form>
    </>
  );
};

export default EmployeeForm;