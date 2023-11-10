import './AddShow.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdminPortal from './NavbarAdminPortal';

interface Venue {
    id: number,
    name: string
}

interface Show {
    id: number,
    venue: string,
    name: string,
    date: string,
    start_time: string,
    end_time: string,
    facebook_event_name: string
}

const Show = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [showid, setShowID] = useState<number>(0)
    const [showname, setShowName] = useState("")
    const [showdate, setShowDate] = useState("")
    // const [showcity, set] = useState("")
    const [showStartTime, setShowStartTime] = useState("")
    const [showEndTime, setShowEndTime] = useState("")
    const [showfacbookeventname, setFacebookEventName] = useState("")
    const [venuelist, setVenueList] = useState<Venue[]>([])
    const [showList, setShowList] = useState<Show[]>([])
    const [selectVenue, setSelectVenue] = useState("") 
    const [selectShow, setSelectShow] = useState("")

    useEffect (() => {
        let URL = `http://${backendURL}/venue`

        axios.get(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            if(res.data.venue.length > 0)
            {
            setVenueList(res.data.venue)
            }
        })
        .catch(err => {
            console.log(err)
        })

        URL = `http://${backendURL}/show`

        axios.get(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            if(res.data.show.length > 0)
            {
            setShowList(res.data.show)
            }
        })
        .catch(err => {
            console.log(err)
        })

    }, [])

    const handleSubmitShow = () => {
        const URL = `http://${backendURL}/show`
        
        const data = {
            'show_venue': selectVenue,
            'show_name': showname,
            'show_date': showdate,
            'show_start_time': showStartTime,
            'show_end_time': showEndTime,
            'show_facebook_event_name': showfacbookeventname
        }

        axios.post(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            // refresh the page
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleUpdateShow = () => {
        const URL = `http://${backendURL}/show`
        console.log(showname)
        const data = {
            'show_name': showname,
            'show_date': showdate,
            'show_start_time': showStartTime,
            'show_end_time': showEndTime,
            'show_facebook_event_name': showfacbookeventname,
            'show_venue': selectVenue,
            'selected_show': selectShow
        }

        axios.put(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            // refresh the page
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
    }

    const SelectShow = (e: any) => {
        // save the venue_name in the local storage

        const URL = `http://${backendURL}/show?selected_show=${selectShow}`


        axios.get(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            console.log(res.data.show)
            const show_name = document.getElementById('show_name') as HTMLInputElement
            const show_date = document.getElementById('show_date') as HTMLInputElement
            const show_start_time = document.getElementById('show_start_time') as HTMLInputElement
            const show_end_time = document.getElementById('show_end_time') as HTMLInputElement
            const facebook_event_name = document.getElementById('facebook_event_name') as HTMLInputElement
            const venue = document.getElementById('venue') as HTMLInputElement

            show_name.value = res.data.show.name
            show_date.value = res.data.show.date
            show_start_time.value = res.data.show.start_time
            show_end_time.value = res.data.show.end_time
            facebook_event_name.value = res.data.show.facebook_event_name
            venue.value = res.data.show.venue.name

            setShowName(res.data.show.name)
            setShowDate(res.data.show.date)
            setShowStartTime(res.data.show.start_time)
            setShowEndTime(res.data.show.end_time)
            setFacebookEventName(res.data.show.facebook_event_name)
            
            setSelectVenue(res.data.show.venue.name)
        })
        
    }


    const handleDeleteShow = () => {
        const URL = `http://${backendURL}/show?show_name=${selectShow}`


        axios.delete(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            // refresh the page
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
    }




    return(
        <div className="admin-show-main">
        <NavbarAdminPortal />
        <div className="admin-show-sub-main">
            <div className="admin-show-input">
                <div className="admin-show-sub-input">
                    <p className="admin-show-input-headiung">
                        Add Show
                    </p>
                    <select className="admin-show-dropdown-menu" onChange={e => setSelectVenue(e.target.value)}>
                        <option value="">Select Venue</option>
                        { venuelist.map((venue) => {
                            return <option key={venue.id} value={venue.name}>{venue.name}</option>
                        })}
                    </select>
                    <input onChange={e => setShowName(e.target.value)} placeholder='Show Name' className="admin-show-input-field" />
                    <input onChange={e => setShowDate(e.target.value)} className="admin-show-input-field" type='date' />
                    <label className="admin-show-input-label">Start Time</label>
                    <input onChange={e => setShowStartTime(e.target.value)} placeholder='State Time' className="admin-show-input-field" type='time' />
                    <label className="admin-show-input-label">End Time</label>
                    <input onChange={e => setShowEndTime(e.target.value)}  placeholder='State Time' className="admin-show-input-field" type='time' />
                    <input onChange={e => setFacebookEventName(e.target.value)} placeholder='Facebook Event Name (Optional)' className="admin-show-input-field" />
                    <button onClick={handleSubmitShow} className="admin-show-input-button">
                        Submit
                    </button>
                </div>
            </div>

            <div className="admin-edit-delete-container">
                <p className="admin-show-dropdown-headiung">
                    Edit/Delete Show
                </p>
                <div className="admin-show-dropdown">
                    <div className="admin-show-sub-dropdown">
                        
                    <select className="admin-show-dropdown-menu" onChange={e => setSelectShow(e.target.value)}>
                        <option value="">Select Show</option>
                        { showList.map((show) => {
                            return <option key={show.id} value={show.name}>{show.name}</option>
                        })}
                    </select>
                    <select className="admin-show-dropdown-menu" id='venue' onChange={e => setSelectVenue(e.target.value)}>
                        <option value="">Select Venue</option>
                        { venuelist.map((venue) => {
                            return <option key={venue.id} value={venue.name}>{venue.name}</option>
                        })}
                    </select>
                    <input onChange={e => setShowName(e.target.value)} id='show_name' placeholder='Show Name' className="admin-show-input-field" />
                    <input onChange={e => setShowDate(e.target.value)} id='show_date' className="admin-show-input-field" type='date' />
                    <label className="admin-show-input-label">Start Time</label>
                    <input onChange={e => setShowStartTime(e.target.value)} id='show_start_time' placeholder='State Time' className="admin-show-input-field" type='time' />
                    <label className="admin-show-input-label">End Time</label>
                    <input onChange={e => setShowEndTime(e.target.value)} id='show_end_time'  placeholder='State Time' className="admin-show-input-field" type='time' />
                    <input onChange={e => setFacebookEventName(e.target.value)} id='facebook_event_name' placeholder='Facebook Event Name (Optional)' className="admin-show-input-field" />

                    </div>
                    <div>
                        <button onClick={SelectShow} className="admin-show-dropdown-button">
                            Select
                        </button>
                        <button onClick={handleDeleteShow} className="admin-show-dropdown-button">
                            Delete
                        </button>
                        <button onClick={handleUpdateShow} className="admin-show-dropdown-button">
                            Update
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Show;