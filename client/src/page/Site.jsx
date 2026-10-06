import React, { useCallback, useEffect, useState } from "react";
import Loading from "../component/Loading";
import api from "../api/axios.js";
import { PlusIcon, SearchIcon } from "lucide-react";
import SitesCard from "../component/SitesCard";
// import { Sites } from "../assets";
import { XIcon } from "lucide-react";
import SiteForm from "../component/SiteForm.jsx"
const Site = () => {
  const [sites, setSites] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ==============================
  // FETCH SITES
  // ==============================
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      const res=await api.get("/sites")
      console.log(res.data)
      setSites(res.data);
      // Currently using static Sites data
      // setSites(Sites);
    } catch (error) {
      console.error("Error loading sites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==============================
  // LOAD SITES
  // ==============================
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // ==============================
  // FILTER
  // ==============================
  const filtered = sites.filter((site) =>
    site.siteName.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="page-title">
            Sites
          </h1>

          <p className="page-subtitle">
            Manage your Sites
          </p>
        </div>

        <button
          onClick={() => setShowModel(true)}
          className="btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          <PlusIcon size={20} />
          Add Site
        </button>

      </div>


      {/* ================= SEARCH ================= */}

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
            placeholder="Search sites..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>


      {/* ================= SITES ================= */}

      {filtered.length === 0 ? (

        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl bg-white text-center">

          <h3 className="text-xl font-semibold text-slate-700">
            No Sites Found
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {search
              ? `No site found matching "${search}"`
              : "No sites available"}
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filtered.map((site) => (

            <SitesCard
              key={ site.siteName}
              sites={site}
              onDelete={fetchSites}
            />

          ))}





        </div>

      )}

{
showModel && (

<div
className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4"
onClick={()=>setShowModel(false)}
>


<div
className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mt-8"
onClick={(e)=>e.stopPropagation()}
>


<div className="flex justify-between items-center p-6 border-b">

<div>

<h2 className="text-xl font-semibold">
Add Sites
</h2>

<p className="text-sm text-slate-500">
Add New Sites into your work
</p>

</div>

<button onClick={()=>setShowModel(false)}>
<XIcon size={18}/>
</button>


</div>


<div className="p-6">

<SiteForm

onSuccess={()=>{

setShowModel(false);
fetchSites();

}}

onCancel={()=>setShowModel(false)}

/>

</div>


</div>


</div>

)

}

    </div>
  );
};

export default Site;