import React from 'react'

const LoginLeftSide = () => {
  return (
<>
<div className="relative overflow-hidden bg-gradient-to-br
from-slate-950 via-indigo-950 to-slate-900
text-white h-full">

  {/* Animated Background */}
  <div className="absolute inset-0 overflow-hidden">

    <div className="absolute top-10 left-10 w-56 h-56 rounded-full
    bg-cyan-500/20 blur-3xl animate-pulse"></div>

    <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full
    bg-indigo-500/20 blur-3xl animate-pulse"></div>

  </div>

  <div className="relative z-10 p-8 lg:p-16">

    {/* Logo */}
    <img
      src="/images/sundigo.png"
      alt="Sundigo Solar"
      className="h-14 lg:h-16 mb-8"
    />

    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2
    rounded-full bg-white/10 backdrop-blur-xl
    border border-white/10 mb-6">

      <span className="h-2 w-2 rounded-full bg-green-400 animate-ping"></span>

      <span className="text-sm font-medium">
        O&M Management System
      </span>
    </div>

    {/* Heading */}
    <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">

      Smart Operations

      <span className="block bg-gradient-to-r
      from-cyan-400 via-blue-400 to-indigo-400
      bg-clip-text text-transparent">

        & Maintenance
      </span>

    </h1>

    <p className="mt-6 text-slate-300 text-lg max-w-xl">
      Manage sites, employees, complaints,
      maintenance activities and performance
      tracking through one centralized platform.
    </p>

    {/* Features */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">

      <div className="bg-white/5 border border-white/10
      rounded-2xl p-4 backdrop-blur-xl">

        ⚡ Real-Time Monitoring
      </div>

      <div className="bg-white/5 border border-white/10
      rounded-2xl p-4 backdrop-blur-xl">

        👥 Employee Management
      </div>

      <div className="bg-white/5 border border-white/10
      rounded-2xl p-4 backdrop-blur-xl">

        📋 Complaint Tracking
      </div>

      <div className="bg-white/5 border border-white/10
      rounded-2xl p-4 backdrop-blur-xl">

        📊 Analytics Dashboard
      </div>

    </div>

    {/* Statistics */}
    <div className="grid grid-cols-3 gap-4 mt-10">

      <div className="bg-white/10 border border-white/10
      rounded-2xl p-5 text-center">

        <h3 className="text-3xl font-bold text-cyan-400">
          238+
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Active Sites
        </p>

      </div>

      <div className="bg-white/10 border border-white/10
      rounded-2xl p-5 text-center">

        <h3 className="text-3xl font-bold text-green-400">
          1000+
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Resolved Cases
        </p>

      </div>

      <div className="bg-white/10 border border-white/10
      rounded-2xl p-5 text-center">

        <h3 className="text-3xl font-bold text-indigo-400">
          24/7
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Monitoring
        </p>

      </div>

    </div>

    {/* Footer */}
    <div className="mt-10">

      <p className="text-slate-400 text-sm">
        Powered by Sundigo Solar Solutions Pvt. Ltd.
      </p>

      <p className="text-slate-500 text-xs mt-2">
        Centralized O&M platform for managing sites,
        employees, complaints and operational
        performance in real time.
      </p>

    </div>

  </div>
</div>
</>
  )
}

export default LoginLeftSide