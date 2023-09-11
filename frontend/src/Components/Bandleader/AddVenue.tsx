import './AddVenue.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Venue {
    id: number,
    name: string
}

const AddVenue = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [venue, setVenue] = useState("")
    const [venueList, setVenueList] = useState<Venue[]>([])
    const [selectVenue, setSelectVenue] = useState("") 

    const handleSubmitVenue = () => {
        const URL = `http://${backendURL}/venue`

        const data = {
            'venue_name': venue
        }

        axios.post(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            localStorage.setItem('venue_name', venue)
            // refresh the page
            window.location.reload()
            setVenue("")
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect (() => {
        const URL = `http://${backendURL}/venue`

        axios.get(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            setVenueList(res.data.venue)
        })
        .catch(err => {
            console.log(err)
        })

    }, [])


    const SelectVenue = (e: any) => {
        // save the venue_name in the local storage

        const URL = `http://${backendURL}/venue`

        const data = {
            'venue_name': selectVenue
        }

        axios.put(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            // refresh the page
            window.location.href = "/bandleader"
            setVenue("")
        })
        
    }


    return(
        <div className="admin-venue-main">
        <div className="admin-venue-navbar">
            <div className="admin-venue-nav-links">
                <a href="/addsinglesong">Add Song &nbsp;</a>
                <a href="/addvenue">&nbsp;Add or Select Venue &nbsp;</a>
                <a href="/editsong">&nbsp;Edit Song &nbsp;</a>
                <a href="/bandleader">&nbsp;Bandleader Dashboard</a>
                <a href="/upload">&nbsp;&nbsp;Upload</a>
            </div>
            <div className="admin-venue-nav-logout">
                <button>
                    LOGOUT
                </button>
            </div>
        </div>
        <div className="admin-venue-sub-main">
            <div className="admin-venue-input">
                <div className="admin-venue-sub-input">
                    <p className="admin-venue-input-headiung">
                        Add a New Venue
                    </p>
                    <textarea onChange={e => setVenue(e.target.value)} className="admin-venue-input-field">

                    </textarea>
                    <button onClick={handleSubmitVenue} className="admin-venue-input-button">
                        Submit
                    </button>
                </div>
            </div>
            <div className="admin-venue-dropdown">
                <div className="admin-venue-sub-dropdown">
                    <p className="admin-venue-dropdown-headiung">
                        Choice from the Existing Venues
                    </p>
                    <select className="admin-venue-dropdown-menu" onChange={e => setSelectVenue(e.target.value)}>
                    <option value="">Select Venue</option>
                    { venueList.map((venue) => {
                        return <option key={venue.id} value={venue.name}>{venue.name}</option>
                    })}
                    </select>
                    
                    <button onClick={SelectVenue} className="admin-venue-dropdown-button">
                        Select
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default AddVenue;