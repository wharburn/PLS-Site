import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/AppNew.tsx';

// Ensure we wait for DOM
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container) {
      try {
        const root = createRoot(container);
        root.render(
          <App />
        );
        console.log("React mounted successfully to #root");
      } catch (error) {
        console.error("React failed to mount:", error);
      }
    } else {
      console.error("Root element #root not found.");
    }
});
