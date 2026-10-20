import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/constants/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.tr) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "tr",
  setLanguage: () => {},
  t: (key) => translations.tr[key] ?? key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("tr");

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: keyof typeof translations.tr): string => {
    return translations[language]?.[key] ?? translations.tr[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
