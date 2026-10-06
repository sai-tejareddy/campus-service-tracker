import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  return <AuthPage title="Welcome back" subtitle="Track campus requests in one place.">
    <form className="form-stack" onSubmit={submit}>
      <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" required minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
      <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
    </form>
  </AuthPage>;
}

function AuthPage({ title, subtitle, children }) {
  return <div className="auth-page"><section className="auth-card">
    <p className="eyebrow">CAMPUS DESK</p><h1>{title}</h1><p className="muted">{subtitle}</p>{children}
  </section></div>;
}
