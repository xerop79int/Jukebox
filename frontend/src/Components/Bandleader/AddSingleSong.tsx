import React, { useEffect, useState } from 'react'
import './AddSingleSong.css'
import axios from 'axios';


const AddSingleSong = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":8000");
    const [songNumber, setSongNumber] = useState<string>("");
    const [songName, setSongName] = useState<string>("");
    const [songArtist, setSongArtist] = useState<string>("");
    const [songGenre, setSongGenre] = useState<string>("");
    const [songDuration, setSongDuration] = useState<string>("");
    const [songYear, setSongYear] = useState<string>("");
    const [songCover, setSongCover] = useState<File | null>(null);
    const [songCortes, setSongCortes] = useState<string>("");
    const [songBPM, setSongBPM] = useState<string>("");
    const [songLyrics, setSongLyrics] = useState<string>("");
    const [song_id, setSong_id] = useState<string>("");

    const url = window.location.href;
    const check = url.includes("editsong");
    useEffect(() => {
            const song_id = url.split("/")[4];
            if (check) {
            axios.get(`http://${backendURL}/songslist?single=${song_id}`, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            })
                .then((response) => {
                    console.log(response);
                    setSong_id(response.data.band_song.id);
                    setSongNumber(response.data.band_song.song_number);
                    setSongName(response.data.band_song.song_name);
                    setSongArtist(response.data.band_song.song_artist);
                    setSongGenre(response.data.band_song.song_genre);
                    setSongDuration(response.data.band_song.song_durations);
                    setSongYear(response.data.band_song.song_year);
                    setSongCortes(response.data.band_song.cortes);
                    setSongBPM(response.data.band_song.bpm);
                    setSongLyrics(response.data.band_song.song_lyrics);

                    // window.location.href = '/editsong';
                })
                .catch((error) => {
                    console.log(error);
                }
                )
            }
        }, [])

    const handleSongSubmit = () => {


        const songData = new FormData();
        if(song_id){
            songData.append("song_id", song_id);
        }
        songData.append("song_number", songNumber);
        songData.append("song_name", songName);
        songData.append("song_artist", songArtist);
        songData.append("song_genre", songGenre);
        songData.append("song_durations", songDuration);
        songData.append("song_year", songYear);
        if(songCover){
            songData.append("song_cover", songCover);
        }
        songData.append("cortes", songCortes);
        songData.append("bpm", songBPM);
        songData.append("song_lyrics", songLyrics);

        if(check){
            axios.put(`http://${backendURL}/songslist`, songData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
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
        else{
            axios.post(`http://${backendURL}/songslist`, songData, {
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
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

        
    }

    return (
        <div className="admin-song-request-main">
        <div className="admin-song-request-navbar">
            <div className="admin-song-request-nav-links">
                <a href="/addsinglesong">Add Song &nbsp;</a>
                <a href="/addvenue">&nbsp;Add or Select Venue &nbsp;</a>
                <a href="/editsong">&nbsp;Edit Song &nbsp;</a>
                <a href="/bandleader">&nbsp;Bandleader Dashboard</a>
                <a href="/upload">&nbsp;&nbsp;Upload</a>
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
                    <input type="number" value={songNumber} className="admin-song-request-input-song-number" onChange={e => setSongNumber(e.target.value)} placeholder="Song Number" />
                    <input type="text" value={songName} className="admin-song-request-input-song-name" onChange={e => setSongName(e.target.value)} placeholder="Song Name" />
                    <input type="text" value={songArtist} className="admin-song-request-input-song-artist" onChange={e => setSongArtist(e.target.value)} placeholder="Song Artist" />
                    <input type="text" value={songGenre} className="admin-song-request-input-song-genre" onChange={e => setSongGenre(e.target.value)} placeholder="Song Genre" />
                    <input type="text" value={songDuration} className="admin-song-request-input-song-duration" onChange={e => setSongDuration(e.target.value)} placeholder="Song Duration" />
                    <input type="text" value={songYear} className="admin-song-request-input-song-year" onChange={e => setSongYear(e.target.value)} placeholder="Song Year" />
                    <div className="admin-song-request-input-song-cover">
                        <label>Song Cover : </label>
                        <input type="file" onChange={e => setSongCover(e.target.files?.[0] || null)} id="admin-song-request-input-song-cover"/ >
                    </div>
                    <input type="text" value={songCortes} className="admin-song-request-input-song-cortes" onChange={e => setSongCortes(e.target.value)} placeholder="Keys" />
                    <input type="text" value={songBPM} className="admin-song-request-input-song-bpm" onChange={e => setSongBPM(e.target.value)} placeholder="BPM" />
                </form>
            </div>
            <div className="admin-song-request-text">
                <form className="admin-song-request-text-form">
                    <textarea placeholder='Enter the Song Lyric' value={songLyrics} onChange={e => setSongLyrics(e.target.value)} className="admin-song-request-text-area"></textarea>
                </form>
            </div>
        </div>
        <div className="admin-song-request-input-form-submit">
            <input type='submit' className="admin-song-request-input-song-submit" onClick={handleSongSubmit} placeholder="Submit" />
        </div>
    </div>
    )
}

export default AddSingleSong;