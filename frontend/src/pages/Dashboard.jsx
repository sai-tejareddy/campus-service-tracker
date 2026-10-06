import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../auth";
import RequestDetails from "../components/RequestDetails";
import { validateRequestForm } from "../utils/requestRules";

const initialForm = { title: "", description: "", category: "Facilities", priority: "MEDIUM" };

export default function Dashboard() {
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0, number: 0 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { user } = useAuth();

  const load = useCallback(async (page = 0) => {
    try {
      setError("");
      const params = { page, size: 8, ...filters };
      const response = await api.get("/requests", { params });
      setData(response.data);
    } catch (err) { setError(err.response?.data?.message || "Could not load requests"); }
  }, [filters]);

  useEffect(() => { load(0); }, [load]);

  async function createRequest(event) {
    event.preventDefault();
    const validationMessage = validateRequestForm(form);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    setBusy(true);
    try {
      await api.post("/requests", form);
      setForm(initialForm);
      await load(0);
    } catch (err) { setError(err.response?.data?.message || "Could not create request"); }
    finally { setBusy(false); }
  }

  async function updateRequest(id, status) {
    try { await api.put(`/requests/${id}`, { status }); await load(); }
    catch (err) { setError(err.response?.data?.message || "Could not update request"); }
  }

  const stats = useMemo(() => data.content.reduce((result, request) => {
    result[request.status] = (result[request.status] || 0) + 1;
    return result;
  }, {}), [data.content]);

  return <div className="dashboard">
    <section className="page-heading"><div><p className="eyebrow">{user?.role === "STAFF" ? "SUPPORT QUEUE" : "REQUESTS"}</p><h1>{user?.role === "STAFF" ? "Keep the support queue moving." : "Good work starts with a clear queue."}</h1><p className="muted">Create a request, follow its status, and keep the support team informed.</p></div></section>
    <section className="stat-grid"><Stat label="Showing" value={data.content.length} /><Stat label="Open" value={stats.OPEN || 0} /><Stat label="In progress" value={stats.IN_PROGRESS || 0} /><Stat label="Resolved" value={stats.RESOLVED || 0} /></section>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-heading"><div><h2>Your requests</h2><p className="muted">{data.totalElements} total requests</p></div></div>
        <div className="filter-row"><input aria-label="Search requests" placeholder="Search title or description" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /><select aria-label="Filter status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Resolved</option><option value="CLOSED">Closed</option></select><select aria-label="Filter priority" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="">All priorities</option><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="request-list">{data.content.length === 0 ? <div className="empty-state"><strong>No requests found</strong><span>Try changing the filters or create your first request.</span></div> : data.content.map((request) => <RequestCard key={request.id} request={request} onStatusChange={updateRequest} onView={setSelectedRequest} canManageStatus={user?.role === "STAFF"} />)}</div>
        {data.totalPages > 1 && <div className="pagination"><button className="button button-ghost" disabled={data.number === 0} onClick={() => load(data.number - 1)}>Previous</button><span>Page {data.number + 1} of {data.totalPages}</span><button className="button button-ghost" disabled={data.number + 1 >= data.totalPages} onClick={() => load(data.number + 1)}>Next</button></div>}
      </section>
      <section className="panel create-panel"><div className="panel-heading"><div><h2>New request</h2><p className="muted">Give the team enough context to help.</p></div></div>
        <form className="form-stack" onSubmit={createRequest}><label>Title<input required maxLength="120" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What do you need help with?" /></label><label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Facilities</option><option>IT Support</option><option>Library</option><option>Accounts</option><option>Other</option></select></label><label>Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label><label>Description<textarea required minLength="10" rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add the details someone should know..." /></label><button className="button button-primary" disabled={busy}>{busy ? "Submitting..." : "Submit request"}</button></form>
      </section>
    </div>
    {selectedRequest && <RequestDetails request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
  </div>;
}

function Stat({ label, value }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>; }
function RequestCard({ request, onStatusChange, onView, canManageStatus }) { return <article className="request-card"><div className="request-card-top"><div><span className="category">{request.category}</span><h3>{request.title}</h3></div><span className={`priority priority-${request.priority.toLowerCase()}`}>{request.priority}</span></div><p>{request.description}</p><div className="request-meta"><span>Created by {request.createdBy}</span><div className="request-actions"><button className="button button-ghost" onClick={() => onView(request)}>Details</button>{canManageStatus ? <select aria-label={`Status for ${request.title}`} value={request.status} onChange={(e) => onStatusChange(request.id, e.target.value)}><option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Resolved</option><option value="CLOSED">Closed</option></select> : <span className="status-label">{request.status.replace("_", " ")}</span>}</div></div></article>; }
