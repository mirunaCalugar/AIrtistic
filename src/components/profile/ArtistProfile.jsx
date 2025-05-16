// src/components/ArtistProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Profile.css";

const BACKEND_URL = "http://localhost:5000";

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchTag, setSearchTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        // Fetch artist data
        const artistRes = await fetch(`${BACKEND_URL}/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!artistRes.ok) throw new Error("Failed to fetch artist");
        const { artist } = await artistRes.json();
        setArtist(artist);

        // Fetch this artist's posts
        const postsRes = await fetch(`${BACKEND_URL}/api/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!postsRes.ok) throw new Error("Failed to fetch posts");
        const { posts: artistPosts } = await postsRes.json();
        setPosts(
          artistPosts.map((p) => ({
            ...p,
            likes: Number(p.likes) || 0,
            liked: Boolean(p.liked),
          }))
        );
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleLike = async (postId) => {
    // Determine if we're toggling on or off
    const current = posts.find((p) => p.id === postId);
    const willLike = !current.liked;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: willLike, likes: p.likes + (willLike ? 1 : -1) }
          : p
      )
    );

    const token = localStorage.getItem("token");
    const method = willLike ? "POST" : "DELETE";
    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      // Rollback on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: current.liked, likes: current.likes }
            : p
        )
      );
      return;
    }

    // Optionally sync exact count on success (POST returns {likes}, DELETE may return {likes})
    const data = await res.json();
    if (typeof data.likes === "number") {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
      );
    }
  };

  if (loading) return <p>Loading artist…</p>;
  if (!artist) return <p>Artist not found</p>;

  // Build safe avatar URL
  const avatarRaw = artist.avatarUrl || "/user.png";
  const avatarSrc = avatarRaw.startsWith("http")
    ? avatarRaw
    : `${BACKEND_URL}${avatarRaw.startsWith("/") ? "" : "/"}${avatarRaw}`;

  // Filter by tag
  const filteredPosts = posts.filter(
    (post) =>
      !searchTag.trim() ||
      post.tags?.some((tag) =>
        tag.name.toLowerCase().includes(searchTag.toLowerCase())
      )
  );

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="user-info">
          <img src={avatarSrc} alt={artist.fullName} className="avatar" />
          <div className="details">
            <h2 className="username">{artist.fullName}</h2>
            <div className="sub-details">
              {artist.email && <span className="email">{artist.email}</span>}
              <span className="role-badge">{artist.role || "Artist"}</span>
            </div>
            {artist.bio && <p className="bio">{artist.bio}</p>}
          </div>
        </div>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by tags..."
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="posts-container">
        {filteredPosts.map((post, idx) => {
          // Safe image URL
          const raw = post.image_url || post.image;
          const imgSrc = raw.startsWith("http")
            ? raw
            : `${BACKEND_URL}${raw.startsWith("/") ? "" : "/"}${raw}`;
          return (
            <div key={post.id ?? idx} className="post-card">
              <img
                src={imgSrc}
                alt={`Post ${post.id}`}
                className="post-image"
              />
              <div className="post-info">
                <div className="tags">
                  {post.tags?.map((tag, tIdx) => (
                    <span key={tag.id ?? tIdx} className="tag">
                      #{tag.name}
                    </span>
                  ))}
                </div>
                <div className="like-section">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`like-button ${post.liked ? "liked" : ""}`}
                  >
                    <span className="heart-icon">♥</span>
                  </button>
                  <span className="like-count">{post.likes}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistProfile;
