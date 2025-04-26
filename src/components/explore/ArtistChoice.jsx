import React from "react";
import "./ArtistChoice.css";

const ArtistChoice = ({ image }) => {
  return (
    <div className="artist-choice-card">
      <img src={image} alt="artist" />
    </div>
  );
};

export default ArtistChoice;
