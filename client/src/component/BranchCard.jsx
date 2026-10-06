import React from "react";
import { MapPin, Trash2 } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const BranchCard = ({ branches, onDelete }) => {
  const handleDelete = async () => {
    try{
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${branches.branchName}?`
    );

    if (!confirmDelete) return;
const response=await api.delete("/branch",{
  data: {
          branchName: branches.branchName,
        },
})

    if (onDelete) {
      onDelete(branches);
      toast.success("Branch deleted successfully")
    }
  }
  catch(error){
         toast.error(error.response?.data?.error || error.message);
  }
  };

  return (
    <div
      className="
        group
        flex
        w-full
        items-center
        gap-4
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:shadow-md
      "
    >
      {/* Site Icon */}
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-gradient-to-br
          from-indigo-500
          to-blue-600
          text-white
          shadow-sm
          transition-transform
          duration-200
          group-hover:scale-105
        "
      >
        <MapPin size={22} />
      </div>

      {/* Site Information */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
          {branches.branchName}
        </h3>

        <p className="mt-0.5 text-xs text-slate-400">
          Project Site
        </p>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDelete}
        title="Delete Site"
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-red-50
          text-red-500
          transition-all
          duration-200
          hover:bg-red-500
          hover:text-white
          active:scale-95
        "
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
};

export default BranchCard;