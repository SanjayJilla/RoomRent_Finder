import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  <p>
  New property owner? <Link to="/register">Create an account</Link>
    </p>

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/owners/login`,
        { email, password }
      );

      sessionStorage.setItem(
        "access_token",
        response.data.access_token
      );

      navigate("/owner/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-card">
        <h2>Owner Login</h2>
        <p>Manage your rental properties</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;