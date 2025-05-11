import React, { useState, useEffect } from "react";
import "./ChatAI.css";
import PostModal from "../modals/PostModal";

export default function ChatAI() {
  // Exemple de prompturi predefinite
  const examples = [
    {
      icon: "?",
      text: "Industrial Revolution's impact on geopolitics.",
      prompt: "What was the Industrial Revolution's impact on geopolitics?",
    },
    {
      icon: "✏️",
      text: "HD wallpaper of a cat licking its paw.",
      prompt: "Create an HD wallpaper of a cat licking its paw.",
    },
    {
      icon: "</>",
      text: "HTTP request în JavaScript?",
      prompt: "How do I make an HTTP request in JavaScript?",
    },
    {
      icon: "📍",
      text: "Istoria Turnului Eiffel.",
      prompt: "Tell me about the history of the Eiffel Tower.",
    },
    {
      icon: "💡",
      text: "Poem despre natură.",
      prompt: "Write a short poem about the beauty of nature.",
    },
  ];

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal preview imagine
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  // Modal postare
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("chat-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(history));
  }, [history]);

  const sendMessage = async (overridePrompt) => {
    const prompt = overridePrompt ?? input;
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: prompt }]);
    setLoading(true);
    setInput("");

    try {
      const resp = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(text || "Server error");
      const data = JSON.parse(text);

      if (data.reply) {
        setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
      }
      if (data.imageUrl) {
        setMessages((prev) => [
          ...prev,
          { from: "bot", imageUrl: data.imageUrl },
        ]);
      }

      setHistory((prev) => [
        ...prev,
        { id: Date.now(), title: prompt.slice(0, 20) + "...", when: "Today" },
      ]);
    } catch (err) {
      console.error("Fetch error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Eroare de rețea sau server: " + err.message },
      ]);
    }

    setLoading(false);
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
  };

  const loadChat = (id) => alert(`Load chat ${id} nu e încă implementat.`);
  const handleExampleClick = (prompt) => sendMessage(prompt);

  // Preview modal handlers
  const openModal = (url) => {
    setModalImageUrl(url);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl(null);
  };

  // Save imagine
  const handleSave = () => {
    const proxyUrl = `http://localhost:5000/api/download?url=${encodeURIComponent(
      modalImageUrl
    )}`;
    const a = document.createElement("a");
    a.href = proxyUrl;
    let ext = modalImageUrl.split(".").pop().split("?")[0];
    if (ext === "jpeg") ext = "jpg";
    a.download = `ai-image.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Activa modal postare
  const onPostClick = (url) => {
    setPendingImage(url);
    setShowModal(false);
    setPostModalOpen(true);
  };

  const handlePostCompleted = (newPost) => {
    // Poți actualiza un feed local sau redirect
    console.log("Post nou creat:", newPost);
    setPostModalOpen(false);
  };

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <h2>AIChat</h2>
        <button className="new-chat" onClick={startNewChat}>
          + New chat
        </button>
        <div className="history">
          <h3>Today</h3>
          {history
            .filter((h) => h.when === "Today")
            .map((item, i) => (
              <div
                key={i}
                className="history-item"
                onClick={() => loadChat(item.id)}
              >
                <span>{item.title}</span>
                <small>{item.when}</small>
              </div>
            ))}
          <h3>Previous 7 days</h3>
          {history
            .filter((h) => h.when !== "Today")
            .map((item, i) => (
              <div
                key={i}
                className="history-item"
                onClick={() => loadChat(item.id)}
              >
                <span>{item.title}</span>
                <small>{item.when}</small>
              </div>
            ))}
        </div>
      </aside>

      <main className="main-area">
        {messages.length === 0 ? (
          <>
            <h1>Ask everything you want!</h1>
            <div className="examples">
              {examples.map((ex, i) => (
                <div
                  key={i}
                  className="example-card"
                  onClick={() => handleExampleClick(ex.prompt)}
                >
                  <span className="icon">{ex.icon}</span>
                  <p>{ex.text}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.from}`}>
                {m.text && <p>{m.text}</p>}
                {m.imageUrl && (
                  <img
                    src={m.imageUrl}
                    alt="Generated"
                    className="chat-image"
                    onClick={() => openModal(m.imageUrl)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="input-bar">
          <input
            type="text"
            placeholder="Scrie mesajul..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading}
          >
            ➤
          </button>
        </div>

        <small className="notice">
          StormBot may produce inaccurate information about people, places, or
          fact. <a href="#">Privacy Notice</a>
        </small>
      </main>

      {/* Preview Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-frame">
              <img src={modalImageUrl} alt="Preview" className="modal-image" />
            </div>
            <div className="modal-actions">
              <button onClick={handleSave} className="btn save-btn">
                Salvează
              </button>
              <button
                onClick={() => onPostClick(modalImageUrl)}
                className="btn post-btn"
              >
                Postează
              </button>
              <button onClick={closeModal} className="btn cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      <PostModal
        isOpen={isPostModalOpen}
        imageUrl={pendingImage}
        onClose={() => setPostModalOpen(false)}
        onPosted={handlePostCompleted}
      />
    </div>
  );
}
