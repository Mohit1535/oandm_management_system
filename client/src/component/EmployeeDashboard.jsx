
import React, { useEffect, useState } from "react";
import {
  HardHat,
  TriangleAlert,
  CircleCheck,
  XCircle,
  TrendingUp,
  GitBranch,
  ArrowUpRight,
  Clock3,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Activity,
} from "lucide-react";
import api from "../api/axios.js";

const EmployeeDashboard = ({ data }) => {
  const [userName, setUserName] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // =========================
  // FETCH EMPLOYEE PROFILE
  // =========================
  useEffect(() => {
    let isMounted = true;

    const fetchEmployee = async () => {
      try {
        const response = await api.get("/profile");

        console.log("PROFILE RESPONSE:", response.data);

        // Supports both response formats:
        // { firstName: "Mohit" }
        // { success: true, employee: { firstName: "Mohit" } }
        const employee = response.data?.employee ?? response.data;

        if (isMounted) {
          const firstName = employee?.firstName?.trim();

          setUserName(firstName || "Employee");
        }
      } catch (error) {
        console.error(
          "Failed to fetch employee profile:",
          error.response?.data || error.message
        );

        if (isMounted) {
          setUserName("Employee");
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchEmployee();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // CURRENT DATE
  // =========================
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = currentDate.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
        ? "Good Afternoon"
        : "Good Evening";

  // =========================
  // DASHBOARD STATISTICS
  // =========================
  const cards = [
    {
      title: "Total Sites",
      value: data?.totalSites ?? 0,
      description: "Your operational sites",
      icon: HardHat,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      gradient: "from-indigo-50 to-white",
      border: "border-indigo-100",
      accent: "bg-indigo-500",
    },
    {
      title: "Total Branches",
      value: data?.totalBranches ?? 0,
      description: "Assigned branches",
      icon: GitBranch,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-100",
      gradient: "from-violet-50 to-white",
      border: "border-violet-100",
      accent: "bg-violet-500",
    },
    {
      title: "Total Complaints",
      value: data?.complaints ?? 0,
      description: "Complaints registered",
      icon: TriangleAlert,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      gradient: "from-amber-50 to-white",
      border: "border-amber-100",
      accent: "bg-amber-500",
    },
    {
      title: "Resolved Cases",
      value: data?.solvedComplaints ?? 0,
      description: "Successfully resolved",
      icon: CircleCheck,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      gradient: "from-emerald-50 to-white",
      border: "border-emerald-100",
      accent: "bg-emerald-500",
    },
    {
      title: "Pending Cases",
      value: data?.pendingComplaints ?? 0,
      description: "Awaiting resolution",
      icon: XCircle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      gradient: "from-rose-50 to-white",
      border: "border-rose-100",
      accent: "bg-rose-500",
    },
  ];

  // =========================
  // COMPLAINT SUMMARY
  // =========================
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

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen space-y-7 bg-slate-50/50 pb-8 animate-fade-in">

      {/* =========================
          WELCOME BANNER
      ========================= */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-xl shadow-indigo-950/10 sm:p-8 lg:p-10">

        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

          {/* Welcome text */}
          <div className="max-w-2xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-indigo-100 shadow-sm backdrop-blur-md sm:text-sm">
              <Sparkles size={15} className="text-amber-300" />
              Employee Control Center
            </div>

            <p className="mb-2 text-sm font-medium tracking-wide text-indigo-200 sm:text-base">
              {greeting}!
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Welcome back,
              <span className="mt-1 block bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
                {profileLoading ? "..." : userName}
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Here's your operational overview. Stay on top of your sites,
              monitor complaints, and keep everything moving forward.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-sm text-indigo-50 backdrop-blur-sm">
                <CalendarDays size={17} className="text-indigo-300" />
                <span>{formattedDate}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2.5 text-sm text-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Dashboard Active
              </div>

            </div>
          </div>

          {/* Right-side visual */}
          <div className="hidden shrink-0 lg:block">
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
              <div className="absolute inset-4 rounded-full border border-dashed border-indigo-300/30" />

              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/10 blur-xl" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-950/40">
                <Activity size={44} strokeWidth={1.5} />
              </div>

              <div className="absolute right-3 top-8 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-slate-900/80 shadow-lg">
                <ShieldCheck size={20} className="text-emerald-300" />
              </div>

              <div className="absolute bottom-5 left-1 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-slate-900/80 shadow-lg">
                <TrendingUp size={20} className="text-amber-300" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          SECTION HEADER
      ========================= */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-600" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Dashboard Overview
              </p>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A quick snapshot of your current operations.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 shadow-sm">
            <Clock3 size={16} className="text-indigo-600" />
            Live Overview
          </div>

        </div>

        {/* =========================
            STATISTICS CARDS
        ========================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">

          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={`group relative isolate overflow-hidden rounded-2xl border ${item.border} bg-gradient-to-br ${item.gradient} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/70`}
              >

                {/* Top accent */}
                <div
                  className={`absolute inset-x-0 top-0 -z-10 h-1 ${item.accent} opacity-80`}
                />

                {/* Decorative circle */}
                <div className="pointer-events-none absolute -right-8 -top-8 -z-10 h-28 w-28 rounded-full bg-white/80 blur-2xl transition-transform duration-500 group-hover:scale-150" />

                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconColor} shadow-sm transition-all duration-300 group-hover:rotate-3 group-hover:scale-110`}
                  >
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-200/70 pt-4">

                  <p className="text-xs font-medium text-slate-500">
                    {item.description}
                  </p>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
                    <ArrowUpRight size={15} />
                  </div>

                </div>

              </article>
            );
          })}

        </div>
      </section>

      {/* =========================
          COMPLAINT PERFORMANCE
      ========================= */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Resolution rate */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm lg:col-span-2">

          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-50 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <TrendingUp size={23} />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Complaint Resolution
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Overview of resolved complaints across your operations.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  <CircleCheck size={16} />
                  {solvedComplaints} Resolved
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                  <Clock3 size={16} />
                  {pendingComplaints} Pending
                </span>

              </div>
            </div>

            {/* Progress circle */}
            <div className="flex shrink-0 flex-col items-center justify-center">

              <div
                className="relative flex h-36 w-36 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#6366f1 ${resolutionRate * 3.6}deg, #e2e8f0 ${resolutionRate * 3.6}deg)`,
                }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">

                  <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {resolutionRate}%
                  </span>

                  <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Resolved
                  </span>

                </div>
              </div>

              <p className="mt-3 text-xs font-medium text-slate-500">
                Resolution rate
              </p>

            </div>

          </div>
        </div>

        {/* Quick summary */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-lg shadow-indigo-900/10">

          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <Activity size={23} />
              </div>

              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100">
                Summary
              </span>

            </div>

            <h3 className="mt-5 text-xl font-bold">
              Operations Snapshot
            </h3>

            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Your current complaint activity at a glance.
            </p>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-sm text-indigo-100">
                  Total complaints
                </span>
                <span className="text-lg font-bold">
                  {totalComplaints}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-sm text-indigo-100">
                  Resolved cases
                </span>
                <span className="text-lg font-bold">
                  {solvedComplaints}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-100">
                  Awaiting resolution
                </span>
                <span className="text-lg font-bold">
                  {pendingComplaints}
                </span>
              </div>

            </div>

            <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-3.5">

              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck size={17} className="text-emerald-300" />

                {pendingComplaints === 0
                  ? "No pending complaints reported"
                  : `${pendingComplaints} complaint${pendingComplaints === 1 ? "" : "s"} awaiting attention`}
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* =========================
          FOOTER NOTE
      ========================= */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShieldCheck size={21} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Your operations, at a glance
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Review your assigned sites and keep track of complaint resolution.
            </p>
          </div>

        </div>

        <p className="text-xs font-medium text-slate-400">
          Employee Dashboard
        </p>

      </div>

    </div>
  );
};

export default EmployeeDashboard;
