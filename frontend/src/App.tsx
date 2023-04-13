import React from 'react';
import './App.css';
import Login from './Components/login';
import Register from './Components/Register';
import Customer from './Components/Customer/Customer';
import CustomerRequest from './Components/Customer/CustomerRequest';
import CustomerRequestedSongs from './Components/Customer/CustomerRequestedSongs';
import AllCustomersRequests from './Components/Customer/AllCustomersRequests';
import DisplaySongsList from './Components/Customer/DisplaySongsList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Customer />} />
        <Route path='/request' element={<CustomerRequest />} />
        <Route path='/requested' element={<CustomerRequestedSongs />} />
        <Route path='/allrequests' element={<AllCustomersRequests />} />
        <Route path='/allsongs' element={<DisplaySongsList />} />
        {/* <Route path='/' element={<Venues />} />
        <Route path='/venues/:Venue_name' element={<Venue />} />
        <Route path='/venues/:Venue_name/submit' element={<SubmitPaper />} />
        <Route path='/venues/:Venue_name/:Paper' element={<ResearchPaper />} />
        <Route path='/profile/:username' element={<Profile />} />
        <Route path='/chat/:paper' element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path='/search/:Paper' element={<ShowSearch />} /> */}
      </Routes>
    </Router>
    </ChakraProvider>
  );
}

export default App;
