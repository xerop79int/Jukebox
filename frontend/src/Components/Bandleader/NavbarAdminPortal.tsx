import './NavbarAdminPortal.css';

const NavbarAdminPortal = () => {

    return(
        <div className="admin-song-request-navbar">
            <div className="admin-song-request-nav-links">
                <a href="/addsinglesong">Add Song &nbsp;</a>
                <a href="/addvenue">&nbsp;Add or Select Venue &nbsp;</a>
                <a href="/editsong">&nbsp;Edit Song &nbsp;</a>
                <a href="/bandleader">&nbsp;Bandleader Dashboard</a>
                <a href="/upload">&nbsp;&nbsp;Upload</a>
                <a href="/backup">&nbsp;&nbsp;Backup</a>
                <a href="/load">&nbsp;&nbsp;Load</a>
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