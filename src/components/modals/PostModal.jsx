// src/components/PostModal.jsx
import React, { useState } from "react";
import "./PostModal.css";

export default function PostModal({ isOpen, onClose, file, onPosted }) {
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("No file selected to post.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(
        tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload post");
      const { post, tags: returnedTags } = await response.json();
      onPosted({ ...post, tags: returnedTags });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Eroare la postare: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Adaugă descriere și tag-uri</h2>
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="modal-preview"
          />
        )}
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            className="modal-form"
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
            <button type="submit" className="btn save-btn" disabled={loading}>
              {loading ? "Se încarcă..." : "Publică"}
            </button>
            <button
              type="button"
              className="btn cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
