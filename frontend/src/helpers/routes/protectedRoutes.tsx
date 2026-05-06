import React from "react";
import { Navigate } from "react-router-dom"
import "@/helpers/i18n/config";
import Layout from "@/helpers/layout"
import useUser from "@/helpers/stores/usersStore"
import useLanguageStore from "@/helpers/stores/useLanguageStore";

function ProtectedRoutes() {
  const { user } = useUser()
    const initLanguage = useLanguageStore((state: any) => state.initLanguage);
  // const isLoaded = useLanguageStore((state: any) => state.isLoaded);
 
  React.useEffect(() => {
    initLanguage();
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // if (user?.role !== "admin") {
  //   return <Navigate to="/workfromhome" replace />; 
  // }

  return <Layout />
}

export default ProtectedRoutes