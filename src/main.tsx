import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// --- CLEANUP: Leaflet CSS Removed to ensure MapTiler Visual Integrity ---

/**
 * NATIONAL GRID BOOTSTRAPPER
 * This file mounts the React Virtual DOM to the Physical DOM.
 * StrictMode is maintained to ensure 2026-grade code quality and catch concurrency bugs.
 */
const mountNode = document.getElementById("root");

if (!mountNode) {
  // Critical Failure: System cannot mount if index.html is corrupted
  console.error("CRITICAL ERROR: National Grid Root Element not detected.");
  throw new Error("Bootstrap Failed: Root element missing.");
}

const root = createRoot(mountNode);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * CSE SYSTEM NOTE:
 * The hydration process completes here. 
 * The 'initial-loader' defined in index.html will be removed by 
 * the window 'load' listener once all assets are finalized.
 */