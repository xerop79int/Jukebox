import { useEffect } from "react";
import axios from "axios";
import './Backup.css'



const Backup = () => {

    useEffect(() => {
        let url = "http://localhost:5000/backup";

        axios.get(url)
            .then((response) => {
                console.log(response.data);
                if(response.data.success){
                    const container = document.querySelector('.bandleader-backup-container') as HTMLElement;
                    container.style.display = 'flex';
                    const message = document.querySelector('.message') as HTMLHeadingElement;
                    message.textContent = response.data.success
                    const successIcon = document.querySelector('.success-icon') as HTMLElement;
                    successIcon.style.display = 'block';
                    

                    setTimeout(() => {
                        window.location.href = '/addsinglesong';
                    }, 2000);
                }
                if(response.data.error){
                    const container = document.querySelector('.bandleader-backup-container') as HTMLElement;
                    container.style.display = 'flex';
                    const message = document.querySelector('.message') as HTMLHeadingElement;
                    message.innerHTML = "Backup already exists<br/>Do you want to overwrite?"
                    const buttons = document.querySelector('.bandleader-backup-buttons') as HTMLElement;
                    buttons.style.display = 'flex';

                   
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const handleUpdateBackup = () => {
        let url = "http://localhost:5000/backup";

        axios.delete(url)
            .then((response) => {
                console.log(response.data);
                if(response.data.success){
                    let url = "http://localhost:5000/backup";
                    axios.get(url)
                        .then((response) => {
                            if(response.data.success){
                                const container = document.querySelector('.bandleader-backup-container') as HTMLElement;
                                container.style.display = 'flex';
                                const message = document.querySelector('.message') as HTMLHeadingElement;
                                message.textContent = response.data.success
                                const successIcon = document.querySelector('.success-icon') as HTMLElement;
                                successIcon.style.display = 'block';
                                const buttons = document.querySelector('.bandleader-backup-buttons') as HTMLElement;
                                buttons.style.display = 'none';
                                

                                setTimeout(() => {
                                    window.location.href = '/addsinglesong';
                                }, 2000);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        })
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
        <div className="bandleader-backup-container">
            
            <div className="bandleader-backup">
            <div className="bandleader-backup-child">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="green" className="success-icon bi bi-check-circle-fill" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8
            0zm3.354 5.646a.5.5 0 0 0-.708-.708L7
            9.293 5.354 7.646a.5.5 0 0 0-.708.708l2
            2a.5.5 0 0 0 .708 0l4-4z"/>        
            </svg>
            <h1 className="message"></h1>
            <div className="bandleader-backup-buttons">
                <button className="bandleader-backup-button" onClick={handleUpdateBackup}>Yes</button>
                <button className="bandleader-backup-button" onClick={handleRedirect}>No</button>
            </div>
            </div>
        </div>
    </div>
    )
}

export default Backup;