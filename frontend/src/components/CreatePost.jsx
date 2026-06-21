import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import API from "../api/axios";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim() && !image) {
      setError("Post must contain text, an image, or both");
      return;
    }

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const { data } = await API.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText("");
      setImage(null);
      setPreview(null);
      onPostCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm mb-4" style={{ borderRadius: 16, border: "none" }}>
      <Card.Body className="p-4">
        <h6 className="fw-bold mb-3">Create a Post</h6>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ borderRadius: 12, resize: "none" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ borderRadius: 12 }}
            />
          </Form.Group>

          {preview && (
            <div className="mb-3 text-center">
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded"
                style={{ maxHeight: 200 }}
              />
            </div>
          )}

          {error && <div className="text-danger mb-2 small">{error}</div>}

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100 rounded-pill"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePost;
