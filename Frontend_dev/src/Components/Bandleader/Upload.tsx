import React, { useEffect, useState } from 'react';
import './Upload.css';
import axios from 'axios';
import Navbar from './NavbarAdminPortal';

const Upload: React.FC = () => {
    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [file, setFile] = useState<File[]>([]);

    useEffect(() => {
        const socket = new WebSocket(`ws://${backendURL}/ws/bandleaderupload/`);
    
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const alertMessage = document.querySelector('.upload-alert-message') as HTMLElement;
            const alert = document.querySelector('.upload-alert-box') as HTMLElement;
            alertMessage.innerHTML = data.upload
            alert.style.display = "block";
            console.log(data.upload)
        };
    
      }, []);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const filesArray = Array.from(e.target.files) as File[];
            setFile(filesArray);
        }
    }

    const handlesubmitdatafile = () => {
        if(file){
            const formData = new FormData();
            formData.append('type', 'data file');
            file.forEach((file) => {
                formData.append('file', file);
            })

            axios.post(`http://${backendURL}/upload`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then(res => {
                const alertMessage = document.querySelector('.upload-alert-message') as HTMLElement;
                const alert = document.querySelector('.upload-alert-box') as HTMLElement;
                alertMessage.innerHTML = res.data.success
                alert.style.display = "block";
                setTimeout(() => {
                    alert.style.display = "none";
                }, 5000);
                console.log(res.data);
            })
            .catch(err => console.log(err))
        }
    }

    const handlesubmitPDFs = () => {
        if(file){
            const formData = new FormData();
            formData.append('type', 'pdf');
            file.forEach((file) => {
                formData.append('files', file);
            })

            axios.post(`http://${backendURL}/upload`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then(res => {
                const alertMessage = document.querySelector('.upload-alert-message') as HTMLElement;
                const alert = document.querySelector('.upload-alert-box') as HTMLElement;
                alertMessage.innerHTML = res.data.success
                alert.style.display = "block";
                setTimeout(() => {
                    alert.style.display = "none";
                }, 5000);
                console.log(res.data);
            })
            .catch(err => console.log(err))
        }
    }



    return(
        <div>
            <Navbar />
            <div className="upload-alert-box upload-green">
                <p className='upload-alert-message'></p>
            </div>
            <div className="upload">
                <p className="upload-list-heading">Upload The Songs List</p>
                <div className="main-upload-div">
                    <p className="file-select">Select a file(s)</p>
                    <i className="fa-solid fa-download fa-3x"></i>
                    <label className="uplaod-file-lable">Select file(s) <br/>Step1: Upload the master_data_file.txt for the library. <br/> Step 2: Upload the all of the pdfs.</label>
                    <input onChange={handleFileChange} type="file" multiple className="uplaod-file" required />
                </div>
                <div className='upload-button-container'>
                <button onClick={e => window.location.href = '/addsinglesong'} className="submit-file">Return</button>
                <button onClick={handlesubmitdatafile} className="submit-file">Submit Data File</button>
                <button onClick={handlesubmitPDFs} className="submit-file">Submit PDFs</button>
                </div>
            </div>
        </div>
    )
}

export default Upload;