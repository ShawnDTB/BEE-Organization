import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/commerce.css';
import './styles/commerce-polish.css';
import './styles/shop-v2.css';
import './styles/studio.css';
import './styles/density.css';
import './styles/footer-v2.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
