import {
    LayoutDashboard,
    Users,
    UserCheck,
    Settings,
} from "lucide-react";

export const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "Management",
        icon: Users,
        children: [
            {
                name: "Students",
                path: "/students",
            },
            {
                name: "Exams",
                path: "/exams",
            },
            {
                name: "Teachers",
                path: "/teachers",
            },
            {
                name: "Testing",
                path: "/testing",
            },
            {
                name: "Academic calendar",
                path: "/academic-calendar"
            },
            {
                name: "Attendance",
                path: "/attendance",

            },
            {
                name: "Academic Hub",
                path: "/academic-hub",
            }

        ],
    },
    {
        name: "Settings",
        icon: Settings,
        children: [
            { name: "Courses", path: "/courses" },
            { name: "Departments", path: "/departments" }
        ]
    },
];