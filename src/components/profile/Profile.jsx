// src/components/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const BACKEND_URL = "http://localhost:5000"; // adaptează dacă ai env var

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "",
    avatarUrl: "/user.png",
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      image: "/user.png",
      likes: 0,
      tags: ["art", "design"],
    },
    // … alte postări
  ]);

  const [searchTag, setSearchTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch profil la mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${BACKEND_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(({ user }) => {
        setUser((prev) => ({
          ...prev,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
            ? `${BACKEND_URL}${user.avatarUrl}`
            : prev.avatarUrl,
        }));
      })
      .catch((err) => {
        console.error(err);
        // dacă vrei, poți redirect /logout
      });
  }, [navigate]);

  // Upload handler
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
        setUser((u) => ({
          ...u,
          avatarUrl: `${BACKEND_URL}${avatarUrl}`,
        }));
        closeModal();
      })
      .catch(console.error);
  };

  // Handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const onFileChange = (e) => handleAvatarUpload(e.target.files[0]);

  const handleLike = (id) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );

  const filteredPosts = posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
  );

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="user-info">
          <img
            src={user.avatarUrl}
            alt="Avatar"
            className="avatar"
            onClick={openModal}
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

      {/* Modal pentru schimbarea avatarului */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
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
              onChange={onFileChange}
            />
          </div>
        </div>
      )}

      {/* Căutare tag-uri */}
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

      {/* Postări */}
      <div className="posts-container">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt="Post" className="post-image" />
            <div className="post-info">
              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
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
