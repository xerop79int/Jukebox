import { useEffect, useState } from "react";
import axios from "axios";
import './Backup.css'
import Navbar from "./NavbarAdminPortal";


const Backup = () => {
    const [backupname, setBackupName] = useState<string>('');


    const CreateNewBackup = () => {
        let url = `http://localhost:5000/backup?name=${backupname}`;

        if (backupname === '') {
            const alertBox = document.querySelector('.backup-alert-box') as HTMLElement;
            const alertMessage = document.querySelector('.backup-alert-message') as HTMLElement;
            alertMessage.textContent = 'Please enter a backup name';
            alertBox.style.display = 'block';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 3000);
            return;
        }

        axios.get(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((response) => {
                console.log(response.data);
                if(response.data.success){
                    const container = document.querySelector('.bandleader-backup-container') as HTMLElement;
                    container.style.display = 'flex';
                    const message = document.querySelector('.backup-message') as HTMLHeadingElement;
                    message.textContent = response.data.success
                    const successIcon = document.querySelector('.success-icon') as HTMLElement;
                    successIcon.style.display = 'block';

                    setTimeout(() => {
                        window.location.href = '/addsinglesong';
                    }, 2000);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleUpdateBackup = () => {
        let url = "http://localhost:5000/backup";

        axios.delete(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
            .then((response) => {
                console.log(response.data);
                if(response.data.success){
                    CreateNewBackup();
                }
            })
            .catch((error) => {
                console.log(error);
            })
        
    }

    const handleRedirect = () => {
        window.location.href = '/addsinglesong';
    }


    


    return(
        <div>
            <Navbar />
            <div className="bandleader-backup-container">
                <div className="bandleader-backup">
                <div className="bandleader-backup-child">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="green" className="success-icon bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8
                0zm3.354 5.646a.5.5 0 0 0-.708-.708L7
                9.293 5.354 7.646a.5.5 0 0 0-.708.708l2
                2a.5.5 0 0 0 .708 0l4-4z"/>        
                </svg>
                <h1 className="backup-message"></h1>
                </div>
                </div>
            </div>
            <div className="backup">
                <p className="backup-list-heading">Backup Library</p>
                <div className="main-backup-div">
                    {/* <p className="file-select">Select a file(s)</p> */}
                    <i className="fa-solid fa-upload fa-3x"></i>
                    <label className="backup-file-lable">Enter Backup Label</label>
                    <input onChange={e => setBackupName(e.target.value)} type="input" multiple className="backup-file" required />
                </div>
                <div className='backup-button-container'>
                <button onClick={e => window.location.href = '/addsinglesong'} className="submit-file">Return</button>
                <button onClick={CreateNewBackup} className="submit-file">Create Backup</button>
                </div>
            </div>
        </div>
    )
}

export default Backup;