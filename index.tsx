import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React failed to mount:", error);
    container.innerHTML = `<div style="padding:20px; color:red; font-family:sans-serif;">Application error on mount. Please check the console.</div>`;
  }
} else {
  console.error("Root element not found.");
}