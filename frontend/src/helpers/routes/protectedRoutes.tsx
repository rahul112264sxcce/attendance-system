import React from "react";
import { Navigate } from "react-router-dom"
import "@/helpers/i18n/config";
import Layout from "@/helpers/layout"
import useUser from "@/helpers/stores/usersStore"

function ProtectedRoutes() {
  const { user } = useUser()
  // const isLoaded = useLanguageStore((state: any) => state.isLoaded);

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // if (user?.role !== "admin") {
  //   return <Navigate to="/workfromhome" replace />; 
  // }

  return <Layout />
}

export default ProtectedRoutes