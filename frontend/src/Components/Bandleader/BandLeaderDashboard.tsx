import React, { useState, useEffect } from 'react';
import './BandLeaderDashboard.css';

// interface Song {
//     id: number;
//     song_name: string;
//     song_artist: string;
//     song_genre: string;
//     count: number;
//     song_number: number;
//     song_durations: string;
// }

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
              <div className="song-title-queue">
                <div className="songtitle-queue">
                  <h4>123 - Lorem ipsum dolor sit - </h4>
                  <h6>Lorem, ipsum</h6>
                </div>
                <h5 className="songdetail-queue"> 1984 - lorem - 7:14</h5>
              </div>
            </div>
            <div className="nav-child2">
              <h3>Next</h3>
              <div className="song-title-queue">
                <div className="songtitle-queue">
                  <h4>123 - Lorem ipsum dolor sit - </h4>
                  <h6>Lorem, ipsum</h6>
                </div>
                <h5 className="songdetail-queue"> 1984 - lorem - 7:14</h5>
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
            <select className="dropdown">
              <option value="option1">opt 1</option>
              <option value="option2">opt 2</option>
              <option value="option3">opt 3</option>
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
          <div className="songlist">
            <div className="sub-songlist">
              {/* <!-- dummy --> */}
  
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
              <div className="song-dummy">
                <h3>12</h3>
                <div className="song-title-queue">
                  <div className="songtitle-queue">
                    <h4>123 - Lorem ipsum dolor sit -</h4>
                    <h6>Lorem, ipsum</h6>
                  </div>
                  <h5 className="songdetail-queue">1984 - lorem - 7:14</h5>
                </div>
              </div>
  
              {/* <!-- dummy --> */}
            </div>
          </div>
        </div>
      </div>
    )
}

export default SongList;
