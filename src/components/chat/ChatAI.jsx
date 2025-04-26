import React from "react";
import "./ChatAI.css";

export default function ChatAI() {
  const examples = [
    { icon: "?", text: "Industrial Revolution's impact on geopolitics." },
    { icon: "✏️", text: "Create an HD wallpaper cat licking paw images." },
    { icon: "</>", text: "HTTP request in JavaScript?" },
    { icon: "📍", text: "Tell me about the history of the Eiffel Tower." },
    { icon: "💡", text: "Write a short poem about the beauty of nature." },
  ];
  const history = [
    { title: "Helpful AI Ready", when: "Today" },
    { title: "Greenhouse Effect Expla…", when: "Today" },
    { title: "Movie Streaming Help", when: "Today" },
    { title: "Web Design Workflow", when: "Previous 7 days" },
    { title: "Photo generation", when: "Previous 7 days" },
    { title: "Cats eat grass", when: "Previous 7 days" },
    { title: "Weather Dynamics", when: "Previous 7 days" },
  ];

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <h2>AIChat</h2>
        <button className="new-chat">+ New chat</button>
        <div className="history">
          {history.map((item, i) => (
            <div key={i} className="history-item">
              <span>{item.title}</span>
              <small>{item.when}</small>
            </div>
          ))}
        </div>
        {/* <div className="upgrade">
          <img src="https://via.placeholder.com/40" alt="User avatar" />
          <div>
            <strong>Emily</strong>
            <button className="upgrade-btn">Upgrade to Pro</button>
          </div>
        </div> */}
      </aside>
      <main className="main-area">
        <h1>Ask everything you want!</h1>
        <div className="examples">
          {examples.map((ex, i) => (
            <div key={i} className="example-card">
              <span className="icon">{ex.icon}</span>
              <p>{ex.text}</p>
            </div>
          ))}
        </div>
        <div className="input-bar">
          <input
            type="text"
            placeholder="Create an HD wallpaper cat licking paw images"
          />
          <button className="send-btn">➤</button>
        </div>
        <small className="notice">
          StormBot may produce inaccurate information about people, places, or
          fact. <a href="#">Privacy Notice</a>
        </small>
      </main>
    </div>
  );
}
