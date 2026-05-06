import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PagenotFound from './components/pagenotFound';
import { Spinner } from "@/components/ui/spinner"
import ProtectedRoutes from '@/helpers/routes/protectedRoutes';
import { Toaster } from "sonner";
import Publicroutes from './helpers/routes/adminRoutes';

function App() {
  
  const Regiter = React.lazy(() => import('@/auth/register'));
  const Login = React.lazy(() => import('@/auth/login'));
  const Users = React.lazy(() => import('@/auth/users'));
  const Attendance = React.lazy(() => import('@/pages/attendance/'));
  const Holidays = React.lazy(() => import('@/pages/holidays/'));
  const WorkFromHome = React.lazy(() => import('@/pages/workfromhome/'));
  const LeaveRequest = React.lazy(() => import('@/pages/leaveRequest/'));
  const ForgetPassword = React.lazy(() => import('@/auth/forget/'));

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PagenotFound />} />
          <Route path="/"
            element={<Navigate to="/login" replace />} />
          <Route path="/login"
            element={
              <React.Suspense fallback={
                <div className="h-dvh flex justify-center items-center">
                  < Spinner />
                </div>
              }
              >
                <Login />
              </React.Suspense>}
          />
          <Route path="/register"
            element={
              <React.Suspense fallback={
                <div className="h-dvh flex justify-center items-center">
                  < Spinner />
                </div>
              }
              >
                <Regiter />
              </React.Suspense>
            }
          />
          <Route path="/forget-password"
            element={
              <React.Suspense fallback={
                <div className="h-dvh flex justify-center items-center">
                  < Spinner />
                </div>
              }
              >
                <ForgetPassword />
              </React.Suspense>
            }
          />

          <Route element={<ProtectedRoutes />}>

            <Route element={<Publicroutes />}>
              <Route path={"/users"}
                element={
                  <React.Suspense fallback={
                    <div className="h-dvh flex justify-center items-center">
                      < Spinner />
                    </div>
                  }
                  >
                    <Users />
                  </React.Suspense>
                }
              />
            </Route>

            <Route path={"/attendance"}
              element={
                <React.Suspense fallback={
                  <div className="h-dvh flex justify-center items-center">
                    < Spinner />
                  </div>
                }
                >
                  <Attendance />
                </React.Suspense>
              }
            />
            <Route path={"/holidays"}
              element={
                <React.Suspense fallback={
                  <div className="h-dvh flex justify-center items-center">
                    < Spinner />
                  </div>
                }
                >
                  <Holidays />
                </React.Suspense>
              }
            />
            <Route path={"/leave"}
              element={
                <React.Suspense fallback={
                  <div className="h-dvh flex justify-center items-center">
                    < Spinner />
                  </div>
                }
                >
                  <LeaveRequest />
                </React.Suspense>
              }
            />
            <Route path={"/workfromhome"}
              element={
                <React.Suspense fallback={
                  <div className="h-dvh flex justify-center items-center">
                    < Spinner />
                  </div>
                }
                >
                  <WorkFromHome />
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
