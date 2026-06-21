import { Card, Button } from "react-bootstrap";
import { FiHeart, FiMessageSquare } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const PostCard = ({ post, onLike, onComment }) => {
  const { user } = useAuth();
  const isLiked = user && post.likes.includes(user.username);

  return (
    <Card className="shadow-sm mb-4" style={{ borderRadius: 16, border: "none" }}>
      <Card.Body className="p-4">
        {/* Author row */}
        <div className="d-flex align-items-center mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold me-2"
            style={{ width: 40, height: 40, fontSize: 18 }}
          >
            {post.authorUsername.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: 14 }}>
              {post.authorUsername}
            </div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Post text */}
        {post.text && <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>{post.text}</p>}

        {/* Post image */}
        {post.imageUrl && (
          <div className="mb-3 text-center">
            <img
              src={post.imageUrl}
              alt="Post"
              className="img-fluid rounded"
              style={{ maxHeight: 400, objectFit: "cover", width: "100%" }}
            />
          </div>
        )}

        {/* Like / Comment actions */}
        <div className="d-flex align-items-center gap-4 pt-2 border-top">
          <Button
            variant={isLiked ? "danger" : "outline-secondary"}
            size="sm"
            className="d-flex align-items-center gap-1 rounded-pill"
            onClick={() => onLike(post._id)}
            disabled={!user}
            style={{ border: "none", fontWeight: isLiked ? 600 : 400 }}
          >
            <FiHeart fill={isLiked ? "currentColor" : "none"} />
            <span>{post.likes.length}</span>
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-flex align-items-center gap-1 rounded-pill"
            onClick={() => onComment(post._id)}
            disabled={!user}
            style={{ border: "none" }}
          >
            <FiMessageSquare />
            <span>{post.comments.length}</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
