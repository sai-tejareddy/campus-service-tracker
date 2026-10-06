import { useEffect, useState } from "react";
import api from "../api";

export default function RequestDetails({ request, onClose }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/requests/${request.id}/comments`)
      .then((response) => setComments(response.data))
      .catch(() => setError("Could not load comments"));
  }, [request.id]);

  async function addComment(event) {
    event.preventDefault();
    if (!body.trim()) return;
    try {
      const response = await api.post(`/requests/${request.id}/comments`, { body });
      setComments((current) => [...current, response.data]);
      setBody("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add comment");
    }
  }

  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="request-details-title" onClick={(event) => event.stopPropagation()}>
      <div className="modal-heading"><div><span className="category">{request.category}</span><h2 id="request-details-title">{request.title}</h2></div><button className="button button-ghost" onClick={onClose}>Close</button></div>
      <p className="details-description">{request.description}</p>
      <div className="details-meta"><span className={`priority priority-${request.priority.toLowerCase()}`}>{request.priority}</span><span className="status-label">{request.status.replace("_", " ")}</span></div>
      <div className="comments"><h3>Conversation</h3>{comments.length === 0 ? <p className="muted">No comments yet.</p> : comments.map((comment) => <div className="comment" key={comment.id}><strong>{comment.author}</strong><span>{comment.body}</span></div>)}</div>
      <form className="comment-form" onSubmit={addComment}><textarea aria-label="Comment" rows="3" placeholder="Add an update..." value={body} onChange={(event) => setBody(event.target.value)} /><button className="button button-primary">Add comment</button></form>
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  </div>;
}
