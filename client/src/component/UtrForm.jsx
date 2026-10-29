
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import Loading from "./Loading.jsx";
import { months } from "../assets.js";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const UtrForm = ({
  initialData = null,
  onSuccess,
  onCancel,
  isAdmin = false,
}) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState(null);
  const [fetchingEmployee, setFetchingEmployee] = useState(false);

  const [selectMonth, setSelectMonth] = useState(
    initialData?.month || initialData?.months || ""
  );

  const [selectSites, setSelectSites] = useState(() => {
    const value = initialData?.sites;

    if (Array.isArray(value)) return value;
    if (value) return [value];

    return [];
  });

  const [selectBranches, setSelectBranches] = useState(() => {
    const value = initialData?.branches;

    if (Array.isArray(value)) return value;
    if (value) return [value];

    return [];
  });

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const isEditMode = Boolean(initialData);

  // =====================================
  // NORMALIZE SITE / BRANCH VALUES
  // Supports string values and populated objects.
  // =====================================

  const getOptionName = (item, type) => {
    if (typeof item === "string") return item;

    if (!item || typeof item !== "object") return "";

    if (type === "site") {
      return item.siteName || item.name || "";
    }

    return item.branchName || item.name || "";
  };

  const normalizeOptions = (value, type) => {
    const items = Array.isArray(value)
      ? value
      : value
        ? [value]
        : [];

    return items
      .map((item) => getOptionName(item, type))
      .filter(Boolean);
  };

  // =====================================
  // FETCH LOGGED-IN EMPLOYEE
  // =====================================

  useEffect(() => {
    let isMounted = true;

    const fetchMyEmployee = async () => {
      // Admins can use the global site/branch lists.
      if (isAdmin) return;

      try {
        setFetchingEmployee(true);

        const response = await api.get("/employees/me");

        const employeeData =
          response.data?.employee ||
          response.data?.employees ||
          response.data;

        if (!employeeData || !isMounted) return;

        setEmployees(employeeData);
      } catch (error) {
        console.error("Error fetching employee:", error);

        if (isMounted) {
          toast.error(
            error.response?.data?.message ||
              error.response?.data?.error ||
              "Failed to fetch employee information."
          );
        }
      } finally {
        if (isMounted) {
          setFetchingEmployee(false);
        }
      }
    };

    fetchMyEmployee();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  // =====================================
  // FETCH ADMIN SITE / BRANCH OPTIONS
  // =====================================

  const [sites, setSites] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchSitesAndBranches = async () => {
      if (!isAdmin) return;

      try {
        const [siteResponse, branchResponse] = await Promise.all([
          api.get("/sites"),
          api.get("/branches"),
        ]);

        if (!isMounted) return;

        setSites(
          siteResponse.data?.sites ||
            siteResponse.data?.data ||
            (Array.isArray(siteResponse.data)
              ? siteResponse.data
              : [])
        );

        setBranches(
          branchResponse.data?.branches ||
            branchResponse.data?.data ||
            (Array.isArray(branchResponse.data)
              ? branchResponse.data
              : [])
        );
      } catch (error) {
        console.error("Error fetching sites and branches:", error);

        if (isMounted) {
          toast.error("Failed to fetch sites and branches.");
        }
      }
    };

    fetchSitesAndBranches();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  // =====================================
  // GET AVAILABLE OPTIONS
  // =====================================

  const assignedSites = isAdmin
    ? normalizeOptions(sites, "site")
    : normalizeOptions(employees?.sites, "site");

  const assignedBranches = isAdmin
    ? normalizeOptions(branches, "branch")
    : normalizeOptions(
        employees?.branchName ?? employees?.branches,
        "branch"
      );

  // =====================================
  // HANDLE SITE SELECTION
  // =====================================

  const handleSiteSelect = (siteName) => {
    setSelectSites((previous) =>
      previous.includes(siteName)
        ? previous.filter((site) => site !== siteName)
        : [...previous, siteName]
    );
  };

  // =====================================
  // HANDLE BRANCH SELECTION
  // =====================================

  const handleBranchSelect = (branchName) => {
    setSelectBranches((previous) =>
      previous.includes(branchName)
        ? previous.filter((branch) => branch !== branchName)
        : [...previous, branchName]
    );
  };

  // =====================================
  // HANDLE FORM SUBMISSION
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectMonth) {
      toast.error("Please select a month.");
      return;
    }

    if (!selectSites.length) {
      toast.error("Please select at least one site.");
      return;
    }

    if (!selectBranches.length) {
      toast.error("Please select at least one branch.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const utrNo = String(formData.get("utrNo") || "").trim();
    const amountValue = formData.get("amount");
    const amount = Number(amountValue);

    if (!utrNo) {
      toast.error("Please enter the UTR number.");
      return;
    }

    if (
      amountValue === null ||
      amountValue === "" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const data = {
      utrNo,
      month: selectMonth,
      amount,
      sites: selectSites,
      branches: selectBranches,
      
    };

    try {
      setLoading(true);

      const url = isEditMode
        ? `/utr/${initialData._id || initialData.id}`
        : "/utr";

      const method = isEditMode ? "put" : "post";

      const response = await api[method](url, data);

      toast.success(
        response.data?.message ||
          (isEditMode
            ? "UTR updated successfully."
            : "UTR created successfully.")
      );

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("UTR submission error:", error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save UTR record."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-h-[80vh] w-full max-w-4xl space-y-8 overflow-y-auto rounded-2xl bg-white p-8 shadow-lg"
    >
      {/* UTR INFORMATION */}

      <div className="rounded-xl border p-6">
        <h3 className="mb-6 border-b pb-3 text-lg font-semibold text-slate-700">
          UTR Information
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* UTR NUMBER */}

          <div>
            <label
              htmlFor="utrNo"
              className="mb-2 block text-sm font-medium"
            >
              UTR Number
            </label>

            <input
              id="utrNo"
              type="text"
              name="utrNo"
              defaultValue={initialData?.utrNo || ""}
              required
              placeholder="Enter UTR number"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* MONTH */}

          <div>
            <label
              htmlFor="month"
              className="mb-2 block text-sm font-medium"
            >
              Month
            </label>

            <select
              id="month"
              name="month"
              value={selectMonth}
              onChange={(event) => setSelectMonth(event.target.value)}
              required
              className="w-full rounded-lg border bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Month</option>

              {months.map((month, index) => {
                const monthName =
                  typeof month === "string"
                    ? month
                    : month.monthName || month.name;

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
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-medium"
            >
              Received Amount
            </label>

            <input
              id="amount"
              type="number"
              name="amount"
              min="0"
              step="0.01"
              defaultValue={initialData?.amount ?? ""}
              required
              placeholder="Enter amount"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SITE AND BRANCH DETAILS */}

      <div className="rounded-xl border p-6">
        <h3 className="mb-6 border-b pb-3 text-lg font-semibold text-slate-700">
          Site & Branch Details
        </h3>

        {fetchingEmployee ? (
          <div className="flex justify-center py-6">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* SITE MULTI-SELECT */}

            <div className="relative">
              <label className="mb-2 block text-sm font-medium">
                Site Allocated
              </label>

              <button
                type="button"
                onClick={() =>
                  setSiteDropdownOpen((previous) => !previous)
                }
                aria-expanded={siteDropdownOpen}
                className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-left outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="truncate">
                  {selectSites.length
                    ? selectSites.join(", ")
                    : "Select Sites"}
                </span>

                <span>▼</span>
              </button>

              {siteDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                  {assignedSites.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      No sites available.
                    </p>
                  ) : (
                    assignedSites.map((siteName) => (
                      <label
                        key={siteName}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={selectSites.includes(siteName)}
                          onChange={() => handleSiteSelect(siteName)}
                        />

                        <span>{siteName}</span>
                      </label>
                    ))
                  )}
                </div>
              )}

              {selectSites.length > 0 && (
                <p className="mt-1 text-xs text-blue-600">
                  {selectSites.length} site
                  {selectSites.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* BRANCH MULTI-SELECT */}

            <div className="relative">
              <label className="mb-2 block text-sm font-medium">
                Branch Name
              </label>

              <button
                type="button"
                onClick={() =>
                  setBranchDropdownOpen((previous) => !previous)
                }
                aria-expanded={branchDropdownOpen}
                className="flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-left outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="truncate">
                  {selectBranches.length
                    ? selectBranches.join(", ")
                    : "Select Branches"}
                </span>

                <span>▼</span>
              </button>

              {branchDropdownOpen && (
                <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                  {assignedBranches.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      No branches available.
                    </p>
                  ) : (
                    assignedBranches.map((branchName) => (
                      <label
                        key={branchName}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={selectBranches.includes(branchName)}
                          onChange={() =>
                            handleBranchSelect(branchName)
                          }
                        />

                        <span>{branchName}</span>
                      </label>
                    ))
                  )}
                </div>
              )}

              {selectBranches.length > 0 && (
                <p className="mt-1 text-xs text-blue-600">
                  {selectBranches.length} branch
                  {selectBranches.length > 1 ? "es" : ""} selected
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BUTTONS */}

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-6 py-2 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || fetchingEmployee}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loading />}

          {loading
            ? "Saving..."
            : isEditMode
              ? "Update UTR"
              : "Create UTR"}
        </button>
      </div>
    </form>
  );
};

export default UtrForm;
