import { useEffect, useState } from "react";
import axios from "axios";
import './Restore.css'
import Navbar from "./NavbarAdminPortal";


const Restore = () => {
    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFile, setSelectedFile] = useState<string>('');

    useEffect(() => {
        let url = "http://localhost:5000/restore";

        axios.get(url, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
            .then((response) => {
                setFiles(response.data.restore_files);
                // const container = document.querySelector('.bandleader-restore-container') as HTMLElement;
                // container.style.display = 'flex';
                // const message = document.querySelector('.message') as HTMLHeadingElement;
                // message.textContent = response.data.success
                // const successIcon = document.querySelector('.success-icon') as HTMLElement;
                // successIcon.style.display = 'block';
                    

                // setTimeout(() => {
                //     window.location.href = '/bandleader';
                // }, 2000);
                
            })
            .catch((error) => {
                console.log(error);
            })

    }, [])

    const handleSelectRestore = (name: any, e: any) => {

        // uncheck all other checkboxes
        const checkboxes = document.querySelectorAll('.restore-file') as NodeListOf<HTMLInputElement>;
        checkboxes.forEach((checkbox) => {
            if (checkbox !== e.target) {
                checkbox.checked = false;
            }
        });

        setSelectedFile(name);       
    }

    const handleRestore = () => {
        if(selectedFile){
            let url = `http://localhost:5000/restore`;

            const data = {
                restore_file: selectedFile,
            }

            axios.post(url, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => {
                const container = document.querySelector('.bandleader-restore-container') as HTMLElement;
                container.style.display = 'flex';
                const message = document.querySelector('.message') as HTMLHeadingElement;
                message.textContent = response.data.success
                const successIcon = document.querySelector('.success-icon') as HTMLElement;
                successIcon.style.display = 'block';
                    

                setTimeout(() => {
                    window.location.href = '/bandleader';
                }, 2000);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    const handleDelete = () => {
        if(selectedFile){
            let url = `http://localhost:5000/backup?file=${selectedFile}`;

            axios.delete(url, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((response) => {
                console.log(response.data);
                if(response.data.success){
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }


    return(
        <div>
            <Navbar />
            <div className="bandleader-restore-container">
                <div className="bandleader-restore">
                <div className="bandleader-restore-child">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="green" className="success-icon bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8
                0zm3.354 5.646a.5.5 0 0 0-.708-.708L7
                9.293 5.354 7.646a.5.5 0 0 0-.708.708l2
                2a.5.5 0 0 0 .708 0l4-4z"/>        
                </svg>
                <h1 className="message"></h1>
                </div>
                </div>
            </div>

            <div className="restore">
                <p className="restore-list-heading">Load Library</p>
                <div className="main-restore-div">
                    <i className="fa-solid fa-download fa-3x"></i>
                    <label className="restore-file-lable">Choose the Library to Load</label>
                    {files.map((file) => {
                        const fileString = JSON.stringify(file);
                        const filename = fileString.slice(1, -1);
                        return (
                            <div key={filename} className="restore-data-container">
                                <input onClick={e => handleSelectRestore(filename, e)} type="checkbox" className="restore-file" required />
                                <p className="restore-filename">{filename}</p>
                            </div>
                        );
                    })}
                </div>
                <div className='restore-button-container'>
                <button onClick={e => window.location.href = '/addsinglesong'} className="submit-file">Return</button>
                <button onClick={handleRestore} className="submit-file">Restore</button>
                <button onClick={handleDelete} className="submit-file">Delete</button>
                </div>
            </div>
        </div>
    )

}

export default Restore;