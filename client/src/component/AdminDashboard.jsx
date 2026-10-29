
import React from "react";
import {
  Users,
  HardHat,
  GitBranch,
  AlertTriangle,
  CircleCheck,
  Clock3,
  TrendingUp,
  ArrowUpRight,
  Activity,
  ShieldCheck,
  Sparkles,
  CalendarDays,
} from "lucide-react";

const AdminDashboard = ({ data = {} }) => {
  const totalEmployees = Number(data?.totalEmployees) || 0;
  const totalSites = Number(data?.totalSites) || 0;
  const totalBranches = Number(data?.totalBranches) || 0;
  const totalComplaints = Number(data?.complaints) || 0;
  const solvedComplaints = Number(data?.solvedComplaints) || 0;
  const pendingComplaints = Number(data?.pendingComplaints) || 0;

  const resolutionRate =
    totalComplaints > 0
      ? Math.min(
          100,
          Math.round((solvedComplaints / totalComplaints) * 100)
        )
      : 0;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      description: "People in your workforce",
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
      accent: "bg-blue-500",
      light: "from-blue-50 to-white",
      label: "Workforce",
    },
    {
      title: "Operational Sites",
      value: totalSites,
      description: "Sites under management",
      icon: HardHat,
      iconStyle: "bg-violet-50 text-violet-600",
      accent: "bg-violet-500",
      light: "from-violet-50 to-white",
      label: "Locations",
    },
    {
      title: "Total Branches",
      value: totalBranches,
      description: "Branches across operations",
      icon: GitBranch,
      iconStyle: "bg-cyan-50 text-cyan-600",
      accent: "bg-cyan-500",
      light: "from-cyan-50 to-white",
      label: "Branches",
    },
    {
      title: "Total Complaints",
      value: totalComplaints,
      description: "Complaints received",
      icon: AlertTriangle,
      iconStyle: "bg-amber-50 text-amber-600",
      accent: "bg-amber-500",
      light: "from-amber-50 to-white",
      label: "All cases",
    },
    {
      title: "Resolved",
      value: solvedComplaints,
      description: "Successfully resolved",
      icon: CircleCheck,
      iconStyle: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
      light: "from-emerald-50 to-white",
      label: "Completed",
    },
    {
      title: "Pending",
      value: pendingComplaints,
      description: "Awaiting resolution",
      icon: Clock3,
      iconStyle: "bg-rose-50 text-rose-600",
      accent: "bg-rose-500",
      light: "from-rose-50 to-white",
      label: "Needs attention",
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen space-y-7 bg-slate-50/70 p-1 pb-8 sm:space-y-8">
      {/* ==================== WELCOME BANNER ==================== */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 px-6 py-8 text-white shadow-xl shadow-indigo-950/10 sm:px-9 sm:py-10 lg:px-10">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-indigo-100 backdrop-blur-md">
              <Sparkles size={15} className="text-amber-300" />
              ADMINISTRATION OVERVIEW
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Welcome Back
              <span className="ml-2 inline-block">👋</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100/80 sm:text-base">
              Your operations at a glance. Monitor your workforce,
              oversee operational sites, and stay on top of complaints
              from one central dashboard.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                <Activity size={17} className="text-emerald-300" />
                <span className="text-sm font-medium">
                  Operations Overview
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                <ShieldCheck size={17} className="text-blue-300" />
                <span className="text-sm font-medium">
                  Admin Dashboard
                </span>
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-xl lg:max-w-[250px]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <CalendarDays size={22} className="text-indigo-200" />
              </div>

              <div>
                <p className="text-xs font-medium text-indigo-200">
                  TODAY'S DATE
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {currentDate}
                </p>
              </div>
            </div>

            <div className="my-5 h-px bg-white/10" />

            <p className="text-xs text-indigo-200">Complaint resolution</p>

            <div className="mt-3 flex items-end justify-between gap-3">
              <span className="text-3xl font-bold">
                {resolutionRate}%
              </span>
              <span className="mb-1 text-xs text-indigo-200">
                Resolution rate
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-700"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION HEADING ==================== */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Dashboard Overview
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Key metrics and operational performance at a glance.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live dashboard data
          </div>
        </div>

        {/* ==================== STATISTICS CARDS ==================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${item.light} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 sm:p-6`}
              >
                {/* Accent */}
                <div
                  className={`absolute left-0 top-5 h-12 w-1 rounded-r-full ${item.accent} opacity-80`}
                />

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                      {item.value.toLocaleString("en-IN")}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconStyle} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon size={23} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4">
                  <span className="text-xs font-medium text-slate-500">
                    {item.label}
                  </span>

                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${item.iconStyle} transition-transform duration-300 group-hover:translate-x-1`}
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={15} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ==================== COMPLAINT SUMMARY ==================== */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Resolution card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <TrendingUp size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Complaint Resolution
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Current resolution performance
                  </p>
                </div>
              </div>
            </div>

            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              {resolutionRate}% resolved
            </span>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Resolution rate
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {resolutionRate}
                  <span className="ml-1 text-lg font-semibold text-slate-400">
                    %
                  </span>
                </p>
              </div>

              <p className="text-right text-xs text-slate-500">
                {solvedComplaints} of {totalComplaints} complaints
              </p>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Complaint resolution rate"
              aria-valuenow={resolutionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${resolutionRate}%` }}
              />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <CircleCheck size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-emerald-700">
                  Resolved Cases
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {solvedComplaints.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-rose-50/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
                <Clock3 size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-rose-700">
                  Pending Cases
                </p>
                <p className="mt-1 text-xl font-bold text-rose-900">
                  {pendingComplaints.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Operations summary */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-lg shadow-indigo-900/10 lg:col-span-2 sm:p-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10">
              <Activity size={22} />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Operations at a Glance
            </h3>

            <p className="mt-2 text-sm leading-6 text-indigo-100">
              A snapshot of your organization's workforce and operational
              coverage.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Users size={19} className="text-indigo-200" />
                  <span className="text-sm text-indigo-50">
                    Employees
                  </span>
                </div>

                <span className="text-lg font-bold">
                  {totalEmployees.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <HardHat size={19} className="text-indigo-200" />
                  <span className="text-sm text-indigo-50">
                    Sites
                  </span>
                </div>

                <span className="text-lg font-bold">
                  {totalSites.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <GitBranch size={19} className="text-indigo-200" />
                  <span className="text-sm text-indigo-50">
                    Branches
                  </span>
                </div>

                <span className="text-lg font-bold">
                  {totalBranches.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-indigo-100">
              <ShieldCheck size={15} />
              <span>Centralized operations overview</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
