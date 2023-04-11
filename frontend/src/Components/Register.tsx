import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    Select,
    Alert,
    AlertIcon,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import axios from 'axios';
  
  export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [accountType, setAccountType] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const data = {
      'name': name,
      'email': email,
      'username': username,
      'account_type': accountType,
      'password': password,
      'password2': password2
    }

    const handleSubmit = () => {
        axios.post('http://127.0.0.1:8000/register', data,{
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
                window.location.href = '/login';
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
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First/Nick name</FormLabel>
                    <Input onChange={e => setName(e.target.value)} type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input onChange={e => setUsername(e.target.value)} type="text" />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input onChange={e => setEmail(e.target.value)} type="email" />
              </FormControl>
              <FormControl id="role" isRequired>
              <FormLabel>Account Type</FormLabel>
              <Select onChange={e => setAccountType(e.target.value)} placeholder='Select option'>
                <option value='customer'>Customer</option>
                <option value='band_leader'>Band Leader</option>
                <option value='band_member'>Band Member</option>
              </Select>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input onChange={e => setPassword2(e.target.value)} type={showPassword ? 'text' : 'password'} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
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
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user? <Link onClick={() => window.location.href = '/login'} color={'blue.400'}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      </div>
    );
  }