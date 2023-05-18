import React, { useState, useEffect } from 'react';
import './BandLeaderDashboard.css';
import axios from 'axios';

interface Song {
    id: number;
    song_name: string;
    song_artist: string;
    song_genre: string;
    count: number;
    song_number: number;
    song_durations: string;
}

// interface CurrentSong {
//     id: number;
//     song_name: string;
//     song_artist: string;
//     song_genre: string;
//     count: number;
//     song_number: number;
//     song_durations: string;
// }

const SongList: React.FC = () => {

  const [songs, setSongs] = useState<Song[]>([]);
  const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
  const [option, setOption] = useState<string>('queue');
  const [search, setSearch] = useState<string>("");
  const [SongsSet, setSetSongs] = useState<Song[]>([]);

  useEffect(() => {
    let URL = `http://localhost:8000/songslist?view=likes`;

    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          // check if the status code is 401
          if(res.data.status === 401){
            window.location.href = '/login';
          }
          console.log(res.data)
          setSongs(res.data.band_songs);

        })
        .catch(err => {if(err.response.status === 401){ window.location.href = '/login'; console.log(err) } else {console.log(err)}})
  }, []);

  const handleSearch = () => {
    const URL = `http://localhost:8000/songslist?search=${search}`
    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {  
      console.log(res.data)
      setSearchedSongs(res.data.band_songs);
      setSearch("");
      const search = document.querySelector('.search') as HTMLInputElement;
      search.value = "";
      setOption('search');
    })
    .catch(err => console.log(err))
  }

  const handleSet = (id: number) => {
    const URL = `http://localhost:8000/songsset`

    const data = {
      "song_id": id
    }

    axios.post(URL, data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => console.log(err))
  }

  const handleSetGet = () => {
    const URL = `http://localhost:8000/songsset`

    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
      setSetSongs(res.data.song_sets);
    })
    .catch(err => console.log(err))
  }

  const handleOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'set') {
      handleSetGet();
    }
    setOption(e.target.value);
  }



  const handleToggle = () => {
    const section = document.getElementById("mySection") as HTMLElement;
    section.classList.toggle("right-position");
  }

    return (
        <div className="main">
        <div className="sub-main">
          <nav>
            <div className="nav-child1">
              <h3>Now</h3>
              <div className="band-song-title-queue">
                <div className="songtitle-queue">
                  <h4>123 - Lorem ipsum dolor sit - </h4>
                  <p>Lorem, ipsum</p>
                </div>
                <p className="songdetail-queue"> 1984 - in C - 120 - 7:14</p>
              </div>
            </div>
            <div className="nav-child2">
              <h3>Next</h3>
              <div className="band-song-title-queue">
                <div className="songtitle-queue">
                  <h4>123 - Lorem ipsum dolor sit - </h4>
                  <p>Lorem, ipsum - </p>
                </div>
                <p className="songdetail-queue"> 1984 - in A - 80 - 7:14</p>
              </div>
            </div>
          </nav>
          <div className="verse-sec">
            <div className="verse-sec-scroll">
              
            </div>
          </div>
        </div>
  
        <div className="slider-section" id="mySection">
          <div className="button" onClick={handleToggle}>
            <i className="fa-solid fa-circle fa-3x" id="moveButton"></i>
          </div>
          <div className="nav">
            <select className="dropdown" value={option} onChange={handleOptions}>
              <option value="queue">Queue</option>
              <option value='search'>Search</option>
              <option value="set">Set</option>
              <option value="option3">opt 3</option>
            </select>
            <div className="search-container">
              <button className="search-button">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <div className="search-bar">
                <input className='search' type="text" onChange={e => setSearch(e.target.value)} placeholder="Search..." />
                <button onClick={handleSearch} className="search-submit">Submit</button>
              </div>
            </div>
          </div>
          <div className="songlist">
            <div className="sub-songlist">
              {/* <!-- dummy --> */}
              { option === 'queue' ?
              songs.map((song: Song) => (
              <div className="song-dummy" key={song.id} onClick={e => handleSet(song.id)}>
                <h3>{song.song_number}</h3>
                <div className="band-song-title-queue">
                  <div className="songtitle-queue">
                    <h4>{song.song_number} - {song.song_name} - </h4>
                    <p> {song.song_artist} - </p>
                  </div>
                  <p className="songdetail-queue"> 1984 - {song.song_genre} - {song.song_durations}</p>
                </div>
                <p style={{alignItems: "flex-end"}}></p>
              </div>
              ))
              :
              null}

              { option === 'search' ?
              searchedSongs.map((song: Song) => (
              <div className="song-dummy" key={song.id}>
                <h3>{song.id}</h3>
                <div className="band-song-title-queue">
                  <div className="songtitle-queue">
                    <h4>{song.song_number} - {song.song_name} - </h4>
                    <p> {song.song_artist} - </p>
                  </div>
                  <p className="songdetail-queue"> 1984 - {song.song_genre} - {song.song_durations}</p>
                </div>
              </div>
              ))
              :
              null}

              { option === 'set' ?
              SongsSet.map((song: Song) => (
                <div className="song-dummy" key={song.id}>
                  <h3>{song.id}</h3>
                  <div className="band-song-title-queue">
                    <div className="songtitle-queue">
                      <h4>{song.song_number} - {song.song_name} - </h4>
                      <p> {song.song_artist} - </p>
                    </div>
                    <p className="songdetail-queue"> 1984 - {song.song_genre} - {song.song_durations}</p>
                  </div>
                </div>
              ))
              :
              null}
  
              {/* <!-- dummy --> */}
            </div>
          </div>
        </div>
      </div>
    )
}

export default SongList;
