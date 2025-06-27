// src/components/ArtistChoice.jsx
import React from "react";
import "./ArtistChoice.css";

/**
 * Thumbnail component for Explore page.
 * Props:
 *  - image: string (URL of the image)
 *  - onVisit: function to call when clicked
 */
const ArtistChoice = ({ image, onVisit }) => {
  return (
    <div
      className="artist-choice-card"
      onClick={onVisit}
      style={{ cursor: "pointer" }}
    >
      <img
        src={image}
        alt="Artwork thumbnail"
        className="artist-choice-image"
      />
    </div>
  );
};

export default ArtistChoice;
