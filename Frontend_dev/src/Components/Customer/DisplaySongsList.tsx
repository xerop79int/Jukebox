import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button
  } from '@chakra-ui/react'
import { UpDownIcon } from '@chakra-ui/icons';
import Sidenav from './Sidenav';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Song {
  id: number;
  song_name: string;
  song_artist: string;
  song_genre: string;
  liked: boolean;
}
  
const SongList: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        let URL = `http://localhost:8000/songslist`;
    
        axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data)
              setSongs(res.data.band_songs);
            })
            .catch(err => console.log(err))
      }, []);

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



    return (
        <div>
            <Sidenav />
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>List of All the Songs by the Band</TableCaption>
                    <Thead>
                    <Tr>
                        <Th>Song Name <UpDownIcon color={'green.400'} cursor={'pointer'} onClick={e => handleSorting('name')} /></Th>
                        <Th>Artist <UpDownIcon color={'green.400'} cursor={'pointer'} onClick={e => handleSorting('artist')} /></Th>
                        <Th>Genre <UpDownIcon color={'green.400'} cursor={'pointer'} onClick={e => handleSorting('genre')} /></Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {songs.map((song) => (
                    <Tr key={song.id}>
                        <Td>{song.song_name} </Td>
                        <Td>{song.song_artist}</Td>
                        <Td>{song.song_genre}</Td>
                        { song.liked ? <Button colorScheme='blue' variant='outline'>Liked</Button> : <Button onClick={e => handleLike(song.id)} colorScheme='blue' variant='outline'>Like</Button>}
                    </Tr>
                    ))}
                    </Tbody>
                </Table>
                </TableContainer>
        </div>
    );
  }

export default SongList;