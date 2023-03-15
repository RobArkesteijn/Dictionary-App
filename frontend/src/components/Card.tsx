import React from 'react';
import '../styles/Card.scss';
import SaveWord from './SaveWord';

interface User {
  user: string,
  password: string,
  words: Array<{ word: string }>,
}

interface CardProps {
    word: string | undefined,
    phonetic: string | undefined,
    meanings: { 
      partOfSpeech: string | undefined; 
      definitions: { 
        definition: string | undefined; 
      }[]; 
      synonyms: string[] | undefined[];
    }[] | undefined,
    user: User | undefined; 
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

function Card(props: CardProps) {
  return (
    <div className='card'>
        <div className='card-container'>
          <SaveWord user={props.user} word={props.word} />
          <h1 className='card-container--word'>{capitalizeFirstLetter(props.word)}</h1>
          {props.phonetic &&
          <h3 className='card-container--phonetic'>{props.phonetic}</h3>
          }
          <hr />
          {props.meanings && props.meanings.length > 0 &&
          <ul className='card-container--list'>
            {props.meanings.map((meaning, index) => (
              <li className='card-container--list-item' key={index}>
                <h4 className='card-container--list-part'>{meaning.partOfSpeech}</h4>
                <ol className='card-container--list-ordered'>
                  {meaning.definitions.map((definition, index) => {
                    return <li className='card-container--list-definition' key={index}>{definition.definition}</li>;
                  })}
                </ol>
                {meaning.synonyms && meaning.synonyms.length > 0 &&
                <div className='card-container--list-synonyms'>
                  <h4 className='card-container--list-synonyms-title'>Synonyms:</h4>
                  {meaning.synonyms.map((synonym, index) => {
                    return <p className='card-container--list-synonym-word' key={index}>{synonym}</p>
                  })}
                </div>
                }
              </li>
            ))}
          </ul>
          } 
        </div>
    </div>
  )
}

export default Card