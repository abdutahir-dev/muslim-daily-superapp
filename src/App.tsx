import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { SuperAppShell } from "./superapp/SuperAppShell";

/**
 * Root Application Entry Point
 * Wraps the SuperApp Shell with Global Auth & Persistence Provider
 */
export default function App() {
  return (
    <AuthProvider>
      <SuperAppShell />
    </AuthProvider>
  );
}

