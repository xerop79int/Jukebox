import './AddVenue.css'

const AddVenue = () => {

    return(
        <div className="admin-venue-main">
        <div className="admin-venue-navbar">
            <div className="admin-venue-nav-links">
                <a href="/addsinglesong">Add Song &nbsp;</a>
                <a href="/addvenue">&nbsp;Add or Select Venue &nbsp;</a>
                <a href="/editsong">&nbsp;Edit Song &nbsp;</a>
                <a href="/bandleader">&nbsp;Bandleader Dashboard</a>
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
                    <textarea className="admin-venue-input-field">

                    </textarea>
                    <button className="admin-venue-input-button">
                        Submit
                    </button>
                </div>
            </div>
            <div className="admin-venue-dropdown">
                <div className="admin-venue-sub-dropdown">
                    <p className="admin-venue-dropdown-headiung">
                        Choice from the Existing Venues
                    </p>
                    <select className="admin-venue-dropdown-menu">
                        <option value="">ABC</option>
                        <option value="">ZXC</option>
                        <option value="">QWE</option>
                    </select>
                    <button className="admin-venue-dropdown-button">
                        Select
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default AddVenue;