import './AddShow.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdminPortal from './NavbarAdminPortal';

interface Venue {
    id: number,
    name: string
}

const Show = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [showname, setVenueName] = useState("")
    const [showaddress, setVenueAddress] = useState("")
    const [showdate, setVenueDate] = useState("")
    const [showList, setVenueList] = useState<Venue[]>([])
    const [selectVenue, setSelectVenue] = useState("") 

    // const handleSubmitVenue = () => {
    //     const URL = `http://${backendURL}/show`

    //     const data = {
    //         'show_name': showname,
    //         'show_address': showaddress,
    //         'show_date': showdate
    //     }

    //     axios.post(URL, data, {
    //         headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    //     })
    //     .then(res => {
    //         // refresh the page
    //         window.location.reload()
    //         setVenueName("")
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    // }

    // useEffect (() => {
    //     const URL = `http://${backendURL}/show`

    //     axios.get(URL, {
    //         headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    //     })
    //     .then(res => {
    //         if(res.data.show.length > 0)
    //         {
    //         setVenueList(res.data.show)
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })

    // }, [])


    const SelectVenue = (e: any) => {
        // save the show_name in the local storage

        const URL = `http://${backendURL}/show`

        const data = {
            'show_name': selectVenue
        }

        axios.put(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            // refresh the page
            window.location.href = "/bandleader"
            setVenueName("")
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
                        { showList.map((show) => {
                            return <option key={show.id} value={show.name}>{show.name}</option>
                        })}
                    </select>
                    <input onChange={e => setVenueName(e.target.value)} placeholder='Venue Name' className="admin-show-input-field" type='date' />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='City' className="admin-show-input-field" />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='State' className="admin-show-input-field" />
                    <label className="admin-show-input-label">Start Time</label>
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='State Time' className="admin-show-input-field" type='time' />
                    <label className="admin-show-input-label">End Time</label>
                    <input onChange={e => setVenueAddress(e.target.value)} type='time' placeholder='State Time' className="admin-show-input-field" />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='Facebook Event Name (Optional)' className="admin-show-input-field" />
                    {/* <input onChange={e => setVenueDate(e.target.value)} placeholder='Venue Date' className="admin-show-input-field" /> */}
                    <button className="admin-show-input-button">
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
                        
                    <select className="admin-show-dropdown-menu" onChange={e => setSelectVenue(e.target.value)}>
                        <option value="">Select Show</option>
                        { showList.map((show) => {
                            return <option key={show.id} value={show.name}>{show.name}</option>
                        })}
                    </select>
                    <select className="admin-show-dropdown-menu" onChange={e => setSelectVenue(e.target.value)}>
                        <option value="">Select Venue</option>
                        { showList.map((show) => {
                            return <option key={show.id} value={show.name}>{show.name}</option>
                        })}
                    </select>
                    <input onChange={e => setVenueName(e.target.value)} placeholder='Venue Name' className="admin-show-input-field" type='date' />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='City' className="admin-show-input-field" />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='State' className="admin-show-input-field" />
                    <label className="admin-show-input-label">Start Time</label>
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='State Time' className="admin-show-input-field" type='time' />
                    <label className="admin-show-input-label">End Time</label>
                    <input onChange={e => setVenueAddress(e.target.value)} type='time' placeholder='State Time' className="admin-show-input-field" />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='Facebook Event Name (Optional)' className="admin-show-input-field" />
                        {/* <input onChange={e => setVenueDate(e.target.value)} placeholder='Venue Date' className="admin-show-input-field" /> */}
                        
                        {/* <button onClick={SelectVenue} className="admin-show-dropdown-button">
                            Select
                        </button> */}
                    </div>
                    <div>
                        <button onClick={SelectVenue} className="admin-show-dropdown-button">
                            Select
                        </button>
                        <button onClick={SelectVenue} className="admin-show-dropdown-button">
                            Delete
                        </button>
                        <button onClick={SelectVenue} className="admin-show-dropdown-button">
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