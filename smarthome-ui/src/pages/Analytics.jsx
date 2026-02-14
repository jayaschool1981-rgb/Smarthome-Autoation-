import { useState } from "react";

export default function Analytics() {
  const weeklyUsage = [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 65 },
    { day: "Wed", value: 30 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 55 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 70 },
  ];

  const peakDay = weeklyUsage.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );

  return (
    <div className="p-10 text-white">

      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">📊 Analytics</h1>
      <p className="text-slate-400 mb-10">
        Energy consumption insights and trends
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Total Usage</h3>
          <p className="text-3xl font-bold text-green-400">430 kWh</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Peak Day</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {peakDay.day}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">System Health</h3>
          <p className="text-3xl font-bold text-blue-400">98%</p>
        </div>
      </div>

      {/* Weekly Usage Bar Chart */}
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
        <h2 className="text-xl font-semibold mb-8">
          Weekly Energy Consumption
        </h2>

        <div className="flex items-end justify-between h-64">
          {weeklyUsage.map((data, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full mx-1"
            >
              <div
                className="bg-green-500 w-8 rounded-t-lg transition-all duration-500"
                style={{ height: `${data.value * 2}px` }}
              ></div>
              <span className="text-sm mt-2 text-slate-400">
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
