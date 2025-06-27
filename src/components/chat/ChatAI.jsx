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
  const [pendingFile, setPendingFile] = useState(null);

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
      if (data.history) setHistory(data.history);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Eroare la server: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onPostClick = async (url) => {
    setLoading(true);
    setShowModal(false);
    try {
      const proxyUrl = `http://localhost:5000/api/download?url=${encodeURIComponent(
        url
      )}`;
      const resp = await fetch(proxyUrl);
      const blob = await resp.blob();
      const file = new File([blob], "ai-generated.png", { type: blob.type });
      setPendingFile(file);
      setPostModalOpen(true);
    } catch (err) {
      console.error("Error preparing post file:", err);
      alert("Nu s-a putut pregăti imaginea pentru postare.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostCompleted = (newPost) => {
    console.log("Post nou creat:", newPost);
    setPostModalOpen(false);
    setPendingFile(null);
  };

  const startNewChat = () => {
    setMessages([]);
    setHistory([]);
  };

  const loadChat = (id) => alert(`Load chat ${id} nu e încă implementat.`);
  const handleExampleClick = (prompt) => sendMessage(prompt);

  const openModal = (url) => {
    setModalImageUrl(url);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl(null);
  };

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

  return (
    <div className="chat-app">
      {loading && (
        <div className="modal-overlay">
          <div className="loader">
            <span className="loader-text">loading</span>
            <span className="load"></span>
          </div>
        </div>
      )}

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
            <h1 onClick={startNewChat}>Ask everything you want!</h1>
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
        ) : null}

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

        <div className="input-bar">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading}
          >
            ➤
          </button>
        </div>
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
        file={pendingFile}
        onClose={() => setPostModalOpen(false)}
        onPosted={handlePostCompleted}
      />
    </div>
  );
}
