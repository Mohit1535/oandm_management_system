import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const UtrTable = ({
  onEdit,
  onDelete,
  utr ,
  isAdmin = false,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-sm">

        <thead className="bg-slate-100 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              UTR No
            </th>

            {isAdmin && (
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Employee Name
              </th>
            )}

            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Received Amount
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Month
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Site Name
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Branch Name
            </th>

            <th className="px-4 py-3 text-left font-semibold text-slate-600">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {utr.length === 0 ? (
            <tr>
              <td
                colSpan={isAdmin ? 7 : 6}
                className="px-4 py-10 text-center text-slate-400"
              >
                No UTR found
              </td>
            </tr>
          ) : (
            utr.map((item, index) => (
              <tr
                key={item._id || index}
                className="hover:bg-slate-50"
              >
                {/* UTR NO */}
                <td className="px-4 py-3 font-medium text-slate-700">
                  {item.utrNo || "-"}
                </td>

                {/* EMPLOYEE */}
                {isAdmin && (
                  <td className="px-4 py-3 text-slate-600">
                    {item.empName ||
                      `${item.firstName || ""} ${
                        item.lastName || ""
                      }`.trim() ||
                      "-"}
                  </td>
                )}

                {/* AMOUNT */}
                <td className="px-4 py-3 text-slate-600">
                  ₹{item.amounts ?? 0}
                </td>

                {/* MONTH */}
                <td className="px-4 py-3 text-slate-600">
                  {item.months || "-"}
                </td>

                {/* SITE */}
                <td className="px-4 py-3 text-slate-600">
                  {Array.isArray(item.sites)
                    ? item.sites.join(", ")
                    : item.sites || "-"}
                </td>

                {/* BRANCH */}
                <td className="px-4 py-3 text-slate-600">
                  {Array.isArray(item.branchName)
                    ? item.branchName.join(", ")
                    : item.branchName || "-"}
                </td>

                {/* ACTION */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">

                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UtrTable;