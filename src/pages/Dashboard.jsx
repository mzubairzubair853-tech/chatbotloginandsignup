import React, { useState, useRef, useEffect } from "react";

function Dashboard() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const handleSignOut = () => {
    localStorage.removeItem("zubairUser");
    window.location.reload();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMessage = message.trim();

    if (!userMessage || loading) return;

    const updatedChat = [...chat, { role: "user", text: userMessage }];
    setChat(updatedChat);
    setMessage("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key missing. Check your .env file.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: updatedChat.map((item) => ({
              role: item.role === "ai" ? "model" : "user",
              parts: [{ text: item.text }],
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`);
      }

      const reply = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("");

      if (!reply) throw new Error("AI se reply nahi mila.");

      setChat((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "ai", text: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 100%, #35205e 0%, #17142f 38%, #080b18 78%)",
        fontFamily: "Inter, Arial, sans-serif",
        color: "#fff",
      }}
    >
      <button
        onClick={handleSignOut}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          padding: "7px 12px",
          border: "1px solid rgba(167,139,250,0.4)",
          borderRadius: 9,
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          fontSize: 12,
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        Sign out
      </button>

      <div
        style={{
          position: "absolute",
          top: 58,
          bottom: 82,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(760px, calc(100% - 20px))",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "8px 2px",
          boxSizing: "border-box",
        }}
      >
        {chat.map((item, index) => (
          <div
            key={index}
            style={{
              alignSelf: item.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "10px 13px",
              borderRadius: 15,
              background:
                item.role === "user"
                  ? "linear-gradient(135deg,#7547e8,#5130ae)"
                  : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.09)",
              fontSize: 13,
              lineHeight: 1.55,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {item.text}
          </div>
        ))}

        {loading && (
          <div style={{ color: "#c4b5fd", padding: 7, fontSize: 12 }}>
            Please wait...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(360px, calc(100% - 32px))",
          minHeight: 42,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 5px 4px 10px",
          boxSizing: "border-box",
          borderRadius: 14,
          border: "1px solid rgba(167,139,250,0.38)",
          background: "rgba(20,22,43,0.96)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
          backdropFilter: "blur(20px)",
          zIndex: 1,
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          disabled={loading}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "7px 0",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#fff",
            fontSize: 12,
          }}
        />

        <button
          type="submit"
          disabled={loading || !message.trim()}
          style={{
            flexShrink: 0,
            padding: "7px 10px",
            border: "none",
            borderRadius: 10,
            background: "linear-gradient(135deg,#8b5cf6,#6335d9)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            opacity: loading || !message.trim() ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Dashboard;