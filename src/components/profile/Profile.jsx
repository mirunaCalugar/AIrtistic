// src/components/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import "../modals/PostModal.css";
import PostModal from "../modals/PostModal";
import EditPostModal from "../modals/EditPostModal";

const BACKEND_URL = "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const postFileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/user.png");
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadAll = async () => {
      try {
        // Fetch user profile
        const profileRes = await fetch(`${BACKEND_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const { user } = await profileRes.json();
        if (!isMounted) return;
        setUser(user);

        // Load avatar blob
        if (user.avatarUrl) {
          const imgRes = await fetch(`${BACKEND_URL}${user.avatarUrl}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (imgRes.ok) {
            const blob = await imgRes.blob();
            setAvatarUrl(URL.createObjectURL(blob));
          }
        }

        // Fetch posts with like-info
        const postsRes = await fetch(`${BACKEND_URL}/api/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (postsRes.ok) {
          const { posts } = await postsRes.json();
          if (isMounted) {
            setPosts(
              posts.map((p) => ({
                ...p,
                likes: Number(p.likes) || 0,
                liked: Boolean(p.liked),
                tags: Array.isArray(p.tags) ? p.tags : [],
              }))
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadAll();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Avatar handlers
  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
      setSelectedAvatarFile(file);
    }
  };
  const uploadAvatar = async () => {
    if (!selectedAvatarFile) return;
    const formData = new FormData();
    formData.append("avatar", selectedAvatarFile);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/auth/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Avatar upload failed");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // New post
  const onNewFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setIsPostModalOpen(true);
  };
  const handlePostAdded = (newPost) => setPosts((prev) => [newPost, ...prev]);

  // Likes
  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId && !p.liked
          ? { ...p, liked: true, likes: p.likes + 1 }
          : p
      )
    );
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, liked: false, likes: p.likes - 1 } : p
        )
      );
    } else {
      const { likes } = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes } : p))
      );
    }
  };

  const userPosts = posts.filter((p) => p.user_id === user.id);
  const filteredPosts = userPosts.filter(
    (post) =>
      !searchTag.trim() ||
      (post.tags || []).some((tag) =>
        tag.name.toLowerCase().includes(searchTag.toLowerCase())
      )
  );

  if (!user) return <div>Loading profile…</div>;
  <div>Loading profile…</div>;

  return (
    <div className="profile-container">
      {/* Header */}
      <header className="profile-header">
        <div className="user-info">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="avatar"
            onClick={() => setIsAvatarModalOpen(true)}
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

      {/* Avatar modal */}
      {isAvatarModalOpen && (
        <div
          className="avatar-modal-overlay"
          onClick={() => setIsAvatarModalOpen(false)}
        >
          <div
            className="avatar-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="avatar-modal-close"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              ×
            </button>
            <img src={avatarUrl} alt="Avatar" className="avatar-modal-image" />
            <button
              className="avatar-change-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Change photo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={onAvatarChange}
            />
            {selectedAvatarFile && (
              <button className="avatar-upload-btn" onClick={uploadAvatar}>
                Upload
              </button>
            )}
          </div>
        </div>
      )}

      {/* New post trigger */}
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
        onChange={onNewFileSelect}
      />
      <PostModal
        isOpen={isPostModalOpen}
        file={selectedFile}
        onClose={() => setIsPostModalOpen(false)}
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
      </div>

      {/* Posts list */}
      {/* Posts list */}
      <div className="posts-container">
        {filteredPosts.map((post, idx) => (
          <div key={post.id ?? idx} className="post-card">
            <img
              src={post.image || post.image_url}
              alt="Post"
              className="post-image"
              onClick={() => {
                setEditingPost(post);
                setIsEditModalOpen(true);
              }}
            />
            <div className="post-info">
              <div className="tags">
                {post.tags.map((tag, tIdx) => (
                  <span key={tag.id ?? tIdx} className="tag">
                    #{tag.name}
                  </span>
                ))}
              </div>
              <div className="like-section">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`like-button ${post.liked ? "liked" : ""}`}
                  disabled={post.liked}
                >
                  <span className="heart-icon">♥</span>
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

      {isEditModalOpen && editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={(updatedPost) =>
            setPosts((prev) =>
              prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
            )
          }
          onDeleted={(deletedId) =>
            setPosts((prev) => prev.filter((p) => p.id !== deletedId))
          }
        />
      )}
    </div>
  );
};

export default Profile;
