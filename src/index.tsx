import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Unregister all service workers to ensure the latest one is used.
// This is a temporary measure to clear out old service workers from clients.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
