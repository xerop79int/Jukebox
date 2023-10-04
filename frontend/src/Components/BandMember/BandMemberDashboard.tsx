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

    const styledChars = ['A', 'AMaj', 'c', 'FG', 'F#m', 'm', '#', '7', 'C#7', 'FGC' , 'AMaj6', 'AMaj6add9', 'AMaj6aug11', 'AMaj7', 'AMaj9', 'AMaj13', 'AMadd9', 'AMadd11', 'AMadd4', 'Am', 'AminMaj7', 'Am(M7)', 'Amin6', 'Am6', 'Am7', 'Amin7', 'AminMaj9', 'Am(M9)', 'Am6add9', 'Am6/9', 'Amin9', 'Am9', 'Amin11', 'Am11', 'Amin13', 'Am13', 'Asus2', 'Asus4', 'Asus', 'A7sus', 'A7sus4', 'Aaug', 'Aaug5', 'A7aug5', 'A7(#5)', 'Aaug#11', 'A+(#11)', 'AMaj7#5', 'AM7(#5)', 'A9aug5', 'A9(#5)', 'A13aug5', 'A13(#5)', 'Adim', 'Ad', 'Adim7', 'Ad7', 'Am7b5', 'ADom', 'A7', 'ADom7b5', 'A7b5', 'A#', 'A#Maj', 'A#Maj6', 'A#Maj6add9', 'A#Maj6aug11', 'A#Maj7', 'A#Maj9', 'A#Maj13', 'A#Madd9', 'A#Madd11', 'A#Madd4', 'A#m', 'A#minMaj7', 'A#m(M7)', 'A#min6', 'A#m6', 'A#m7', 'A#min7', 'A#minMaj9', 'A#m(M9)', 'A#m6add9', 'A#m6/9', 'A#min9', 'A#m9', 'A#min11', 'A#m11', 'A#min13', 'A#m13', 'A#sus2', 'A#sus4', 'A#sus', 'A#7sus', 'A#7sus4', 'A#aug', 'A#aug5', 'A#7aug5', 'A#7(#5)', 'A#aug#11', 'A#+(#11)', 'A#Maj7#5', 'A#M7(#5)', 'A#9aug5', 'A#9(#5)', 'A#13aug5', 'A#13(#5)', 'A#dim', 'A#d', 'A#dim7', 'A#d7', 'A#m7b5', 'A#Dom', 'A#7', 'A#Dom7b5', 'A#7b5', 'Bb', 'BbMaj', 'BbMaj6', 'BbMaj6add9', 'BbMaj6aug11', 'BbMaj7', 'BbMaj9', 'BbMaj13', 'BbMadd9', 'BbMadd11', 'BbMadd4', 'Bbm', 'BbminMaj7', 'Bbm(M7)', 'Bbmin6', 'Bbm6', 'Bbm7', 'Bbmin7', 'BbminMaj9', 'Bbm(M9)', 'Bbm6add9', 'Bbm6/9', 'Bbmin9', 'Bbm9', 'Bbmin11', 'Bbm11', 'Bbmin13', 'Bbm13', 'Bbsus2', 'Bbsus4', 'Bbsus', 'Bb7sus', 'Bb7sus4', 'Bbaug', 'Bbaug5', 'Bb7aug5', 'Bb7(#5)', 'Bbaug#11', 'Bb+(#11)', 'BbMaj7#5', 'BbM7(#5)', 'Bb9aug5', 'Bb9(#5)', 'Bb13aug5', 'Bb13(#5)', 'Bbdim', 'Bbd', 'Bbdim7', 'Bbd7', 'Bbm7b5', 'BbDom', 'Bb7', 'BbDom7b5', 'Bb7b5', 'B', 'BMaj', 'BMaj6', 'BMaj6add9', 'BMaj6aug11', 'BMaj7', 'BMaj9', 'BMaj13', 'BMadd9', 'BMadd11', 'BMadd4', 'Bm', 'BminMaj7', 'Bm(M7)', 'Bmin6', 'Bm6', 'Bm7', 'Bmin7', 'BminMaj9', 'Bm(M9)', 'Bm6add9', 'Bm6/9', 'Bmin9', 'Bm9', 'Bmin11', 'Bm11', 'Bmin13', 'Bm13', 'Bsus2', 'Bsus4', 'Bsus', 'B7sus', 'B7sus4', 'Baug', 'Baug5', 'B7aug5', 'B7(#5)', 'Baug#11', 'B+(#11)', 'BMaj7#5', 'BM7(#5)', 'B9aug5', 'B9(#5)', 'B13aug5', 'B13(#5)', 'Bdim', 'Bd', 'Bdim7', 'Bd7', 'Bm7b5', 'BDom', 'B7', 'BDom7b5', 'B7b5', 'C', 'CMaj', 'CMaj6', 'CMaj6add9', 'CMaj6aug11', 'CMaj7', 'CMaj9', 'CMaj13', 'CMadd9', 'CMadd11', 'CMadd4', 'Cm', 'CminMaj7', 'Cm(M7)', 'Cmin6', 'Cm6', 'Cm7', 'Cmin7', 'CminMaj9', 'Cm(M9)', 'Cm6add9', 'Cm6/9', 'Cmin9', 'Cm9', 'Cmin11', 'Cm11', 'Cmin13', 'Cm13', 'Csus2', 'Csus4', 'Csus', 'C7sus', 'C7sus4', 'Caug', 'Caug5', 'C7aug5', 'C7(#5)', 'Caug#11', 'C+(#11)', 'CMaj7#5', 'CM7(#5)', 'C9aug5', 'C9(#5)', 'C13aug5', 'C13(#5)', 'Cdim', 'Cd', 'Cdim7', 'Cd7', 'Cm7b5', 'CDom', 'C7', 'CDom7b5', 'C7b5', 'C#', 'C#Maj', 'C#Maj6', 'C#Maj6add9', 'C#Maj6aug11', 'C#Maj7', 'C#Maj9', 'C#Maj13', 'C#Madd9', 'C#Madd11', 'C#Madd4', 'C#m', 'C#minMaj7', 'C#m(M7)', 'C#min6', 'C#m6', 'C#m7', 'C#min7', 'C#minMaj9', 'C#m(M9)', 'C#m6add9', 'C#m6/9', 'C#min9', 'C#m9', 'C#min11', 'C#m11', 'C#min13', 'C#m13', 'C#sus2', 'C#sus4', 'C#sus', 'C#7sus', 'C#7sus4', 'C#aug', 'C#aug5', 'C#7aug5', 'C#7(#5)', 'C#aug#11', 'C#+(#11)', 'C#Maj7#5', 'C#M7(#5)', 'C#9aug5', 'C#9(#5)', 'C#13aug5', 'C#13(#5)', 'C#dim', 'C#d', 'C#dim7', 'C#d7', 'C#m7b5', 'C#Dom', 'C#7', 'C#Dom7b5', 'C#7b5', 'Db', 'DbMaj', 'DbMaj6', 'DbMaj6add9', 'DbMaj6aug11', 'DbMaj7', 'DbMaj9', 'DbMaj13', 'DbMadd9', 'DbMadd11', 'DbMadd4', 'Dbm', 'DbminMaj7', 'Dbm(M7)', 'Dbmin6', 'Dbm6', 'Dbm7', 'Dbmin7', 'DbminMaj9', 'Dbm(M9)', 'Dbm6add9', 'Dbm6/9', 'Dbmin9', 'Dbm9', 'Dbmin11', 'Dbm11', 'Dbmin13', 'Dbm13', 'Dbsus2', 'Dbsus4', 'Dbsus', 'Db7sus', 'Db7sus4', 'Dbaug', 'Dbaug5', 'Db7aug5', 'Db7(#5)', 'Dbaug#11', 'Db+(#11)', 'DbMaj7#5', 'DbM7(#5)', 'Db9aug5', 'Db9(#5)', 'Db13aug5', 'Db13(#5)', 'Dbdim', 'Dbd', 'Dbdim7', 'Dbd7', 'Dbm7b5', 'DbDom', 'Db7', 'DbDom7b5', 'Db7b5', 'D', 'DMaj', 'DMaj6', 'DMaj6add9', 'DMaj6aug11', 'DMaj7', 'DMaj9', 'DMaj13', 'DMadd9', 'DMadd11', 'DMadd4', 'Dm', 'DminMaj7', 'Dm(M7)', 'Dmin6', 'Dm6', 'Dm7', 'Dmin7', 'DminMaj9', 'Dm(M9)', 'Dm6add9', 'Dm6/9', 'Dmin9', 'Dm9', 'Dmin11', 'Dm11', 'Dmin13', 'Dm13', 'Dsus2', 'Dsus4', 'Dsus', 'D7sus', 'D7sus4', 'Daug', 'Daug5', 'D7aug5', 'D7(#5)', 'Daug#11', 'D+(#11)', 'DMaj7#5', 'DM7(#5)', 'D9aug5', 'D9(#5)', 'D13aug5', 'D13(#5)', 'Ddim', 'Dd', 'Ddim7', 'Dd7', 'Dm7b5', 'DDom', 'D7', 'DDom7b5', 'D7b5', 'D#', 'D#Maj', 'D#Maj6', 'D#Maj6add9', 'D#Maj6aug11', 'D#Maj7', 'D#Maj9', 'D#Maj13', 'D#Madd9', 'D#Madd11', 'D#Madd4', 'D#m', 'D#minMaj7', 'D#m(M7)', 'D#min6', 'D#m6', 'D#m7', 'D#min7', 'D#minMaj9', 'D#m(M9)', 'D#m6add9', 'D#m6/9', 'D#min9', 'D#m9', 'D#min11', 'D#m11', 'D#min13', 'D#m13', 'D#sus2', 'D#sus4', 'D#sus', 'D#7sus', 'D#7sus4', 'D#aug', 'D#aug5', 'D#7aug5', 'D#7(#5)', 'D#aug#11', 'D#+(#11)', 'D#Maj7#5', 'D#M7(#5)', 'D#9aug5', 'D#9(#5)', 'D#13aug5', 'D#13(#5)', 'D#dim', 'D#d', 'D#dim7', 'D#d7', 'D#m7b5', 'D#Dom', 'D#7', 'D#Dom7b5', 'D#7b5', 'Eb', 'EbMaj', 'EbMaj6', 'EbMaj6add9', 'EbMaj6aug11', 'EbMaj7', 'EbMaj9', 'EbMaj13', 'EbMadd9', 'EbMadd11', 'EbMadd4', 'Ebm', 'EbminMaj7', 'Ebm(M7)', 'Ebmin6', 'Ebm6', 'Ebm7', 'Ebmin7', 'EbminMaj9', 'Ebm(M9)', 'Ebm6add9', 'Ebm6/9', 'Ebmin9', 'Ebm9', 'Ebmin11', 'Ebm11', 'Ebmin13', 'Ebm13', 'Ebsus2', 'Ebsus4', 'Ebsus', 'Eb7sus', 'Eb7sus4', 'Ebaug', 'Ebaug5', 'Eb7aug5', 'Eb7(#5)', 'Ebaug#11', 'Eb+(#11)', 'EbMaj7#5', 'EbM7(#5)', 'Eb9aug5', 'Eb9(#5)', 'Eb13aug5', 'Eb13(#5)', 'Ebdim', 'Ebd', 'Ebdim7', 'Ebd7', 'Ebm7b5', 'EbDom', 'Eb7', 'EbDom7b5', 'Eb7b5', 'E', 'EMaj', 'EMaj6', 'EMaj6add9', 'EMaj6aug11', 'EMaj7', 'EMaj9', 'EMaj13', 'EMadd9', 'EMadd11', 'EMadd4', 'Em', 'EminMaj7', 'Em(M7)', 'Emin6', 'Em6', 'Em7', 'Emin7', 'EminMaj9', 'Em(M9)', 'Em6add9', 'Em6/9', 'Emin9', 'Em9', 'Emin11', 'Em11', 'Emin13', 'Em13', 'Esus2', 'Esus4', 'Esus', 'E7sus', 'E7sus4', 'Eaug', 'Eaug5', 'E7aug5', 'E7(#5)', 'Eaug#11', 'E+(#11)', 'EMaj7#5', 'EM7(#5)', 'E9aug5', 'E9(#5)', 'E13aug5', 'E13(#5)', 'Edim', 'Ed', 'Edim7', 'Ed7', 'Em7b5', 'EDom', 'E7', 'EDom7b5', 'E7b5', 'F', 'FMaj', 'FMaj6', 'FMaj6add9', 'FMaj6aug11', 'FMaj7', 'FMaj9', 'FMaj13', 'FMadd9', 'FMadd11', 'FMadd4', 'Fm', 'FminMaj7', 'Fm(M7)', 'Fmin6', 'Fm6', 'Fm7', 'Fmin7', 'FminMaj9', 'Fm(M9)', 'Fm6add9', 'Fm6/9', 'Fmin9', 'Fm9', 'Fmin11', 'Fm11', 'Fmin13', 'Fm13', 'Fsus2', 'Fsus4', 'Fsus', 'F7sus', 'F7sus4', 'Faug', 'Faug5', 'F7aug5', 'F7(#5)', 'Faug#11', 'F+(#11)', 'FMaj7#5', 'FM7(#5)', 'F9aug5', 'F9(#5)', 'F13aug5', 'F13(#5)', 'Fdim', 'Fd', 'Fdim7', 'Fd7', 'Fm7b5', 'FDom', 'F7', 'FDom7b5', 'F7b5', 'F#', 'F#Maj', 'F#Maj6', 'F#Maj6add9', 'F#Maj6aug11', 'F#Maj7', 'F#Maj9', 'F#Maj13', 'F#Madd9', 'F#Madd11', 'F#Madd4', 'F#m', 'F#minMaj7', 'F#m(M7)', 'F#min6', 'F#m6', 'F#m7', 'F#min7', 'F#minMaj9', 'F#m(M9)', 'F#m6add9', 'F#m6/9', 'F#min9', 'F#m9', 'F#min11', 'F#m11', 'F#min13', 'F#m13', 'F#sus2', 'F#sus4', 'F#sus', 'F#7sus', 'F#7sus4', 'F#aug', 'F#aug5', 'F#7aug5', 'F#7(#5)', 'F#aug#11', 'F#+(#11)', 'F#Maj7#5', 'F#M7(#5)', 'F#9aug5', 'F#9(#5)', 'F#13aug5', 'F#13(#5)', 'F#dim', 'F#d', 'F#dim7', 'F#d7', 'F#m7b5', 'F#Dom', 'F#7', 'F#Dom7b5', 'F#7b5', 'Gb', 'GbMaj', 'GbMaj6', 'GbMaj6add9', 'GbMaj6aug11', 'GbMaj7', 'GbMaj9', 'GbMaj13', 'GbMadd9', 'GbMadd11', 'GbMadd4', 'Gbm', 'GbminMaj7', 'Gbm(M7)', 'Gbmin6', 'Gbm6', 'Gbm7', 'Gbmin7', 'GbminMaj9', 'Gbm(M9)', 'Gbm6add9', 'Gbm6/9', 'Gbmin9', 'Gbm9', 'Gbmin11', 'Gbm11', 'Gbmin13', 'Gbm13', 'Gbsus2', 'Gbsus4', 'Gbsus', 'Gb7sus', 'Gb7sus4', 'Gbaug', 'Gbaug5', 'Gb7aug5', 'Gb7(#5)', 'Gbaug#11', 'Gb+(#11)', 'GbMaj7#5', 'GbM7(#5)', 'Gb9aug5', 'Gb9(#5)', 'Gb13aug5', 'Gb13(#5)', 'Gbdim', 'Gbd', 'Gbdim7', 'Gbd7', 'Gbm7b5', 'GbDom', 'Gb7', 'GbDom7b5', 'Gb7b5', 'G', 'GMaj', 'GMaj6', 'GMaj6add9', 'GMaj6aug11', 'GMaj7', 'GMaj9', 'GMaj13', 'GMadd9', 'GMadd11', 'GMadd4', 'Gm', 'GminMaj7', 'Gm(M7)', 'Gmin6', 'Gm6', 'Gm7', 'Gmin7', 'GminMaj9', 'Gm(M9)', 'Gm6add9', 'Gm6/9', 'Gmin9', 'Gm9', 'Gmin11', 'Gm11', 'Gmin13', 'Gm13', 'Gsus2', 'Gsus4', 'Gsus', 'G7sus', 'G7sus4', 'Gaug', 'Gaug5', 'G7aug5', 'G7(#5)', 'Gaug#11', 'G+(#11)', 'GMaj7#5', 'GM7(#5)', 'G9aug5', 'G9(#5)', 'G13aug5', 'G13(#5)', 'Gdim', 'Gd', 'Gdim7', 'Gd7', 'Gm7b5', 'GDom', 'G7', 'GDom7b5', 'G7b5', 'G#', 'G#Maj', 'G#Maj6', 'G#Maj6add9', 'G#Maj6aug11', 'G#Maj7', 'G#Maj9', 'G#Maj13', 'G#Madd9', 'G#Madd11', 'G#Madd4', 'G#m', 'G#minMaj7', 'G#m(M7)', 'G#min6', 'G#m6', 'G#m7', 'G#min7', 'G#minMaj9', 'G#m(M9)', 'G#m6add9', 'G#m6/9', 'G#min9', 'G#m9', 'G#min11', 'G#m11', 'G#min13', 'G#m13', 'G#sus2', 'G#sus4', 'G#sus', 'G#7sus', 'G#7sus4', 'G#aug', 'G#aug5', 'G#7aug5', 'G#7(#5)', 'G#aug#11', 'G#+(#11)', 'G#Maj7#5', 'G#M7(#5)', 'G#9aug5', 'G#9(#5)', 'G#13aug5', 'G#13(#5)', 'G#dim', 'G#d', 'G#dim7', 'G#d7', 'G#m7b5', 'G#Dom', 'G#7', 'G#Dom7b5', 'G#7b5', 'Ab', 'AbMaj', 'AbMaj6', 'AbMaj6add9', 'AbMaj6aug11', 'AbMaj7', 'AbMaj9', 'AbMaj13', 'AbMadd9', 'AbMadd11', 'AbMadd4', 'Abm', 'AbminMaj7', 'Abm(M7)', 'Abmin6', 'Abm6', 'Abm7', 'Abmin7', 'AbminMaj9', 'Abm(M9)', 'Abm6add9', 'Abm6/9', 'Abmin9', 'Abm9', 'Abmin11', 'Abm11', 'Abmin13', 'Abm13', 'Absus2', 'Absus4', 'Absus', 'Ab7sus', 'Ab7sus4', 'Abaug', 'Abaug5', 'Ab7aug5', 'Ab7(#5)', 'Abaug#11', 'Ab+(#11)', 'AbMaj7#5', 'AbM7(#5)', 'Ab9aug5', 'Ab9(#5)', 'Ab13aug5', 'Ab13(#5)', 'Abdim', 'Abd', 'Abdim7', 'Abd7', 'Abm7b5', 'AbDom', 'Ab7', 'AbDom7b5', 'Ab7b5']

    const regex = new RegExp(`\\b(${styledChars.join('|')})\\b`, 'g'); 
    const wordRegex = /\[([^\]]+)\]/g;

    let replacelyric = lyric.replace(regex, '<span style="color: #1482f0;font-size: 32px;">$&</span>');
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
          <h1>Jukebox Cover Band System</h1>
          <p>Version 0.6<br/>Release Date: 04/10/2023<br/> Copyright Steven Rock (c) 2023</p>
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
