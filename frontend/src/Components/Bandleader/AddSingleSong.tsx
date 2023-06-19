import './AddSingleSong.css'

const AddSingleSong = () => {

    return (
        <div className="admin-song-request-main">
        <div className="admin-song-request-navbar">
            <div className="admin-song-request-nav-links">
                <a href="/addsinglesong">Add Song &nbsp;</a>
                <a href="/addvenue">&nbsp;Add or Select Venue &nbsp;</a>
                <a href="/editsong">&nbsp;Edit Song &nbsp;</a>
                <a href="/bandleader">&nbsp;Bandleader Dashboard</a>
            </div>
            <div className="admin-song-request-nav-logout">
                <button>
                    LOGOUT
                </button>
            </div>
        </div>
        <div className="admin-song-request-sub-main">
            <div className="admin-song-request-input-songs">
                <form className="admin-song-request-input-form">
                    <input type="number" className="admin-song-request-input-song-number" placeholder="Song Number" />
                    <input type="text" className="admin-song-request-input-song-name" placeholder="Song Name" />
                    <input type="text" className="admin-song-request-input-song-artist" placeholder="Song Artist" />
                    <input type="text" className="admin-song-request-input-song-genre" placeholder="Song Genre" />
                    <input type="text" className="admin-song-request-input-song-duration" placeholder="Song Duration" />
                    <input type="text" className="admin-song-request-input-song-year" placeholder="Song Year" />
                    <div className="admin-song-request-input-song-cover">
                        <label>Song Cover : </label>
                        <input type="file" id="admin-song-request-input-song-cover"/ >
                    </div>
                    <input type="text" className="admin-song-request-input-song-cortes" placeholder="Cortes" />
                    <input type="text" className="admin-song-request-input-song-bpm" placeholder="BPM" />
                </form>
            </div>
            <div className="admin-song-request-text">
                <form className="admin-song-request-text-form">
                    <textarea placeholder='Enter the Song Lyric' className="admin-song-request-text-area"></textarea>
                </form>
            </div>
        </div>
        <form className="admin-song-request-input-form-submit">
            <input type="submit" className="admin-song-request-input-song-submit" placeholder="Submit" />
        </form>
    </div>
    )
}

export default AddSingleSong;