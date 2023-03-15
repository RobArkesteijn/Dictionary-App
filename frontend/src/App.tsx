import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.scss';
import Card from './components/Card';
import './Login.scss'
import Sidemenu from './components/Sidemenu';

type DataItem = {
  word: string,
  phonetic: string,
  meanings: {
    partOfSpeech: string | undefined,
    definitions: {
      definition: string | undefined,
    }[]
    synonyms: string[],
  }[]
};

interface User {
  user: string,
  password: string,
  words: Array<{ word: string }>,
}

function App() {
  const [data, setData] = useState<DataItem>();
  const [word, setWord] = useState('');
  const [error, setError] = useState(false);
  const [newUser, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://localhost:8080/api/dictionary');
      setData(response.data[0]);
    }

    fetchData();
  }, [])

  useEffect(() => {
    // Check local storage for user login information
    const storedUser = window.localStorage.getItem('user');
    const storedPass = window.localStorage.getItem('pass');
    if (storedUser && storedPass) {
      handleLogin(storedUser, storedPass);
    }
  }, []);

  const handleSubmitWord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (word !== '') {
      try {
        const response = await axios.get(`http://localhost:8080/api/${word}`);
        setData(response.data[0]);
        setError(false);
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setWord('');
    }
  };

  const handleLogin = async (user: string, password: string) => {
    const data = { user, password};
    try {
      if (isSignup) {
        const url = 'http://localhost:8080/api/signup';
        const response = await axios.post(url, data);
        console.log(response.data);
        setUserExist(false);
      }
      const url = `http://localhost:8080/api/user/${data.user}`
      const response = await axios.get(url);
      if (response.data === null) {
        throw new Error(`The user '${data.user}' does not exist`);
      }
      if (response.data.password !== data.password){
        throw new Error('Password is incorrect');
      }
      setUserData(response.data);
      console.log(response.data);
      window.localStorage.setItem('user', data.user);
      window.localStorage.setItem('pass', data.password);
      window.localStorage.setItem('words', JSON.stringify(userData!.words));
    } catch (error) {
      if (error!.toString() === 'AxiosError: Request failed with status code 500') {
        setErrorMessage('Error: This user already exists, log in!')
      } else {
        setErrorMessage(error!.toString());
      }
      setUserExist(true);
    }
    setUser('');
    setPass('');
  };

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin(newUser, pass);
  };

  const handleLogout = () => {
    setUserData(undefined);
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('pass');
    window.localStorage.removeItem('words');
  };

  return (
    <>
    {userData ? ( 
        <Sidemenu user={userData.user} words={userData.words} logout={handleLogout}/>
      ) : (
      <div className='login'>
        <h5 className="login-title" onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}</h5>
        <form className='login-form' method="POST" onSubmit={handleSubmitLogin}>
            <label className='login-form--label' htmlFor="username">Username:</label>
            <input className='login-form--input' type="text" id="username" name="username" placeholder='Username..' value={newUser} onChange={(e) => setUser(e.target.value)}/>
            <label className='login-form--label' htmlFor="password">Password:</label>
            <input className='login-form--input' type="password" id="password" name="password" placeholder='Password..' value={pass} onChange={(e) => setPass(e.target.value)}/>
            <button className='login-form--button' type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        {userExist && <p className='login-error'>{errorMessage}</p>}
      </div>
      )}
      <form className="form" onSubmit={handleSubmitWord}>
        <input className="form--input" type="text" id="search" name="search" placeholder="Search.." value={word} onChange={(e) => setWord(e.target.value)}/>
        {error && <p className="form--error">The word you searched for does not exist.</p>}
      </form>
      <Card word={data?.word} phonetic={data?.phonetic} meanings={data?.meanings} user={userData}/>
    </>
  );
}

export default App;
