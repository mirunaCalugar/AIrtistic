import React from "react";
import "./ArtistCard.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { FiExternalLink } from "react-icons/fi";
import { LuBadgeCheck } from "react-icons/lu";

const ArtistCard = ({ id, name, image, isVerified, onVisit }) => {
  const navigate = useNavigate();
  return (
    <div className="artist-card">
      <img src={image} alt={name} className="artist-image" />

      <div className="artist-info">
        <div className="artist-name">
          {name}
          {isVerified && <span className="artist-badge">Top artist</span>}
        </div>

        <button className="visit-btn" onClick={() => navigate(`/artist/${id}`)}>
          Visit →
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
