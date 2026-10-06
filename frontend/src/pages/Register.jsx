import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try { await register(form.name, form.email, form.password); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Unable to create account"); }
    finally { setBusy(false); }
  }

  return <div className="auth-page"><section className="auth-card">
    <p className="eyebrow">CAMPUS DESK</p><h1>Create account</h1><p className="muted">Start tracking your campus requests.</p>
    <form className="form-stack" onSubmit={submit}>
      <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" required minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
      <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
    </form>
  </section></div>;
}
