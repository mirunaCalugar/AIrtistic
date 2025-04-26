// Explore.jsx
import React, { useRef } from "react";
import "./Explore.css";
import ArtistChoice from "./ArtistChoice";
import ArtistCard from "./ArtistCard";

const artistData = [
  { image: "src/assets/art1.jpg" },
  { image: "src/assets/art2.jpg" },
  { image: "src/assets/art3.jpg" },
  { image: "src/assets/art1.jpg" },
  { image: "src/assets/art2.jpg" },
  { image: "src/assets/art3.jpg" },
  { image: "src/assets/art1.jpg" },
  { image: "src/assets/art2.jpg" },
  { image: "src/assets/art3.jpg" },
  { image: "src/assets/art1.jpg" },
  { image: "src/assets/art2.jpg" },
  { image: "src/assets/art3.jpg" },
];
const authors = [
  {
    name: "Alexander Hughes",
    image: "src/assets/author1.jpg",
    isVerified: true,
  },
  {
    name: "Christopher Brown",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
  {
    name: "Sophia Anderson",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
  {
    name: "Sophia Anderson",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
  {
    name: "Sophia Anderson",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
  {
    name: "Sophia Anderson",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
  {
    name: "Sophia Anderson",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
  {
    name: "Sophia Anderson",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
  {
    name: "Sophia Anderson",
    image: "src/assets/author1.jpg",
    isVerified: false,
  },
];

const Explore = () => {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        setTimeout(() => {
          scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
        }, 300);
      }
    }
  };
  const scrollAuthorsRef = useRef(null);

  const scrollAuthorsRight = () => {
    if (scrollAuthorsRef.current) {
      scrollAuthorsRef.current.scrollBy({ left: 300, behavior: "smooth" });

      // Loop reset
      const { scrollLeft, scrollWidth, clientWidth } = scrollAuthorsRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        setTimeout(() => {
          scrollAuthorsRef.current.scrollTo({ left: 0, behavior: "auto" });
        }, 300);
      }
    }
  };

  return (
    <div className="explore-container">
      {/* Header */}
      <div className="explore-header">
        <h1>🧭 Discover</h1>
        <p>Step into a new zone, join a new conversation.</p>
      </div>

      {/* Search */}
      <div className="explore-search">
        <input type="text" placeholder="Search..." />
        <button className="explore-dropdown">Articles ▼</button>
      </div>

      {/* Artists' choice with carousel */}
      <div className="section">
        <div className="artists-header">
          <h3>Artists' choice</h3>
          <button className="scroll-btn" onClick={scrollRight}>
            ▶
          </button>
        </div>
        <div className="artists-carousel" ref={scrollRef}>
          {artistData.map((artist, index) => (
            <ArtistChoice key={index} image={artist.image} />
          ))}
        </div>
      </div>
      <div className="section">
        <div className="authors-header">
          <h3>Rising authors</h3>
          <button className="scroll-btn" onClick={scrollAuthorsRight}>
            ▶
          </button>
        </div>

        <div className="authors-carousel" ref={scrollAuthorsRef}>
          {authors.map((author, idx) => (
            <ArtistCard
              key={idx}
              name={author.name}
              image={author.image}
              isVerified={author.isVerified}
              onVisit={() => console.log("Visit", author.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
