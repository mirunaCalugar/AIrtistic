// src/components/Explore.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Explore.css";
import ArtistChoice from "./ArtistChoice";
import ArtistCard from "./ArtistCard";

const BACKEND_URL = "http://localhost:5000";

const Explore = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);
  const scrollAuthorsRef = useRef(null);

  // Fetch rising authors
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${BACKEND_URL}/artists`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load rising authors");
        return res.json();
      })
      .then((data) => setAuthors(data.authors))
      .catch(console.error);
  }, []);

  // Fetch all posts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${BACKEND_URL}/api/posts/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load posts");
        return res.json();
      })
      .then((data) => setPosts(data.posts))
      .catch(console.error);
  }, []);

  // Scroll helper
  const scrollRight = (ref) => {
    if (!ref.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = ref.current;
    ref.current.scrollBy({ left: clientWidth, behavior: "smooth" });
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      setTimeout(
        () => ref.current.scrollTo({ left: 0, behavior: "auto" }),
        300
      );
    }
  };

  // Filter authors by search query
  const filteredAuthors = searchQuery.trim()
    ? authors.filter((author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : authors;

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>🧭 Discover</h1>
        <p>Discover new artists, inspiration from other pieces of art</p>
      </div>

      <div className="explore-search">
        <input
          type="text"
          placeholder="Search artists by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button
          className="explore-dropdown"
          onClick={() => {} /* optional action */}
        >
          Search
        </button>
      </div>

      {/* Artists' choice */}
      <div className="section">
        <div className="artists-header">
          <h3>Artists' choice</h3>
          <button className="scroll-btn" onClick={() => scrollRight(scrollRef)}>
            ▶
          </button>
        </div>
        <div className="artists-carousel" ref={scrollRef}>
          {posts.length === 0 && <p>Loading posts...</p>}
          {posts
            .filter((p) => p.image && p.image.startsWith("/uploads/posts"))
            .sort(() => 0.5 - Math.random())
            .slice(0, 12)
            .map((p) => (
              <ArtistChoice
                key={p.id}
                image={`${BACKEND_URL}${p.image}`}
                onVisit={() => navigate(`/artist/${p.user_id}`)}
              />
            ))}
        </div>
      </div>

      {/* Rising authors */}
      <div className="section">
        <div className="authors-header">
          <h3>Rising authors</h3>
          <button
            className="scroll-btn"
            onClick={() => scrollRight(scrollAuthorsRef)}
          >
            ▶
          </button>
        </div>
        <div className="authors-carousel" ref={scrollAuthorsRef}>
          {filteredAuthors.length === 0 ? (
            <p>No artists found.</p>
          ) : (
            filteredAuthors.map((author) => (
              <ArtistCard
                key={author.id}
                id={author.id}
                name={author.name}
                image={
                  author.image && author.image.startsWith("/uploads/")
                    ? `${BACKEND_URL}${author.image}`
                    : author.image || "/user.png"
                }
                isVerified={author.isVerified}
                onVisit={() => navigate(`/artist/${author.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
