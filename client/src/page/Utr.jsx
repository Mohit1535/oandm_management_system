
import React, { useEffect, useState, useCallback } from "react";
import {
  PlusIcon,
  Search,
  XIcon,
  CalendarDays,
  RotateCcw,
} from "lucide-react";

import { months } from "../assets";
import UtrTable from "../component/UtrTable.jsx";
import UtrForm from "../component/UtrForm.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/authContext.jsx";

const Utr = () => {
  // ================= STATES =================

  const [utr, setUtr] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModel, setShowModel] = useState(false);
  const [editModel, setEditModel] = useState(null);

  const [selectDate, setSelectDate] = useState("");
  const [selectMonth, setSelectMonth] = useState("");
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // ================= FETCH UTR =================

  const fetchUtr = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};

      if (selectMonth) {
        params.month = selectMonth;
      }

      if (selectDate) {
        params.date = selectDate;
      }

      const response = await api.get("/utr", { params });

      console.log("UTR API RESPONSE:", response.data);

      const records = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.utr)
          ? response.data.utr
          : Array.isArray(response.data)
            ? response.data
            : [];

      setUtr(records);
    } catch (error) {
      console.error(
        "FETCH UTR ERROR:",
        error.response?.data || error.message
      );

      setUtr([]);
    } finally {
      setLoading(false);
    }
  }, [selectMonth, selectDate]);

  // ================= FETCH WHEN FILTERS CHANGE =================

  useEffect(() => {
    fetchUtr();
  }, [fetchUtr]);

  // ================= SEARCH + FILTER =================

  const filtered = utr.filter((item) => {
    const searchText = [
      item?.utrNo,
      item?.amount,
      item?.month,

      ...(Array.isArray(item?.sites)
        ? item.sites
        : [item?.sites || ""]),

      ...(Array.isArray(item?.branches)
        ? item.branches
        : [item?.branches || ""]),

      item?.employee?.firstName,
      item?.employee?.lastName,
      item?.employee?.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const searchMatch = searchText.includes(
      search.toLowerCase().trim()
    );

    const monthMatch =
      !selectMonth || item?.month === selectMonth;

    // Compare the submission date using Indian Standard Time.
    const submissionDate = item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        })
      : "";

    const dateMatch =
      !selectDate || submissionDate === selectDate;

    return searchMatch && monthMatch && dateMatch;
  });

  // ================= CLEAR FILTERS =================

  const clearFilters = () => {
    setSearch("");
    setSelectMonth("");
    setSelectDate("");
  };

  const hasActiveFilters = search || selectMonth || selectDate;

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading UTR records...
          </p>
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="animate-fade-in space-y-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <CalendarDays size={25} />
            </div>

            <div>
              <h1 className="page-title">UTR Management</h1>

              <p className="page-subtitle">
                Manage, search and track your UTR records.
              </p>
            </div>
          </div>
        </div>

        {!isAdmin && (
          <button
            type="button"
            onClick={() => {
              setEditModel(null);
              setShowModel(true);
            }}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          >
            <PlusIcon size={18} />
            Add UTR
          </button>
        )}
      </div>

      {/* ================= SEARCH + FILTERS ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[minmax(0,1fr)_180px_220px]">
          {/* SEARCH */}

          <div className="min-w-0">
            <label
              htmlFor="utrSearch"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Search Records
            </label>

            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                id="utrSearch"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search UTR, amount, site, branch..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          {/* MONTH FILTER */}

          <div>
            <label
              htmlFor="utrMonth"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Select Month
            </label>

            <select
              id="utrMonth"
              value={selectMonth}
              onChange={(event) =>
                setSelectMonth(event.target.value)
              }
              className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition hover:border-indigo-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="">All Months</option>

              {months.map((month, index) => {
                const monthName =
                  typeof month === "string"
                    ? month
                    : month?.monthName || month?.name;

                if (!monthName) return null;

                return (
                  <option
                    key={month?._id || monthName || index}
                    value={monthName}
                  >
                    {monthName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* DATE FILTER */}

          <div>
            <label
              htmlFor="utrDate"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Submission Date
            </label>

            <div className="group relative">
              <CalendarDays
                size={19}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 transition group-focus-within:text-indigo-700"
              />

              <input
                id="utrDate"
                type="date"
                name="selectDate"
                value={selectDate}
                onChange={(event) =>
                  setSelectDate(event.target.value)
                }
                className="w-full cursor-pointer rounded-xl border border-indigo-100 bg-indigo-50/50 py-3 pl-11 pr-3 text-sm font-medium text-slate-700 outline-none transition hover:border-indigo-300 hover:bg-indigo-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                title="Filter by submission date"
              />
            </div>
          </div>
        </div>

        {/* FILTER FOOTER */}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {utr.length}
            </span>{" "}
            UTR records
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <RotateCcw size={14} />
              Clear Filters
              <XIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ================= UTR TABLE ================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={28} />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No UTR records found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              No records match your current search or filters. Try
              changing the month or submission date.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <UtrTable
            utr={filtered}
            isAdmin={isAdmin}
            onEdit={(item) => setEditModel(item)}
          />
        )}
      </div>

      {/* ================= ADD UTR MODAL ================= */}

      {showModel && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setShowModel(false)}
        >
          <div
            className="my-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add UTR
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new UTR record.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModel(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Close add UTR form"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <UtrForm
                isAdmin={isAdmin}
                initialData={null}
                onSuccess={async () => {
                  setShowModel(false);
                  await fetchUtr();
                }}
                onCancel={() => setShowModel(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT UTR MODAL ================= */}

      {editModel && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setEditModel(null)}
        >
          <div
            className="my-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit UTR
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the selected UTR record.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditModel(null)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                aria-label="Close edit UTR form"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <UtrForm
                isAdmin={isAdmin}
                initialData={editModel}
                onSuccess={async () => {
                  setEditModel(null);
                  await fetchUtr();
                }}
                onCancel={() => setEditModel(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Utr;
