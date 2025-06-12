import React from "react";

export default function SessionWarningModal({ onExtend, onLogout }) {
    console.log("Rendering modal")
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <p>⚠️ You will be logged out in 5 minutes due to inactivity.</p>
        <button
          onClick={onExtend}
          style={{ marginRight: 10, padding: "8px 16px" }}
        >
          Extend Session 60 min
        </button>
        <button onClick={onLogout} style={{ padding: "8px 16px" }}>
          Logout Now
        </button>
      </div>
    </div>
  );
}
