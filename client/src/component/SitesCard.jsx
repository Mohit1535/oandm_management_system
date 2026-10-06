import React from "react";
import { MapPin, Trash2 } from "lucide-react";
import api from "../api/axios.js";

const SitesCard = ({ sites, onDelete }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${sites.siteName}?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete("/sites", {
        data: {
          siteName: sites.siteName,
        },
      });

      // Refresh site list
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Delete Site Error:", error);

      alert(
        error.response?.data?.error || "Failed to delete site"
      );
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
          {sites.siteName}
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

export default SitesCard;