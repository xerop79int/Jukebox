import { useState, useEffect } from 'react';
import './AddShowSchedule.css'
import axios from 'axios';
import NavbarAdminPortal from './NavbarAdminPortal';

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
}

const ShowSchedule = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [showList, setShowList] = useState<Show[]>([]);
    useEffect(() => {

        let URL = `http://${backendURL}/show`

        axios.get(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            console.log(res.data.show)
            if(res.data.show.length > 0)
            {
            setShowList(res.data.show)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    , [])

    const handleShowStart = (name: any) => {
        
        let URL = `http://${backendURL}/show`

        const data = {
            'show_name': name,
            'start': true
        }

        axios.put(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            window.location.href = `/bandleader`
            // if(res.data.show.length > 0)
            // {
            // setShowList(res.data.show)
            // }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return(
        <div className="admin-show-schedule-main">
            <NavbarAdminPortal />
            <div className="admin-show-schedule-sub-main">
                <div className="admin-show-schedule-input">
                    <div className="admin-show-schedule-header">
                        <p className="admin-show-schedule-heading">
                            Upcoming Shows Schedule
                        </p>
                        <button className='admin-show-schedule-input-button'>Past</button>
                    </div>
                    {showList.map((show, index) => {
                    return(
                    <div key={show.id} className='admin-show-schedule-details-container'>
                        <input type="checkbox" className='show-schedule-classbox' />
                        <p>{show.venue}</p>
                        <p>{show.name}</p>
                        <p>{show.date}</p>
                        <p>{show.city}</p>
                        <p className='show-schedule-sub-p'>{show.state}</p>
                        <p className='show-schedule-sub-p'>{show.start_time}</p>
                        <p className='show-schedule-sub-p'>{show.end_time}</p>
                        <button onClick={e => handleShowStart(show.name)} className='admin-show-schedule-input-button start-button'>Start</button>
                    </div>
                    )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ShowSchedule;