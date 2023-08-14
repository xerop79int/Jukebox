  import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Alert,
    AlertIcon,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import axios from 'axios';
  
  export default function Login() {

    const [backendURL, setBackendURL] = useState<string>(((window.location.href).split("/")[2]).split(":")[0] + ":5000");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const data = {
      'username': username,
      'password': password,
    }

    const handleSubmit = () => {
        axios.post(`http://${backendURL}/login`, data,{
          headers: {
              'Content-Type': 'application/json'
          }
      }).then((response) => {
          console.log(response);
          if (response.status === 200){
              if(response.data.error){ 
                setErrorMessage(response.data.error);
              }
              else{
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('account_type', response.data.account_type);
                console.log(localStorage.getItem('account_type'));
                window.location.href = '/' + response.data.account_type;
              }
          }
      })
      .catch((error)=>{
          console.error(error);
      })
    }

    return (
      <div>
        <Flex marginTop={'1.5'} bg={useColorModeValue('gray.50', 'gray.800')} >
          <Box style={{margin: '0 auto'}}>
        {errorMessage && <Alert maxW={'500px'} status="error">
          <AlertIcon />
          {errorMessage}
        </Alert>}
        </Box>
        </Flex>

      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Username</FormLabel>
                <Input onChange={e => setUsername(e.target.value)} type="text" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input onChange={e => setPassword(e.target.value)} type="password" />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: 'column', sm: 'row' }}
                  align={'start'}
                  justify={'space-between'}>
                  <Checkbox isChecked>Remember me</Checkbox>
                </Stack>
                <Button
                  onClick={handleSubmit}
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign in
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don't have an account? <Link onClick={() => window.location.href = '/register'} color={'blue.400'}>Register</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      </div>
    );
  }