  import { io, Socket } from "socket.io-client";

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

  let socket: Socket | null = null;

  export const initializeSocket = (token: string) => {
    //  Don't recreate if already connected
    if (socket?.connected) {
      console.log(" Socket already connected");
      return socket;
    }

    //  Disconnect old socket if exists but not connected
    if (socket) {
      socket.disconnect();
    }

    console.log("🔌 Creating socket connection...");

    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true, //  Auto-connect on creation
      reconnection: true, //  Enable auto-reconnection
      reconnectionAttempts: 5, //  Try 5 times
      reconnectionDelay: 1000, //  Wait 1s between attempts
    });

    socket.on("connect", () => {
      console.log(" Connected to Socket.IO server, ID:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log(" Disconnected from Socket.IO server:", reason);
      
      //  Auto-reconnect on unexpected disconnect
      if (reason === "io server disconnect") {
        console.log(" Server disconnected socket, reconnecting...");
        socket?.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error(" Socket connection error:", error.message);
    });

    //  Add reconnection handlers
    socket.on("reconnect_attempt", (attempt) => {
      console.log(` Reconnection attempt ${attempt}...`);
    });

    socket.on("reconnect", (attempt) => {
      console.log(` Reconnected after ${attempt} attempts`);
    });

    socket.on("reconnect_failed", () => {
      console.error(" Reconnection failed after all attempts");
    });

    return socket;
  };

  export const disconnectSocket = () => {
    if (socket) {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
      socket = null;
    }
  };

  export const getSocket = () => socket;

  export const listenToKYCUpdates = (
    
    onApproved: (data) => void, //  Added type
    onRejected: (data) => void  //  Added type
  ) => {
    if (!socket) {
      console.warn("⚠️ Socket not initialized");
      return;
    }

    console.log("👂 Listening for KYC updates...");

    //  Remove old listeners first to prevent duplicates
    socket.off("kyc:document-approved");
    socket.off("kyc:document-rejected");

    //  Add new listeners

    socket.on("kyc:document-approved", (data) => {
      console.log(" Received document-approved event:", data);
      onApproved(data);
    });

    socket.on("kyc:document-rejected", (data) => {
      console.log(" Received document-rejected event:", data);
      onRejected(data);
    });
  };

  export const removeKYCListeners = () => {
    if (!socket) return;

    console.log("🔇 Removing KYC listeners...");
    socket.off("kyc:document-approved");
    socket.off("kyc:document-rejected");
  };

  export const listenToAdminKYCUpdates = (
    onDocumentUploaded: (data) => void,
    onDocumentApproved: (data) => void,
    onDocumentRejected: (data) => void
  ) => {
    if (!socket) {
      console.warn("⚠️ Socket not initialized");
      return;
    }

    console.log("👂 [ADMIN] Listening for KYC updates...");

    // Remove old listeners first
    socket.off("kyc:document-uploaded");
    socket.off("kyc:document-approved");
    socket.off("kyc:document-rejected");

    // Listen for client uploads
    socket.on("kyc:document-uploaded", (data) => {
      console.log("📨 [ADMIN SOCKET] Document uploaded:", data);
      onDocumentUploaded(data);
    });

    // Listen for approvals (for other admins to see)
    socket.on("kyc:document-approved", (data) => {
      console.log("📨 [ADMIN SOCKET] Document approved:", data);
      onDocumentApproved(data);
    });

    // Listen for rejections (for other admins to see)
    socket.on("kyc:document-rejected", (data) => {
      console.log("📨 [ADMIN SOCKET] Document rejected:", data);
      onDocumentRejected(data);
    });
  };

  export const removeAdminKYCListeners = () => {
    if (!socket) return;

    console.log("🔇 [ADMIN] Removing KYC listeners...");
    socket.off("kyc:document-uploaded");
    socket.off("kyc:document-approved");
    socket.off("kyc:document-rejected");
  };

  // ============================================================
  // COMPANY PROFILE LISTENERS
  // ============================================================
  
  export const listenToCompanyUpdates = (
    onCompanyUpdated: (data: any) => void
  ) => {
    if (!socket) {
      console.warn("⚠️ Socket not initialized");
      return;
    }

    console.log("👂 Listening for company profile updates...");

    // Remove old listeners first to prevent duplicates
    socket.off("company:profile-updated");

    socket.on("company:profile-updated", (data) => {
      console.log("📨 Received company-profile-updated event:", data);
      onCompanyUpdated(data);
    });
  };

  export const removeCompanyListeners = () => {
    if (!socket) return;

    console.log("🔇 Removing company listeners...");
    socket.off("company:profile-updated");

  };
