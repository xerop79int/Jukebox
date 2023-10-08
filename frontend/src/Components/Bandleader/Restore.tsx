import { useEffect } from "react";
import axios from "axios";
import './Restore.css'



const Backup = () => {

    useEffect(() => {
        let url = "http://localhost:5000/restore";

        axios.get(url)
            .then((response) => {
                console.log(response);
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

    }, [])


    return(
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
    )
}

export default Backup;