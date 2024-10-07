// import React, { useState, useEffect } from 'react';
// import web3 from "./web3";
// import Admin from "./contracts/Admin.json";
// import StudentFactory from "./contracts/StudentFactory.json";
// import TeacherFactory from "./contracts/TeacherFactory.json";
// import AdminDashboard from './components/admin/AdminDashboard';
// import TeacherDashboard from './components/teacher/TeacherDashboard';
// import StudentDashboard from './components/student/StudentDashboard';
// import AccountInput from './components/AccountInput';
// import AddStudentForm from './components/admin/AddStudentForm';
// import ViewStudentDetails from './components/admin/ViewStudentDetails';
// import AddTeacherForm from './components/admin/AddTeacherForm';
// import ViewTeacherDetails from './components/admin/ViewTeacherDetails';
// import UpdateStudentForm from './components/admin/UpdateStudentForm';
// import UpdateRequests from './components/admin/UpdateRequests';
// import StudentProfile from './components/student/StudentProfile';
// import TeacherProfile from './components/teacher/TeacherProfile';
// import AssignedStudents from './components/teacher/AssignedStudents';
// import Home from './components/Home';
// import ProtectedRoute from './components/ProtectedRoute';
// import View from './components/admin/View';
// import { useBlockchain } from './context/BlockchainContext';

// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// function App() {
//     const [account, setAccount] = useState(localStorage.getItem('account') || ''); // Check localStorage for account
//     const [adminContract, setAdminContract] = useState(null);
//     const [studentFactoryContract, setStudentFactoryContract] = useState(null);
//     const [teacherFactoryContract, setTeacherFactoryContract] = useState(null);
//     const [networkError, setNetworkError] = useState("");
//     const [role, setRole] = useState(localStorage.getItem('role') || ''); // Check localStorage for role
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const loadBlockchainData = async () => {
//             setLoading(true);
//             try {
//                 const accounts = await web3.eth.getAccounts();
//                 console.log("Account:", accounts[0]);

//                 const networkId = await web3.eth.net.getId();
//                 console.log("Network ID:", networkId);
                
//                 const adminNetworkData = Admin.networks[networkId];
//                 const studentFactoryNetworkData = StudentFactory.networks[networkId];
//                 const teacherFactoryNetworkData = TeacherFactory.networks[networkId];

//                 if (adminNetworkData && studentFactoryNetworkData && teacherFactoryNetworkData) {
//                     const adminContractInstance = new web3.eth.Contract(Admin.abi, adminNetworkData.address);
//                     const studentFactoryContractInstance = new web3.eth.Contract(StudentFactory.abi, studentFactoryNetworkData.address);
//                     const teacherFactoryContractInstance = new web3.eth.Contract(TeacherFactory.abi, teacherFactoryNetworkData.address);
                    
//                     setAdminContract(adminContractInstance);
//                     setStudentFactoryContract(studentFactoryContractInstance);
//                     setTeacherFactoryContract(teacherFactoryContractInstance);
//                 } else {
//                     throw new Error("Smart contract not deployed to detected network.");
//                 }
//             } catch (error) {
//                 console.error("Error loading blockchain data:", error);
//                 setNetworkError("Could not connect to blockchain.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadBlockchainData();
//     }, []); // Empty dependency array

//     const handleLogout = () => {
//         setRole('');
//         setAccount('');
//         localStorage.removeItem('role'); // Clear role from localStorage
//         localStorage.removeItem('account'); // Clear account from localStorage
//         navigate('/'); // Redirect to home
//     };

//     if (loading) {
//         return <div>Loading blockchain data...</div>;  // Show loading message while connecting to blockchain
//     }
  
//     if (networkError) {
//         return (
//             <div>
//                 <p className="text-red-500 font-bold">Network Error: {networkError}</p>
//                 <p>Please make sure your blockchain node is running and the contracts are deployed.</p>
//             </div>
//         );
//     }

//     return (
//         <Routes>
//             <Route 
//                 path="/" 
//                 element={role === '' ? 
//                     <AccountInput 
//                         setRole={(r) => {
//                             setRole(r);
//                             localStorage.setItem('role', r); // Store role in localStorage
//                         }} 
//                         setAccount={(acc) => {
//                             setAccount(acc);
//                             localStorage.setItem('account', acc); // Store account in localStorage
//                         }} 
//                         adminContract={adminContract} 
//                         studentFactoryContract={studentFactoryContract} 
//                         teacherFactoryContract={teacherFactoryContract} 
//                         account={account}
//                     /> : 
//                     <Navigate to={`/${role}`} />} 
//             />
//             <Route 
//                 path="/admin" 
//                 element={role === 'admin' ? <AdminDashboard handleLogout={handleLogout} /> : <Navigate to="/" />} 
//             >
//                 <Route index element={<Home/>} />
//                 <Route path="add-student" element={<AddStudentForm studentFactoryContract={studentFactoryContract} account={account} />} />
//                 <Route path="view-students" element={<ViewStudentDetails studentFactoryContract={studentFactoryContract} teacherFactoryContract={teacherFactoryContract} account={account} />} />
//                 <Route path="add-teacher" element={<AddTeacherForm teacherFactoryContract={teacherFactoryContract} account={account} />} />
//                 <Route path="view-teachers" element={<ViewTeacherDetails teacherFactoryContract={teacherFactoryContract} account={account} />} />
//                 <Route path="update-requests" element={<UpdateRequests studentFactoryContract={studentFactoryContract} />} />
//                 <Route path="view-students/view" element={<View/>}/>
//                 <Route
//     path="view-students/update-student/:studentAccount"
//     element={
//         <ProtectedRoute
//             isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
//             redirectPath="/" // Redirect unauthorized users to the home page
//         >
//             <UpdateStudentForm studentFactoryContract={studentFactoryContract} account={account} />
//         </ProtectedRoute>
//     }
// />
//             </Route>
//             <Route 
//                 path="/teacher" 
//                 element={role === 'teacher' ? <TeacherDashboard handleLogout={handleLogout} /> : <Navigate to="/" />} 
//             >
//                 <Route index element={<Home/>} />
//                 <Route path="teacher-profile" element={<TeacherProfile teacherFactoryContract={teacherFactoryContract} account={account}/> } />
//                 <Route path="assigned-student" element={<AssignedStudents studentFactoryContract={studentFactoryContract} account={account} />} />
//             </Route>
//             <Route 
//                 path="/student" 
//                 element={role === 'student' ? 
//                 <StudentDashboard handleLogout={handleLogout} /> : 
//                 <Navigate to="/" />} >
//                     <Route index element={<Home/>} />
//                     <Route path="student-profile" element={<StudentProfile studentFactoryContract={studentFactoryContract} account={account}/> } />
//             </Route>
            

//         </Routes>
//     );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import web3 from "./web3";
import Admin from "./contracts/Admin.json";
import StudentFactory from "./contracts/StudentFactory.json";
import TeacherFactory from "./contracts/TeacherFactory.json";
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import AccountInput from './components/AccountInput';
import AddStudentForm from './components/admin/AddStudentForm';
import ViewStudentDetails from './components/admin/ViewStudentDetails';
import AddTeacherForm from './components/admin/AddTeacherForm';
import ViewTeacherDetails from './components/admin/ViewTeacherDetails';
import UpdateStudentForm from './components/admin/UpdateStudentForm';
import UpdateRequests from './components/admin/UpdateRequests';
import StudentProfile from './components/student/StudentProfile';
import EventAchievement from './components/student/EventAchievement';
import Result from './components/student/Result';
import TeacherProfile from './components/teacher/Teacherprofile';
import AssignedStudents from './components/teacher/AssignedStudents';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import View from './components/admin/View';
import { useBlockchain } from './context/BlockchainContext';

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    const {
        account,
            setAccount,
            adminContract,
            setAdminContract,
            studentFactoryContract,
            setStudentFactoryContract,
            teacherFactoryContract,
            setTeacherFactoryContract,
            loading,
            setLoading,
            networkError,
            setNetworkError,
            role, 
            setRole,
            logout
    } = useBlockchain();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home
    };

    if (loading) {
        return <div>Loading blockchain data...</div>;  // Show loading message while connecting to blockchain
    }
  
    if (networkError) {
        return (
            <div>
                <p className="text-red-500 font-bold">Network Error: {networkError}</p>
                <p>Please make sure your blockchain node is running and the contracts are deployed.</p>
            </div>
        );
    }

    return (
        <Routes>
            <Route 
                path="/" 
                element={role === '' ? 
                    <AccountInput 
                        setRole={(r) => {
                            setRole(r);
                            localStorage.setItem('role', r); // Store role in localStorage
                        }} 
                        setAccount={(acc) => {
                            setAccount(acc);
                            localStorage.setItem('account', acc); // Store account in localStorage
                        }} 
                        adminContract={adminContract} 
                        studentFactoryContract={studentFactoryContract} 
                        teacherFactoryContract={teacherFactoryContract} 
                        account={account}
                    /> : 
                    <Navigate to={`/${role}`} />} 
            />
            <Route 
                path="/admin" 
                element={role === 'admin' ? <AdminDashboard handleLogout={handleLogout} /> : <Navigate to="/" />} 
            >
                <Route index element={<Home/>} />
                <Route path="add-student" element={<AddStudentForm studentFactoryContract={studentFactoryContract} account={account} />} />
                <Route path="view-students" element={<ViewStudentDetails studentFactoryContract={studentFactoryContract} teacherFactoryContract={teacherFactoryContract} account={account} />} />
                <Route path="add-teacher" element={<AddTeacherForm teacherFactoryContract={teacherFactoryContract} account={account} />} />
                <Route path="view-teachers" element={<ViewTeacherDetails teacherFactoryContract={teacherFactoryContract} account={account} />} />
                <Route path="update-requests" element={<UpdateRequests studentFactoryContract={studentFactoryContract} />} />
                <Route path="view-students/view/:studentAccount" element={<View/>}/>
                <Route
    path="view-students/update-student/:studentAccount"
    element={
        <ProtectedRoute
            isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
            redirectPath="/" // Redirect unauthorized users to the home page
        >
            <UpdateStudentForm studentFactoryContract={studentFactoryContract} account={account} />
        </ProtectedRoute>
    }
/>
<Route
    path="view-students/view/:studentAccount/update-student/:studentAccount"
    element={
        <ProtectedRoute
            isAllowed={role === 'admin' || role === 'teacher'} // Only allow admin or teacher to access
            redirectPath="/" // Redirect unauthorized users to the home page
        >
            <UpdateStudentForm studentFactoryContract={studentFactoryContract} account={account} />
        </ProtectedRoute>
    }
/>
            </Route>

            <Route 
                path="/teacher" 
                element={role === 'teacher' ? <TeacherDashboard handleLogout={handleLogout} /> : <Navigate to="/" />} 
            >
                <Route index element={<Home/>} />
                <Route path="teacher-profile" element={<TeacherProfile teacherFactoryContract={teacherFactoryContract} account={account}/> } />
                <Route path="assigned-student" element={<AssignedStudents studentFactoryContract={studentFactoryContract} account={account} />} />
            </Route>
            <Route 
                path="/student" 
                element={role === 'student' ? 
                <StudentDashboard handleLogout={handleLogout} /> : 
                <Navigate to="/" />} >
                    <Route index element={<Home/>} />
                    <Route path="student-profile" element={<StudentProfile studentFactoryContract={studentFactoryContract} account={account}/> } />
                    <Route path="student-event-achievement" element={<EventAchievement/> } />
                    <Route path="student-result" element={<Result/> } />
            </Route>
            

        </Routes>
    );
}

export default App;
