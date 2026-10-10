import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element for the app.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log('[Service Worker] Stale cache anchor released.');
        }).catch(() => {
          console.debug('[Service Worker] Cleanup ignored.');
        });
      }
    })
    .catch((err) => {
      console.debug('[Service Worker] Cleanup ignored:', err);
    });
}
