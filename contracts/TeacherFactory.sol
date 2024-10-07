// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Admin.sol";

contract TeacherFactory {
    Admin public adminContract; // Store reference to Admin contract
    mapping(address => Teacher) public teachers;
    address[] public teacherAccounts;

    event TeacherCreated(address teacherAddress, string name, string subject, address account);

    constructor(address _adminAddress) {
        adminContract = Admin(_adminAddress); // Initialize with admin address
    }

    function createTeacher(string memory _ipfsHash_photo,string memory _id, string memory _name, string memory _subject, string memory _gmail, address _account) public {
        require(msg.sender == adminContract.admin(), "Not Allowed"); // Check admin permission
        require(address(teachers[_account]) == address(0), "Teacher already exists");

        Teacher newTeacher = new Teacher(_ipfsHash_photo,_id, _name, _subject, _gmail, _account, adminContract.admin());
        teachers[_account] = newTeacher;
        teacherAccounts.push(_account);

        emit TeacherCreated(address(newTeacher), _name, _subject, _account);
    }

    function isTeacher(address _account) public view returns (bool) {
        return address(teachers[_account]) != address(0);
    }
    
    function getTeacher(address _account) public view returns (Teacher) {
        return teachers[_account];
    }

    function getAllTeachers() public view returns (address[] memory) {
        return teacherAccounts;
    }

    function getAdminAddress() public view returns (address) {
    return adminContract.admin();
}

}

contract Teacher {
    string public ipfsHash_photo
    string public id;
    string public name;
    string public subject;
    string public gmail;
    address public account;
    address public admin;

    constructor(string memory _ipfsHash_photo,string memory _id, string memory _name, string memory _subject, string memory _gmail, address _account, address _admin) {
        ipfsHash_photo = _ipfsHash_photo;
        id = _id;
        name = _name;
        subject = _subject;
        gmail = _gmail;
        account = _account;
        admin = _admin; // Set the admin address from the factory
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can manage teacher details");
        _;
    }

    function updateSubject(string memory _subject) public onlyAdmin {
        subject = _subject;
    }
}
