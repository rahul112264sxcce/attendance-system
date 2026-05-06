import useUserSession from "@/helpers/stores/usersStore";
import axios from "axios";


export const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    timeout: 1000,
});

instance.interceptors.request.use((config) => {
    const user = useUserSession.getState().user
   
    if (user?.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`
    }
    return config
})

























































// const getWorkFromHome = async () => {
//     try {
//         const res = await instance.get("/wfh/requests")
//         return res.data
//     }
//     catch (e) {
//         console.error("get user", e);
//     }
// }
// export const useWorkFromHomeRequestQuery = () => {
//     return useSuspenseQuery({
//         queryKey: ["workfromhome"],
//         queryFn: () => getWorkFromHome(),
//         retry: false,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//     })
// }
// const getLeaveRequest = async () => {
//     try {
//         const res = await instance.get("/leave-requests")
//         return res.data
//     }
//     catch (e) {
//         console.error("get user", e);
//     }
// }
// export const useLeaveRequestQuery = () => {
//     return useSuspenseQuery({
//         queryKey: ["leave_request"],
//         queryFn: () => getLeaveRequest(),
//         retry: false,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//     })
// }
// const getAttendanceAll = async () => {
//     try {
//         const res = await instance.get("/attendance/cumulative")
//         return res.data
//     }
//     catch (e) {
//         console.error("get user", e);
//     }
// }
// export const useAttendanceAllQuery = () => {
//     return useSuspenseQuery({
//         queryKey: ["attendance_all"],
//         queryFn: () => getAttendanceAll(),
//         retry: false,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//     })
// }
// const getAttendanceToday = async () => {
//     try {
//         const res = await instance.get("/attendance/today")
//         return res.data
//     }
//     catch (e) {
//         console.error("get user", e);
//     }
// }
// export const useAttendanceTodayQuery = () => {
//     return useSuspenseQuery({
//         queryKey: ["attendance_today"],
//         queryFn: () => getAttendanceToday(),
//         retry: false,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//     })
// }



// , {
//             params: {
//                 user_id: todoId,
//                 role: 'employee'
//             }
//         })

// def get_users(
//     page: int = 1,
//     limit: int = 10,
//     search: str = "",
//     sort_by: str = "created_at",
//     order: str = "asc"
// ):

// from fastapi import HTTPException
// from sqlalchemy import or_, asc, desc

// def serialize_user(user):
//     return {
//         "id": user.id,
//         "first_name": user.first_name,
//         "last_name": user.last_name,
//         "email": user.email,
//         "employee_id": user.employee_id,
//         "role": user.role,
//     }


// def get_users(page=1, limit=10, search="", sort_by="created_at", order="asc"):
//     db = SessionLocal()

//     try:
//         query = db.query(Users)

//         # 🔍 SEARCH
//         if search:
//             query = query.filter(
//                 or_(
//                     Users.first_name.ilike(f"%{search}%"),
//                     Users.last_name.ilike(f"%{search}%"),
//                     Users.email.ilike(f"%{search}%"),
//                 )
//             )

//         # 🔃 SORTING
//         sort_column = getattr(Users, sort_by, Users.created_at)

//         if order == "desc":
//             query = query.order_by(desc(sort_column))
//         else:
//             query = query.order_by(asc(sort_column))

//         # 📄 TOTAL COUNT (before pagination)
//         total = query.count()

//         # 📄 PAGINATION
//         offset = (page - 1) * limit
//         users = query.offset(offset).limit(limit).all()

//         return {
//             "users": [serialize_user(user) for user in users],
//             "meta": {
//                 "total": total,
//                 "page": page,
//                 "limit": limit,
//                 "total_pages": (total + limit - 1) // limit
//             }
//         }

//     except Exception as e:
//         print(e, "error")
//         raise HTTPException(status_code=500, detail="Internal Server Error")

//     finally:
//         db.close()