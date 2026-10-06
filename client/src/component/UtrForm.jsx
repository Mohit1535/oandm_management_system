import React, { useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import Loading from "./Loading.jsx";
import { months } from "../assets.js";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const UtrForm = ({
  initialData = null,
  onSuccess,
  onCancel,
  isAdmin,
}) => {
  // ================= ROLE =================

  const { user } = useAuth();

  // ================= STATES =================

  const [loading, setLoading] = useState(false);

  const [sites, setSites] = useState([]);
  const [branches, setBranches] = useState([]);

  const [selectMonth, setSelectMonth] = useState(
    initialData?.Month || ""
  );

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);

  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const isEditMode = !!initialData;

  // ================= SELECTED SITES =================

  const [selectSites, setSelectSites] = useState(
    Array.isArray(initialData?.sites)
      ? initialData.sites
      : initialData?.sites
      ? [initialData.sites]
      : []
  );

  // ================= SELECTED BRANCHES =================

  const [selectBranches, setSelectBranches] = useState(
    Array.isArray(initialData?.branches)
      ? initialData.branches
      : initialData?.branches
      ? [initialData.branches]
      : []
  );

  // ================= SITE SELECT =================

  const handleSiteSelect = (siteName) => {
    setSelectSites((prev) => {
      if (prev.includes(siteName)) {
        return prev.filter((site) => site !== siteName);
      }

      return [...prev, siteName];
    });
  };

  // ================= BRANCH SELECT =================

  const handleBranchSelect = (branchName) => {
    setSelectBranches((prev) => {
      if (prev.includes(branchName)) {
        return prev.filter((branch) => branch !== branchName);
      }

      return [...prev, branchName];
    });
  };

  // ================= FETCH SITES AND BRANCHES =================

  const fetchSitesAndBranches = async () => {
    try {
      if (isAdmin) {
        const [siteRes, branchRes] = await Promise.all([
          api.get("/sites"),
          api.get("/branches"),
        ]);

        setSites(siteRes.data.sites || siteRes.data);
        setBranches(branchRes.data.branches || branchRes.data);
      } else {
        const res = await api.get("/employees/me");

        const employees = res.data.employees || res.data;

        setSites(employees.sites || []);
        setBranches(employees.branches || []);
      }
    } catch (error) {
      console.error("Error fetching sites and branches:", error);
    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = isEditMode
        ? `/utr/${initialData._id}`
        : "/utr";

      const formData = new FormData(e.currentTarget);

      const data = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        months: formData.get("month"),
        amounts: formData.get("amount"),
        sites: selectSites,
        branches: selectBranches,
        utrNo: formData.get("utrNo"),
      };

      const method = isEditMode ? "put" : "post";

      const res = await api[method](url, data);

      console.log("UTR response:", res.data);

      toast.success(
        isEditMode
          ? "UTR Edited Successfully"
          : "UTR Created Successfully"
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 max-h-[80vh] overflow-y-auto"
    >
      {/* ================= UTR INFORMATION ================= */}

      <div className="border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-700 border-b pb-3 mb-6">
          UTR Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* FIRST NAME */}

          {isAdmin && (
            <div>
              <label className="block mb-2 text-sm font-medium">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                defaultValue={initialData?.firstName || ""}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* LAST NAME */}

          {isAdmin && (
            <div>
              <label className="block mb-2 text-sm font-medium">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                defaultValue={initialData?.lastName || ""}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          {/* UTR NUMBER */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              UTR Number
            </label>

            <input
              type="number"
              name="utrNo"
              defaultValue={initialData?.utrNo || ""}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* MONTH */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Month
            </label>

            <select
              name="month"
              value={selectMonth}
              onChange={(e) => setSelectMonth(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Month</option>

              {months.map((month, index) => {
                const monthName =
                  typeof month === "string"
                    ? month
                    : month.monthName;

                return (
                  <option
                    key={month._id || monthName || index}
                    value={monthName}
                  >
                    {monthName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* AMOUNT */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Received Amount
            </label>

            <input
              type="number"
              name="amount"
              defaultValue={initialData?.amount || ""}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= SITE & BRANCH ================= */}

      <div className="border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-700 border-b pb-3 mb-6">
          Site & Branch Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ================= SITE ================= */}

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
                {selectSites.length > 0
                  ? selectSites.join(", ")
                  : "Select Sites"}
              </span>

              <span>▼</span>
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
                        checked={selectSites.includes(
                          site.siteName
                        )}
                        onChange={() =>
                          handleSiteSelect(site.siteName)
                        }
                      />

                      <span>{site.siteName}</span>
                    </label>
                  ))
                )}
              </div>
            )}

            {selectSites.length > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {selectSites.length} site
                {selectSites.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* ================= BRANCH ================= */}

          <div className="relative">
            <label className="block mb-2 text-sm font-medium">
              Branch Name
            </label>

            <button
              type="button"
              onClick={() =>
                setBranchDropdownOpen(!branchDropdownOpen)
              }
              className="w-full border rounded-lg px-4 py-2 bg-white text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <span className="truncate">
                {selectBranches.length > 0
                  ? selectBranches.join(", ")
                  : "Select Branches"}
              </span>

              <span>▼</span>
            </button>

            {branchDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">

                {branches.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No branches available
                  </p>
                ) : (
                  branches.map((branch) => (
                    <label
                      key={branch._id}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectBranches.includes(
                          branch.branchName
                        )}
                        onChange={() =>
                          handleBranchSelect(
                            branch.branchName
                          )
                        }
                      />

                      <span>{branch.branchName}</span>
                    </label>
                  ))
                )}
              </div>
            )}

            {selectBranches.length > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {selectBranches.length} branch
                {selectBranches.length > 1 ? "es" : ""} selected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= BUTTONS ================= */}

      <div className="flex justify-end gap-4 pt-4">

        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
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

          {initialData ? "Update UTR" : "Create UTR"}
        </button>
      </div>
    </form>
  );
};

export default UtrForm;