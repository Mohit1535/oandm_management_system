import React, { useEffect, useState } from "react";
import {
  PlusIcon,
  Search,
  XIcon,
} from "lucide-react";

import { months } from "../assets";
import UtrTable from "../component/UtrTable.jsx";
import UtrForm from "../component/UtrForm.jsx";
import api from "../api/axios.js";

const Utr = () => {
  // ================= STATES =================

  const [utr, setUtr] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModel, setShowModel] = useState(false);
  const [editModel, setEditModel] = useState(null);

  const [selectMonth, setSelectMonth] = useState("");
  const [search, setSearch] = useState("");

  const isAdmin = true;

  // ================= FETCH UTR =================

  const fetchUtr = async () => {
    try {
      setLoading(true);

      let url = "/utr";

      if (selectMonth) {
        url = `/utr?months=${encodeURIComponent(selectMonth)}`;
      }

      const res = await api.get(url);

      console.log("UTR RESPONSE:", res.data);

      // Backend returns:
      // { success: true, utr: [...] }
//const data=dummyUtrData.filter((emp)=>selectMonths?emp.Months===selectMonths:emp);
      setUtr(res.data.utr || []);

    } catch (error) {
      console.error(
        "FETCH UTR ERROR:",
        error.response?.data || error.message
      );

      setUtr([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL + MONTH FETCH =================

  useEffect(() => {
    fetchUtr();
  }, [selectMonth]);

  // ================= SEARCH FILTER =================

  const filtered = utr.filter((item) => {
    const searchText = `
      ${item.firstName || ""}
      ${item.lastName || ""}
      ${item.utrNo || ""}
      ${item.amounts || ""}
      ${item.Month || ""}
    `
      .toLowerCase()
      .trim();

    return searchText.includes(search.toLowerCase());
  });

  // ================= LOADING =================

  if (loading) {
    return <div>Loading...</div>;
  }

  // ================= UI =================

  return (
    <div className="animate-fade-in">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

        <div>
          <h1 className="page-title">
            UTR
          </h1>

          <p className="page-subtitle">
            Manage your UTR
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowModel(true);
            setEditModel(null);
          }}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <PlusIcon size={16} />
          Add UTR
        </button>

      </div>

      {/* ================= SEARCH + FILTER ================= */}

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
            placeholder="Search UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* MONTH */}

        <select
          className="max-w-40"
          value={selectMonth}
          onChange={(e) => setSelectMonth(e.target.value)}
        >

          <option value="">
            All Months
          </option>

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

      {/* ================= UTR DATA ================= */}

      <div className="grid grid-cols-1 gap-4">

        {filtered.length === 0 ? (

          <p className="text-center py-16 text-slate-400 bg-white rounded-2xl">
            No UTR Found
          </p>

        ) : (

          filtered.map((emp) => (

            <UtrTable
              key={emp._id}
              utr={emp}
              isAdmin={isAdmin}
              onEdit={() => setEditModel(emp)}
              onDelete={fetchUtr}
            />

          ))

        )}

      </div>

      {/* ================= ADD UTR MODAL ================= */}

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
                  Add UTR
                </h2>

                <p className="text-sm text-slate-500">
                  Add new UTR
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModel(false)}
                className="p-2"
              >
                <XIcon size={18} />
              </button>

            </div>

            <div className="p-6">

              <UtrForm
                isAdmin={isAdmin}
                initialData={null}
                edit={false}
                onSuccess={() => {
                  setShowModel(false);
                  fetchUtr();
                }}
                onCancel={() => {
                  setShowModel(false);
                }}
              />

            </div>

          </div>

        </div>

      )}

      {/* ================= EDIT UTR MODAL ================= */}

      {editModel && (

        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4"
          onClick={() => setEditModel(null)}
        >

          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mt-8"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h2 className="text-xl font-semibold">
                  Edit UTR
                </h2>

                <p className="text-sm text-slate-500">
                  Update UTR details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditModel(null)}
                className="p-2"
              >
                <XIcon size={18} />
              </button>

            </div>

            <div className="p-6">

              <UtrForm
                isAdmin={isAdmin}
                initialData={editModel}
                edit={true}
                onSuccess={() => {
                  setEditModel(null);
                  fetchUtr();
                }}
                onCancel={() => {
                  setEditModel(null);
                }}
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Utr;