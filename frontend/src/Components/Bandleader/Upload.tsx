import React, { useState } from 'react';
import './Upload.css';
import axios from 'axios';

const Upload: React.FC = () => {
    const [file, setFile] = useState<File>();


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setFile(e.target.files[0]);
        }
    }

    const handlesubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(file){
            const formData = new FormData();
            formData.append('file', file);

            axios.post('http://localhost:8000/upload', formData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err))
        }
    }


    return(
        <div className="upload">
            <p className="upload-list-heading">Upload The Songs List</p>
            <div className="main-upload-div">
                <p className="file-select">Select a file</p>
                <i className="fa-solid fa-download fa-3x"></i>
                <label className="uplaod-file-lable">Select file or drag here</label>
                <input onChange={handleFileChange} type="file" accept='text/*' className="uplaod-file" required placeholder="Select A File " />
            </div>
            <button onClick={handlesubmit} className="submit-file">Submit the file</button>
        </div>
    )
}

export default Upload;