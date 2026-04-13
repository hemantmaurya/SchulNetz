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
                name: "Teachers",
                path: "/teachers",
            },
            {
                name: "Testing",
                path: "/testing",
            },
            {
                name: "Academic Calendar",
                path: "/academic-calendar"
            },
            {
                name: "Attendance",
                path: "/attendance",

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