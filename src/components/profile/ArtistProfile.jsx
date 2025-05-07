import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Profile.css";

const BACKEND_URL = "http://localhost:5000";

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/artists/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Artist not found");
        return res.json();
      })
      .then((data) => {
        setArtist(data.artist);
      })
      .catch((err) => {
        console.error(err);
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <p>Loading artist…</p>;
  if (!artist) return <p>Artist not found</p>;

  // Determine avatar source with fallback
  const avatarSrc = artist.avatarUrl
    ? `${BACKEND_URL}${artist.avatarUrl}`
    : "/user.png";

  // Example posts data structure; replace with real fetch if needed
  const posts = artist.posts || [];
  const filteredPosts = posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
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
