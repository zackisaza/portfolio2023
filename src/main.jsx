// Build version: 2025.11.05-3
import React from 'react'
import ReactDOM from 'react-dom/client'

// Ensure React is globally available for Three.js compatibility
if (typeof window !== 'undefined') {
  window.React = React;
  window.ReactDOM = ReactDOM;
}
import App from "./App.jsx";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { wolfcave } from "./assets";

// Ensure favicon has white background using canvas so it looks clean in dark tabs
const ensureFavicon = () => {
  try {
    const size = 64; // favicon base size
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const img = new Image();
  img.src = wolfcave;
    img.onload = () => {
      // Maintain aspect ratio, fit within canvas with small padding
      const padding = 6;
      const maxW = size - padding * 2;
      const maxH = size - padding * 2;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const drawW = Math.round(img.width * scale);
      const drawH = Math.round(img.height * scale);
      const dx = Math.round((size - drawW) / 2);
      const dy = Math.round((size - drawH) / 2);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, dx, dy, drawW, drawH);

      let link = document.querySelector("link[rel='icon']");
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'icon');
        document.head.appendChild(link);
      }
      link.setAttribute('type', 'image/png');
      link.setAttribute('href', canvas.toDataURL('image/png'));
    };
  } catch (e) {
    // no-op
  }
};

ensureFavicon();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
