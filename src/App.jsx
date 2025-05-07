import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeroSection from "./components/herosection/HeroSection";
import SignUp from "./components/signup/SignUp";
import Login from "./components/login/Login";
import Explore from "./components/explore/Explore";
import ChatAI from "./components/chat/ChatAI";
import Profile from "./components/profile/Profile";
import ArtistProfile from "./components/profile/ArtistProfile";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/chatAI" element={<ChatAI />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
