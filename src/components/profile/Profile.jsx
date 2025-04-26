import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const user = {
    name: "Brenda Gardner",
    email: "example@email.com",
    role: "Top Artist",
    avatar: "https://via.placeholder.com/80",
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["art", "design"],
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["photography"],
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["art", "abstract"],
    },
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["art", "design"],
    },
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["art", "design"],
    },
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["art", "design"],
    },
    {
      id: 1,
      image: "https://via.placeholder.com/300",
      likes: 0,
      tags: ["art", "design"],
    },
    // ... more posts
  ]);

  const [searchTag, setSearchTag] = useState("");

  const handleLike = (id) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const filteredPosts = posts.filter((post) =>
    post.tags.some((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()))
  );

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="user-info">
          <img src={user.avatar} alt="avatar" className="avatar" />
          <div className="details">
            <h2 className="username">{user.name}</h2>
            <div className="sub-details">
              <span className="email">{user.email}</span>
              <span className="role-badge">{user.role}</span>
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
