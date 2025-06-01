import React, { useState, useRef, useEffect } from "react";

const defaultWelcome = "Xin chào! Tôi có thể giúp gì cho bạn?";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: defaultWelcome }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    // Fake bot reply (có thể thay bằng API call)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Bạn vừa hỏi: " + input }
      ]);
    }, 700);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      {/* Nút mở chatbot */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 9999,
            borderRadius: "50%",
            width: 60,
            height: 60,
            background: "linear-gradient(135deg,#007bff,#28a745)",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            fontSize: 28,
            cursor: "pointer"
          }}
          title="Chat với hỗ trợ"
        >
          <i className="fa fa-comments"></i>
        </button>
      )}

      {/* Khung chatbot */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 340,
            height: 440,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg,#007bff,#28a745)",
              color: "#fff",
              padding: "16px 20px",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            Chatbot hỗ trợ
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 22,
                cursor: "pointer"
              }}
              title="Đóng"
            >
              ×
            </button>
          </div>
          <div
            style={{
              flex: 1,
              padding: "16px 12px",
              overflowY: "auto",
              background: "#f8f9fa"
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: 8
                }}
              >
                <div
                  style={{
                    background: msg.from === "user" ? "#007bff" : "#e9ecef",
                    color: msg.from === "user" ? "#fff" : "#222",
                    borderRadius: 16,
                    padding: "8px 14px",
                    maxWidth: "75%",
                    fontSize: 15,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div
            style={{
              padding: 12,
              borderTop: "1px solid #e9ecef",
              background: "#fff",
              display: "flex"
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ borderRadius: 16, marginRight: 8, fontSize: 15 }}
            />
            <button
              className="btn btn-success"
              onClick={handleSend}
              style={{ borderRadius: 16, fontWeight: 500 }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;