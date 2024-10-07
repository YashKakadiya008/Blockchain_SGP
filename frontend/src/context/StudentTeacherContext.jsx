import React, { createContext, useContext,useState, useEffect } from 'react';
import web3 from '../web3';
import Student from '../contracts/Student.json';
import Teacher from '../contracts/Teacher.json' // Import contracts
import { useBlockchain } from './BlockchainContext';

const StudentTeacherContext = createContext();

export const useStudentTeacher = () => useContext(StudentTeacherContext);

export const StudentTeacherProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const {
        studentFactoryContract,
        teacherFactoryContract
} = useBlockchain();

  const loadAllStudents = async () => {
    try {
      const studentAddresses = await studentFactoryContract.methods.getAllStudents().call();
      const studentDetails = await Promise.all(
        studentAddresses.map(async (address) => {
          const studentContractAddress = await studentFactoryContract.methods.getStudent(address).call();
          const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);

          const photo = await studentContract.methods.ipfsHash_photo().call();
          const id = await studentContract.methods.id().call();
          const name = await studentContract.methods.name().call();
          const age = await studentContract.methods.age().call();
          const gmail = await studentContract.methods.gmail().call();
          const mobileNo = await studentContract.methods.mobile_no().call();
          const course = await studentContract.methods.course().call();
          const remarks = await studentContract.methods.remarks().call();
          const account = await studentContract.methods.account().call();
          const teacherAddress = await studentContract.methods.teacher().call();
        
          let isTeacherAssig ;
          let teacher_name;
          console.log("teacher : ",teacherAddress);
          if(teacherAddress === "0x0000000000000000000000000000000000000000")
          {
            teacher_name = "NA"
            isTeacherAssig=false;
          }
          else{
            const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(teacherAddress).call();
            const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
            teacher_name = await teacherContract.methods.name().call();
            isTeacherAssig=true;
          }

          return { photo,id, name, age, gmail, mobileNo, course, remarks, account ,teacher_name,isTeacherAssig };
        })
      );

      setStudents(studentDetails);
    } catch (err) {
      setError('Error loading student data.');
    } finally {
      setLoading(false); // Set loading to false after data fetch
    }
  };

  const loadAllTeachers = async () => {
    try {
      const teacherAddresses = await teacherFactoryContract.methods.getAllTeachers().call();
      const teacherDetails = await Promise.all(
        teacherAddresses.map(async (address) => {
          console.log("teacher address :" ,address);
          const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(address).call();
          const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
          const name = await teacherContract.methods.name().call();
          const account = await teacherContract.methods.account().call();

          return { name, account };
        })
      );
      setTeachers(teacherDetails); // Set all existing teachers in state
    } catch (err) {
      console.error('Error loading teachers:', err);
      setError('Error loading teacher data.');
    }
  };

  const assignTeacher = async (studentAccount, teacherAddress, account) => {
    const teacherAddresses = await teacherFactoryContract.methods.getAllTeachers().call();
    if (!teacherAddresses.includes(teacherAddress)) {
      alert('Teacher does not exist in the system.');
      return;
    }
  
    try {
      const studentContractAddress = await studentFactoryContract.methods.getStudent(studentAccount).call();
      const studentContract = new web3.eth.Contract(Student.abi, studentContractAddress);
      
      // Here, make sure you pass the `account` (which is the user's Ethereum address) as the `from` address.
      await studentContract.methods.assignTeacher(teacherAddress).send({ from: account });
      
      alert(`Teacher assigned successfully to student ${studentAccount}`);
    } catch (err) {
      console.error('Error assigning teacher:', err);
      alert('Failed to assign teacher');
    }
  };
  

  const deleteStudent = async (studentAccount, account) => {
    try {
      await studentFactoryContract.methods.deleteStudent(studentAccount).send({ from: account });
      alert(`Student ${studentAccount} deleted successfully`);
      loadAllStudents(); // Reload the students list
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student');
    }
  };

  return (
    <StudentTeacherContext.Provider
      value={{
        students,
        teachers,
        loading,
        error,
        assignTeacher,
        deleteStudent,
        loadAllStudents,
        loadAllTeachers
      }}
    >
      {children}
    </StudentTeacherContext.Provider>
  );
};

