// src/store/useLanguageStore.js
import { create } from "zustand";
import { getLanguage, setLanguage } from "@/helpers/indexdb/index";
import i18n from "@/helpers/i18n/config";

const useLanguageStore = create((set) => ({
  lang: "en",
  isLoaded: false,

  initLanguage: async () => {
    const savedLang = await getLanguage();
    i18n.changeLanguage(savedLang);

    set({
      lang: savedLang,
      isLoaded: true,
    });
  },

  changeLanguage: async (newLang: string) => {
    i18n.changeLanguage(newLang);
    await setLanguage(newLang);

    set({ lang: newLang });
  },
}));

export default useLanguageStore;