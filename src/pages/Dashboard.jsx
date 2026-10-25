import React, { useState } from "react";

function Dashboard() {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log(message);
    setMessage("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 50% 110%, #35205e 0%, #17142f 38%, #080b18 78%)",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          top: "-230px",
          right: "-100px",
          borderRadius: "50%",
          background: "rgba(99, 65, 190, 0.15)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <form
        onSubmit={sendMessage}
        style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(720px, calc(100% - 32px))",
          minHeight: "68px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "9px 10px 9px 24px",
          borderRadius: "24px",
          border: "1px solid rgba(167, 139, 250, 0.38)",
          background: "rgba(20, 22, 43, 0.94)",
          boxShadow:
            "0 12px 45px rgba(0,0,0,0.4), 0 0 25px rgba(124,58,237,0.12)",
          backdropFilter: "blur(20px)",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          style={{
            flex: 1,
            width: "100%",
            minWidth: 0,
            padding: "14px 0",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#ffffff",
            fontSize: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            flexShrink: 0,
            padding: "13px 23px",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "17px",
            background: "linear-gradient(135deg, #8b5cf6, #6335d9)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(109,40,217,0.3)",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Dashboard;