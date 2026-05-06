import React from "react";
import { Outlet, useNavigate } from "react-router-dom"
import { useUser } from "../stores/usersStore";

export default function PublicRoutes() {
    const navigate = useNavigate();
    const user = useUser()

    React.useEffect(() => {
        if (user && user.role !== "admin") {
            navigate(-1);
        }
    }, [user, navigate]);

    return user?.role === "admin" ? <Outlet /> : null;

}