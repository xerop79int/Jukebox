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
    const [venueList, setVenueList] = useState<Venue[]>([])
    const [selectVenue, setSelectVenue] = useState("") 
    const [venuename, setVenueName] = useState("")
    const [venueaddress, setVenueAddress] = useState("")
    const [venuecity, setVenueCity] = useState("")
    const [venuestate, setVenueState] = useState("")
    const [venuecontactname, setVenueContactName] = useState("")
    const [venuephonenumber, setVenuePhoneNumber] = useState("")
    const [venuefacebook, setVenueFacebook] = useState("")
    const [venueurl, setVenueURL] = useState("")
    const [venuezip, setVenueZipCode] = useState("")
    const [venueid, setVenueID] = useState("")


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

    const handleSubmitVenue = () => {
        const URL = `http://${backendURL}/venue`

        const data = {
            'venue_name': venuename,
            'venue_address': venueaddress,
            'venue_city': venuecity,
            'venue_state': venuestate,
            'venue_zip': venuezip,
            'venue_contact_name': venuecontactname,
            'venue_phone_number': venuephonenumber,
            'venue_facebook': venuefacebook,
            'venue_url': venueurl,

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

    const handleUpdateVenue = () => {
        const URL = `http://${backendURL}/venue`

        const data = {
            'venue_id': venueid,
            'venue_name': venuename,
            'venue_address': venueaddress,
            'venue_city': venuecity,
            'venue_state': venuestate,
            'venue_zip': venuezip,
            'venue_contact_name': venuecontactname,
            'venue_phone_number': venuephonenumber,
            'venue_facebook': venuefacebook,
            'venue_url': venueurl,

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

    const handleDeleteVenue = () => {
        const URL = `http://${backendURL}/venue?venue_name=${selectVenue}`

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


    const SelectVenue = (e: any) => {
        // save the venue_name in the local storage

        const URL = `http://${backendURL}/venue?selected_venue=${selectVenue}`

        axios.get(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            const venue_name = document.getElementById('venue_name') as HTMLInputElement
            const venue_address = document.getElementById('venue_address') as HTMLInputElement
            const venue_city = document.getElementById('venue_city') as HTMLInputElement
            const venue_state = document.getElementById('venue_state') as HTMLInputElement
            const venue_zip = document.getElementById('venue_zip') as HTMLInputElement
            const venue_contact_name = document.getElementById('venue_contact_name') as HTMLInputElement
            const venue_phone_number = document.getElementById('venue_phone_number') as HTMLInputElement
            const venue_facebook = document.getElementById('venue_facebook') as HTMLInputElement
            const venue_url = document.getElementById('venue_url') as HTMLInputElement

            venue_name.value = res.data.venue.name
            venue_address.value = res.data.venue.address
            venue_city.value = res.data.venue.city
            venue_state.value = res.data.venue.state
            venue_zip.value = res.data.venue.zipcode
            venue_contact_name.value = res.data.venue.contact_name
            venue_phone_number.value = res.data.venue.phone_number
            venue_facebook.value = res.data.venue.facebook
            venue_url.value = res.data.venue.url
            
            setVenueName(res.data.venue.name)
            setVenueAddress(res.data.venue.address)
            setVenueCity(res.data.venue.city)
            setVenueState(res.data.venue.state)
            setVenueZipCode(res.data.venue.zipcode)
            setVenueContactName(res.data.venue.contact_name)
            setVenuePhoneNumber(res.data.venue.phone_number)
            setVenueFacebook(res.data.venue.facebook)
            setVenueURL(res.data.venue.url)
            setVenueID(res.data.venue.id)
        })
        
    }


    return(
        <div className="admin-venue-main">
        <NavbarAdminPortal />
        <div className="admin-venue-sub-main">
            <div className="admin-venue-input">
                <div className="admin-venue-sub-input">
                    <p className="admin-venue-input-headiung">
                        Add Venue
                    </p>
                    <input onChange={e => setVenueName(e.target.value)} placeholder='Venue Name' className="admin-venue-input-field" />
                    <input onChange={e => setVenueAddress(e.target.value)} placeholder='Venue Address' className="admin-venue-input-field" />
                    <input onChange={e => setVenueCity(e.target.value)} placeholder='City' className="admin-venue-input-field" />
                    <select onChange={e => setVenueState(e.target.value)} placeholder='State' className="admin-venue-input-field">
                        <option value="">Select State</option>
                        <option value="AL">AL</option>
                        <option value="AK">AK</option>
                        <option value="AZ">AZ</option>
                        <option value="AR">AR</option>
                        <option value="CA">CA</option>
                        <option value="CO">CO</option>
                        <option value="CT">CT</option>
                        <option value="DE">DE</option>
                        <option value="DC">DC</option>
                        <option value="FL">FL</option>
                        <option value="GA">GA</option>
                        <option value="GU">GU</option>
                        <option value="HI">HI</option>
                        <option value="ID">ID</option>
                        <option value="IL">IL</option>
                        <option value="IN">IN</option>
                        <option value="IA">IA</option>
                        <option value="KS">KS</option>
                        <option value="KY">KY</option>
                        <option value="LA">LA</option>
                        <option value="ME">ME</option>
                        <option value="MD">MD</option>
                        <option value="MA">MA</option>
                        <option value="MI">MI</option>
                        <option value="MN">MN</option>
                        <option value="MS">MS</option>
                        <option value="MO">MO</option>
                        <option value="MT">MT</option>
                        <option value="NE">NE</option>
                        <option value="NV">NV</option>
                        <option value="NH">NH</option>
                        <option value="NJ">NJ</option>
                        <option value="NM">NM</option>
                        <option value="NY">NY</option>
                        <option value="NC">NC</option>
                        <option value="ND">ND</option>
                        <option value="MP">MP</option>
                        <option value="OH">OH</option>
                        <option value="OK">OK</option>
                        <option value="OR">OR</option>
                        <option value="PA">PA</option>
                        <option value="PR">PR</option>
                        <option value="RI">RI</option>
                        <option value="SC">SC</option>
                        <option value="SD">SD</option>
                        <option value="TN">TN</option>
                        <option value="TX">TX</option>
                        <option value="TT">TT</option>
                        <option value="UT">UT</option>
                        <option value="VT">VT</option>
                        <option value="VI">VI</option>
                        <option value="VA">VA</option>
                        <option value="WA">WA</option>
                        <option value="WV">WV</option>
                        <option value="WI">WI</option>
                        <option value="WY">WY</option>

                    </select>
                    <input onChange={e => setVenueZipCode(e.target.value)} placeholder='Zip Code' className="admin-venue-input-field" />
                    <input onChange={e => setVenueContactName(e.target.value)} placeholder='Contact Name (Optional)' className="admin-venue-input-field" />
                    <input onChange={e => setVenuePhoneNumber(e.target.value)} placeholder='Phone Number (Optional)' className="admin-venue-input-field" />
                    <input onChange={e => setVenueFacebook(e.target.value)} placeholder='Facebook (Optional)' className="admin-venue-input-field" />
                    <input onChange={e => setVenueURL(e.target.value)} placeholder='https:// (Optional)' className="admin-venue-input-field" />
                    {/* <input onChange={e => setVenueDate(e.target.value)} placeholder='Venue Date' className="admin-venue-input-field" /> */}
                    <button onClick={handleSubmitVenue} className="admin-venue-input-button">
                        Submit
                    </button>
                </div>
            </div>

            <div className="admin-venue-edit-delete-container">
                <p className="admin-venue-dropdown-headiung">
                    Edit/Delete Venue
                </p>
                <div className="admin-venue-dropdown">
                    <div className="admin-venue-sub-dropdown">
                        
                        <select className="admin-venue-dropdown-menu" onChange={e => setSelectVenue(e.target.value)}>
                        <option value="">Select Venue</option>
                        { venueList.map((venue) => {
                            return <option key={venue.id} value={venue.name}>{venue.name}</option>
                        })}
                        </select>
                        <input onChange={e => setVenueName(e.target.value)} id='venue_name' placeholder='Venue Name' className="admin-venue-input-field" />
                        <input onChange={e => setVenueAddress(e.target.value)} id='venue_address'   placeholder='Venue Address' className="admin-venue-input-field" />
                        <input onChange={e => setVenueCity(e.target.value)} id='venue_city'  placeholder='City' className="admin-venue-input-field" />
                        <select onChange={e => setVenueState(e.target.value)} id='venue_state' placeholder='State' className="admin-venue-input-field">
                            <option value="">Select State</option>
                            <option value="AL">AL</option>
                            <option value="AK">AK</option>
                            <option value="AZ">AZ</option>
                            <option value="AR">AR</option>
                            <option value="CA">CA</option>
                            <option value="CO">CO</option>
                            <option value="CT">CT</option>
                            <option value="DE">DE</option>
                            <option value="DC">DC</option>
                            <option value="FL">FL</option>
                            <option value="GA">GA</option>
                            <option value="GU">GU</option>
                            <option value="HI">HI</option>
                            <option value="ID">ID</option>
                            <option value="IL">IL</option>
                            <option value="IN">IN</option>
                            <option value="IA">IA</option>
                            <option value="KS">KS</option>
                            <option value="KY">KY</option>
                            <option value="LA">LA</option>
                            <option value="ME">ME</option>
                            <option value="MD">MD</option>
                            <option value="MA">MA</option>
                            <option value="MI">MI</option>
                            <option value="MN">MN</option>
                            <option value="MS">MS</option>
                            <option value="MO">MO</option>
                            <option value="MT">MT</option>
                            <option value="NE">NE</option>
                            <option value="NV">NV</option>
                            <option value="NH">NH</option>
                            <option value="NJ">NJ</option>
                            <option value="NM">NM</option>
                            <option value="NY">NY</option>
                            <option value="NC">NC</option>
                            <option value="ND">ND</option>
                            <option value="MP">MP</option>
                            <option value="OH">OH</option>
                            <option value="OK">OK</option>
                            <option value="OR">OR</option>
                            <option value="PA">PA</option>
                            <option value="PR">PR</option>
                            <option value="RI">RI</option>
                            <option value="SC">SC</option>
                            <option value="SD">SD</option>
                            <option value="TN">TN</option>
                            <option value="TX">TX</option>
                            <option value="TT">TT</option>
                            <option value="UT">UT</option>
                            <option value="VT">VT</option>
                            <option value="VI">VI</option>
                            <option value="VA">VA</option>
                            <option value="WA">WA</option>
                            <option value="WV">WV</option>
                            <option value="WI">WI</option>
                            <option value="WY">WY</option>
                        </select>
                        <input onChange={e => setVenueZipCode(e.target.value)} id='venue_zip'  placeholder='Zip Code' className="admin-venue-input-field" />
                        <input onChange={e => setVenueContactName(e.target.value)} id='venue_contact_name'  placeholder='Contact Name (Optional)' className="admin-venue-input-field" />
                        <input onChange={e => setVenuePhoneNumber(e.target.value)} id='venue_phone_number' placeholder='Phone Number (Optional)' className="admin-venue-input-field" />
                        <input onChange={e => setVenueFacebook(e.target.value)} id='venue_facebook' placeholder='Facebook (Optional)' className="admin-venue-input-field" />
                        <input onChange={e => setVenueURL(e.target.value)} id='venue_url' placeholder='https:// (Optional)' className="admin-venue-input-field" />
                        {/* <input onChange={e => setVenueDate(e.target.value)} placeholder='Venue Date' className="admin-venue-input-field" /> */}
                        
                        {/* <button onClick={SelectVenue} className="admin-venue-dropdown-button">
                            Select
                        </button> */}
                    </div>
                    <div className='admin-edit-delete-button-container'>
                        <button onClick={SelectVenue} className="admin-venue-dropdown-button">
                            Select
                        </button>
                        <button onClick={handleDeleteVenue} className="admin-venue-dropdown-button">
                            Delete
                        </button>
                        <button onClick={handleUpdateVenue} className="admin-venue-dropdown-button venue-edit-delete-update-button">
                            Update
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default AddVenue;