import { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import CommentSection from "../components/CommentSection";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedComments, setExpandedComments] = useState({});

  // Fetch posts with pagination
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get(`/api/posts?page=${page}&limit=10`);
      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setTotalPages(data.pages);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle like toggle
  const handleLike = async (postId) => {
    try {
      const { data } = await API.post(`/api/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: data.likes } : p
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Handle comment added — update local state with new comments array
  const handleCommentAdded = (postId, comments) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, comments } : p))
    );
  };

  // Toggle comment section visibility
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Prepend newly created post to feed
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <Container style={{ maxWidth: 640 }} className="py-4">
      {user && <CreatePost onPostCreated={handlePostCreated} />}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && page === 1 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p style={{ fontSize: 18 }}>No posts yet.</p>
          {user && <p>Be the first to create a post!</p>}
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post._id}>
              <PostCard
                post={post}
                onLike={handleLike}
                onComment={toggleComments}
              />
              {expandedComments[post._id] && (
                <div className="mb-4" style={{ marginTop: -16 }}>
                  <div
                    className="shadow-sm p-3"
                    style={{
                      borderRadius: "0 0 16px 16px",
                      border: "none",
                      background: "#f8f9fa",
                    }}
                  >
                    <CommentSection
                      postId={post._id}
                      comments={post.comments}
                      onCommentAdded={(comments) =>
                        handleCommentAdded(post._id, comments)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Load more button */}
          {page < totalPages && (
            <div className="text-center mt-3">
              <Button
                variant="outline-primary"
                className="rounded-pill px-4"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Feed;
