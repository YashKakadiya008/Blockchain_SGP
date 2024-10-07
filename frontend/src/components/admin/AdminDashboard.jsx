import React from "react";
import Dashboard from "../Dashboard";

const adminLinks = [
    { to: 'add-student', label: 'Add Student' },
    { to: 'view-students', label: 'View Students' },
    { to: 'add-teacher', label: 'Add Teacher' },
    { to: 'view-teachers', label: 'View Teachers' },
    { to: 'update-requests', label: 'Update Requests' }
];

function AdminDashboard({handleLogout}) {
    return (
        <Dashboard 
            role="admin" 
            links={adminLinks} 
            handleLogout={handleLogout} 
        />
    );
}

export default AdminDashboard;
