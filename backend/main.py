from fastapi import FastAPI
from auth.routes.auth_routes import router as auth_router
from attendance.routes.attendanceRoutes import router as attendance_router
from holiday.routes.holiday_routes import router as holiday_router
from leaves.routes.leave_routes import router as leaves_router
from workfromhome.routes.wft_routes import router as wft_routes
from fastapi.middleware.cors import CORSMiddleware
from translations.main import router as translation_router

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translation_router)
app.include_router(auth_router)
app.include_router(attendance_router)
app.include_router(holiday_router)
app.include_router(leaves_router)
app.include_router(wft_routes)