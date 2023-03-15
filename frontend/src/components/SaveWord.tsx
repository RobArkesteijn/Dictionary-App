import React, {useState } from 'react';
import axios from 'axios';
import '../styles/SaveWord.scss';

interface User {
  user: string,
  password: string,
  words: Array<{ word: string }>,
}

interface SaveWordProps {
	user: User | undefined,
	word: string | undefined,
}

function SaveWord(props: SaveWordProps) {
	const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = async () => {
    setIsChecked(!isChecked);
    if (!isChecked && props.user) {			
      try {
        const response = await axios.post(`http://localhost:8080/api/user/${props.user.user}/words`, {
          word: `${props.word}`,
        });
        console.log(response);

				const words = JSON.parse(localStorage.getItem('words') || '[]');
      	const updatedWords = [...words, { word: props.word }];
      	localStorage.setItem('words', JSON.stringify(updatedWords));
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <label>
      <input className="checkbox" type="checkbox" name="myCheckbox" onChange={handleCheckboxChange}/>
    </label>
  )
}

export default SaveWord