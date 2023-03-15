import React from 'react'
import '../styles/Sidemenu.scss'
import { useState, useEffect } from 'react';

interface SidemenuProps {
  user: string,
  words: Array<{ word: string }>,
  logout: React.MouseEventHandler<HTMLButtonElement>,
}

function capitalizeFirstLetter(str: string | undefined): string {
  if (str === undefined) {
      return '';
  }
  const words = str.split(' ');

  words.forEach((word, index) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    words[index] = firstLetter + restOfWord;
  });

  return words.join(' ');
}

function Sidemenu(props: SidemenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [words, setWords] = useState<Array<{ word: string }>>([]);

  useEffect(() => {
    const localStorageWords = JSON.parse(localStorage.getItem('words') || '[]');
    const combinedWords = [...localStorageWords, ...props.words];
    const uniqueWords = Array.from(new Set(combinedWords.map((wordObj) => wordObj.word)))
      .map((word) => {
        return { word };
      });
    setWords(uniqueWords);
  }, [localStorage.getItem('words')]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <i className="fa-solid fa-bars icon" onClick={toggleMenu}></i>
      <div className={`foreground ${isMenuOpen ? 'foreground-visible' : ''}`} onClick={toggleMenu}></div>
      <div className={`sidemenu ${isMenuOpen ? 'sidemenu-visible' : ''}`}>
        <h2 className='sidemenu-title'>{`Welcome ${props.user}`}</h2>
        <hr />
        <h3 className='sidemenu-save'>Saved Words:</h3>
        {words && words.length > 0 &&
          <ul className='sidemenu-list'>
            {words.sort((a, b) => a.word.localeCompare(b.word)).map((wordObj) => (
              <li className='sidemenu-list--item' key={wordObj.word}>{capitalizeFirstLetter(wordObj.word)}</li>
            ))}
          </ul>
        }
        <button onClick={props.logout} className={`sidemenu-logout ${isMenuOpen ? 'sidemenu-logout-visible' : ''}`}>Log Out</button>
      </div>
    </>
  )
}

export default Sidemenu