import React from "react";
import "./HeroSection.css";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/chatAI");
  };

  return (
    <section className="hero">
      <div className="hero-image">
        <h1>Unleash Your Creativity</h1>
        <h3>Transform ideas into stunning AI-generated art</h3>
        <div className="button-div">
          <button className="btn-hero" onClick={handleClick}>
            Create Art Now
          </button>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
