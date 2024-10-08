// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Admin.sol";
import "./TeacherFactory.sol";

contract StudentFactory {
    Admin public adminContract; // Store reference to Admin contract
    TeacherFactory public teacherFactoryContract;
    mapping(address => Student) public students;
    address[] public studentAccounts;

    event StudentCreated(address studentAddress, string name, uint256 age, string course, address account);
    event StudentDeleted(address studentAddress);
    event TeacherAssigned(address studentAddress, address teacherAddress);

    constructor(address _adminAddress, address _teacherFactoryAddress) {
        adminContract = Admin(_adminAddress);
        teacherFactoryContract = TeacherFactory(_teacherFactoryAddress);
    }

    function createStudent(string memory _ipfsHash_photo,string memory _id, string memory _name, uint256 _age, string memory _gmail, uint256 _mobileno, string memory _course, address _account) public {
        require(msg.sender == adminContract.admin(), "Not Allowed"); // Check admin permission
        require(address(students[_account]) == address(0), "Student already exists");
        Student newStudent = new Student(_ipfsHash_photo,_id, _name, _age, _gmail, _mobileno, _course, _account, adminContract.admin());
        students[_account] = newStudent;
        studentAccounts.push(_account);

        emit StudentCreated(address(newStudent), _name, _age, _course, _account);
    }

    function assignTeacher(address _studentAccount, address _teacher) public {
        require(msg.sender == adminContract.admin(), "Not Allowed");
        require(address(students[_studentAccount]) != address(0), "Student does not exist");
        require(teacherFactoryContract.isTeacher(_teacher), "Teacher does not exist in TeacherFactory");

        students[_studentAccount].assignTeacher(_teacher);
        emit TeacherAssigned(_studentAccount, _teacher);
    }
    
    function deleteStudent(address _account) public {
        require(msg.sender == adminContract.admin(), "Not Allowed");
        require(address(students[_account]) != address(0), "Student does not exist");
        delete students[_account];

        // Remove the student from the accounts list
        for (uint256 i = 0; i < studentAccounts.length; i++) {
            if (studentAccounts[i] == _account) {
                studentAccounts[i] = studentAccounts[studentAccounts.length - 1];
                studentAccounts.pop();
                break;
            }
        }

        emit StudentDeleted(_account);
    }

    function getStudentsWithUpdateRequests() public view returns (address[] memory) {
    address[] memory studentsWithRequests = new address[](studentAccounts.length);
    uint256 count = 0;

    for (uint256 i = 0; i < studentAccounts.length; i++) {
        Student student = students[studentAccounts[i]];
        if (student.detailsRequested()) {
            studentsWithRequests[count] = studentAccounts[i];
            count++;
        }
    }

    address[] memory result = new address[](count);
    for (uint256 i = 0; i < count; i++) {
        result[i] = studentsWithRequests[i];
    }
    return result;
}


    function getStudent(address _account) public view returns (Student) {
        return students[_account];
    }

    function getAllStudents() public view returns (address[] memory) {
        return studentAccounts;
    }

    function getAdminAddress() public view returns (address) {
    return adminContract.admin();
}

}

contract Student {
    string public id;
    string public name;
    uint256 public age;
    string public gmail;
    uint256 public mobile_no;
    string public course;
    address public account;
    bool public detailsRequested;
    string public remarks;

    address public admin;
    address public teacher;
    
    string public ipfsHash_photo;
    
    struct EventCertificate {
        string eventName;
        uint256 eventDate; // Using Unix timestamp
        string fileHash;
        string eventRemark;
    }
    
    mapping(string => EventCertificate) private certificates;
    EventCertificate[] private studentCertificates;
    constructor(string memory _ipfsHash_photo,string memory _id, string memory _name, uint256 _age, string memory _gmail, uint256 _mobileno, string memory _course, address _account, address _admin) {
        ipfsHash_photo = _ipfsHash_photo;
        id = _id;
        name = _name;
        age = _age;
        gmail = _gmail;
        mobile_no = _mobileno;
        course = _course;
        account = _account;
        admin = _admin; // Set the admin address from the factory
        detailsRequested = false;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, "Only the assigned teacher can edit remarks");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can change details");
        _;
    }

    function addCertificate(
        string memory _eventName,
        uint256 _eventDate, // Accepting Unix timestamp
        string memory _fileHash,
        string memory _eventRemark
    ) public {
        require(msg.sender == account, "Only student can request updates");
        EventCertificate memory newCertificate = EventCertificate({
            eventName: _eventName,
            eventDate: _eventDate,
            fileHash: _fileHash,
            eventRemark: _eventRemark
        });
        certificates[_fileHash] = newCertificate;
        studentCertificates.push(newCertificate);
    }

    function getCertificates() public view returns (EventCertificate[] memory) {
        return studentCertificates;
    }

    function getCertificate(string memory _fileHash) public view returns (EventCertificate memory) {
    require(bytes(certificates[_fileHash].fileHash).length > 0, "Certificate not found");
    return certificates[_fileHash];
}

     function addEventRemark(
        string memory _fileHash,
        string memory _newRemark
    ) public onlyTeacher() {
        require(bytes(certificates[_fileHash].fileHash).length > 0, "Certificate not found");

        certificates[_fileHash].eventRemark = _newRemark;
    }

    function requestDetailsUpdate() public {
        require(msg.sender == account, "Only student can request updates");
        require(!detailsRequested, "Update already requested");
        detailsRequested = true;
    }

    function updateDetails(string memory _id, string memory _name, uint256 _age, string memory _gmail, uint256 _mobileno, string memory _course) public onlyAdmin {
        id = _id;
        name = _name;
        age = _age;
        gmail = _gmail;
        mobile_no = _mobileno;
        course = _course;
        detailsRequested = false;
    }

    function assignTeacher(address _teacher) public onlyAdmin {
        teacher = _teacher;
    }

    function addRemarks(string memory _remarks) public onlyTeacher {
        remarks = _remarks;
    }
}
