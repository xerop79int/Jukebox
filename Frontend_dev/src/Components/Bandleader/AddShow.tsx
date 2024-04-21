import './AddShow.css'
import { useState, useEffect } from 'react';
import axios, { all } from 'axios';
import NavbarAdminPortal from './NavbarAdminPortal';

interface Venue {
    id: number,
    name: string,
    city: string,
    state: string,
}

interface Show {
    id: number,
    venue: string,
    name: string,
    date: string,
    formatted_date: string,
    start_time: string,
    end_time: string,
    facebook_event_name: string
}

interface Sets {
    id: number;
    set_name: string;
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
    const [Sets, setSets] = useState<Sets[]>([]);
    const [set1, setSet1] = useState("")
    const [set2, setSet2] = useState("")
    const [set3, setSet3] = useState("")
    const [set4, setSet4] = useState("")

    useEffect (() => {
        let URL = `http://${backendURL}/venue`

        axios.get(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

        handleGetSets()

    }, [])

    


    const handleGetSets = () => {
        const URL = `http://${backendURL}/sets`
    
        axios.get(URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(res => {
          if(res.data.sets.length > 0)
          {
            setSets(res.data.sets);
          }
        })
        .catch(err => console.log(err))
      }

    const handleSubmitShow = () => {
        if (selectVenue === "" || showdate === "" || showStartTime === "" || showEndTime === ""){
            const alert = document.querySelector('.show-alert-box') as HTMLElement;
            const alertMessage = document.querySelector('.show-alert-message') as HTMLElement;
            alertMessage.innerHTML = "Complete the option to add a show"
            alert.style.display = "block";

            setTimeout(function() {
                alert.style.display = 'none';
            }
            , 2000);
            return;
        }
        const URL = `http://${backendURL}/show`
        const setList = [set1, set2, set3, set4]
        const data = {
            'show_venue': selectVenue,
            'show_date': showdate,
            'show_start_time': showStartTime,
            'show_end_time': showEndTime,
            'show_facebook_event_name': showfacbookeventname,
            'sets': setList
        }

        axios.post(URL, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        const setList = [set1, set2, set3, set4]
        const URL = `http://${backendURL}/show`
        
        const data = {
            'show_date': showdate,
            'show_start_time': showStartTime,
            'show_end_time': showEndTime,
            'show_facebook_event_name': showfacbookeventname,
            'show_venue': selectVenue,
            'selected_show': selectShow,
            'sets': setList
        }

        axios.put(URL, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

        const URL = `http://${backendURL}/show?selected_show=${selectShow}`


        axios.get(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(res => {
            console.log(res.data.show)
            const show_date = document.getElementById('show_date') as HTMLInputElement
            const show_start_time = document.getElementById('show_start_time') as HTMLInputElement
            const show_end_time = document.getElementById('show_end_time') as HTMLInputElement
            const facebook_event_name = document.getElementById('facebook_event_name') as HTMLInputElement
            const venue = document.getElementById('venue') as HTMLInputElement
            const city = document.getElementById('admin-show-city-update') as HTMLInputElement
            const state = document.getElementById('admin-show-state-update') as HTMLInputElement
            const date = document.getElementById('admin-day-date-format-update') as HTMLInputElement
            const sets = document.querySelectorAll('#sets') as NodeListOf<HTMLInputElement>;
            

            show_date.value = res.data.show.date
            show_start_time.value = res.data.show.start_time
            show_end_time.value = res.data.show.end_time
            facebook_event_name.value = res.data.show.facebook_event_name
            venue.value = res.data.show.venue.name
            city.textContent = res.data.show.venue.city
            state.textContent = res.data.show.venue.state
            date.textContent = res.data.show.formatted_date


            let i = 0
            res.data.show.sets.forEach((s: any) => {
                Sets.forEach((set: any) => {
                    if(set.set_name === s.set_name)
                    {
                        sets[i].value = set.id
                        if (i === 0)
                            setSet1(set.id)
                        else if (i === 1)
                            setSet2(set.id)
                        else if (i === 2)
                            setSet3(set.id)
                        else if (i === 3)
                            setSet4(set.id)
                        i++
                    }
                })    
            });

            

            setShowDate(res.data.show.date)
            setShowStartTime(res.data.show.start_time)
            setShowEndTime(res.data.show.end_time)
            setFacebookEventName(res.data.show.facebook_event_name)
            setSelectVenue(res.data.show.venue.name)
        })
        
        
    }


    const handleDeleteShow = () => {
        const URL = `http://${backendURL}/show?show_id=${selectShow}`


        axios.delete(URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then(res => {
            // refresh the page
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleVenueSelect = (e: any) => {
        setSelectVenue(e.target.value)

        // find the venue with the name 
        const venue = venuelist.find(venue => venue.name === e.target.value)
        if(venue)
        {
            const city = document.getElementById('admin-show-city') as HTMLInputElement
            const state = document.getElementById('admin-show-state') as HTMLInputElement
            city.textContent = venue.city
            state.textContent = venue.state
        }
    }


    const handleDate = (e: any) => {
        setShowDate(e.target.value)
        const date = e.target.value
        console.log(date);
        const [year, month, day] = date.split('-');
        const isDateValid = !isNaN(Date.parse(`${year}-${month}-${day}`));
        console.log(isDateValid);
        if (isDateValid) {      
            console.log('valid date');
            const date_data = new Date(date);
            const dayOfMonth = date_data.getDate();

            const month_short = date_data.toLocaleString('default', { month: 'short' });
            const dayOfWeek = date_data.toLocaleString('default', { weekday: 'long' });

            let suffix = dayOfMonth > 0
            ? ["th", "st", "nd", "rd"][
                (dayOfMonth > 3 && dayOfMonth < 21) || dayOfMonth % 10 > 3 ? 0 : dayOfMonth % 10
            ]
            : "";
            
            const date_obj = document.getElementById('admin-day-date-format') as HTMLInputElement
            date_obj.textContent = `${dayOfWeek} ${month_short} ${parseInt(day)}${suffix}, ${year}`
        
        }
    }






    return(
        <div className="admin-show-main">
        <NavbarAdminPortal />
            <div className="show-alert-box bandleader-green">
                    <p className='show-alert-message'></p>
            </div>
        <div className="admin-show-sub-main">
        <div className="admin-edit-delete-container">
                <p className="admin-show-dropdown-headiung">
                    Add
                </p>
                <div className="admin-show-dropdown">
                    <div className="admin-show-sub-dropdown">
                        
                    <select className="admin-show-dropdown-menu" onChange={e => handleVenueSelect(e)}>
                        <option value="">Select Venue</option>
                        { venuelist.map((venue) => {
                            return <option key={venue.id} value={venue.name}>{venue.name}</option>
                        })}
                    </select>
                    <input onChange={e => handleDate(e)} className="admin-show-input-field" type='date' />
                    
                    <p className='admin-day-date-format' id='admin-day-date-format'>Date</p>
                    <div className='admin-show-city-state-container'>
                        <p id='admin-show-city'>City</p>
                        <p className='admin-show-state' id='admin-show-state'>State</p>
                    </div>

                    <label className="admin-show-input-label">Start Time</label>
                    <select className="admin-show-input-field" onChange={e => setShowStartTime(e.target.value)}>
                        <option value="">Start Time</option>
                        <option value="00:00">12:00 AM</option>
                        <option value="00:15">12:15 AM</option>
                        <option value="00:30">12:30 AM</option>
                        <option value="00:45">12:45 AM</option>
                        <option value="01:00">01:00 AM</option>
                        <option value="01:15">01:15 AM</option>
                        <option value="01:30">01:30 AM</option>
                        <option value="01:45">01:45 AM</option>
                        <option value="02:00">02:00 AM</option>
                        <option value="02:15">02:15 AM</option>
                        <option value="02:30">02:30 AM</option>
                        <option value="02:45">02:45 AM</option>
                        <option value="03:00">03:00 AM</option>
                        <option value="03:15">03:15 AM</option>
                        <option value="03:30">03:30 AM</option>
                        <option value="03:45">03:45 AM</option>
                        <option value="04:00">04:00 AM</option>
                        <option value="04:15">04:15 AM</option>
                        <option value="04:30">04:30 AM</option>
                        <option value="04:45">04:45 AM</option>
                        <option value="05:00">05:00 AM</option>
                        <option value="05:15">05:15 AM</option>
                        <option value="05:30">05:30 AM</option>
                        <option value="05:45">05:45 AM</option>
                        <option value="06:00">06:00 AM</option>
                        <option value="06:15">06:15 AM</option>
                        <option value="06:30">06:30 AM</option>
                        <option value="06:45">06:45 AM</option>
                        <option value="07:00">07:00 AM</option>
                        <option value="07:15">07:15 AM</option>
                        <option value="07:30">07:30 AM</option>
                        <option value="07:45">07:45 AM</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="08:15">08:15 AM</option>
                        <option value="08:30">08:30 AM</option>
                        <option value="08:45">08:45 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="09:15">09:15 AM</option>
                        <option value="09:30">09:30 AM</option>
                        <option value="09:45">09:45 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:15">10:15 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="10:45">10:45 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:15">11:15 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="11:45">11:45 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:15">12:15 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="12:45">12:45 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="13:15">01:15 PM</option>
                        <option value="13:30">01:30 PM</option>
                        <option value="13:45">01:45 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="14:15">02:15 PM</option>
                        <option value="14:30">02:30 PM</option>
                        <option value="14:45">02:45 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="15:15">03:15 PM</option>
                        <option value="15:30">03:30 PM</option>
                        <option value="15:45">03:45 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="16:15">04:15 PM</option>
                        <option value="16:30">04:30 PM</option>
                        <option value="16:45">04:45 PM</option>
                        <option value="17:00">05:00 PM</option>
                        <option value="17:15">05:15 PM</option>
                        <option value="17:30">05:30 PM</option>
                        <option value="17:45">05:45 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="18:15">06:15 PM</option>
                        <option value="18:30">06:30 PM</option>
                        <option value="18:45">06:45 PM</option>
                        <option value="19:00">07:00 PM</option>
                        <option value="19:15">07:15 PM</option>
                        <option value="19:30">07:30 PM</option>
                        <option value="19:45">07:45 PM</option>
                        <option value="20:00">08:00 PM</option>
                        <option value="20:15">08:15 PM</option>
                        <option value="20:30">08:30 PM</option>
                        <option value="20:45">08:45 PM</option>
                        <option value="21:00">09:00 PM</option>
                        <option value="21:15">09:15 PM</option>
                        <option value="21:30">09:30 PM</option>
                        <option value="21:45">09:45 PM</option>
                        <option value="22:00">10:00 PM</option>
                        <option value="22:15">10:15 PM</option>
                        <option value="22:30">10:30 PM</option>
                        <option value="22:45">10:45 PM</option>
                        <option value="23:00">11:00 PM</option>
                        <option value="23:15">11:15 PM</option>
                        <option value="23:30">11:30 PM</option>
                        <option value="23:45">11:45 PM</option>
                    </select>
                    <label className="admin-show-input-label">End Time</label>
                    <select className="admin-show-input-field" onChange={e => setShowEndTime(e.target.value)} required>
                        <option value="">End Time</option>
                        <option value="00:00">12:00 AM</option>
                        <option value="00:15">12:15 AM</option>
                        <option value="00:30">12:30 AM</option>
                        <option value="00:45">12:45 AM</option>
                        <option value="01:00">01:00 AM</option>
                        <option value="01:15">01:15 AM</option>
                        <option value="01:30">01:30 AM</option>
                        <option value="01:45">01:45 AM</option>
                        <option value="02:00">02:00 AM</option>
                        <option value="02:15">02:15 AM</option>
                        <option value="02:30">02:30 AM</option>
                        <option value="02:45">02:45 AM</option>
                        <option value="03:00">03:00 AM</option>
                        <option value="03:15">03:15 AM</option>
                        <option value="03:30">03:30 AM</option>
                        <option value="03:45">03:45 AM</option>
                        <option value="04:00">04:00 AM</option>
                        <option value="04:15">04:15 AM</option>
                        <option value="04:30">04:30 AM</option>
                        <option value="04:45">04:45 AM</option>
                        <option value="05:00">05:00 AM</option>
                        <option value="05:15">05:15 AM</option>
                        <option value="05:30">05:30 AM</option>
                        <option value="05:45">05:45 AM</option>
                        <option value="06:00">06:00 AM</option>
                        <option value="06:15">06:15 AM</option>
                        <option value="06:30">06:30 AM</option>
                        <option value="06:45">06:45 AM</option>
                        <option value="07:00">07:00 AM</option>
                        <option value="07:15">07:15 AM</option>
                        <option value="07:30">07:30 AM</option>
                        <option value="07:45">07:45 AM</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="08:15">08:15 AM</option>
                        <option value="08:30">08:30 AM</option>
                        <option value="08:45">08:45 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="09:15">09:15 AM</option>
                        <option value="09:30">09:30 AM</option>
                        <option value="09:45">09:45 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:15">10:15 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="10:45">10:45 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:15">11:15 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="11:45">11:45 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:15">12:15 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="12:45">12:45 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="13:15">01:15 PM</option>
                        <option value="13:30">01:30 PM</option>
                        <option value="13:45">01:45 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="14:15">02:15 PM</option>
                        <option value="14:30">02:30 PM</option>
                        <option value="14:45">02:45 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="15:15">03:15 PM</option>
                        <option value="15:30">03:30 PM</option>
                        <option value="15:45">03:45 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="16:15">04:15 PM</option>
                        <option value="16:30">04:30 PM</option>
                        <option value="16:45">04:45 PM</option>
                        <option value="17:00">05:00 PM</option>
                        <option value="17:15">05:15 PM</option>
                        <option value="17:30">05:30 PM</option>
                        <option value="17:45">05:45 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="18:15">06:15 PM</option>
                        <option value="18:30">06:30 PM</option>
                        <option value="18:45">06:45 PM</option>
                        <option value="19:00">07:00 PM</option>
                        <option value="19:15">07:15 PM</option>
                        <option value="19:30">07:30 PM</option>
                        <option value="19:45">07:45 PM</option>
                        <option value="20:00">08:00 PM</option>
                        <option value="20:15">08:15 PM</option>
                        <option value="20:30">08:30 PM</option>
                        <option value="20:45">08:45 PM</option>
                        <option value="21:00">09:00 PM</option>
                        <option value="21:15">09:15 PM</option>
                        <option value="21:30">09:30 PM</option>
                        <option value="21:45">09:45 PM</option>
                        <option value="22:00">10:00 PM</option>
                        <option value="22:15">10:15 PM</option>
                        <option value="22:30">10:30 PM</option>
                        <option value="22:45">10:45 PM</option>
                        <option value="23:00">11:00 PM</option>
                        <option value="23:15">11:15 PM</option>
                        <option value="23:30">11:30 PM</option>
                        <option value="23:45">11:45 PM</option>
                    </select>
                    <input onChange={e => setFacebookEventName(e.target.value)} placeholder='Facebook Event Name (Optional)' className="admin-show-input-field" />
                    <button onClick={handleSubmitShow} className="admin-show-dropdown-button">Submit</button>
                    </div>
                    <div>
                    <select className="admin-show-dropdown-sets"  onChange={e => setSet1(e.target.value)}>
                        <option value="">Sets</option>
                        { Sets.map((set) => {
                            return <option key={set.id} value={set.id}>{set.set_name}</option>
                        })}
                    </select>
                    <select className="admin-show-dropdown-sets"  onChange={e => setSet2(e.target.value)}>
                        <option value="">Sets</option>
                        { Sets.map((set) => {
                            return <option key={set.id} value={set.id}>{set.set_name}</option>
                        })}
                    </select>
                    <select className="admin-show-dropdown-sets"  onChange={e => setSet3(e.target.value)}>
                        <option value="">Sets</option>
                        { Sets.map((set) => {
                            return <option key={set.id} value={set.id}>{set.set_name}</option>
                        })}
                    </select>
                    <select className="admin-show-dropdown-sets" onChange={e => setSet4(e.target.value)}>
                        <option value="">Sets</option>
                        { Sets.map((set) => {
                            return <option key={set.id} value={set.id}>{set.set_name}</option>
                        })}
                    </select>
                        
                    </div>
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
                            return <option key={show.id} value={show.id}>{show.name}</option>
                        })}
                    </select>
                    <input onChange={e => setShowDate(e.target.value)} id='show_date' className="admin-show-input-field" type='date' />
                    
                    <p className='admin-day-date-format' id='admin-day-date-format-update'>Date</p>
                    <div className='admin-show-city-state-container'>
                        <p id='admin-show-city-update'>City</p>
                        <p className='admin-show-state' id='admin-show-state-update'>State</p>
                    </div>

                    <label className="admin-show-input-label">Start Time</label>
                    <select onChange={e => setShowStartTime(e.target.value)} id='show_start_time' className="admin-show-input-field" >
                        <option value="">Start Time</option>
                        <option value="00:00">12:00 AM</option>
                        <option value="00:15">12:15 AM</option>
                        <option value="00:30">12:30 AM</option>
                        <option value="00:45">12:45 AM</option>
                        <option value="01:00">01:00 AM</option>
                        <option value="01:15">01:15 AM</option>
                        <option value="01:30">01:30 AM</option>
                        <option value="01:45">01:45 AM</option>
                        <option value="02:00">02:00 AM</option>
                        <option value="02:15">02:15 AM</option>
                        <option value="02:30">02:30 AM</option>
                        <option value="02:45">02:45 AM</option>
                        <option value="03:00">03:00 AM</option>
                        <option value="03:15">03:15 AM</option>
                        <option value="03:30">03:30 AM</option>
                        <option value="03:45">03:45 AM</option>
                        <option value="04:00">04:00 AM</option>
                        <option value="04:15">04:15 AM</option>
                        <option value="04:30">04:30 AM</option>
                        <option value="04:45">04:45 AM</option>
                        <option value="05:00">05:00 AM</option>
                        <option value="05:15">05:15 AM</option>
                        <option value="05:30">05:30 AM</option>
                        <option value="05:45">05:45 AM</option>
                        <option value="06:00">06:00 AM</option>
                        <option value="06:15">06:15 AM</option>
                        <option value="06:30">06:30 AM</option>
                        <option value="06:45">06:45 AM</option>
                        <option value="07:00">07:00 AM</option>
                        <option value="07:15">07:15 AM</option>
                        <option value="07:30">07:30 AM</option>
                        <option value="07:45">07:45 AM</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="08:15">08:15 AM</option>
                        <option value="08:30">08:30 AM</option>
                        <option value="08:45">08:45 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="09:15">09:15 AM</option>
                        <option value="09:30">09:30 AM</option>
                        <option value="09:45">09:45 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:15">10:15 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="10:45">10:45 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:15">11:15 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="11:45">11:45 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:15">12:15 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="12:45">12:45 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="13:15">01:15 PM</option>
                        <option value="13:30">01:30 PM</option>
                        <option value="13:45">01:45 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="14:15">02:15 PM</option>
                        <option value="14:30">02:30 PM</option>
                        <option value="14:45">02:45 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="15:15">03:15 PM</option>
                        <option value="15:30">03:30 PM</option>
                        <option value="15:45">03:45 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="16:15">04:15 PM</option>
                        <option value="16:30">04:30 PM</option>
                        <option value="16:45">04:45 PM</option>
                        <option value="17:00">05:00 PM</option>
                        <option value="17:15">05:15 PM</option>
                        <option value="17:30">05:30 PM</option>
                        <option value="17:45">05:45 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="18:15">06:15 PM</option>
                        <option value="18:30">06:30 PM</option>
                        <option value="18:45">06:45 PM</option>
                        <option value="19:00">07:00 PM</option>
                        <option value="19:15">07:15 PM</option>
                        <option value="19:30">07:30 PM</option>
                        <option value="19:45">07:45 PM</option>
                        <option value="20:00">08:00 PM</option>
                        <option value="20:15">08:15 PM</option>
                        <option value="20:30">08:30 PM</option>
                        <option value="20:45">08:45 PM</option>
                        <option value="21:00">09:00 PM</option>
                        <option value="21:15">09:15 PM</option>
                        <option value="21:30">09:30 PM</option>
                        <option value="21:45">09:45 PM</option>
                        <option value="22:00">10:00 PM</option>
                        <option value="22:15">10:15 PM</option>
                        <option value="22:30">10:30 PM</option>
                        <option value="22:45">10:45 PM</option>
                        <option value="23:00">11:00 PM</option>
                        <option value="23:15">11:15 PM</option>
                        <option value="23:30">11:30 PM</option>
                        <option value="23:45">11:45 PM</option>
                    </select>
                    <label className="admin-show-input-label">End Time</label>
                    <select onChange={e => setShowEndTime(e.target.value)} id='show_end_time' className="admin-show-input-field" >
                        <option value="">End Time</option>
                        <option value="00:00">12:00 AM</option>
                        <option value="00:15">12:15 AM</option>
                        <option value="00:30">12:30 AM</option>
                        <option value="00:45">12:45 AM</option>
                        <option value="01:00">01:00 AM</option>
                        <option value="01:15">01:15 AM</option>
                        <option value="01:30">01:30 AM</option>
                        <option value="01:45">01:45 AM</option>
                        <option value="02:00">02:00 AM</option>
                        <option value="02:15">02:15 AM</option>
                        <option value="02:30">02:30 AM</option>
                        <option value="02:45">02:45 AM</option>
                        <option value="03:00">03:00 AM</option>
                        <option value="03:15">03:15 AM</option>
                        <option value="03:30">03:30 AM</option>
                        <option value="03:45">03:45 AM</option>
                        <option value="04:00">04:00 AM</option>
                        <option value="04:15">04:15 AM</option>
                        <option value="04:30">04:30 AM</option>
                        <option value="04:45">04:45 AM</option>
                        <option value="05:00">05:00 AM</option>
                        <option value="05:15">05:15 AM</option>
                        <option value="05:30">05:30 AM</option>
                        <option value="05:45">05:45 AM</option>
                        <option value="06:00">06:00 AM</option>
                        <option value="06:15">06:15 AM</option>
                        <option value="06:30">06:30 AM</option>
                        <option value="06:45">06:45 AM</option>
                        <option value="07:00">07:00 AM</option>
                        <option value="07:15">07:15 AM</option>
                        <option value="07:30">07:30 AM</option>
                        <option value="07:45">07:45 AM</option>
                        <option value="08:00">08:00 AM</option>
                        <option value="08:15">08:15 AM</option>
                        <option value="08:30">08:30 AM</option>
                        <option value="08:45">08:45 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="09:15">09:15 AM</option>
                        <option value="09:30">09:30 AM</option>
                        <option value="09:45">09:45 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="10:15">10:15 AM</option>
                        <option value="10:30">10:30 AM</option>
                        <option value="10:45">10:45 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:15">11:15 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="11:45">11:45 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:15">12:15 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="12:45">12:45 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="13:15">01:15 PM</option>
                        <option value="13:30">01:30 PM</option>
                        <option value="13:45">01:45 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="14:15">02:15 PM</option>
                        <option value="14:30">02:30 PM</option>
                        <option value="14:45">02:45 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="15:15">03:15 PM</option>
                        <option value="15:30">03:30 PM</option>
                        <option value="15:45">03:45 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="16:15">04:15 PM</option>
                        <option value="16:30">04:30 PM</option>
                        <option value="16:45">04:45 PM</option>
                        <option value="17:00">05:00 PM</option>
                        <option value="17:15">05:15 PM</option>
                        <option value="17:30">05:30 PM</option>
                        <option value="17:45">05:45 PM</option>
                        <option value="18:00">06:00 PM</option>
                        <option value="18:15">06:15 PM</option>
                        <option value="18:30">06:30 PM</option>
                        <option value="18:45">06:45 PM</option>
                        <option value="19:00">07:00 PM</option>
                        <option value="19:15">07:15 PM</option>
                        <option value="19:30">07:30 PM</option>
                        <option value="19:45">07:45 PM</option>
                        <option value="20:00">08:00 PM</option>
                        <option value="20:15">08:15 PM</option>
                        <option value="20:30">08:30 PM</option>
                        <option value="20:45">08:45 PM</option>
                        <option value="21:00">09:00 PM</option>
                        <option value="21:15">09:15 PM</option>
                        <option value="21:30">09:30 PM</option>
                        <option value="21:45">09:45 PM</option>
                        <option value="22:00">10:00 PM</option>
                        <option value="22:15">10:15 PM</option>
                        <option value="22:30">10:30 PM</option>
                        <option value="22:45">10:45 PM</option>
                        <option value="23:00">11:00 PM</option>
                        <option value="23:15">11:15 PM</option>
                        <option value="23:30">11:30 PM</option>
                        <option value="23:45">11:45 PM</option>
                    </select>
                    <input onChange={e => setFacebookEventName(e.target.value)} id='facebook_event_name' placeholder='Facebook Event Name (Optional)' className="admin-show-input-field" />

                    </div>
                    <div>
                        <button onClick={SelectShow} className="admin-show-dropdown-button">
                            Select
                        </button>
                        <button onClick={handleDeleteShow} className="admin-show-dropdown-button">
                            Delete
                        </button>
                        <select className="admin-show-dropdown-sets" id='sets' onChange={e => setSet1(e.target.value)}>
                            <option value="">Sets</option>
                            { Sets.map((set) => {
                                return <option key={set.id} value={set.id}>{set.set_name}</option>
                            })}
                        </select>
                        <select className="admin-show-dropdown-sets" id='sets'  onChange={e => setSet2(e.target.value)}>
                            <option value="">Sets</option>
                            { Sets.map((set) => {
                                return <option key={set.id} value={set.id}>{set.set_name}</option>
                            })}
                        </select>
                        <select className="admin-show-dropdown-sets" id='sets' onChange={e => setSet3(e.target.value)}>
                            <option value="">Sets</option>
                            { Sets.map((set) => {
                                return <option key={set.id} value={set.id}>{set.set_name}</option>
                            })}
                        </select>
                        <select className="admin-show-dropdown-sets" id='sets' onChange={e => setSet4(e.target.value)}>
                            <option value="">Sets</option>
                            { Sets.map((set) => {
                                return <option key={set.id} value={set.id}>{set.set_name}</option>
                            })}
                        </select>
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