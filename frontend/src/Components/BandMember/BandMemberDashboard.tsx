import React, { useState, useEffect } from 'react';
import './BandMemberDashboard.css';
import axios from 'axios';

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

interface Sets {
    id: number;
    set_name: string;
}
// Create a queue to store the requests


const SongList: React.FC = () => {

  const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
  const [option, setOption] = useState<string>('queue');
  const [search, setSearch] = useState<string>("");
  const [Sets, setSets] = useState<Sets[]>([]);
  const [selectedSetSongs, setSelectedSetSongs] = useState<Song[]>([]);
  const [nowSong, setNowSong] = useState<Song>();
  const [nextSong, setNextSong] = useState<Song>();

  const [lyric, setLyric]= useState<string>(``);

  const Measure = React.useRef<number>(1);
  const Beat = React.useRef<number>(1);
  const SCROLL = React.useRef<number>(0);

  const handlefullscreen = () => {
    if(document.fullscreenElement){
      document.exitFullscreen();
      const fullscreen = document.querySelector('.fullscreen') as HTMLElement;
      fullscreen.textContent = 'Fullscreen';
    }
    else{
    document.documentElement.requestFullscreen();
    const fullscreen = document.querySelector('.fullscreen') as HTMLElement;
    fullscreen.textContent = 'Exit Fullscreen';
    }
  }

  useEffect(() => {
    const socket = new WebSocket(`ws://${backendURL}/ws/bandmember/`);

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.log(data.metronome)
      if(data.playlist){
        handleGettingPlaylist(); 
      }
      else if(data.metronome === true || data.metronome === false){
        const metronome = document.querySelector('.bandmember-main-buttons') as HTMLElement;
        if (data.metronome){
          metronome.style.display = 'flex';
        }
        else{
          metronome.style.display = 'none';
        }
      }
      else{
        console.log(data.Scroll)
        // handleGettingPlaylist();
        Measure.current = data.measure;
        Beat.current = data.beat;
        SCROLL.current = data.scroll;
        handleMeasureAndBeat();
      }
    };

  }, []);

  const handleMeasureAndBeat = () => {
    

    if (Measure.current % 4 === 0){
      handleAutoScrolling(SCROLL.current);
    }


    const measure1 = document.querySelector('.measure-1') as HTMLElement;
    if (measure1){
    measure1.textContent = Measure.current.toString();
    }
    else{
      return;
    }

    if (Beat.current === 0 && Measure.current === 1 && SCROLL.current === 0){
      const fa4 = document.querySelector('.fa4') as HTMLElement;
      const fa1 = document.querySelector('.fa1') as HTMLElement;
      const fa2 = document.querySelector('.fa2') as HTMLElement;
      const fa3 = document.querySelector('.fa3') as HTMLElement;
      if (fa4 && fa2 && fa3 && fa1){
        fa4.style.backgroundColor = 'black';
        fa1.style.backgroundColor = 'black';
        fa2.style.backgroundColor = 'black';
        fa3.style.backgroundColor = 'black';
      }
      handleAutoScrolling(SCROLL.current);
      return;
    }


    if (Beat.current === 1){
      measure1.style.backgroundColor = 'red';
      const fa4 = document.querySelector('.fa4') as HTMLElement;
      if (fa4){
        fa4.style.backgroundColor = 'black';
      }
    }
    else{
      measure1.style.backgroundColor = 'black';
      const fa = document.querySelector('.fa' + (Beat.current - 1)) as HTMLElement;
      if (fa){
      fa.style.backgroundColor = 'black';
      }
      const fabeat = document.querySelector('.fa' + Beat.current) as HTMLElement;
      if (fabeat){
      fabeat.style.backgroundColor = 'red';
      }
    }
  }


  const handleAutoScrolling = (SCROLL: number) => {
    const scrollingdiv = document.querySelector('.bandleader-verse-sec-scroll') as HTMLElement;
    if(scrollingdiv === null){
      return;
    }
    scrollingdiv.scrollTo({
      top: SCROLL,
      behavior: 'smooth'
    })
  }

  

  const handlestyling = (lyric: string) => {

    const styledChars = ['D', 'A', 'G', 'A7', 'E7', 'Bm', 'E', 'C#', 'B', 'F#m', 'C', 'c', 'BHAE7V', 'GA', 'GS', 'ES', 'AS', 'E5', 'A5', 'G5', 'Am', 'FG', 'FGC', 'F', 'DE', 'DEA', 'DoA', '#7DA', 'DCE', 'DA', '#7']

    const regex = new RegExp(`\\b(${styledChars.join('|')})\\b`, 'g'); 
    const wordRegex = /\[([^\]]+)\]/g;

    let replacelyric = lyric.replace(regex, '<span class="styled-char">$&</span>');
    replacelyric = replacelyric.replace(wordRegex, '<span class="styled-word">$&</span>');
    replacelyric = replacelyric.replace(
      /\[|\]/g,
      ''
    );
    setLyric(replacelyric)

  }

  const handleGetSets = () => {
    const URL = `http://${backendURL}/sets`

    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      setSets(res.data.sets);
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    let URL = `http://${backendURL}/songslist?view=likes`;


    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          // check if the status code is 401
          if(res.data.status === 401){
            window.location.href = '/login';
          }
          setSongs(res.data.band_songs);

        })
        .catch(err => {if(err.response.status === 401){ window.location.href = '/login'; console.log(err) } else {console.log(err)}})

        handleGetSets()
        handleGettingPlaylist()


  }, []);

  const handleGettingPlaylist = () => {
    let URL = `http://${backendURL}/playlist`;

    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          console.log(res.data)
          setNowSong(res.data.playlist[0])
          setNextSong(res.data.playlist[1])
          handlestyling(res.data.playlist[0].lyric)
        })
        .catch(err => {console.log(err)})
  }


  
  // if (requestQueue.length === 0) {
  //   processRequest();
  // }
  const handleSearch = () => {
    const URL = `http://${backendURL}/songslist?search=${search}`
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

  const handleGettingSongsInSet = (id: number) => {
    const URL = `http://${backendURL}/songsinset?set_id=${id}`


    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
      setSelectedSetSongs(res.data.songs_in_set);
    })
    .catch(err => console.log(err))
  }

  // const handleSetGet = () => {
  //   const URL = `http://${backendURL}/songsset`

  //   axios.get(URL, {
  //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
  //   })
  //   .then(res => {
  //     console.log(res.data)
  //     setSetSongs(res.data.song_sets);
  //   })
  //   .catch(err => console.log(err))
  // }

  const handleOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {

    // check if the e.target.value has a substring of 'set'
    if(e.target.value.includes('Set')){
      const splitString = e.target.value.split(' ')[1];
      const id = parseInt(splitString);

      handleGettingSongsInSet(id);
      setOption(e.target.value);
    }    
  }



  const handleToggle = () => {
    const section = document.getElementById("mySection") as HTMLElement;
    section.classList.toggle("bandleader-right-position");
    const moveButton = document.getElementById("moveButton") as HTMLElement;
    if(moveButton.classList.contains("fa-rotate-90")){
      moveButton.classList.remove("fa-rotate-90");
      moveButton.classList.add("fa-rotate-270");
    }
    else if(moveButton.classList.contains("fa-rotate-270")){
    moveButton.classList.remove("fa-rotate-270");
    moveButton.classList.add("fa-rotate-90");
    }
  }

  const handleAdminBTN = () => {
    const adminDropDownContent = document.getElementById('bandleader-show') as HTMLElement;
    
    if (adminDropDownContent.style.display === 'block'){
      adminDropDownContent.style.display = 'none';
    }
    else{
      adminDropDownContent.style.display = 'block';
    }
  }

  const handleAbout = () => {
    const about = document.querySelector('.bandleader-about') as HTMLElement;
    about.style.display = about.style.display === 'flex' ? 'none' : 'flex';
  }



 












  return (
    <div>

      <div className="bandleader-about">
        <div className="bandleader-about-child">
          <h1>Band Member Dashboard</h1>
          <p>Version 0.6<br/>Release Date: <br/> Copyright Steven Rock (c) 2023</p>
        </div>
        <button className="bandleader-about-button" onClick={handleAbout}>Close</button>
      </div>

    <div className="bandleader-main">
       <div className="bandleader-alert-box bandleader-green">
                <p className='bandleader-alert-message'></p>
       </div>



      <div className="bandleader-sub-main">
        <div className="bandmember-main-buttons">
          <div className="band-member-main-button-1-head">
          <div className="band-member-measure">
            <div className="band-member-main-button-circle-1 measure-1 fa1">
            1
            </div>
          </div>
          </div>
          <i className="fa-solid fa2 fa-2x">2</i>
          <i className="fa-solid fa3 fa-2x">3</i>
          <i className="fa-solid fa4 fa-2x">4</i>
        </div>
        <nav>
        { nowSong ? (
          <div className="bandleader-nav-child1">
            <h3 style={{paddingTop: '0.2rem'}}>Now</h3>
            <div className="bandleader-song-title-queue">
              <div className="bandleader-songtitle-queue">
                <h4>{nowSong?.number} - {nowSong?.song_name} -</h4>
                <p style={{textTransform: 'capitalize'}}>{nowSong?.song_artist} - </p>
              </div>
              <h5 className="bandleader-songdetail-queue">  <span className='keys-now-next'> {nowSong.cortes} </span> <span className='bpm-now-next'>- {nowSong.bpm}</span> </h5>
            </div>
          </div>
          ): null}

          { nextSong ? (
          <div className="bandleader-nav-child2">
            <h3 style={{paddingTop: '0.2rem'}}>Next</h3>
            <div className="bandleader-song-title-queue">
              <div className="bandleader-songtitle-queue">
                <h4 >{nextSong?.number} - {nextSong?.song_name} -</h4>
                <p style={{textTransform: 'capitalize'}}>{nextSong?.song_artist} - </p>
              </div>
              <h5 className="bandleader-songdetail-queue"> <span className='keys-now-next'>{nextSong.cortes}</span> <span className='bpm-now-next'>- {nextSong.bpm}</span></h5>
            </div>
          </div>
          ): null}
        </nav>
        <div className="bandleader-verse-sec">
          <div className="bandleader-verse-sec-scroll">
            <pre dangerouslySetInnerHTML={{ __html: lyric }} >
            {/* <div className='bandleader-lyric' /> */}
            </pre>
          </div>
        </div>
      </div>

      <div className="bandleader-slider-section" id="mySection">
        <div className="bandleader-button" onClick={handleToggle}>
          <i className="fa-solid fa-chevron-down fa-rotate-90" id="moveButton"></i>
        </div>
        <div className="bandleader-nav">
          <select className="bandleader-dropdown" value={option} onChange={handleOptions}>
          <option value="">Select</option>
            {  Sets.map((set, index) => ( 
              <option key={set.id} value={`Set ` + set.id}>{set.set_name}</option>
              ))}
          </select>

          <div className="bandleader-admin-dropdown" onClick={handleAdminBTN} id="bandleader-btn">


            <button className="bandleader-drop-button bandleader-dropdown-btn">Admin &nbsp; <i className="fa-solid fa-chevron-down"></i></button>


              <div className="bandleader-dropdown-content" id="bandleader-show" >

                <div>
                <a className='fullscreen' onClick={handlefullscreen}>Full Screen</a>
                </div>
                <div>
                  <a onClick={handleAbout}>About</a>
                </div>
              </div>
              
          </div>

          <div className="bandleader-search-container">
            <button className="bandleader-search-button">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <div className="bandleader-search-bar">
              <input type="text" placeholder="Search..." />
              <button className="bandleader-search-submit">Submit</button>
            </div>
          </div>
        </div>
        <div className="bandleader-songlist">
          <div className="bandleader-sub-songlist">

             { option.includes('Set') && selectedSetSongs ? 
             selectedSetSongs.map((song: Song) => (
              <div key={song.id} className="bandleader-song-dummy">
              <h3>{song.number}</h3>
              <div className="bandleader-song-title-queue">
                <div className="bandleader-songtitle-queue">
                  <h4 style={{textTransform: 'capitalize'}}>{song.song_number} - {song.song_name} -</h4>
                  <p style={{textTransform: 'capitalize'}}>{song.song_artist} </p>
                </div>
                <div className="bandleader-songdetail">
                <h5 className="bandleader-songdetail-queue"> - {song.song_year} - {song.song_genre} </h5>
                <h5> - in A </h5> 
                <p> - {song.song_durations}</p>
                </div>
              </div>
            </div>
            ))
            :
            null}
            

          </div>
        </div>
      </div>
    </div>
    </div>
  )

}

export default SongList;
