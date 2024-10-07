import React from "react";
import Dashboard from "../Dashboard";

const teacherLinks = [
    { to: 'teacher-profile', label : 'Profile'},
    { to: 'assigned-student', label: 'Students' }
];

function TeacherDashboard({handleLogout}) {
    return (
        <Dashboard 
            role="teacher" 
            links={teacherLinks} 
            handleLogout={handleLogout} 
        />
    );
}

export default TeacherDashboard;

