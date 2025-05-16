import React, { useState } from "react";
import "./PostModal.css";

const EditPostModal = ({ post, onClose, onUpdated, onDeleted }) => {
  const [description, setDescription] = useState(post.description);
  const [tags, setTags] = useState(post.tags.map((t) => t.name).join(","));
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const res = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description, tags: tagList }),
    });
    if (res.ok) {
      const { post: updated, tags: newTags } = await res.json();
      onUpdated({ ...updated, tags: newTags });
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Sigur vrei să ștergi această postare?")) return;
    const res = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) {
      onDeleted(post.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header>Edit Post</header>
        <div className="modal-body">
          <img
            src={post.image || post.image_url}
            alt="Preview"
            className="modal-preview"
          />
          <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descriere..."
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1,tag2,..."
            />
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="cancel-btn" onClick={handleDelete}>
            Șterge
          </button>
          <button type="button" className="publish-btn" onClick={handleSave}>
            Salvează
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
