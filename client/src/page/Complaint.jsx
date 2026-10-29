
import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

import Loading from "../component/Loading";
import ApplyComplaint from "../component/Complaint/ApplyComplaint.jsx";
import ComplaintHistory from "../component/Complaint/ComplaintHistory.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/authContext.jsx";

const Complaint = () => {
const [complaint, setComplaint] = useState([]);
const [loading, setLoading] = useState(true);
const [showComplaintModel, setShowComplaintModel] = useState(false);
const [editComplaintModel, setEditComplaintModel] = useState(null);
const [error, setError] = useState("");

const {user}=useAuth()
// Replace this with your actual logged-in user's role
// if the page is shared by ADMIN and EMPLOYEE.
const isAdmin = user?.role==="ADMIN";

// =========================
// FETCH COMPLAINTS
// =========================
const fetchComplaint = useCallback(async () => {
try {
setError("");


  const response = await api.get("/complaints");

  // Support common backend response structures.
  const responseData = response.data;

  const complaintList = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(responseData?.complaints)
        ? responseData.complaints
        : [];

  setComplaint(complaintList);
} catch (err) {
  console.error(
    "Error fetching complaints:",
    err.response?.data || err.message
  );

  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Failed to load complaints. Please try again."
  );

  toast.error("Failed to load complaints.");
}

}, []);

// =========================
// INITIAL FETCH
// =========================
useEffect(() => {
let isMounted = true;


const loadComplaints = async () => {
  try {
    const response = await api.get("/complaints");

    if (!isMounted) return;

    const responseData = response.data;

    const complaintList = Array.isArray(responseData)
      ? responseData
      : Array.isArray(responseData?.data)
        ? responseData.data
        : Array.isArray(responseData?.complaints)
          ? responseData.complaints
          : [];

    setComplaint(complaintList);
  } catch (err) {
    if (!isMounted) return;

    console.error(
      "Error fetching complaints:",
      err.response?.data || err.message
    );

    setError(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load complaints. Please try again."
    );
  } finally {
    if (isMounted) {
      setLoading(false);
    }
  }
};

loadComplaints();

return () => {
  isMounted = false;
};

}, [fetchComplaint]);




// =========================
// CLOSE CREATE MODAL
// =========================
const closeCreateModal = () => {
setShowComplaintModel(false);
};

// =========================
// CLOSE EDIT MODAL
// =========================
const closeEditModal = () => {
setEditComplaintModel(null);
};

// =========================
// SUCCESSFUL CREATE
// =========================
const handleCreateSuccess = async () => {
setShowComplaintModel(false);
await fetchComplaint();
};

// =========================
// SUCCESSFUL EDIT
// =========================
const handleEditSuccess = async () => {
setEditComplaintModel(null);
await fetchComplaint();
};

// =========================
// OPEN EDIT MODAL
// =========================
const handleEdit = (item) => {
setEditComplaintModel(item);
};

// =========================
// LOADING
// =========================
if (loading) {
return <Loading />;
}

// =========================
// DASHBOARD COUNTS
// =========================
const solvedComplaints = complaint.filter(
(item) => item.status === "SOLVED"
).length;

const unsolvedComplaints = complaint.filter(
(item) => item.status === "UNSOLVED"
).length;

// =========================
// UI
// =========================
return ( <div className="animate-fade-in">
{/* PAGE HEADER */} <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"> <div> <h1 className="page-title">Complaints Management</h1>

      <p className="page-subtitle">
        {isAdmin
          ? "Manage Complaint Applications"
          : "Your complaint history"}
      </p>
    </div>

    {!isAdmin && (
      <button
        type="button"
        className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"
        onClick={() => setShowComplaintModel(true)}
      >
        <PlusIcon className="h-4 w-4" />
        Apply for Complaint
      </button>
    )}
  </div>

  {/* ERROR MESSAGE */}
  {error && (
    <div
      role="alert"
      className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>{error}</p>

      <button
        type="button"
        onClick={fetchComplaint}
        className="font-semibold underline"
      >
        Retry
      </button>
    </div>
  )}

  {/* OPTIONAL COMPLAINT COUNTS */}
  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">Solved Complaints</p>
      <p className="mt-2 text-2xl font-bold text-emerald-600">
        {solvedComplaints}
      </p>
    </div>

    <div className="rounded-xl border border-rose-100 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">Unsolved Complaints</p>
      <p className="mt-2 text-2xl font-bold text-rose-600">
        {unsolvedComplaints}
      </p>
    </div>
  </div>

  {/* CREATE COMPLAINT MODAL */}
  {showComplaintModel && (
    <ApplyComplaint
      open={showComplaintModel}
      onClose={closeCreateModal}
      onSuccess={handleCreateSuccess}
    />
  )}

  {/* EDIT COMPLAINT MODAL */}
  {editComplaintModel && (
    <ApplyComplaint
      key={editComplaintModel._id || editComplaintModel.id}
      open={Boolean(editComplaintModel)}
      initialData={editComplaintModel}
      onClose={closeEditModal}
      onSuccess={handleEditSuccess}
    />
  )}

  {/* COMPLAINT HISTORY */}
  <ComplaintHistory
    complaint={complaint}
    isAdmin={isAdmin}
    onEdit={handleEdit}
  />
</div>


);
};

export default Complaint;
