import {
    Heading,
    Box,
    Image,
    Flex,
    Text,
    Stack,
    Button,
  } from '@chakra-ui/react';
import Sidenav from './Sidenav';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Song {
  id: number;
  song_name: string;
  song_artist: string;
  song_genre: string;
  song_dedicated_to: string;
}
  
const SongList: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        let URL = `http://localhost:8000/customerrequest`;
    
        axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
              console.log(res.data.customer_requests)
              setSongs(res.data.customer_requests);
            })
            .catch(err => console.log(err))
      }, []);



    return (
        <div>
            <Sidenav />

        <Flex direction={'row'} wrap={'wrap'} p={6} justifyContent={'center'}>
        { songs.map((song) => (
        <Stack
          style={{width: '270px'}}
          boxShadow={'2xl'}
          m={2}
          rounded={'md'}
          overflow={'hidden'}
          >
          <Image
            h={'120px'}
            w={'full'}
            src={
              'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
            }
            objectFit={'cover'}
          />
          <Box p={6} >
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} textTransform={'capitalize'} fontWeight={500} fontFamily={'body'}>
                {song.song_name}
              </Heading>
              <Text color={'gray.500'}>Dedicated: {song.song_dedicated_to}</Text>
            </Stack>
  
            <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>Artist</Text>
                <Text fontSize={'sm'} textTransform={'capitalize'}  color={'gray.500'}>
                  {song.song_artist}
                </Text>
              </Stack>
              <Stack spacing={0} align={'center'}>
                <Text fontWeight={600}>Genre</Text>
                <Text fontSize={'sm'} textTransform={'capitalize'} color={'gray.500'}>
                  {song.song_genre}
                </Text>
              </Stack>
            </Stack>
  
            <Button
              w={'full'}
              mt={8}
              backgroundColor={'#151f21'}
              color={'white'}
              rounded={'md'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}>
              Follow
            </Button>
          </Box>
        </Stack>
          ))}
        </Flex>

        </div>
    );
  }

export default SongList;