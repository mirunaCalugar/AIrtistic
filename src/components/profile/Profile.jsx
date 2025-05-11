// src/components/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import PostModal from "../modals/PostModal";

const BACKEND_URL = "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const postFileInputRef = useRef(null);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "",
    avatarUrl: "/user.png",
  });
  const [posts, setPosts] = useState([]);
  const [searchTag, setSearchTag] = useState("");

  // Modals state
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Fetch profile and posts on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Load profile
    fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(({ user }) =>
        setUser((prev) => ({
          ...prev,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
            ? `${BACKEND_URL}${user.avatarUrl}`
            : prev.avatarUrl,
        }))
      )
      .catch(console.error);

    // Load posts
    fetch(`${BACKEND_URL}/api/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => setPosts(data.posts))
      .catch(console.error);
  }, [navigate]);

  // Avatar upload
  const handleAvatarUpload = (file) => {
    if (!file) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);

    fetch(`${BACKEND_URL}/auth/profile/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Avatar upload failed");
        return res.json();
      })
      .then(({ avatarUrl }) => {
        setUser((u) => ({ ...u, avatarUrl: `${BACKEND_URL}${avatarUrl}` }));
        setIsAvatarModalOpen(false);
      })
      .catch(console.error);
  };

  // New post handlers
  const handleNewFile = (file) => {
    if (!file) return;
    setNewImageUrl(URL.createObjectURL(file));
    setIsPostModalOpen(true);
  };
  const onAvatarFileChange = (e) => handleAvatarUpload(e.target.files[0]);
  const onNewFileChange = (e) => handleNewFile(e.target.files[0]);
  const handlePostAdded = (newPost) => setPosts((prev) => [newPost, ...prev]);

  // Like handler
  const handleLike = (id) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

  // Filter posts by tag name
  const filteredPosts = posts.filter((post) =>
    post.tags.some((tagObj) =>
      tagObj.name.toLowerCase().includes(searchTag.toLowerCase())
    )
  );

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="user-info">
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="avatar"
            onClick={() => setIsAvatarModalOpen(true)}
          />
          <div className="details">
            <h2 className="username">{user.fullName || "–"}</h2>
            <div className="sub-details">
              <span className="email">{user.email}</span>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Avatar modal */}
      {isAvatarModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              ×
            </button>
            <img
              src={user.avatarUrl}
              alt="Current avatar"
              className="modal-avatar"
            />
            <button
              className="change-photo-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Change photo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={onAvatarFileChange}
            />
          </div>
        </div>
      )}

      {/* Add post UI */}
      <button
        className="view-more-btn"
        onClick={() => postFileInputRef.current.click()}
      >
        Adaugă postare
      </button>
      <input
        type="file"
        accept="image/*"
        ref={postFileInputRef}
        style={{ display: "none" }}
        onChange={onNewFileChange}
      />
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        imageUrl={newImageUrl}
        onPosted={handlePostAdded}
      />

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by tags..."
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="search-input"
        />
        <div className="view-modes">
          <button className="mode-btn grid-mode">🔳</button>
          <button className="mode-btn list-mode">📋</button>
        </div>
      </div>

      {/* Posts list */}
      <div className="posts-container">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <img
              src={post.image || post.image_url}
              alt="Post"
              className="post-image"
            />
            <div className="post-info">
              <div className="tags">
                {post.tags.map((tagObj) => (
                  <span key={tagObj.id} className="tag">
                    #{tagObj.name}
                  </span>
                ))}
              </div>
              <div className="like-section">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`like-button ${post.likes > 0 ? "liked" : ""}`}
                >
                  ❤️
                </button>
                <span className="like-count">{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="view-more-btn">
        View more ({posts.length - filteredPosts.length})
      </button>
    </div>
  );
};

export default Profile;
