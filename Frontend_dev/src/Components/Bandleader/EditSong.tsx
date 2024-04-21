import { useState, useEffect } from 'react';
import './EditSong.css'
import axios from 'axios';
import NavbarAdminPortal from './NavbarAdminPortal';

interface Song {
    id: number;
    song_name: string;
    song_artist: string;
    song_genre: string;
    count: number;
    song_number: number;
    song_durations: string;
    song_year: string;
    number: number;
    cortes: string;
    bpm: string;
}

const EditSong = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        let URL = `http://${backendURL}/songslist?view=likes`;
    
        axios.get(URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data.band_songs);
              setSongs(res.data.band_songs);
    
            })
            .catch(err => {if(err.response.status === 401){ window.location.href = '/login'; console.log(err) } else {console.log(err)}}) 
      }, []);
    
    const handleSongEdit = (id: number) => {
        window.location.href = `/editsong/${id}`;
    }


    const handleSongDelete = (id: number) => {
        
        axios.delete(`http://${backendURL}/songslist?song_id=${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((response) => {
            console.log(response);
            window.location.href = '/editsong';
        })
        .catch((error) => {
            console.log(error);
        }
        )
    }

    return(
        <div className="admin-display-song-main">
        <NavbarAdminPortal />
        <div className="admin-display-song-sub-main">
            <div className="admin-display-song-list-1">
                <div className="admin-display-song-list-1-scroll">
                    
                    {songs.map((song) => (
                    <div className="admin-display-song-list-dummy-1">
                        <p className="admin-display-song--dummy-text-1">
                           {song.song_number} - {song.song_name} - {song.song_artist} - {song.song_genre}
                        </p>
                        <div className='admin-display-song-button-container'>
                        <button className="admin-display-song-dummy-button-1" onClick={e => handleSongEdit(song.id)}>Edit</button>
                        <button className="admin-display-song-dummy-button-2" onClick={e => handleSongDelete(song.id)}>Delete</button>
                        </div>
                    </div>
                    ))}
                    
                    

                    

                    
                    
                </div>
            </div>
            
        </div>
    </div>
    );

}

export default EditSong;