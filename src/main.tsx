import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.info('CampusOS: New version available. Updating in background.');
  },
  onOfflineReady() {
    console.info('CampusOS: Application assets cached for offline operation.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
