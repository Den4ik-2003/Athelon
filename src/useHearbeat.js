import { useEffect } from "react";

const ONLINE_URL = import.meta.env.VITE_ONLINE_API_URL;

function getSessionId() {
  let id = localStorage.getItem("sessionId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sessionId", id);
  }
  return id;
}

export function useHeartbeat() {
  useEffect(() => {
    const sessionId = getSessionId();

    const sendHeartbeat = () => {
      fetch(`${ONLINE_URL}/api/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          language: navigator.language,
          referrer: document.referrer,
          platform: navigator.platform,
          screenWidth: screen.width,
          screenHeight: screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, []);
}