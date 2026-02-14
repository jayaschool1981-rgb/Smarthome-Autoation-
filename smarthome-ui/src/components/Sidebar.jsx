import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const linkStyle =
    "block px-4 py-2 rounded-lg transition duration-200";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-10">🏠 SmartHome</h2>

      <nav className="space-y-4 text-slate-300">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`
          }
        >
          Rooms
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`
          }
        >
          Analytics
        </NavLink>

        <div className="pt-10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-400 hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>

      </nav>
    </div>
  );
}
