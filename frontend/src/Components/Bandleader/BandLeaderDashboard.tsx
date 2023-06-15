import React, { useState, useEffect } from 'react';
import './BandLeaderDashboard.css';
import axios from 'axios';
import { m } from 'framer-motion';

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
}

interface Sets {
    id: number;
    set_name: string;
}

interface SongRequest{
  customer_name: string;
  song_number: number;
  song_name: string;
  song_artist: string;
  song_durations: string;
  id: number;
}
// Create a queue to store the requests


const SongList: React.FC = () => {

  const [songs, setSongs] = useState<Song[]>([]);
  const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);
  const [option, setOption] = useState<string>('queue');
  const [search, setSearch] = useState<string>("");
  // const [SongsSet, setSetSongs] = useState<Song[]>([]);
  const [Sets, setSets] = useState<Sets[]>([]);
  const [currentSet, setCurrentSet] = useState<number>(0);
  const [selectedSetSongs, setSelectedSetSongs] = useState<Song[]>([]);
  const [SongRequestid, setSongRequestid] = useState<number>(0);
  const [nowSong, setNowSong] = useState<Song>();
  const [nextSong, setNextSong] = useState<Song>();

  const [movesong, setMovesong] = useState<number>(0);

  const [requestQueue, setRequestQueue] = useState<SongRequest[]>([]);
  const socket = new WebSocket('ws://localhost:8000/ws/bandleadercustomerrequests/');

  const [lyric, setLyric]= useState<string>( 
  `
[Verse]

D                 A              D
Ridin'  on the City of  New Orleans
  
Bm                G              D 
Illinois  Central Monday  mornin' rail
  
D                 A                D 
There's  15 cars, and  15 restless riders
  
Bm               A               D 
3 conductors  and 25 sacks of  mail 
  
Bm                                 F#m 
All along a  southbound oddyssey,  and the train pulls  out of Kankakee 
  
A                                            E 
And rolls along  past the houses,  farms and fields 
  
Bm                                 F#m 
Passin' trains  that have no name,  and freightyards  full of old black  men 
  
A                   A7                  D 
The graveyards of the rusted automobiles 
  
[Chorus] 
  
G              A7                D 
Good mornin'  America, how  are you? 
  
        Bm                   G                D      A7 
Sayin' don't  you know me?,  I'm your native  son 
  
        D                     A            Bm A E7 
I'm the train  they call the City of  New Orleans 
  
        C     G   A                      D 
I'll be gone  50@ miles when  the day is done. 
  
[Verse] 
  
D                    A                             D 
Dealin’  card games with  the old men  in the club car. 
  
Bm               G                       D 
Penny a  point, ain’t  no one keepin'  score 
  
D                A                       D 
Pass the  paper bag that  holds that bottle. 
  
Bm               A                     D 
Hear the wheels  rumblin'  ‘neath the floor. 
  
Bm                                         F#m 
And the sons of  Pullman Porters, and  the sons of engineers 
  
A                                          E 
Ride their father's  magic carpet made  of steel 
  
Bm                                    F#m 
Mothers with their  babes asleep are  rockin’ to the gentle  beat 
  
A                      A7                 D 
And the rhythm  of the rails  is all they feel. 
  
[Chorus] 
  
G             A7                D 
Good mornin'  America, how are  you? 
  
        Bm              G              D      A7 
Sayin' don't  you know me?,  I'm your native  son 
  
        D                     A           Bm A  E7 
I'm the train  they call the  City of New Orleans 
  
        c      G   A                      D 
I'll be gone  50@ miles when  the day is done. 
  
[Break] 
  
  A7 D  Bm G  D  A7 D  A  BHAE7V  C GA    D 
  
[Verse] 
  
D                 A            D 
Nighttime on  the City of New  Orleans. 
  
Bm                G              D 
Changin’ cars  in Memphis, Tennessee 
  
D                   A                  D 
Half way home,  and we'll be  there by mornin’ 
  
              Bm                    A                    D 
Through the  Mississippi darkness  rollin’ down  to the sea. 
  
        Bm                             F#m 
And all the towns  and people seem to  fade into a bad dream 
  
        A                                    E 
And the  steel rails still  ain't heard the  news 
  
        Bm                               F#m 
The conductor sings  his songs again the passengers  will please  refrain 
  
        A                   A7                 D 
This train has  got the disappearin’  railroad blues 
  
[Chorus] 
  
G             A7                D 
Good mornin'  America, how  are you? 
  
        Bm              G              D       A7 
Sayin' don't  you know me?,  I'm your native  son 
  
        D                     A            Bm A E7 
I'm the train  they call the City of  New Orleans 
  
[Outro] 
  
        G    G    A                      D 
I'll be gone 50@  miles when the day  is done 
  
        c     G    A                      D 
I'll be gone 50@  miles when the day  is done 
  
        C    G    A                      D 
I'll be gone 50@  miles when the day  is done 
  
  `);

  

  const handlestyling = () => {
    const lyricsArray = lyric.split('\n');
    lyricsArray.map((line) => {
      if(line.includes("   "))
      {
        console.log(line)
      }
    })
    
    // lyric.replaceAll('G', "<span className='alphabet'> G </span>")
    // let updatedlyric= lyric.replaceAll('A', '<span style="color: #00468b">A</span>')
    // updatedlyric= lyric.replaceAll('A ', '<span style="color: #00468b">A </span>')
    // updatedlyric = updatedlyric.replaceAll('Bm', '<span style="color: #00468b">Bm</span>')
    // updatedlyric = updatedlyric.replaceAll('D', '<span style="color: #00468b">D</span>')
    // // updatedlyric = updatedlyric.replaceAll('D ', '<span style="color: #00468b">D </span>')
    // // updatedlyric = updatedlyric.replaceAll(' D', '<span style="color: #00468b"> D</span>')
    // updatedlyric = updatedlyric.replaceAll(' G ', '<span style="color: #00468b"> G </span>')
    // updatedlyric = updatedlyric.replaceAll('G ', '<span style="color: #00468b">G </span>')
    // updatedlyric = updatedlyric.replaceAll('A7', '<span style="color: #00468b">A7</span>')
    // updatedlyric = updatedlyric.replaceAll(' E ', '<span style="color: #00468b"> E </span>')
    // updatedlyric = updatedlyric.replaceAll(' E7 ', '<span style="color: #00468b"> E7 </span>')
    // updatedlyric = updatedlyric.replaceAll('E7', '<span style="color: #00468b">E7</span>')
    // updatedlyric = updatedlyric.replaceAll(' C ', '<span style="color: #00468b"> C </span>')
    // updatedlyric = updatedlyric.replaceAll('F#m', '<span style="color: #00468b">F#m</span>')
    let updatedlyric = lyric.replaceAll('[Break]', '<span style="color: Yellow">Break</span>')
    updatedlyric = updatedlyric.replaceAll('[Verse]', '<span style="color: Yellow">Verse</span>')
    updatedlyric = updatedlyric.replaceAll('[Chorus]', '<span style="color: Yellow">Chorus</span>')
    updatedlyric = updatedlyric.replaceAll('[Outro]', '<span style="color: Yellow">Outro</span>')
    setLyric(updatedlyric)
  }

  const handleGetSets = () => {
    const URL = `http://localhost:8000/sets`

    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      setSets(res.data.sets);
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    let URL = `http://localhost:8000/songslist?view=likes`;

    handlestyling()

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


        socket.onopen = function(e) {
          console.log("[open] Connection established");
          // Perform actions after the WebSocket connection is established
          // For example, send an initial request
          socket.send('WebSocket connection established');
        };


  }, []);

  const handleGettingPlaylist = () => {
    let URL = `http://localhost:8000/playlist`;

    axios.get(URL, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
        .then(res => {
          setNowSong(res.data.playlist[0])
          setNextSong(res.data.playlist[1])

        })
        .catch(err => {console.log(err)})
  }


  const processRequest = (currentRequest: any) => {
  
    // Display the request data on the frontend
    const name = document.querySelector('.customer-name') as HTMLInputElement;
    name.textContent = " " + currentRequest.customer_name;
  
    const song_number_name = document.querySelector('.number-song-name') as HTMLInputElement;
    song_number_name.textContent = " " + currentRequest.song_number + " - " + currentRequest.song_name + " - ";
  
    const artist = document.querySelector('.artist-durations') as HTMLInputElement;
    artist.textContent = " " + currentRequest.song_artist + " - " + currentRequest.song_duration;
  
    const popup = document.querySelector('#popup') as HTMLInputElement;
    popup.style.right = '0px';
    popup.style.display = 'flex';
  
    setSongRequestid(currentRequest.id);
  
    // Process the request by sending the response
    // ...
  
    // Remove the processed request from the queue
    
  };

  useEffect(() => {
    if(requestQueue.length !== 0){
      const currentRequest = requestQueue[0];
      processRequest(currentRequest);
    }
  }, [requestQueue]);
  

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data); 
      console.log(data)
      setRequestQueue([data]);
    };
  
  
  // if (requestQueue.length === 0) {
  //   processRequest();
  // }
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

  const handleGettingSongsInSet = (id: number) => {
    const URL = `http://localhost:8000/songsinset?set_id=${id}`


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
  //   const URL = `http://localhost:8000/songsset`

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
      // split the string
      const splitString = e.target.value.split(' ')[1];
      // convert the string to a number
      const id = parseInt(splitString);
      // call the handleSet function
      handleGettingSongsInSet(id);

      setOption(e.target.value);

      const updown_arrow = document.querySelector('.bandleader-buttons-updown') as HTMLInputElement;
      updown_arrow.style.position = 'absolute';
      const songlist = document.querySelector('.bandleader-sub-songlist') as HTMLInputElement;
      songlist.style.alignItems = 'flex-start';
      songlist.style.padding = '0 2rem';
    } 
    else{
      setOption(e.target.value);
      const updown_arrow = document.querySelector('.bandleader-buttons-updown') as HTMLInputElement;
      updown_arrow.style.position = '';
      const songlist = document.querySelector('.bandleader-sub-songlist') as HTMLInputElement;
      songlist.style.alignItems = 'center';
      songlist.style.padding = '';
    }

    
  }



  const handleToggle = () => {
    const section = document.getElementById("mySection") as HTMLElement;
    section.classList.toggle("bandleader-right-position");
  }

  const handleAdminBTN = () => {
    const adminDropDownContent = document.getElementById('bandleader-show') as HTMLElement;
    
    if (adminDropDownContent.style.display == 'block'){
      adminDropDownContent.style.display = 'none';
    }
    else{
      adminDropDownContent.style.display = 'block';
    }
  }

  const handleSetAdd = () => {
    console.log(localStorage.getItem('token'))
    const URL = `http://localhost:8000/sets`

    const data = {
      "name": 'Set '
    }

    axios.post(URL, data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {  
      console.log(res.data.error)
      const alert = document.querySelector('.bandleader-alert-box') as HTMLElement;
      const alertMessage = document.querySelector('.bandleader-alert-message') as HTMLElement;
      alertMessage.innerHTML = res.data.success
      alert.style.display = "block";

      setTimeout(function() {
        alert.style.display = 'none';
      }, 2000);
      handleGetSets()
    })
    .catch(err => console.log(err))
    
  
  }

 

  const handleEditSet = (id: number) => {
    setOption('editset');
    setCurrentSet(id);
  }

  const handleSetSubmit = (id: number) => {
    const URL = `http://localhost:8000/songsinset`

    const data = {
      "set_id": currentSet,
      "song_id": id
    }

    axios.post(URL, data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
      const alert = document.querySelector('.bandleader-alert-box') as HTMLElement;
      const alertMessage = document.querySelector('.bandleader-alert-message') as HTMLElement;
      alertMessage.innerHTML = res.data.success
      alert.style.display = "block";

      setTimeout(function() {
        alert.style.display = 'none';
      }, 2000);
    })
    .catch(err => console.log(err))
  }

  const handleCustomerRequestUpdate = (status: string, approved: boolean, number: number) => {

    const URL = `http://localhost:8000/customerrequest`

    const data = {
      "request_id": SongRequestid,
      "status": status,
      "approved": approved
    }

    axios.put(URL, data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
      if (requestQueue.length !== 0) {
      const popup = document.querySelector('#popup') as HTMLInputElement;
      popup.style.right = '-350px';
      setRequestQueue(prevQueue => prevQueue.slice(1));
      // const currentRequest = requestQueue[0];
      // processRequest(currentRequest);
      }
      else{
        
      }

      
      
    })
    .catch(err => console.log(err))

    if (number !== 0) {

    const SonginsetURL = `http://localhost:8000/songsinset`

    const songinsetdata = {
      "request_id": SongRequestid,
      "place": number
    }

    axios.put(SonginsetURL, songinsetdata, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
    }
    )
    .catch(err => console.log(err))
    }


  }

  const handleScrolledToTop = () => {
    const scroll = document.querySelector('.bandleader-verse-sec') as HTMLElement;
    scroll.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }


  const handleChangingSong = (movement: string) => {
    const URL = `http://localhost:8000/playlist`

    const data = {
      "movement": movement
    }

    axios.post(URL, data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
      handleGettingPlaylist()
    }
    )
    .catch(err => console.log(err))
  }

  const handleSelectedSongForMovement = (id: number) => {
    setMovesong(id);
    const alert = document.querySelector('.bandleader-alert-box') as HTMLElement;
    const alertMessage = document.querySelector('.bandleader-alert-message') as HTMLElement;
    alertMessage.innerHTML = "Song Selected"
    alert.style.display = "block";

    setTimeout(function() {
      alert.style.display = 'none';
    }, 2000);
  }

  const handlemovement = (movement: string) => {
    let place = 0;
    if( movement === 'up'){
      place = 4;
    }
    else if(movement === 'down'){
      place = 5;
    }

    const URL = `http://localhost:8000/songsinset`

    const data = {
      "request_id": movesong,
      "place": place
    }

    axios.put(URL, data, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    })
    .then(res => {
      console.log(res.data)
      const id = parseInt(option.split(' ')[1]);
      handleGettingSongsInSet(id)
    }
    )
    .catch(err => console.log(err))
  }



  return (
    <div className="bandleader-main">
       <div className="bandleader-alert-box bandleader-green">
                <p className='bandleader-alert-message'></p>
                {/* <span onClick={handleAlertClose} className="close-btn">&times;</span> */}
       </div>

       <div id="popup" className="">
          <button id="closeButton">X</button>
          <div className="pop-up-div1 p-d">
            <div className="text-upper" >
              <div className="t1">
                New Request From 
              </div>
              <div className="customer-name t2">
                Lorem, ipsum dolor
              </div>
            </div>
            <div className="text-lower" >
              <div className="number-song-name t1">
                25 - Lorem, ipsum
              </div>
              <div className="artist-durations t2">
                - Lorem, ipsum - 4:20
              </div>
            </div>
          </div>
          <div className="pop-up-div2 p-d">
            <button className="sub-pop-div1 spd" onClick={e => handleCustomerRequestUpdate('Approved Next in Que!', true, 1)}>1 - Play Next</button>
            <button className="sub-pop-div2 spd" onClick={e => handleCustomerRequestUpdate("Delined, Sorry, but we already played this one", false, 0)}>Declined - Already Played</button>
          </div>
          <div className="pop-up-div3 p-d">
            <button className="sub-pop-div1 spd" onClick={e => handleCustomerRequestUpdate('Approved number in Que!', true, 2)}>2 - Play After Next</button>
            <button className="sub-pop-div2 spd" onClick={e => handleCustomerRequestUpdate("Delined, Sorry, but there isn't enough time left!", false, 0)}>Declined - Not Enough Time</button>
          </div>
          <div className="pop-up-div4 p-d">
            <button className="sub-pop-div1 spd" onClick={e => handleCustomerRequestUpdate('Approved number in Que', true, 3)}>? - Next Available</button>
            <div className="sub-pop-div2 spd" >
              <div className="tip-icon icon">
                <div className="tip">
                  <img className="tip-jar" src="./img/tip jar.png" alt="tip-jar-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>


      <div className="bandleader-sub-main">
        <div className="bandleader-main-buttons">
          <i className="fa-solid fa-arrow-left fa-2x" onClick={e => handleChangingSong('previous')}></i>
          <i className="fa-solid fa-play fa-2x"></i>
          <i className="fa-solid fa-pause fa-2x"></i>
          <i className="fa-solid fa-stop fa-2x"></i>
          <i className="fa-solid fa-arrow-rotate-left fa-2x" onClick={handleScrolledToTop}></i>
          <i className="fa-solid fa-arrow-right fa-2x" onClick={e => handleChangingSong('next')}></i>
          <i className="fa-solid fa-1 fa-2x"></i>
          <i className="fa-solid fa-2 fa-2x"></i>
          <i className="fa-solid fa-3 fa-2x"></i>
          <i className="fa-solid fa-4 fa-2x"></i>
        </div>
        <nav>
          { nowSong ? (
          <div className="bandleader-nav-child1">
            <h3>Now</h3>
            <div className="bandleader-song-title-queue">
              <div className="bandleader-songtitle-queue">
                <h4>{nowSong?.number} - {nowSong?.song_name} -</h4>
                <p style={{textTransform: 'capitalize'}}>{nowSong?.song_artist} - </p>
              </div>
              <h5 className="bandleader-songdetail-queue"> 1984 - {nowSong?.song_genre} - {nowSong?.song_durations}</h5>
            </div>
          </div>
          ): null}

          { nextSong ? (
          <div className="bandleader-nav-child2">
            <h3>Next</h3>
            <div className="bandleader-song-title-queue">
              <div className="bandleader-songtitle-queue">
                <h4>{nextSong?.number} - {nextSong?.song_name} -</h4>
                <p style={{textTransform: 'capitalize'}}>{nextSong?.song_artist} - </p>
              </div>
              <h5 className="bandleader-songdetail-queue">1984 - {nextSong?.song_genre} - {nextSong?.song_durations}</h5>
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

      <div className="bandleader-slider-section bandleader-right-position" id="mySection">
      <div className="bandleader-buttons-updown arrowww">
          <div className="bandleader-uparrow" onClick={e => handlemovement('up')}>
            <i className="fa-solid fa-arrow-up fa-3x"></i>
          </div>
          <div className="bandleader-downarrow arrowww" onClick={e => handlemovement('down')}>
            <i className="fa-solid fa-arrow-down fa-3x"></i>
          </div>
        </div>
        <div className="bandleader-button" onClick={handleToggle}>
          <i className="fa-solid fa-circle fa-3x" id="moveButton"></i>
        </div>
        <div className="bandleader-nav">
          <select className="bandleader-dropdown" value={option} onChange={handleOptions}>
            <option value="queue">Queue</option>
            <option value='search'>Search</option>
            <option value="editset">Edit Set</option>
            {  Sets.map((set, index) => ( 
            <option key={set.id} value={`Set ` + set.id}>{set.set_name}</option>
            ))}
          </select>



          <div className="bandleader-admin-dropdown" onClick={handleAdminBTN} id="bandleader-btn">


            <button className="bandleader-drop-button bandleader-dropdown-btn">Admin &nbsp; <i className="fa-solid fa-arrow-down"></i></button>


              <div className="bandleader-dropdown-content" id="bandleader-show" >

                <div className="bandleader-dropdown-submenu bandleader-dropdown-submenu-1" >
                  <a>Sets</a>
                  <div className="bandleader-dropdown-submenu-content bandleader-dropdown-submenu-content-1">
                    <a href="#" className="bandleader-add-btn"
                     onClick={handleSetAdd}
                     >Add</a>
                    <div className="bandleader-dropdown-submenu-edit">
                      <a href="#">Edit</a>
                      <div className="bandleader-dropdown-submenu-content-edit">
                        { Sets.map((set, index) => (
                          <a key={set.id} onClick={e => handleEditSet(set.id)}>{set.set_name}</a>
                        ))}
                      </div>
                    </div>
                    <a href="#">Delete</a>
                  </div>
                </div>
                
              
                <div className="bandleader-dropdown-submenu bandleader-dropdown-submenu-2">
                  <a href="#">Songs</a>
                  <div className="bandleader-dropdown-submenu-content bandleader-dropdown-submenu-content-2">
                    <a href="#" className="bandleader-add-btn">Add</a>
                    <a href="#">Edit</a>
                    <a href="#">Delete</a>
                  </div>
                </div>
              
                <div className="bandleader-dropdown-submenu bandleader-dropdown-submenu-3">
                  <a href="#">User Settings</a>
                  <div className="bandleader-dropdown-submenu-content bandleader-dropdown-submenu-content-3">
                    <a href="#" className="bandleader-add-btn">Add</a>
                    <a href="#">Edit</a>
                    <a href="#">Delete</a>
                  </div>
                </div>
              
                <div className="bandleader-dropdown-submenu bandleader-dropdown-submenu-4">
                  <a href="#">Network Setting</a>
                  <div className="bandleader-dropdown-submenu-content bandleader-dropdown-submenu-content-4">
                    <a href="#" className="bandleader-add-btn">Add</a>
                    <a href="#">Edit</a>
                    <a href="#">Delete</a>
                  </div>
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

          { option === 'queue' ?
              songs.map((song: Song) => (
                <div key={song.id} className="bandleader-song-dummy">
                <h3>{song.song_number}</h3>
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
                {/* <i className="fa-solid fa-check fa-2x" id="brandleaderCheck"></i>
                <i className="fa-solid fa-xmark fa-2x" id="brandleaderCross"></i> */}
              </div>
              ))
              :
              null}
            
            { option === 'editset' && currentSet != 0 ?
              songs.map((song: Song) => (
                <div key={song.id} className="bandleader-song-dummy">
                <h3>{song.song_number}</h3>
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
                <i className="fa-solid fa-check fa-2x" onClick={e => handleSetSubmit(song.id)} id="brandleaderCheck"></i>
                <i className="fa-solid fa-xmark fa-2x" id="brandleaderCross"></i>
              </div>
              ))
              :
              null}

             { option.includes('Set') ? 
             selectedSetSongs.map((song: Song) => (
              <div key={song.id} className="bandleader-song-dummy" onClick={e => handleSelectedSongForMovement(song.id)}>
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
              <i className="fa-solid fa-lock fa-2x" id="brandleaderLock"></i>
              <i className="fa-solid fa-unlock fa-2x" id="brandleaderUnlock"></i>
            </div>
            ))
            :
            null}

            {/* <div className="bandleader-song-dummy">
              <h3>12</h3>
              <div className="bandleader-song-title-queue">
                <div className="bandleader-songtitle-queue">
                  <h4>123 - Lorem ipsum dolor sit -</h4>
                  <h6>Lorem, ipsum</h6>
                </div>
                <h5 className="bandleader-songdetail-queue">1984 - lorem - 7:14</h5>
              </div>
              <i className="fa-solid fa-lock fa-2x" id="brandleaderLock"></i>
              <i className="fa-solid fa-unlock fa-2x" id="brandleaderUnlock"></i>
            </div> */}
            

            {/* <div className="bandleader-song-dummy">
              <h3>12</h3>
              <div className="bandleader-song-title-queue">
                <div className="bandleader-songtitle-queue">
                  <h4>123 - Lorem ipsum dolor sit -</h4>
                  <h6>Lorem, ipsum</h6>
                </div>
                <h5 className="bandleader-songdetail-queue">1984 - lorem - 7:14</h5>
              </div>
              <i className="fa-solid fa-check fa-2x" id="brandleaderCheck"></i>
              <i className="fa-solid fa-xmark fa-2x" id="brandleaderCross"></i>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  )

}

export default SongList;
