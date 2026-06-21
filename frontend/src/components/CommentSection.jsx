import { useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
import API from "../api/axios";

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setLoading(true);
      const { data } = await API.post(`/api/posts/${postId}/comment`, {
        text: text.trim(),
      });
      setText("");
      onCommentAdded(data.comments);
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-top">
      <Form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
        <Form.Control
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="sm"
          style={{ borderRadius: 20 }}
        />
        <Button
          variant="primary"
          type="submit"
          size="sm"
          disabled={loading || !text.trim()}
          className="rounded-pill px-3"
        >
          {loading ? "..." : "Post"}
        </Button>
      </Form>

      {comments.length > 0 ? (
        <ListGroup variant="flush">
          {comments.map((c, idx) => (
            <ListGroup.Item
              key={idx}
              className="px-0 py-2"
              style={{ background: "transparent", borderBottom: "1px solid #f0f0f0" }}
            >
              <strong style={{ fontSize: 13 }}>{c.username}</strong>
              <span className="ms-2" style={{ fontSize: 13 }}>{c.text}</span>
              <div className="text-muted" style={{ fontSize: 11 }}>
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="text-muted small">No comments yet.</div>
      )}
    </div>
  );
};

export default CommentSection;
