import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    img: string;
    song_year: string;
    all_venues_count: number;
}

interface CurrentSong {
    id: number;
    song_name: string;
    song_artist: string;
    song_genre: string;
    count: number;
    song_number: number;
    song_durations: string;
    img: string;
    song_year: string;
    all_venues_count: number;
}

interface SongResponse{
  id: number;
  customer_name: string;
  song_artist: string;
  song_durations: string;
  song_number: number;
  song_name: string;
  is_approved: boolean;
  status: string;
}

const SongList: React.FC = () => {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");

    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<CurrentSong | null>();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [displaynow, setdDisplayNow] = useState<boolean | null> (true);
    const [search, setSearch] = useState<string>("");
    const [likedtiming, setLikedTiming] = useState<boolean>(false);
    const [nextSong, setNextSong] = useState<Song>();
    const [responseQueue, setResponseQueue] = useState<SongResponse[]>([]);    
      
    useEffect(() => {


        let URL = `http://${backendURL}/customersongslist`;
    
        const checknowplaylistsong = handleGettingPlaylist();
        axios.get(URL)
            .then(res => {
              console.log(res.data)
              setSongs(res.data.band_songs);
              if(!checknowplaylistsong){
                setdDisplayNow(true)
                handleCurrentSong(res.data.band_songs[0], res.data.band_songs[0].id);
              }
            })
            .catch(err => {console.log(err) })
               
  }, []);
          

        const socket = new WebSocket(`ws://${backendURL}/ws/customerrequestsresponse/`);

        const processRequest = (currentRequest: any) => {
            
        const container = document.querySelector("#nowPlayingPopup") as HTMLInputElement;
        container.style.right = "0px"
  
        // Display the request data on the frontend
        const name = document.querySelector('.customer-name') as HTMLInputElement;
        name.textContent = " " + currentRequest.customer_name;
      
        const song_number_name = document.querySelector('.number-song-name') as HTMLInputElement;
        song_number_name.textContent = " " + currentRequest.song_number + " - " + currentRequest.song_name + " - ";
      
        const artist = document.querySelector('.artist-durations') as HTMLInputElement;
        artist.textContent = " " + currentRequest.song_artist + " - " + currentRequest.song_duration;
      
        const box = document.querySelector('.nowplaying-pop-up-green') as HTMLInputElement;
        box.textContent = currentRequest.status
        if (currentRequest.is_approved){
          box.style.background = "rgba(62, 249, 5, 0.581)"
        }


        setTimeout(function() {
          setResponseQueue(prevQueue => prevQueue.slice(1));
          container.style.right = "-350px"
        }, 5000);
        
      };

      useEffect(() => {
        if(responseQueue.length !== 0){
          const currentResponse = responseQueue[0];
          processRequest(currentResponse);
        }
      }, [responseQueue]);

      socket.onopen = () => {
        console.log('connected to websocket');
        socket.send("Websocket is connected");
      };

      socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if(data.playlist){
          setCurrentSong(data.playlist[0])
          setNextSong(data.playlist[1])
        }
        else{
          setResponseQueue([data]);
        }
        // setRequestQueue([data]);
      };

      const handleGettingPlaylist = () : Promise<boolean> => {
        let URL = `http://${backendURL}/playlist`;
    
        return axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              setCurrentSong(res.data.playlist[0])
              // setNowSong(res.data.playlist[0])
              setNextSong(res.data.playlist[1])
              return true
  
            })
            .catch(err => {
              console.log(err)
              return false
            }) as Promise<boolean>

      };

      const handleCurrentSong = (song: CurrentSong, index: number) => {
        setCurrentSong(song);
        setActiveIndex(index);
        setdDisplayNow(false);
        const heading = document.querySelector('.p-heading') as HTMLDivElement;
        heading.textContent = "Request Line";

      }

      const handleRefresh = (id: number) => {
        let URL = `http://${backendURL}/songslist`;

        axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data)
              setSongs(res.data.band_songs);
              // match the id with the current song id and set the current song
              const song = res.data.band_songs.find((song: Song) => song.id === id);
              setCurrentSong(song);

            })
            .catch(err => console.log(err))
      }

      const handleSorting = (sort: string) =>{
        let URL = `http://${backendURL}/customersongslist?sort=${sort}`;
    
        axios.get(URL)
            .then(res => {
              console.log(res.data)
              setSongs(res.data.band_songs);
            })
            .catch(err => console.log(err))
      }


      const handleLike = (id: number) =>{
        const alert = document.querySelector('.alert-box') as HTMLDivElement;
        const alertMessage = document.querySelector('.alert-message') as HTMLParagraphElement;

        if (likedtiming){
          alertMessage.textContent = "You have already liked a song wait for 20 seconds"
          alert.style.display = "block"; 
          
          setTimeout(function() {
            alert.style.display = 'none';
          }, 2000);

          return;
        }
        
        let URL = `http://${backendURL}/likedbandsongslist`;
    
        const data = {
            "song_id": id,
            // "venue_name": "Just Venue Testing"
        }

        axios.post(URL, data)
            .then(res => {
              console.log(res.data)
              alertMessage.textContent = res.data.success;
              alert.style.display = "block";  
              handleRefresh(id);
              setLikedTiming(true);

              setTimeout(function() {
                alert.style.display = 'none';
              }, 2000);

              setTimeout(function() {
                setLikedTiming(false);
              }, 1000 * 10);
              
            })
            .catch(err => console.log(err))
      }

      const handleSubmit = () => {
        const URL = `http://${backendURL}/customerrequest`;

        const data = {
            "song_id": currentSong?.id,
            'customer_name': "Steve"
        }

        axios.post(URL, data)
              .then(res => {
                const alert = document.querySelector('.alert-box') as HTMLDivElement;
                const alertMessage = document.querySelector('.alert-message') as HTMLParagraphElement;
                alert.style.display = "block";
                if (res.data.error){
                  alertMessage.textContent = res.data.error;
                }
                else{
                  const alertMessage = document.querySelector('.alert-message') as HTMLParagraphElement;
                  alertMessage.textContent = res.data.success;
                }

                setTimeout(function() {
                  alert.style.display = 'none';
                }, 2000);

              })
              .catch(err => console.log(err))
    }

    const handleSearch = () => {
      const URL = `http://${backendURL}/songslist?search=${search}`
      axios.get(URL, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      })
      .then(res => {  
        console.log(res.data)
        setSongs(res.data.band_songs);
        setSearch("");
        const search = document.querySelector('.search') as HTMLInputElement;
        search.value = "";
      })
      .catch(err => console.log(err))
    }

      return (
        <div>
          {/* <Sidenav /> */}
            <div className="alert-box green">
                <p className='alert-message'></p>
            </div>

            <div id="nowPlayingPopup" className="">
              <div className="nowplaying-pp-text">
                <div className="text-upper" >
                  <div className="t1">
                    New Request From
                  </div>
                  <div className="customer-name t2">
                  </div>
                </div>
                <div className="text-lower" >
                  <div className="number-song-name t1">
                  </div>
                  <div className=" artist-durations t2">
                  </div>
                </div>
              </div>
              <button className="nowplaying-pop-up-green">
                <p><span>Declined</span> Sorry We Already Played This One!</p>
              </button>
            </div>

           <div className="customer-main">
            {/* <!-- Player Section --> */}
            <div className="customer-player">
              <div className="p-heading">Now Playing</div>
              <div className="player-thumbnail">
                <img
                  src={`http://${backendURL}${currentSong?.img}`}
                  alt="Thumbnail"
                  className="thumbnail"
                />
              </div>
              { displaynow ? (
                <div className="icons" style={{height: "150px", marginTop: "20px"}}>
                <div className="like-icon icon" onClick={e => currentSong?.id && handleLike(currentSong?.id)}>
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
                <div onClick={e => currentSong?.id && handleLike(currentSong?.id)} className="like-icon icon">
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
                  {currentSong?.song_year} - {currentSong?.song_genre} - {currentSong?.song_durations}
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
                  <h5> {currentSong?.all_venues_count}</h5>
                </div>
              </div>

              { nextSong ? (
              <div className="player-queue">
                <div className="p-queue-box">
                  <div className="heading">
                    <h2>Up Next</h2>
                  </div>

                  {/* <!-- Dummy Song for Queue --> */}
                  <div className="song-queue">
                    <div className="song-img">
                      <img
                        src={`http://${backendURL}${nextSong.img}`}
                        alt="song-img"
                        className="song-image"
                      />
                    </div>
                    <div className="song-title-queue">
                      <div className="songtitle-queue">
                        <h3>{nextSong.song_number} - {nextSong.song_name} -</h3>
                        <h5>
                          {nextSong.song_artist}
                        </h5>
                      </div>
                      <div className="songdetail-queue">
                        {nextSong.song_year} - {nextSong.song_genre} - {nextSong.song_durations}
                      </div>
                    </div>
                  </div>
                  {/* <!-- Dummy Song for Queue --> */}
                </div>
              </div>
              ) : null}
            </div>


            {/* <!-- List Section --> */}
            <div className="list">
              <div className="list-bar">
                <select className="dropdown" onChange={e => handleSorting(e.target.value)}>
                  <option value="duration">Sort By: Song Number</option>
                  <option value="name">Sort By: Song Title</option>
                  <option value="artist">Sort By: Artist</option>
                  <option value="genre">Sort By: Genre</option>
                  <option value="year">Sort By: Release Date</option>
                  <option value="this_venue_likes">Sort By: This Venue Likes</option>
                  <option value="all_venue_likes">Sort By: All Venue Likes</option>
                </select>
                <div className="search-container">
                  <button className="search-button">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                  <div className="search-bar">
                    <input className='search' type="text" onKeyDown={e => e.key === 'Enter' && handleSearch()} onChange={e => setSearch(e.target.value)}  placeholder="Search..." />
                    <button onClick={handleSearch} className="search-submit">Submit</button>
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
                        src={`http://${backendURL}${song.img}`}
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
                        {song.song_year} - {song.song_genre} - {song.song_durations}
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