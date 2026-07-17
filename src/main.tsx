import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global safeguard for pointer lock requests to catch and ignore rapid-request/rate-limit errors gracefully
const originalRequestPointerLock = HTMLElement.prototype.requestPointerLock;
if (originalRequestPointerLock) {
  HTMLElement.prototype.requestPointerLock = function (this: HTMLElement, options?: any): any {
    try {
      const result = originalRequestPointerLock.call(this, options);
      if (result && typeof result.catch === 'function') {
        return result.catch((err: any) => {
          console.warn('Pointer lock request rejected gracefully:', err);
        });
      }
      return result;
    } catch (err) {
      console.warn('Pointer lock request failed synchronously:', err);
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

