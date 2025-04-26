import React from "react";
import "./ArtistCard.css";

import { FiExternalLink } from "react-icons/fi";
import { LuBadgeCheck } from "react-icons/lu";

const ArtistCard = ({ name, image, isVerified, onVisit }) => {
  return (
    <div className="artist-card">
      <img src={image} alt={name} className="artist-image" />

      <div className="artist-info">
        <div className="artist-name">
          {name}
          {isVerified && <span className="artist-badge">Top artist</span>}
        </div>

        <button className="visit-btn" onClick={onVisit}>
          Visit →
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
