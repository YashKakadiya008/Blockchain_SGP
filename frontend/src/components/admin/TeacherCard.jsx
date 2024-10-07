import React from 'react';

const TeacherCard = ({ teachers }) => {
  return (
    <table className="table-auto w-full text-left border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-200">
        <th className="border px-4 py-2">ID</th>
        <th className="border px-4 py-2">Name</th>
        <th className="border px-4 py-2">Subject</th>
        <th className="border px-4 py-2">Email</th>
        <th className="border px-4 py-2">Account</th>
      </tr>
    </thead>
    <tbody>
      {teachers.map((teacher, index) => (
        <tr key={index} className="hover:bg-gray-100">
          <td className="border px-4 py-2 whitespace-nowrap">{teacher.id}</td>
          <td className="border px-4 py-2 whitespace-nowrap">{teacher.name}</td>
          <td className="border px-4 py-2 whitespace-nowrap">{teacher.subject}</td>
          <td className="border px-4 py-2 ">{teacher.email}</td>
          <td className="border px-4 py-2">{teacher.account}</td>
        </tr>
      ))}
    </tbody>
  </table>
  );  
};

export default TeacherCard;
