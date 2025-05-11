import React, { useState } from "react";
import "./PostModal.css";

export default function PostModal({ isOpen, onClose, imageUrl, onPosted }) {
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      imageUrl,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    const token = localStorage.getItem("token");
    const resp = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (resp.ok) {
      const { post, tags } = await resp.json();
      onPosted({ ...post, tags });
      onClose();
    } else {
      alert("Eroare la postare");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Adaugă descriere și tag-uri</h2>
        <img src={imageUrl} alt="To post" className="modal-preview" />
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            placeholder="Descriere…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tag-uri separate prin virgulă"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit" className="btn save-btn">
              Publică
            </button>
            <button type="button" className="btn cancel-btn" onClick={onClose}>
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
