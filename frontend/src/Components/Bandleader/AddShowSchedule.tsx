import { useState, useEffect, useRef } from 'react';
import './AddShowSchedule.css'
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

const ShowSchedule = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [showList, setShowList] = useState<Show[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {

        let URL = `http://${backendURL}/show?future=true`

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
            window.location.reload();
        })
        .catch(err => {
            console.log(err)
        })
    }

    const handleShowStop = (id: any) => {
            
            let URL = `http://${backendURL}/show`
    
            const data = {
                'show_id': id,
                'stop': true
            }
    
            axios.put(URL, data, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            })
            .then(res => {
                window.location.reload();
            })
            .catch(err => {
                console.log(err)
            })
        }

    const handlePastShow = () => {

        let URL = `http://${backendURL}/show?past=true`

        axios.get(URL, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then(res => {
            console.log(res.data.show)
            if(res.data.show.length > 0)
            {
                setShowList(res.data.show)
                setTimeout(() => {
                    const startButton = document.querySelectorAll<HTMLInputElement>('#start-button');
                    if (startButton.length > 0) {
                        startButton.forEach(button => {
                            button.style.display = 'none';
                        })
                    }
                }, 30)
                const futureButton = document.querySelector<HTMLButtonElement>('.future-show');
                if(futureButton)
                    futureButton.style.display = 'block';
                const pastButton = document.querySelector<HTMLButtonElement>('.past-show');
                if(pastButton)
                    pastButton.style.display = 'none';
            }
        })
        .catch(err => {
            console.log(err)
        })

        

        
    }

    const handleFutureShow = () => {
        // refresh page
        window.location.reload();
    }


    const handlePNG = async () => {

        // get al the admin-show-schedule-details-container elements and filter out the ones that are checked
        const showScheduleDetailsContainer = document.querySelectorAll('#shows') as NodeListOf<HTMLInputElement>;
        const container = document.querySelector('.admin-show-container') as HTMLTableElement;
        const heading = document.querySelector('.admin-show-schedule-screenshot-heading-tr') as HTMLTableElement;
        console.log(showScheduleDetailsContainer)
        const checkedShows = Array.from(showScheduleDetailsContainer).filter(show => {
            const checkbox = show.querySelector<HTMLInputElement>('.show-schedule-classbox');
            if(checkbox?.checked)
                return true;
            else
                return false;
        })

        checkedShows.forEach(show => {
            const checkbox = show.querySelector<HTMLInputElement>('.show-schedule-classbox');
            if(checkbox)
                checkbox.style.display = 'none';
            const p = show.querySelectorAll<HTMLParagraphElement>('p');
            p.forEach(p => {
                p.style.backgroundColor = '#1c1c1c';
                p.style.color = 'white';
            })
        })

        // Capture all the canvases, each with a different part of the page
        let headingcanvas = await html2canvas(heading, { scrollY: -window.scrollY, useCORS: true,   backgroundColor: '#1c1c1c'  });

        const canvasPromises = Array.from(checkedShows).map((div) =>
            html2canvas(div, { scrollY: -window.scrollY, useCORS: true,   backgroundColor: '#1c1c1c'  })
        );


        const canvases = await Promise.all(canvasPromises);
        // Create a single canvas to composite all the images
        const combinedCanvas = document.createElement('canvas');
        const ctx = combinedCanvas.getContext('2d');

        // get the width and height of the combined canvas


        combinedCanvas.width = container.offsetWidth;
        combinedCanvas.height = container.offsetHeight + heading.offsetHeight;

        // Draw each captured canvas onto the combined canvas
        let yOffset = 0;
        ctx?.drawImage(headingcanvas, 120, yOffset);
        yOffset += headingcanvas.height;
        canvases.forEach((canvas) => {
            if (ctx) {
                ctx.drawImage(canvas, 120, yOffset);
                yOffset += canvas.height;
            }
        });

        // Convert the combined canvas to a data URL
        const dataUrl = combinedCanvas.toDataURL('image/png');

        // Create a link element
        const link = document.createElement('a');
        link.href = dataUrl;

        // Set the download attribute with a desired filename
        link.download = 'combined_screenshot.png';

        // Append the link to the document and trigger a click
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);

        
        
        checkedShows.forEach(show => {
            const checkbox = show.querySelector<HTMLInputElement>('.show-schedule-classbox');
            if(checkbox)
                checkbox.style.display = 'block';
            const p = show.querySelectorAll<HTMLParagraphElement>('p');
            p.forEach(p => {
                p.style.backgroundColor = '#303030';
                p.style.color = '#8f8d8d';
            })
        })
    }

    const handleSelectAll = () => {
        console.log('select all')
        const showScheduleDetailsContainer = document.querySelectorAll('#shows') as NodeListOf<HTMLInputElement>;
        const checkbox = document.querySelector<HTMLInputElement>('.show-schedule-classbox');
        if(checkbox?.checked)
        {
            showScheduleDetailsContainer.forEach(show => {
                const checkbox = show.querySelector<HTMLInputElement>('.show-schedule-classbox');
                if(checkbox)
                    checkbox.checked = true;
            })
        }
        else
        {
            showScheduleDetailsContainer.forEach(show => {
                const checkbox = show.querySelector<HTMLInputElement>('.show-schedule-classbox');
                if(checkbox)
                    checkbox.checked = false;
            })
        }
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
                        <button onClick={handlePastShow} className='admin-show-schedule-input-button past-show'>Past</button>
                        <button onClick={handleFutureShow} className='admin-show-schedule-input-button future-show'>Future</button>
                    </div>
                    <table className='admin-show-schedule-screenshot-heading'>
                        <thead>
                            <tr className='admin-show-schedule-screenshot-heading-tr'>
                                <th><input type="checkbox" className='show-schedule-classbox' onClick={handleSelectAll} /></th>
                                <th>Venue</th>
                                <th>Date</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th></th>
                            </tr>
                        </thead>
                        {/* <div ref={containerRef}> */}
                        <tbody className='admin-show-container'>
                            {showList.map((show, index) => {
                            return(
                                <tr key={show.id} id='shows'
                                 className='admin-show-schedule-details-container'
                                 >
                                    <td className='admin-show-schedule-screenshot-tbody-td-button'>
                                        <input type="checkbox" className='show-schedule-classbox' />
                                    </td>
                                    <td className='admin-show-schedule-screenshot-tbody-td'>
                                        <p>{show.venue}</p>
                                    </td>
                                    <td className='admin-show-schedule-screenshot-tbody-td'>
                                        <p>{show.date}</p>
                                    </td>
                                    <td className='admin-show-schedule-screenshot-tbody-td-sub'>
                                        <p className='show-schedule-sub-p'>{show.city}</p>
                                    </td>
                                    <td className='admin-show-schedule-screenshot-tbody-td-sub'>
                                        <p className='show-schedule-sub-p'>{show.state}</p>
                                    </td>
                                    <td className='admin-show-schedule-screenshot-tbody-td-sub'>
                                    <p className='show-schedule-sub-p'>{parseInt(show.start_time.split(":")[0]).toString() + ":" + show.start_time.split(":")[1]}</p>
                                    </td>
                                    <td className='admin-show-schedule-screenshot-tbody-td-sub'>
                                        <p className='show-schedule-sub-p'>{parseInt(show.end_time.split(":")[0]).toString() + ":" + show.end_time.split(":")[1]}</p>
                                    </td>
                                    <td className='admin-show-schedule-screenshot-tbody-td-button'>
                                        { show.check ? <button id='start-button' onClick={e => handleShowStop(show.id)} className='admin-show-schedule-input-button stop-button'>Stop</button> 
                                        : <button id='start-button' onClick={e => handleShowStart(show.name)} className='admin-show-schedule-input-button start-button'>Start</button> }
                                    </td>
                                </tr>
                            )
                        })}
                            </tbody>
                        {/* </div> */}
                    </table>
                    {/* <div>
                        <input type="checkbox" className='show-schedule-classbox' />
                        <input type="checkbox" className='show-schedule-classbox' />
                        <input type="checkbox" className='show-schedule-classbox' />
                        <input type="checkbox" className='show-schedule-classbox' />
                        <input type="checkbox" className='show-schedule-classbox' />
                        <input type="checkbox" className='show-schedule-classbox' />
                        <input type="checkbox" className='show-schedule-classbox' />
                        
                    </div> */}
                    {/* <div >
                        
                        <div >
                            
                            
                        </div>
                        
                    </div> */}
                    <div className='admin-show-schedule-publish-button-container'>
                        <button onClick={handlePNG} className='admin-show-schedule-publish-Button'>Publish as .png</button>
                        {/* <button className='admin-show-schedule-publish-Button'>Publish to Email List</button>
                        <button className='admin-show-schedule-publish-Button'>Publish to Facebook Post</button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowSchedule;