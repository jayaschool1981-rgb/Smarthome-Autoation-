import { useState, useEffect } from "react";

const initialDevices = [
  { id: 1, name: "Living Room Light", icon: "💡", status: true },
  { id: 2, name: "Bedroom AC", icon: "❄️", status: false },
  { id: 3, name: "Smart TV", icon: "📺", status: true },
  { id: 4, name: "Security Camera", icon: "📷", status: true },
  { id: 5, name: "Main Door Lock", icon: "🔒", status: false },
  { id: 6, name: "Kitchen Fan", icon: "🌀", status: false },
];

export default function Dashboard() {
  const [devices, setDevices] = useState(initialDevices);
  const [time, setTime] = useState(new Date());

  // Live Clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleDevice = (id) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id
          ? { ...device, status: !device.status }
          : device
      )
    );
  };

  const activeCount = devices.filter((d) => d.status).length;
  const energyPercentage = (activeCount / devices.length) * 100;

  return (
    <div className="p-10 text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-wide">
            🏠 Smart Home Dashboard
          </h1>
          <p className="text-slate-400 mt-1">
            {time.toLocaleTimeString()}
          </p>
          <p className="text-slate-500 text-sm">
            Monitor and control your connected devices
          </p>
        </div>

        <div className="bg-slate-800 px-8 py-4 rounded-2xl shadow-lg border border-slate-700">
          <p className="text-sm text-slate-400">Active Devices</p>
          <p className="text-3xl font-bold text-green-400">
            {activeCount} / {devices.length}
          </p>
        </div>
      </div>

      {/* Energy Usage Section */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-10 border border-slate-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">⚡ Energy Usage</h2>
          <span className="text-sm text-slate-400">
            {Math.round(energyPercentage)}%
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${energyPercentage}%` }}
          ></div>
        </div>

        <p className="text-slate-400 mt-3 text-sm">
          Usage increases dynamically as more devices are active.
        </p>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl hover:shadow-2xl hover:scale-105 transition duration-300"
          >
            <div className="text-5xl mb-4">{device.icon}</div>

            <h2 className="text-xl font-semibold mb-6">
              {device.name}
            </h2>

            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${
                  device.status
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {device.status ? "ON" : "OFF"}
              </span>

              {/* Modern Toggle */}
              <button
                onClick={() => toggleDevice(device.id)}
                className={`relative w-14 h-7 rounded-full transition duration-300 ${
                  device.status
                    ? "bg-green-500"
                    : "bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    device.status ? "translate-x-7" : ""
                  }`}
                ></span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
