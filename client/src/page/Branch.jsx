import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";

import Loading from "../component/Loading";
import BranchCard from "../component/BranchCard.jsx";
import BranchForm from "../component/BranchForm.jsx";
import api from "../api/axios.js";

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ============================================
  // FETCH ALL BRANCHES
  // ============================================
  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/branch");

      console.log("Branch API Response:", res.data);

      // Backend response:
      // {
      //   success: true,
      //   branches: [...]
      // }

      setBranches(res.data || []);
    } catch (error) {
      console.error("Error loading branches:", error);

      toast.error(
        error.response?.data?.error || "Failed to load branches"
      );

      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // LOAD BRANCHES WHEN PAGE LOADS
  // ============================================
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // ============================================
  // SEARCH / FILTER BRANCHES
  // ============================================
  const filteredBranches = branches.filter((branch) =>
    branch.branchName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ============================================
  // LOADING SCREEN
  // ============================================
  if (loading) {
    return <Loading />;
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="animate-fade-in">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="page-title">
            Branches
          </h1>

          <p className="page-subtitle">
            Manage your Branches
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModel(true)}
          className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          <PlusIcon size={20} />
          Add Branch
        </button>

      </div>

      {/* ==========================================
          SEARCH
      ========================================== */}
      <div className="mb-6">

        <div className="relative">

          <SearchIcon
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={22}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branches..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* ==========================================
          BRANCHES
      ========================================== */}
      {filteredBranches.length === 0 ? (

        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl bg-white text-center">

          <h3 className="text-xl font-semibold text-slate-700">
            No Branches Found
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {search
              ? `No branch found matching "${search}"`
              : "No branches available"}
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredBranches.map((branch) => (

            <BranchCard
              key={branch.branchName}
              branches={branch}
              onDelete={fetchBranches}
            />

          ))}

        </div>

      )}

      {/* ==========================================
          ADD BRANCH MODAL
      ========================================== */}
      {showModel && (

        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setShowModel(false)}
        >

          <div
            className="mt-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ======================================
                MODAL HEADER
            ====================================== */}
            <div className="flex items-center justify-between border-b p-6">

              <div>

                <h2 className="text-xl font-semibold text-slate-800">
                  Add Branch
                </h2>

                <p className="text-sm text-slate-500">
                  Add a new branch into your system
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowModel(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <XIcon size={18} />
              </button>

            </div>

            {/* ======================================
                BRANCH FORM
            ====================================== */}
            <div className="p-6">

              <BranchForm
                onSuccess={() => {
                  setShowModel(false);
                  fetchBranches();
                }}
                onCancel={() => setShowModel(false)}
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Branch;