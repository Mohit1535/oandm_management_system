import React from "react";
import { Cog } from "lucide-react";


const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Rotating Gears */}
        <div className="relative">
          <Cog
            size={60}
            className="animate-spin text-blue-600"
            style={{ animationDuration: "3s" }}
          />
          <Cog
            size={35}
            className="absolute -bottom-2 -right-4 animate-spin text-orange-500"
            style={{
              animationDirection: "reverse",
              animationDuration: "2s",
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Operations & Maintenance
          </h3>
          <p className="text-sm text-slate-500 animate-pulse">
            Initializing System...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-orange-500 rounded-full animate-[loading_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Loading;