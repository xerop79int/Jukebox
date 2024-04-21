import { useState, useEffect, useRef, MutableRefObject } from 'react';
import './Logs.css'
import axios from 'axios';
import NavbarAdminPortal from './NavbarAdminPortal';
import html2canvas from 'html2canvas';

interface Show {
    id: number,
    venue: string,
    name: string,
    date: string,
    start_time: string,
    end_time: string,
    facebook_event_name: string,
    city: string,
    state: string,
    check: boolean,
}

interface Logs {
    id: number,
    log: string,
    type: string,
    date: string,
}

const ShowSchedule = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [logs, setLogs] = useState<Logs[]>([]);
    const [showList, setShowList] = useState<Show[]>([]);
    const myTableRef: MutableRefObject<HTMLTableSectionElement | null> = useRef(null);
    // useEffect(() => {

    //     let URL = `http://${backendURL}/show?future=true`

    //     axios.get(URL, {
    //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    //     })
    //     .then(res => {
    //         console.log(res.data.show)
    //         if(res.data.show.length > 0)
    //         {
    //         setShowList(res.data.show)
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    // }
    // , [])

    useEffect(() => {

        let URL = `http://${backendURL}/logs`

        axios.get(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(res => {
            setLogs(res.data.logs)
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }
    , [])

    const handleDeleteLogs = () => {
        let URL = `http://${backendURL}/logs`

        axios.delete(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(res => {
            setLogs([])
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleExportLogs = () => {
        const header = document.querySelector('.admin-logs-screenshot-heading') as HTMLElement;
        html2canvas(header, {
            backgroundColor: "#303030",
        }).then(function(canvas) {
            var link = document.createElement('a');
            link.download = 'logs.png';
            link.href = canvas.toDataURL()
            link.click();
        });
    }





    return(
        <div className="admin-logs-main">
            <NavbarAdminPortal />
            <div className="admin-logs-sub-main">
                <div className="admin-logs-input">
                    <div className="admin-logs-header">
                        <p className="admin-logs-heading">
                            Logs
                        </p>
                    </div>
                    <table className='admin-logs-screenshot-heading' >
                        <thead>
                            <tr className='admin-logs-screenshot-heading-tr'>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th></th>
                            </tr>
                        </thead>
                        {/* <div ref={containerRef}> */}
                        <tbody className='admin-logs-container' ref={myTableRef}>
                            {logs.map((log, index) => {
                            return(
                                <tr key={log.id} id='shows'
                                 className='admin-logs-details-container'
                                 >
                                    <td className='admin-logs-screenshot-tbody-td admin-logs-type'>
                                        <p>{log.type}</p>
                                    </td>
                                    <td className='admin-logs-screenshot-tbody-td admin-logs-date'>
                                        <p>{log.date}</p>
                                    </td>
                                    <td className='admin-logs-screenshot-tbody-td-sub admin-logs-log'>
                                        <p className='logs-sub-p'>{log.log}</p>
                                    </td>
                                </tr>
                            )
                        })}
                            </tbody>

                    </table>

                    <div className='admin-logs-publish-button-container'>
                        <button onClick={handleDeleteLogs} className='admin-logs-publish-Button'>Delete all logs</button>
                        <button onClick={handleExportLogs} className='admin-logs-publish-Button'>Export logs</button>
                        {/* <button className='admin-logs-publish-Button'>Publish to Email List</button>
                        <button className='admin-logs-publish-Button'>Publish to Facebook Post</button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowSchedule;