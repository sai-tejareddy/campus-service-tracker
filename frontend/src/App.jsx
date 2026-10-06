import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Shell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => navigate("/")}>Campus Desk</button>
        <div className="topbar-user">
          <span>{user?.name}</span>
          <button className="button button-ghost" onClick={logout}>Sign out</button>
        </div>
      </header>
      <main className="page-container"><Dashboard /></main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Shell /></ProtectedRoute>} />
    </Routes>
  );
}
