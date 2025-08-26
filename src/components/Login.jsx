import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "password") {
      localStorage.setItem("admin", "true");
      navigate("/admin");
      return;
    }
    try {
      const response = await api.post("/donors/login", { email, password });
      setUser(response.data);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-red-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-red-600">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
