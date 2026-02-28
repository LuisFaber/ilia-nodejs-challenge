import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptBR from "./locales/pt-BR";
import en from "./locales/en";
import es from "./locales/es";

const defaultNS = "common" as const;
const resources = {
  "pt-BR": {
    common: ptBR.common,
    auth: ptBR.auth,
    wallet: ptBR.wallet,
  },
  en: {
    common: en.common,
    auth: en.auth,
    wallet: en.wallet,
  },
  es: {
    common: es.common,
    auth: es.auth,
    wallet: es.wallet,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "en",
    supportedLngs: ["en", "es", "pt-BR"],
    defaultNS,
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
  }
}

export default i18n;
