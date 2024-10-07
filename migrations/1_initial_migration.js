const Admin = artifacts.require("Admin");
const StudentFactory = artifacts.require("StudentFactory");
const TeacherFactory = artifacts.require("TeacherFactory");

module.exports = async function (deployer){
    await deployer.deploy(Admin);
    const adminInstance = await Admin.deployed();

    await deployer.deploy(TeacherFactory, adminInstance.address);
    const teacherInstance = await TeacherFactory.deployed();
    await deployer.deploy(StudentFactory,adminInstance.address,teacherInstance.address);
    
};