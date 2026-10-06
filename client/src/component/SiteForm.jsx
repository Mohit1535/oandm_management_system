import React from "react";
import { MapPin, Save, X, Sparkles } from "lucide-react";
import Loading from "../component/Loading";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SiteForm = ({ onCancel, onSuccess, loading }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const siteName = formData.get("siteName");

  try {
    await api.post("/sites", {
      siteName,
    });

    toast.success("Site created successfully");

    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/sites");
    }
  } catch (error) {
    console.error("Create Site Error:", error);

    toast.error(
      error.response?.data?.error || "Failed to create site"
    );
  }
};
  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-7 sm:px-8">

          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10" />

          <div className="absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg backdrop-blur-sm">
              <MapPin size={28} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Create New Site
                </h2>

                <Sparkles
                  size={18}
                  className="text-yellow-200"
                />
              </div>

              <p className="mt-1 text-sm text-white/80">
                Add a new site to your system
              </p>
            </div>

          </div>
        </div>

        <div className="p-6 sm:p-8">

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">
              Site Data
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter the basic information of your site.
            </p>
          </div>

          <div>
            <label
              htmlFor="siteName"
              className="mb-2.5 block text-sm font-semibold text-slate-700"
            >
              Site Name
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">

              <MapPin
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"
              />

              <input
                id="siteName"
                required
                type="text"
                name="siteName"
                placeholder="Enter site name"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Enter the name of the project site.
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

            <button
              onClick={() =>
                onCancel ? onCancel() : navigate(-1)
              }
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 sm:w-auto"
            >
              <X size={18} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-7 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading && <Loading />}

              {!loading && <Save size={18} />}

              {loading ? "Creating..." : "Create Site"}
            </button>

          </div>

        </div>
      </div>
    </form>
  );
};

export default SiteForm;