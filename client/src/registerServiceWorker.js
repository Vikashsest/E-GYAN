export function registerSW({ onUpdate }) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          if (registration.waiting && onUpdate) {
            onUpdate(registration);
          }

          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            newWorker.onstatechange = () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                onUpdate && onUpdate(registration);
              }
            };
          };
        })
        .catch(err => console.error('SW registration failed:', err));
    });
  }
}
