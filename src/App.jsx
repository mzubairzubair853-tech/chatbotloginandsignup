
import { useState } from "react";
import Dashboard from "./Pages/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zubairUser")) || null;
    } catch {
      return null;
    }
  });

  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("zubairUsers") || "[]");

    if (mode === "signup") {
      if (users.some((item) => item.email === email)) {
        setError("This email already has an account.");
        return;
      }

      const newUser = { name: name.trim(), email, password };
      users.push(newUser);
      localStorage.setItem("zubairUsers", JSON.stringify(users));

      const currentUser = { name: newUser.name, email };
      localStorage.setItem("zubairUser", JSON.stringify(currentUser));
      setUser(currentUser);
      return;
    }

    const existingUser = users.find(
      (item) => item.email === email && item.password === password
    );

    if (!existingUser) {
      setError("Incorrect email or password.");
      return;
    }

    const currentUser = {
      name: existingUser.name,
      email: existingUser.email,
    };

    localStorage.setItem("zubairUser", JSON.stringify(currentUser));
    setUser(currentUser);
  }

  function logout() {
    localStorage.removeItem("zubairUser");
    setUser(null);
    setPassword("");
    setMode("signin");
    setError("");
  }

  if (user) {
    return <Dashboard user={user} onLogout={logout} />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="wordmark">ZUBAIR<span>.</span></div>

        <div className="auth-heading">
          <h1>{mode === "signin" ? "Welcome back." : "Create your account."}</h1>
          <p>Sign in to access your personal workspace.</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => {
              setMode("signin");
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit">
            {mode === "signin" ? "Sign In" : "Create Account"} <span>↗</span>
          </button>
        </form>

        <p className="auth-footer">
          {mode === "signin" ? "Don't have an account? " : "Already registered? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default App;
