import { io, Socket } from "socket.io-client";

import { getCookie } from "@/hooks/cookies";

// Определяем, находимся ли мы в продакшене (HTTPS)
const isProduction = typeof window !== "undefined" && window.location.protocol === "https:";

// Получаем Socket URL
// В продакшене используем относительный путь через прокси, чтобы избежать Mixed Content
// В разработке используем прямой URL
const getSocketURL = (): string => {
  if (isProduction) {
    // В продакшене используем относительный путь (текущий домен)
    // Socket.IO добавит /api/socket.io/ к этому URL
    return typeof window !== "undefined" ? window.location.origin : "";
  }
  
  // В разработке используем прямой URL
  return (
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3001"
  );
};

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Only get token on client side
    const token = typeof window !== "undefined" ? getCookie("token") : "";

    if (!token) {
      console.warn("⚠️ No token available for socket connection");
    }

    const socketURL = getSocketURL();
    
    // В продакшене используем только polling (HTTP/HTTPS), чтобы избежать Mixed Content
    // В разработке используем websocket и polling
    const transports = isProduction ? ["polling"] : ["websocket", "polling"];

    // Настройки Socket.IO
    const socketOptions: any = {
      transports,
      autoConnect: false,
      auth: {
        token: token || undefined,
      },
      query: {
        token: token || undefined,
      },
    };

    // В продакшене указываем путь через прокси
    // Socket.IO автоматически добавит /socket.io/ к указанному path
    // Если path = "/api", то итоговый путь будет /api/socket.io/
    if (isProduction) {
      // Socket.IO добавит /socket.io/ к этому path
      // Если path = "/api", то итоговый путь будет /api/socket.io/
      socketOptions.path = "/api";
    }

    socket = io(socketURL, socketOptions);

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
    const authToken = typeof socket.auth === "object" && socket.auth !== null && "token" in socket.auth 
      ? (socket.auth as { token?: string }).token 
      : undefined;
    
    if (currentToken && authToken !== currentToken) {
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
