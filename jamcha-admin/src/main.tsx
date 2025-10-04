import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './lib/i18n';
import { DirectionProvider } from '@radix-ui/react-direction';

function Root() {
  const { i18n } = useTranslation();
  const dir = i18n.dir?.() || 'ltr';
  return (
    <DirectionProvider dir={dir}>
      <App />
    </DirectionProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Root />
    </I18nextProvider>
  </React.StrictMode>,
)
