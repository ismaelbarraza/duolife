import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import pt from './locales/pt/translation.json'
import it from './locales/it/translation.json'
import nl from './locales/nl/translation.json'
import de from './locales/de/translation.json'
import zh from './locales/zh/translation.json'
import fr from './locales/fr/translation.json'
import ru from './locales/ru/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      pt: { translation: pt },
      it: { translation: it },
      nl: { translation: nl },
      de: { translation: de },
      zh: { translation: zh },
      fr: { translation: fr },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'pt', 'it', 'nl', 'de', 'zh', 'fr', 'ru'],
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'dl_language',
      caches: ['localStorage'],
    },
  })

export default i18n
