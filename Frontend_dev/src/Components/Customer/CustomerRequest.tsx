import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select,
  } from '@chakra-ui/react';
import { useState } from 'react';
import Sidenav from './Sidenav';
import axios from 'axios';
  
export default function CustomerRequest() {

    const [songName, setSongName] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [songGenre, setSongGenre] = useState('');
    const [songDedicatedTo, setSongDedicatedTo] = useState('');
    

    const data = {
        'song_name': songName,
        'song_artist': songArtist,
        'song_genre': songGenre,
        'song_dedicated_to': songDedicatedTo,
    }
    const URL = 'http://localhost:8000/customerrequest';

    const handleSubmit = () => {
        axios.post(URL, data, {
            headers: { Authorization: `Token ${localStorage.getItem('token')}` },
          })
              .then(res => {
                console.log(res.data)
              })
              .catch(err => console.log(err))
    }
    
  
    return (
    <div>

      <Sidenav />
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Make a Song Request
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              What do you want to hear ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
             <FormControl >
             <FormLabel>Select a Song from the List</FormLabel>
              <Select placeholder='Select option' onChange={e => setSongName(e.target.value)}>
                <option value='customer'>Customer</option>
                <option value='band_leader'>Band Leader</option>
                <option value='band_member'>Band Member</option>
              </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Song Name (Request a custom Song) </FormLabel>
                <Input onChange={e => setSongName(e.target.value)} type="text" />
              </FormControl>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>Song Artist</FormLabel>
                    <Input onChange={e => setSongArtist(e.target.value)} type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Song Genre</FormLabel>
                    <Input onChange={e => setSongGenre(e.target.value)} type="text" />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email">
                <FormLabel>Song Dedicated To</FormLabel>
                <Input onChange={e => setSongDedicatedTo(e.target.value)} type="text" />
              </FormControl>
             
              <Stack spacing={10} pt={2}>
                <Button
                  onClick={handleSubmit}
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Submit
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Want to see what other people have <Link color={'blue.400'}>request?</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </div>
    );
  }