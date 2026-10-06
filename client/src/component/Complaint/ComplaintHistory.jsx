import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckIcon, XIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

const ComplaintHistory = ({ complaint, onUpdate, isAdmin }) => {
  const [processing, setProcessing] = useState(null);

  const handleStatusUpdate = async (id, status) => {
    setProcessing(id);

    try {
      await onUpdate(id, status);
    } finally {
      setProcessing(null);
    }
  };

  return (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
   <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
  <tr>
    {isAdmin && (
      <th className="px-6 py-4 text-left text-sm font-semibold">
        Employee
      </th>
    )}

    <th className="px-6 py-4 text-left text-sm font-semibold">Branch</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">Site</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">Asset</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">
      Complaint Date
    </th>
    <th className="px-6 py-4 text-center text-sm font-semibold">Image</th>
    <th className="px-6 py-4 text-left text-sm font-semibold">
      Description
    </th>

    {!isAdmin && (
      <th className="px-6 py-4 text-center text-sm font-semibold">
        Status
      </th>
    )}

    {isAdmin && (
      <th className="px-6 py-4 text-center text-sm font-semibold">
        Action
      </th>
    )}
  </tr>
</thead>

      <tbody className="divide-y divide-gray-100 bg-white">
        {complaint.map((item) => (
          <tr
            key={item._id || item.id}
            className="hover:bg-blue-50 transition duration-200"
          >
            {isAdmin && (
              <td className="px-6 py-4 font-medium text-gray-800">
                {item.employee.firstName} {item.employee.lastName}
              </td>
            )}

            <td className="px-6 py-4">{item.branchName}</td>

            <td className="px-6 py-4">{item.Sites}</td>

            <td className="px-6 py-4">{item.assetsName}</td>

        <td className="px-6 py-4">
  {item.complaintDate
    ? format(new Date(item.complaintDate), "dd MMM yyyy")
    : "N/A"}
</td>

        <td className="px-6 py-4">
  <img
    src={item.image}
    alt="Complaint"
    className="w-16 h-16 rounded-lg object-cover border"
  />
</td>
<td className="px-6 py-4 max-w-xs truncate">
  {item.description}
</td>

{!isAdmin && (
  <td className="px-6 py-4 text-center">
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        item.status === "SOLVED"
          ? "bg-green-100 text-green-700"
          : item.status === "UNSOLVED"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {item.status}
    </span>
  </td>
)}

{isAdmin && (
  <td className="px-6 py-4">
    {item.type === "PENDING" ? (
      <div className="flex justify-center gap-3">
        <button
          onClick={() => handleStatusUpdate(item._id || item.id, "SOLVED")}
          disabled={processing === (item._id || item.id)}
          className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition disabled:opacity-50"
        >
          {processing === (item._id || item.id) ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CheckIcon size={18} />
          )}
        </button>

        <button
          onClick={() => handleStatusUpdate(item._id || item.id, "UNSOLVED")}
          disabled={processing === (item._id || item.id)}
          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition disabled:opacity-50"
        >
          {processing === (item._id || item.id) ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <XIcon size={18} />
          )}
        </button>
      </div>
    ) : (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          item.status === "SOLVED"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {item.status}
      </span>
    )}
  </td>
)}
            
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default ComplaintHistory;