import './NavbarAdminPortal.css';

const NavbarAdminPortal = () => {

    return(
        <div className="admin-song-request-navbar">
            <div className="admin-song-request-nav-links">
                <a href="/bandleader">Dashboard</a>
                <a href="/addsinglesong">Add Song</a>
                <a href="/editsong">Edit Song</a>
                <a href="/addvenue">Venues</a>
                <a className='navbar-a-with-span' href="/upload">Upload <br/>Master File</a>
                <a className='navbar-a-with-span' href="/backup">Backup <br />Library</a>
                <a className='navbar-a-with-span' href="/load">Load <br/>Library</a>
                <a href="/show">Shows</a>
                <a className='navbar-a-with-span' href="/showschedule">Show <br/>Schedule</a>
                <a href="/logs">Logs</a>
            </div>
            <div className="admin-song-request-nav-logout">
                <button>
                    LOGOUT
                </button>
            </div>
        </div>
    )
}

export default NavbarAdminPortal;