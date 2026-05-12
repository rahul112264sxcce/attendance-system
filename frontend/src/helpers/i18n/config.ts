import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLanguage } from "../indexdb";


const data = await getLanguage();

i18n.use(initReactI18next).init({
  resources:data,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

// const resources = {
//   en: {
//     translation: {
//       Employees: "Employees",
//       Attendance: "Attendance",
//       Leave: "Leave",
//       Holidays: "Holidays",
//       WorkFromHome: "Work from home",
//     },
//   },
//   ta: {
//     translation: {
//       Employees: "பணியாளர்கள்",
//       Attendance: "தேதி செயல்பாடு",
//       Leave: "வெளியேறு",
//       Holidays: "காலாவதிகள்",
//       WorkFromHome: "வீட்டிலிருந்து வேலை",
//     },
//   },
//   hi: {
//     translation: {
//       welcome: "स्वागत है",
//       Employees: "कर्मचारियों",
//       Attendance: "उपस्थिति",
//       Leave: "छुट्टी",
//       Holidays: "छुट्टियां",
//       WorkFromHome: "घर से काम",
//     },
//   },
// };