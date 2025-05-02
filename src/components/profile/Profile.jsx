import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    fullName: "Brenda Gardner",
    email: "example@email.com",
    role: "Top Artist",
    avatarUrl: "https://via.placeholder.com/80",
  });
  const [posts, setPosts] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["art", "design"],
    },
    // …
  ]);
  const [searchTag, setSearchTag] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/auth/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setUser((prev) => ({
          ...prev,
          fullName: data.user.fullName,
          email: data.user.email,
          role: data.user.role || prev.role,
          avatarUrl: data.user.avatarUrl || prev.avatarUrl,
        }));
      })
      .catch((err) => console.error(err));
  }, []);

  // Upload handler (folosit de modal)
  const handleAvatarUpload = (file) => {
    if (!file) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);
    fetch("http://localhost:5000/auth/profile/avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Avatar upload failed");
        return res.json();
      })
      .then(({ avatarUrl }) => {
        setUser((u) => ({ ...u, avatarUrl }));
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    handleAvatarUpload(file);
  };

  const handleLike = (id) =>
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );

  const filteredPosts = posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
  );

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="user-info">
          {/* Avatar click deschide modal */}
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="avatar"
            onClick={openModal}
            style={{ cursor: "pointer" }}
          />
          <div className="details">
            <h2 className="username">{user.fullName}</h2>
            <div className="sub-details">
              <span className="email">{user.email}</span>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Modal */}
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
            {/* Hidden file input */}
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
