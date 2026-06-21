const express = require("express");
const multer = require("multer");
const { cloudinary } = require("../config/cloudinary");
const Post = require("../models/Post");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Multer setup — store upload in memory so we can send buffer to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// POST /api/posts — create a post (auth required)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = null;

    // Validate: at least one of text or image must be present
    if (!text && !req.file) {
      return res
        .status(400)
        .json({ message: "Post must contain text, an image, or both" });
    }

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "mini-social-posts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      author: req.user.id,
      authorUsername: req.user.username,
      text: text || undefined,
      imageUrl,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "username"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/posts — public feed with pagination
// Query params: page (default 1), limit (default 10)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username");

    const total = await Post.countDocuments();

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/:id/like — toggle like (auth required)
router.post("/:id/like", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const username = req.user.username;
    const index = post.likes.indexOf(username);

    if (index === -1) {
      post.likes.push(username);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes, likesCount: post.likes.length });
  } catch (error) {
    console.error("Like toggle error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts/:id/comment — add comment (auth required)
router.post("/:id/comment", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      username: req.user.username,
      text: text.trim(),
    });

    await post.save();
    res.json({ comments: post.comments, commentsCount: post.comments.length });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
