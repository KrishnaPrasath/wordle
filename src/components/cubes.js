import React, { useEffect, useState } from 'react';
import Cubicles from './cubicles';
import Modal from './ReportModal';
import { mock5LetterWords } from './../data/words';
import { getRandomWord, useWindowSize } from './../utils/utils';
import {
  GREEN,
  GREY,
  YELLOW,
  MAX_TRIES,
  WORD_LENGTH,
} from './../data/constants';
import Confetti from 'react-confetti';
import { Button } from 'react-bootstrap';

const Cubes = () => {
  const [word, setWord] = useState('');
  const [inputOne, setInputOne] = useState('');
  const [inputHistory, setInputHistory] = useState([]);
  const [colorCodes, setColorCodes] = useState([]);
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState(0); // 0 = no win ; 1 = win;
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const { width, height } = useWindowSize();

  const successCallback = (codes) => {
    if (codes.every((i) => i === GREEN)) {
      console.log('Congratatulations! Fireworks!!');
      setTries(MAX_TRIES);
      setStatus(1);
      return false;
    }
    return true;
  };

  const verifyBtn = () => {
    if (inputOne.length === WORD_LENGTH && tries < MAX_TRIES) {
      setTries((prev) => ++prev);
      let verifiedLetters = [];
      let currentColorCodes = inputOne.split('').map((letter, idx) => {
        let colorCode = GREY;

        if (verifiedLetters.includes(letter)) {
          verifiedLetters.push(letter);
          return colorCode;
        } else {
          verifiedLetters.push(letter);
        }
        if (word.includes(letter)) {
          colorCode = YELLOW;
        }
        if (letter === word[idx]) {
          colorCode = GREEN;
        }

        // TODO: if a letter is entered more than once, red flag the second letter
        return colorCode;
      });
      setInputHistory([...inputHistory, inputOne]);
      setInputOne('');
      setColorCodes([...colorCodes, currentColorCodes]);
      successCallback(currentColorCodes);
    }
  };

  useEffect(() => {
    const word = getRandomWord(0, mock5LetterWords.length);
    console.log(word);
    setWord(word);
  }, []);

  useEffect(() => {
    if(status === 1){
      setModalShow(true);
      setModalMessage('Congratulations! :)');
    } else if (status === 0 && tries >= MAX_TRIES) {
      setModalShow(true);
      setModalMessage('Better luck next time! :(');
    }
  }, [status]);

  return (
    <>
      {status === 1 && (
        <Confetti width={width} height={height} numberOfPieces={200} />
      )}

      <div class='mb-3 w-50 m-auto'>
        <input
          id='inputOne'
          value={inputOne}
          onChange={(e) => setInputOne(e.target.value.toLowerCase())}
          maxLength={5}
          autoFocus
          onKeyPress={(e) => e.code === 'Enter' && verifyBtn()}
          placeholder='Enter a 5 letter word...'
          className='form-control mb-4 text-uppercase shadow-sm'
          type='text'
          aria-label='Enter a 5 letter word...'
          aria-describedby='button-addon2'
        ></input>
        <Button
          id='verifyBtn'
          type='button'
          onClick={verifyBtn}
          className={`${
            (tries >= MAX_TRIES || inputOne.length < WORD_LENGTH || status) &&
            'tries-over'
          } btn btn-outline-secondary m-auto w-50 shadow-sm`}
          style={{ color: 'white' }}
          size={'lg'}
        >
          VERIFY
        </Button>
      </div>
      {colorCodes.map((colorCode, idx) => (
        <Cubicles
          key={idx}
          colorCodes={colorCode}
          inputHistory={inputHistory[idx]}
        />
      ))}
      <Modal show={modalShow} onHide={() => setModalShow(false)} message={modalMessage}/>
    </>
  );
};

export default Cubes;
