import {
    Heading,
    Box,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    Alert,
    AlertIcon,
    useColorModeValue
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
  const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let URL = `http://localhost:8000/customerrequest?view=all`;
    
        axios.get(URL, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
                    setSongs(res.data.customer_requests);
            })
            .catch(err => console.log(err))
      }, []);

    const handlerequest = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
        event.preventDefault();
        let URL = `http://localhost:8000/customerrequest`;
        
        const data = {
            "song_id": id,
        }

        axios.put(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        })
            .then(res => {
                if (res.data.error){
                    console.log(res.data)
                    setErrorMessage(res.data.error);
                }
                else{
                    console.log(res.data);
                }
            })
            .catch(err => console.log(err))
    }



    return (
      <div>
        <Sidenav />
        <Flex marginTop={'1.5'} bg={useColorModeValue('gray.50', 'gray.800')} >
            <Box style={{margin: '0 auto'}}>
            {errorMessage && <Alert maxW={'500px'} status="error">
            <AlertIcon />
            {errorMessage}
            </Alert>}
            </Box>
        </Flex>
        <Flex direction={'row'} wrap={'wrap'} p={6} justifyContent={'center'}>
        { songs.map((song) => (
        <Stack
          style={{width: '270px'}}
          boxShadow={'2xl'}
          key={song.id}
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
              onClick={e => handlerequest(e, song.id)}
              mt={8}
              id="rqstbtn"
              backgroundColor={'#151f21'}
              color={'white'}
              rounded={'md'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}>
              Request this song
            </Button>
          </Box>
        </Stack>
          ))}
        </Flex>

        </div>
    );
  }

export default SongList;