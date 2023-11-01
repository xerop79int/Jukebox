import './NavbarAdminPortal.css';

const NavbarAdminPortal = () => {

    return(
        <div className="admin-song-request-navbar">
            <div className="admin-song-request-nav-links">
                <a href="/bandleader">Bandleader Dashboard</a>
                <a href="/addsinglesong">Add Song</a>
                <a href="/editsong">Edit Song</a>
                <a href="/addvenue">Venues</a>
                <a href="/upload">Upload</a>
                <a href="/backup">Backup</a>
                <a href="/load">Load</a>
                <a href="/show">Shows</a>
                <a href="#">Show Schedule</a>
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