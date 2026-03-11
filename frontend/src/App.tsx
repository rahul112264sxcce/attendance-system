import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PagenotFound from './components/pagenotFound';
import { Spinner } from "@/components/ui/spinner"
import ProtectedRoutes from '@/features/protectedRoutes';
import LeaveRequest from './pages/leave';
function App() {
  
  const SignUp = React.lazy(() => import('@/features/auth/SignUp'));
  const SignIn = React.lazy(() => import('@/features/auth/SignIn'));
  const Users = React.lazy(() => import('@/pages/users'));
  const Attendance = React.lazy(() => import('@/pages/attendance'));
  const Holidays = React.lazy(() => import('@/pages/holidays'));

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PagenotFound />} />
          <Route path="/"
            element={<Navigate to="/signin" replace />} />
          <Route path="/signin"
            element={
              <React.Suspense fallback={<div className="h-[100dvh] flex justify-center items-center">< Spinner /></div>}>
                <SignIn />
              </React.Suspense>}
          />
          <Route path="/signup"
            element={
              <React.Suspense fallback={<div className="h-[100dvh] flex justify-center items-center">< Spinner /></div>}>
                <SignUp />
              </React.Suspense>
            }
          />

          <Route element={<ProtectedRoutes />} >
            <Route path={"/users"}
              element={
                <React.Suspense fallback={<div className="h-[100dvh] flex justify-center items-center">< Spinner /></div>}>
                  <Users />
                </React.Suspense>
              }
            />
            <Route path={"/attendance"}
              element={
                <React.Suspense fallback={<div className="h-[100dvh] flex justify-center items-center">< Spinner /></div>}>
                  <Attendance />
                </React.Suspense>
              }
            />
            <Route path={"/holidays"}
              element={
                <React.Suspense fallback={<div className="h-[100dvh] flex justify-center items-center">< Spinner /></div>}>
                  <Holidays />
                </React.Suspense>
              }
            />
            <Route path={"/leave"}
              element={
                <React.Suspense fallback={<div className="h-[100dvh] flex justify-center items-center">< Spinner /></div>}>
                  <LeaveRequest />
                </React.Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
