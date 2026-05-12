
import { openDB } from "idb";

const DB_NAME = import.meta.env.REACT_APP_LANGDB || "langDB";
const STORE = import.meta.env.REACT_APP_LANGSTORE || "langStore";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE);
    },
  });
}

export async function setLanguage(lang: string) {
  
  const db = await initDB();
  const result = await db.put(STORE, lang, "language");
  return result;
}

export async function getLanguage() {
  const db = await initDB();
  return (await db.get(STORE, "language")) || "en";
}



