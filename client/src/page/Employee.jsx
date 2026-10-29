import React, { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";
import { PlusIcon, Search, XIcon } from "lucide-react";
import Loading from "../component/Loading.jsx";
import EmployeeCard from "../component/EmployeeCard.jsx";
import EmployeeForm from "../component/EmployeeForm.jsx";
import toast from "react-hot-toast";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [showModel, setShowModel] = useState(false);

  const [sites, setSites] = useState([]);
  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectSite, setSelectSite] = useState("");
  const [selectBranch, setSelectBranch] = useState("");

  const [search, setSearch] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);



 const handleStatusChange = async (emp) => {
  try {
    const newStatus =
      emp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await api.patch(`/employees/${emp._id}/status`, {
      status: newStatus,
    });

    toast.success(
      `Employee marked as ${
        newStatus === "ACTIVE" ? "Active" : "Inactive"
      }`
    );

    fetchEmployee();

  } catch (error) {
    console.log("STATUS ERROR:", error);

    toast.error(
      error.response?.data?.error || error.message
    );
  }
};
  // =========================
  // FETCH SITES
  // =========================
  const fetchSites = useCallback(async () => {
    try {
      const res = await api.get("/sites");
 
      setSites(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message
      );
    }
  }, []);
               
  // =========================
  // FETCH BRANCHES
  // =========================
const fetchBranches = useCallback(async () => {
  try {
    const res = await api.get("/branch");

    setBranches(res.data);
  } catch (error) {
    toast.error(
      error.response?.data?.error || error.message
    );
  }
}, []);

  // =========================
  // FETCH EMPLOYEES
  // =========================
  const fetchEmployee = useCallback(async () => {
    try {
      let url = "/employees";

      if (selectSite && selectBranch) {
        url = `/employees?sites=${selectSite}&branchName=${selectBranch}`;
      } else if (selectSite) {
        url = `/employees?sites=${selectSite}`;
      } else if (selectBranch) {
        url = `/employees?branchName=${selectBranch}`;
      }

      const res = await api.get(url);

      setEmployee(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message
      );
    } finally {
      setLoading(false);
    }
  }, [selectSite, selectBranch]);

  // =========================
  // INITIAL DATA
  // =========================
  useEffect(() => {
    fetchSites();
    fetchBranches();
    fetchEmployee();
  }, [fetchSites, fetchBranches, fetchEmployee]);

  // =========================
  // SEARCH
  // =========================
  const filtered = employee.filter((emp) => {
    return `${emp.firstName} ${emp.lastName} ${emp.Sites} ${emp.branchName}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

        <div>
          <h1 className="page-title">
            Employees
          </h1>

          <p className="page-subtitle">
            Manage your team members
          </p>
        </div>

        <button
          onClick={() => setShowModel(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <PlusIcon size={16} />
          Add Employee
        </button>

      </div>


      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* SEARCH */}
        <div className="flex-1 relative">

          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />

          <input
            type="text"
            className="w-full pl-10"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        {/* SITE */}
        <select
          className="max-w-40"
          value={selectSite}
          onChange={(e) => setSelectSite(e.target.value)}
        >
          <option value="">
            All Sites
          </option>

          {sites.map((site) => (
            <option
              key={site._id || site.siteName}
              value={site.siteName}
            >
              {site.siteName}
            </option>
          ))}
        </select>


        {/* BRANCH */}
        <select
          className="max-w-40"
          value={selectBranch}
          onChange={(e) => setSelectBranch(e.target.value)}
        >
          <option value="">
            All Branch
          </option>

       {branches.map((branch) => (
  <option
    key={branch._id || branch.branchName}
    value={branch.branchName}
  >
    {branch.branchName}
  </option>
))}
        </select>

      </div>


      {/* EMPLOYEE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {filtered.length === 0 ? (

          <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl">
            No employees found
          </p>

        ) : (

          filtered.map((emp) => (

            <EmployeeCard
              key={emp._id}
              employee={emp}
              onEdit={setEditEmployee}
              onDelete={fetchEmployee}
                onStatusChange={handleStatusChange}
            />

          ))

        )}

      </div>


      {/* ADD EMPLOYEE MODAL */}
      {showModel && (

        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4"
          onClick={() => setShowModel(false)}
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mt-8"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h2 className="text-xl font-semibold">
                  Add Employee
                </h2>

                <p className="text-sm text-slate-500">
                  Add New Employee into your team
                </p>
              </div>

              <button
                onClick={() => setShowModel(false)}
              >
                <XIcon size={18} />
              </button>

            </div>

            <div className="p-6">

              <EmployeeForm
                onSuccess={() => {
                  setShowModel(false);
                  fetchEmployee();
                }}
                onCancel={() => setShowModel(false)}
              />

            </div>

          </div>

        </div>

      )}


      {/* EDIT EMPLOYEE MODAL */}
      {editEmployee && (

        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4"
          onClick={() => setEditEmployee(null)}
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mt-8"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-between items-center p-6 border-b">

              <div>

                <h2 className="text-xl font-semibold">
                  Edit Employee
                </h2>

                <p className="text-sm text-slate-500">
                  Update employee profile details
                </p>

              </div>

              <button
                onClick={() => setEditEmployee(null)}
              >
                <XIcon size={18} />
              </button>

            </div>

            <div className="p-6">

              <EmployeeForm
                initialData={editEmployee}
                employee={editEmployee}
                onSuccess={() => {
                  setEditEmployee(null);
                  fetchEmployee();
                }}
                onCancel={() => setEditEmployee(null)}
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Employee;