import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react';
import { AppProvider } from './components/context/app.context'
import { RouterProvider } from 'react-router-dom'
import './global.css'
import { router } from '@/router'
import { App, ConfigProvider } from 'antd'
import global_vi from "@/languages/vi/global.json"
import global_en from "@/languages/en/global.json"
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import enUS from 'antd/es/locale/en_US'
import viVN from 'antd/es/locale/vi_VN';

i18next.init({
  interpolation: { escapeValue: true },
  lng: "en",
  resources: {
    en: {
      global: global_en
    },
    vi: {
      global: global_vi
    }
  }
});

const Main = () => {
  const [locale, setLocale] = useState(i18next.language === 'en' ? enUS : viVN);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLocale(lng === 'en' ? enUS : viVN);
    };

    i18next.on('languageChanged', handleLanguageChange);
    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <App>
      <AppProvider>
        <I18nextProvider i18n={i18next}>
          <ConfigProvider locale={locale}>
            <RouterProvider router={router} />
          </ConfigProvider>
        </I18nextProvider>
      </AppProvider>
    </App>
  );
};

createRoot(document.getElementById('root')!).render(<Main />);
