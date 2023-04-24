import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidenav from './Sidenav';
import tipjar from './img/tip jar.png';
import "./NowPlaying.css";

interface Song {
    id: number;
    song_name: string;
    song_artist: string;
    song_genre: string;
    count: number;
    song_number: number;
    song_durations: string;
}

interface CurrentSong {
    id: number;
    song_name: string;
    song_artist: string;
    song_genre: string;
    count: number;
    song_number: number;
    song_durations: string;
}

const SongList: React.FC = () => {

    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<CurrentSong>();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [displaynow, setdDisplayNow] = useState<boolean | null> (true);

    useEffect(() => {
        let URL = `http://localhost:8000/songslist?view=likes`;
    
        axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data)
              setdDisplayNow(true)
              setSongs(res.data.band_songs);
            })
            .catch(err => console.log(err))
      }, []);

      const handleSorting = (sort: string) =>{
        let URL = `http://localhost:8000/songslist?sort=${sort}`;
    
        axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data)
              setSongs(res.data.band_songs);
            })
            .catch(err => console.log(err))
      }

      const handleCurrentSong = (song: CurrentSong, index: number) => {
        setCurrentSong(song);
        setActiveIndex(index);
        setdDisplayNow(false);
        const heading = document.querySelector('.p-heading') as HTMLDivElement;
        heading.textContent = "Request Line";

      }

      const handleRefresh = () => {
        let URL = `http://localhost:8000/songslist`;

        axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data)
              setSongs(res.data.band_songs);
            })
            .catch(err => console.log(err))
      }

      const handleLike = (id: number) =>{
        let URL = `http://localhost:8000/likedbandsongslist`;
    
        const data = {
            "song_id": id,
        }

        axios.post(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data)
              handleRefresh();
            })
            .catch(err => console.log(err))
      }

      const handleSubmit = () => {
        const URL = "http://localhost:8000/customerrequest"

        const data = {
            "song_id": currentSong?.id,
        }

        axios.post(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          })
              .then(res => {
                console.log(res.data)
              })
              .catch(err => console.log(err))
    }

      return (
        <div>
          <Sidenav />
           <div className="main">
            {/* <!-- Player Section --> */}
            <div className="player">
              <div className="p-heading">Now Playing</div>
              <div className="player-thumbnail">
                <img
                  src="https://picsum.photos/id/231/250/250"
                  alt="Thumbnail"
                  className="thumbnail"
                />
              </div>
              { displaynow ? (
                <div className="icons" style={{height: "150px", marginTop: "20px"}}>
                <div className="like-icon icon" onClick={e => handleLike(currentSong?.id)}>
                  <i className="fa-solid fa-thumbs-up fa-2x like-btn"></i>
                </div>
                <div className="tip-icon icon">
                  <div className="tip">
                    <img className="tip-jar" src={tipjar} alt="tip-jar-icon" />
                  </div>
                </div>
              </div>
              ) : (
              <div className="icons">
                <div onClick={e => handleLike(currentSong?.id)} className="like-icon icon">
                  <i className="fa-solid fa-thumbs-up fa-2x like-btn"></i>
                </div>
                <div className="play-icon icon" onClick={handleSubmit}>
                  <i className="fa-solid fa-play fa-2x"></i>
                </div>
                <div className="tip-icon icon">
                  <div className="tip">
                    <img className="tip-jar" src={tipjar} alt="tip-jar-icon" />
                  </div>
                </div>
              </div>
              )}
              <div className="p-title-box">
                <div className="songtitle">
                  <h3>{currentSong?.song_number} - {currentSong?.song_name} - </h3>
                  <h5>{currentSong?.song_artist}</h5>
                </div>
                <div className="songdetail">
                  1984 - {currentSong?.song_genre} - {currentSong?.song_durations}
                </div>
                <br />
                <div className="songbox1">
                  <h4>This </h4>
                  <h5>Venue - </h5>
                  <div className="box1icon">
                    <i className="fa-solid fa-thumbs-up fa-xs"> </i>
                  </div>
                  <h5> {currentSong?.count}</h5>
                </div>
                <div className="songbox2">
                  <h4>All </h4>
                  <h5>Venues - </h5>
                  <div className="box2icon">
                    <i className="fa-solid fa-thumbs-up fa-xs"> </i>
                  </div>
                  <h5> 1566</h5>
                </div>
              </div>
              <div className="player-queue">
                <div className="p-queue-box">
                  <div className="heading">
                    <h2>Up Next</h2>
                  </div>

                  {/* <!-- Dummy Song for Queue --> */}
                  <div className="song-queue">
                    <div className="song-img">
                      <img
                        src="https://picsum.photos/id/234/250/300"
                        alt="song-img"
                        className="song-image"
                      />
                    </div>
                    <div className="song-title-queue">
                      <div className="songtitle-queue">
                        <h3>123 - Lorem ipsum dolor sit -</h3>
                        <h5>
                          Lorem, ipsum
                        </h5>
                      </div>
                      <div className="songdetail-queue">
                        1984 - lorem - 7:14
                      </div>
                    </div>
                  </div>
                  {/* <!-- Dummy Song for Queue --> */}
                </div>
              </div>
            </div>


            {/* <!-- List Section --> */}
            <div className="list">
              <div className="list-bar">
                <select className="dropdown" onChange={e => handleSorting(e.target.value)}>
                  <option value="name">Sort By: Song Title</option>
                  <option value="artist">Sort By: Artist</option>
                  <option value="genre">Sort By: Genre</option>
                  <option value="date">Sort By: Release Date</option>
                  <option value="this_venue_likes">Sort By: This Venue Likes</option>
                  <option value="all_venue_likes">Sort By: All Venue Likes</option>
                </select>
                <div className="search-container">
                  <button className="search-button">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                  <div className="search-bar">
                    <input type="text" placeholder="Search..." />
                    <button className="search-submit">Submit</button>
                  </div>
                </div>
              </div>
              <div className="song-list-main">
                <div className="song-list">
                  {/* <!-- Dummy songs --> */}
                  {songs.map((song, index) => (
                    <div
                    key={song.id}
                    className={`song-listed ${index === activeIndex ? "active" : ""}`}
                    onClick={() => handleCurrentSong(song, index)}
                  >
                    <div className="song-img-list">
                      <img
                        src="https://picsum.photos/id/239/250/300"
                        alt="song-img"
                        className="song-image-list"
                      />
                    </div>
                    <div className="song-title-list">
                      <div className="songtitle-list">
                        <h3>{song.song_number} - {song.song_name} - </h3>
                        <h5>
                          {song.song_artist}
                        </h5>
                      </div>
                      <div className="songdetail-list">
                        1984 - {song.song_genre} - {song.song_durations}
                      </div>
                    </div>
                  </div>
                  ))}
                  {/* <!-- Dummy Songs --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        );
    }

    export default SongList;