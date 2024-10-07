import React, { useEffect, useState } from 'react';
import web3 from '../../web3';
import Teacher from '../../contracts/Teacher.json';
import TeacherCard from './TeacherCard';

const ViewTeacherDetails = ({ teacherFactoryContract, account }) => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllTeachers();
  }, []);

  const loadAllTeachers = async () => {
    try {
      const teacherAddresses = await teacherFactoryContract.methods.getAllTeachers().call();
      console.log("Teacher Addresses:", teacherAddresses);
  
      const teacherDetails = await Promise.all(
        teacherAddresses.map(async (address) => {
          const teacherContractAddress = await teacherFactoryContract.methods.getTeacher(address).call();
          console.log("Teacher Contract Address:", teacherContractAddress);
          
          const teacherContract = new web3.eth.Contract(Teacher.abi, teacherContractAddress);
  
          const id = await teacherContract.methods.id().call();
          const name = await teacherContract.methods.name().call();
          const subject = await teacherContract.methods.subject().call();
          const email = await teacherContract.methods.gmail().call();
          const account = await teacherContract.methods.account().call();
          
          console.log({ id, name, subject, email, account });  // Debug individual teacher data
  
          return { id, name, subject, email, account };
        })
      );
  
      setTeachers(teacherDetails);
    } catch (err) {
      console.error("Error loading teacher data:", err);  // Log the error for more details
      setError('Error loading teacher data.');
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">View All Teachers</h2>

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.length > 0
          ? <TeacherCard teachers={teachers}/>
          : <div>No teachers found.</div>}
      </div>
    </div>
  );
};

export default ViewTeacherDetails;
