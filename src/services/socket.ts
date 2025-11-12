import { io, Socket } from "socket.io-client";

import { getCookie } from "@/hooks/cookies";

// Получаем Socket URL из переменных окружения
let SOCKET_URL: string =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3001";

// Если приложение работает на HTTPS (продакшен), а Socket URL использует HTTP,
// автоматически заменяем HTTP на HTTPS для избежания Mixed Content ошибок
if (typeof window !== "undefined" && window.location.protocol === "https:") {
  // Если SOCKET_URL начинается с http://, заменяем на https://
  if (SOCKET_URL.startsWith("http://")) {
    SOCKET_URL = SOCKET_URL.replace("http://", "https://");
  }
}

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Only get token on client side
    const token = typeof window !== "undefined" ? getCookie("token") : "";

    if (!token) {
      console.warn("⚠️ No token available for socket connection");
    }

    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
      auth: {
        token: token || undefined,
      },
      query: {
        token: token || undefined,
      },
    });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message || error);
      if (error.message === "Authentication failed") {
        console.error(
          "🔐 Authentication failed - token may be invalid or expired"
        );
      }
    });
  }

  // Update token if it changed (only on client side)
  if (typeof window !== "undefined") {
    const currentToken = getCookie("token");
    if (currentToken && socket.auth?.token !== currentToken) {
      socket.auth = { token: currentToken };
      socket.io.opts.query = { token: currentToken };
    }
  }

  return socket;
};

export const connectSocket = () => {
  // Only connect on client side and if token exists
  if (typeof window === "undefined") return;

  const token = getCookie("token");
  if (!token) {
    console.warn("⚠️ Cannot connect socket: no token available");
    return;
  }

  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export default getSocket();
