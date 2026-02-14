import { useState } from "react";

export default function Login({ setIsLoggedIn }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await fetch("https://smarthome-backend-p7pc.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.error);
    }

    // 🔥 Store token
    localStorage.setItem("token", data.token);

    setIsLoggedIn(true);

  } catch (err) {
    alert("Server error");
  }
};


  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return alert("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch("https://smarthome-backend-p7pc.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return alert(data.error);
      }

      alert("Registration successful! Please login.");
      setIsRegistering(false);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      alert("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl w-96 border border-slate-700">

        <h2 className="text-3xl font-bold mb-6 text-center">
          {isRegistering ? "📝 Create Account" : "🔐 SmartHome Login"}
        </h2>

        {isRegistering && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full mb-6 p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {!isRegistering ? (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 hover:underline text-sm"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "New user? Create account"}
          </button>
        </div>

      </div>
    </div>
  );
}
