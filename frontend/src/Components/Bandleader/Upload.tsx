import React, { useState } from 'react';
import './Upload.css';
import axios from 'axios';

const Upload: React.FC = () => {
    const [file, setFile] = useState<File[]>([]);


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

            axios.post('http://localhost:8000/upload', formData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            })
            .then(res => {
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
                <label className="uplaod-file-lable">Select file(s) <br/>(Instructions: First upload the data file of the songs After they have been uploaded then upload all the PDFs)</label>
                <input onChange={handleFileChange} type="file" multiple className="uplaod-file" required />
            </div>
            <div className='upload-button-container'>
            <button onClick={handlesubmitdatafile} className="submit-file">Submit Data File</button>
            <button onClick={handlesubmitPDFs} className="submit-file">Submit PDFs</button>
            </div>
        </div>
    )
}

export default Upload;