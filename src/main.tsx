import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const passwordKey = 'authenticated';

const stored = sessionStorage.getItem(passwordKey);

const init = () => {
  if (!stored) {
    const password = prompt('🔒 Enter password to access:');

    const correct = import.meta.env.VITE_APP_PASSWORD;

    if (password !== correct) {
      alert('❌ Incorrect password. Reload the page to try again.');
      return;
    }

    sessionStorage.setItem(passwordKey, 'true');
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

init();
