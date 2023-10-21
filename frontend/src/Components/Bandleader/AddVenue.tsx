import './AddVenue.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdminPortal from './NavbarAdminPortal';

interface Venue {
    id: number,
    name: string
}

const AddVenue = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [venuename, setVenueName] = useState("")
    const [venueaddress, setVenueAddress] = useState("")
    const [venuedate, setVenueDate] = useState("")
    const [venueList, setVenueList] = useState<Venue[]>([])
    const [selectVenue, setSelectVenue] = useState("") 

    const handleSubmitVenue = () => {
        const URL = `http://${backendURL}/venue`

        const data = {
            'venue_name': venuename,
            'venue_address': venueaddress,
            'venue_date': venuedate
        }

        axios.post(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            // refresh the page
            window.location.reload()
            setVenueName("")
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
            if(res.data.venue.length > 0)
            {
            setVenueList(res.data.venue)
            }
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
            setVenueName("")
        })
        
    }


    return(
        <div className="admin-venue-main">
        <NavbarAdminPortal />
        <div className="admin-venue-sub-main">
            <div className="admin-venue-input">
                <div className="admin-venue-sub-input">
                    <p className="admin-venue-input-headiung">
                        Add a New Venue
                    </p>
                    <input onChange={e => setVenueName(e.target.value)} placeholder='Venue Name' className="admin-venue-input-field" />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='Venue Address' className="admin-venue-input-field" />
                    <input onChange={e => setVenueDate(e.target.value)} placeholder='Venue Date' className="admin-venue-input-field" />
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