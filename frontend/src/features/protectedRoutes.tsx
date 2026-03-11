import { Navigate } from "react-router-dom"
import Layout from "@/features/layout"
import useUserSession from "./stores/usersStore"

function ProtectedRoutes() {
  const user = useUserSession((state) => state.user)
  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <Layout />
}

export default ProtectedRoutes