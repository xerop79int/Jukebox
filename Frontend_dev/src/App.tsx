import './App.css';
import Login from './Components/login';
import Register from './Components/Register';
import NowPlaying from './Components/Customer/NowPlaying';
import BandLeaderDashboard from './Components/Bandleader/BandLeaderDashboard';
import BandMemberDashboard from './Components/BandMember/BandMemberDashboard'
import Upload from './Components/Bandleader/Upload';
import AddSingleSong from './Components/Bandleader/AddSingleSong';
import AddVenue from './Components/Bandleader/AddVenue';
import Show from './Components/Bandleader/AddShow';
import ShowSchedule from './Components/Bandleader/AddShowSchedule';
import EditSong from './Components/Bandleader/EditSong';
import Backup from './Components/Bandleader/Backup';
import Restore from './Components/Bandleader/Restore';
import Logs from './Components/Bandleader/Logs'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import "@fontsource/dejavu-sans";

function App() {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/' element={<NowPlaying />} />
        <Route path='/bandleader' element={<BandLeaderDashboard />} /> 
        <Route path='/addsinglesong' element={<AddSingleSong />} /> 
        <Route path='/addvenue' element={<AddVenue />} /> 
        <Route path='/show' element={<Show />} />
        <Route path='/showschedule' element={<ShowSchedule />} />
        <Route path='/editsong' element={<EditSong />} />
        <Route path='/editsong/:song_id' element={<AddSingleSong />} />
        <Route path='/bandmember' element={<BandMemberDashboard />} />
        <Route path='/backup' element={<Backup />} />
        <Route path='/load' element={<Restore />} />
        <Route path='/logs' element={<Logs />} />
      </Routes>
    </Router>
    </ChakraProvider>
  );
}

export default App;
