import React, { useState } from 'react';
import { useIpfs } from '../../context/IpfsContext'; // Assuming you're using IPFS context for file uploads
import { useBlockchain } from '../../context/BlockchainContext';
import Student from '../../contracts/Student.json';
import Web3 from 'web3';
import web3 from '../../web3'; // Ensure you have Web3.js installed

const AddEvent = () => {
    const { photoHash,setPhotoHash } = useIpfs(); // Get the file hash from IPFS context
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventRemark, setEventRemark] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { account,studentFactoryContract} = useBlockchain(); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        const date = new Date(eventDate);
        if (isNaN(date.getTime())) {
            setErrorMessage('Please enter a valid date.');
            return;
        }
        
        // Convert to Unix timestamp
        const unixTimestamp = Math.floor(date.getTime() / 1000);

        try {
            // Ensure contract is defined
            if (!studentFactoryContract) {
                throw new Error('Smart contract not loaded.');
            }

            // Call the smart contract method to add the certificate
            const studentAddress = await studentFactoryContract.methods.getStudent(account).call();
            const studentContractInstance = new web3.eth.Contract(Student.abi, studentAddress);
            await studentContractInstance.methods.addCertificate( // The student's Ethereum address (assuming the user is logged in)
                eventName,
                photoHash,
                unixTimestamp,
                eventRemark
            ).send({ from: accounts[0] });

            setSuccessMessage('Certificate added successfully!');
            // Reset the form fields
            setEventName('');
            setEventDate('');
            setEventRemark('');
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to add the certificate. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add Student Event Certificate</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Event Name:</label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Event Date:</label>
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Event Remark:</label>
                    <textarea
                        value={eventRemark}
                        onChange={(e) => setEventRemark(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit Certificate</button>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default AddEvent;
