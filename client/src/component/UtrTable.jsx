
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const UtrTable = ({
onEdit,
utr,
isAdmin = false,
}) => {

return ( 
<div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm"> <table className="w-full min-w-[800px] text-sm"> <thead className="border-b bg-slate-100"> <tr> <th className="px-4 py-3 text-left font-semibold text-slate-600">
UTR No </th>


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
        Utr Submission  Date
        </th>
        <th className="px-4 py-3 text-left font-semibold text-slate-600">
          Site Name
        </th>

        <th className="px-4 py-3 text-left font-semibold text-slate-600">
          Branch Name
        </th>
{!isAdmin && (
  <th className="px-4 py-3 text-left font-semibold text-slate-600">
          Action
        </th>
)}
      
      </tr>
    </thead>

    <tbody className="divide-y divide-slate-100">
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
            key={item._id || item.id || index}
            className="transition-colors hover:bg-slate-50"
          >
            {/* UTR NUMBER */}
            <td className="px-4 py-3 font-medium text-slate-700">
              {item.utrNo || "-"}
            </td>

            {/* EMPLOYEE NAME */}
            {isAdmin && (
              <td className="px-4 py-3 text-slate-600">
                {item.employee
                  ? `${item.employee.firstName || ""} ${
                      item.employee.lastName || ""
                    }`.trim() || "-"
                  : item.empName ||
                    `${item.firstName || ""} ${
                      item.lastName || ""
                    }`.trim() ||
                    "-"}
              </td>
            )}

            {/* AMOUNT */}
            <td className="px-4 py-3 text-slate-600">
              ₹
              {Number(item.amount ?? 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>

            {/* MONTH */}
            <td className="px-4 py-3 text-slate-600">
              {item.month || "-"}
            </td>


    <td className="px-4 py-3 text-slate-600">
              {item.createdAt?new Date(item.createdAt).toLocaleDateString():"-" || "-"}
            </td>
            {/* SITES */}
            <td className="px-4 py-3 text-slate-600">
              {Array.isArray(item.sites)
                ? item.sites.join(", ") || "-"
                : item.sites || "-"}
            </td>

            {/* BRANCHES */}
            <td className="px-4 py-3 text-slate-600">
              {Array.isArray(item.branches)
                ? item.branches.join(", ") || "-"
                : item.branches || "-"}
            </td>

            {/* ACTIONS */}
           
           
           {!isAdmin && (
    <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(item)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  <Pencil size={15} />
                  Edit
                </button>

              
              </div>
            </td>
           )}
        
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


);
};

export default UtrTable;

