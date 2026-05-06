import { openDB } from "idb";

const DB_NAME = import.meta.env.REACT_APP_LANGDB
const STORE = import.meta.env.REACT_APP_LANGSTORE;

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE);
    },
  });
}

export async function setLanguage(lang: string) {
  const db = await initDB();
  return db.put(STORE, lang, "language");
}

export async function getLanguage() {
  const db = await initDB();
  return (await db.get(STORE, "language")) || "en";
}