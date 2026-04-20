import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "../components/layout/Layout";
import AdminDashboard from "../pages/AdminDashboard";
import GeneralDashboard from "../pages/GeneralDashboard";
import Testing from "../pages/Testing";
import Student from "../features/student/student.jsx";
import AcademicCalendar from "../pages/AcademicCalendar";
import AttendanceMaster from "../pages/attendance_master.jsx";
import TakeAttendance from "../pages/Take_attendance.jsx";
import Attendance from "../pages/Attendance.jsx";
import  ViewAttendance from "../pages/ViewAttendance.jsx";
import AcademicHub from '../pages/AcademicHub.jsx';
import Exam from '../pages/Exam.jsx';







// import CoursesPage from "../pages/CoursesPage.jsx";
import CoursesPage from "../pages/CoursesPage";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Admin Route */}
                <Route
                    path="/admin"
                    element={
                        <Layout>
                            <AdminDashboard />
                        </Layout>
                    }
                />

                {/* Normal User Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <Layout>
                            <GeneralDashboard />
                        </Layout>
                    }
                />

                {/* Testing Page - Inside Layout */}
                <Route path="/testing" element={ <Layout> <Testing /> </Layout> } />

                <Route
                    path="/courses"
                    element={
                        <Layout>
                            <CoursesPage />
                        </Layout>
                    }
                />

                {/* AcademicCalender Page - Inside Layout */}

                <Route path="/academic-calendar" element={<Layout><AcademicCalendar /></Layout>} />

                {/*students page*/}
                <Route
                    path="/students"
                    element={
                        <Layout>
                            <Student />
                        </Layout>
                    }
                />



                <Route
                    path="/attendance-master"
                    element={
                        <Layout>
                            <AttendanceMaster />
                        </Layout>
                    }
                />
                <Route
                    path="/take-attendance/:id"
                    element={<Layout><TakeAttendance /></Layout>}
                />
                <Route
                    path="/attendance"
                    element={
                        <Layout>
                            <Attendance />
                        </Layout>
                    }
                />

                <Route
                    path="/attendance/mark"
                    element={
                        <Layout>
                            <h1 className="p-8 text-2xl">Attendance Marking Page (Next Lesson)</h1>
                        </Layout>
                    }
                />
                <Route
                    path="/viewattendance"
                    element={<Layout><ViewAttendance /></Layout>}
                />

                <Route path="/academic-hub" element={<AcademicHub />} />

                <Route path="/Exams" element={<Exam />} />





                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
