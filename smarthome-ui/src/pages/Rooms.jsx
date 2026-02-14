export default function Rooms() {
  const rooms = [
    { name: "Living Room", devices: 3, icon: "🛋" },
    { name: "Bedroom", devices: 2, icon: "🛏" },
    { name: "Kitchen", devices: 1, icon: "🍳" },
    { name: "Security", devices: 2, icon: "🔐" },
  ];

  return (
    <div className="p-10 text-white">
      <h1 className="text-4xl font-bold mb-2">🛏 Rooms</h1>
      <p className="text-slate-400 mb-10">
        Manage devices by room category
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg hover:scale-105 transition duration-300"
          >
            <div className="text-4xl mb-4">{room.icon}</div>
            <h2 className="text-2xl font-semibold">
              {room.name}
            </h2>
            <p className="text-slate-400 mt-2">
              {room.devices} Connected Devices
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
