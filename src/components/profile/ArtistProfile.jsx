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

  // Fetch artist profile and posts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${BACKEND_URL}/artists/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch artist");
        return res.json();
      })
      .then(({ artist, posts }) => {
        setArtist(artist);
        setPosts(posts);
      })
      .catch((err) => {
        console.error(err);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Handle liking a post
  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
      )
    );
  };

  if (loading) return <p>Loading artist…</p>;
  if (!artist) return <p>Artist not found</p>;

  const avatarSrc = artist.avatarUrl
    ? `${BACKEND_URL}${artist.avatarUrl}`
    : "/user.png";

  const filteredPosts = posts.filter((post) =>
    post.tags.some((tag) =>
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
          className="search-input"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
        />
      </div>

      <div className="posts-container">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <img
              src={`${BACKEND_URL}${post.image_url}`}
              alt={`Post ${post.id}`}
              className="post-image"
            />
            <div className="post-info">
              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="tag">
                    #{tag.name}
                  </span>
                ))}
              </div>
              <div className="like-section">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`like-button ${post.likes > 0 ? "liked" : ""}`}
                >
                  <span className="heart-icon">♥</span>
                </button>
                <span className="like-count">{post.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistProfile;
