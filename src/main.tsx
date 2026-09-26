import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('two children with the same key')) {
    originalError('[DUPLICATE_KEY_FOUND]', JSON.stringify(args));
  }
  originalError(...args);
};
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Unregister active Service Workers to bypass caching and prevent redirect errors in iframe sandboxes
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then(() => {
        console.log('[Service Worker] Stale cache anchor released.');
      });
    }
  }).catch((err) => {
    console.debug('[Service Worker] Cleanup ignored:', err);
  });
}
