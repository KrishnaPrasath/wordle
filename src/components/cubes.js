import React, { useEffect, useState } from 'react';
import Cubicles from './cubicles';
import ToastEmitter from './ToastEmitter';
import Modal from './ReportModal';
import { mock5LetterWords } from '../data/words';
import { getRandomWord, useWindowSize } from '../utils/utils';
import { GREEN, GREY, YELLOW, MAX_TRIES, WORD_LENGTH } from '../data/constants';
import Confetti from 'react-confetti';
import { Button } from 'react-bootstrap';

const Cubes = () => {
  const [word, setWord] = useState('');
  const [inputOne, setInputOne] = useState('');
  const [inputHistory, setInputHistory] = useState([]);
  const [colorCodes, setColorCodes] = useState([]);
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState(null); // 0 = no win ; 1 = win;
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [toastShow, setToastShow] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const difficultyLevel = 'easy';

  /*
    toastMessage = {
      body: string,
      title: string,
      variant: string,
    }
  */

  const { width, height } = useWindowSize();

  const addValidatedToastMessage = (message) => {
    setToastShow(true);
    setToastMessage(message);
  };

  const validationCallback = (codes) => {
    if (codes.every((i) => i === GREEN)) {
      setTries(MAX_TRIES);
      setStatus(1);
      setModalShow(true);
      setModalMessage('Congratulations! :)');
      addValidatedToastMessage({
        body: 'Congratulations!',
        title: 'toast!!',
        variant: 'Light',
      });
      return;
    } else if (tries >= MAX_TRIES - 1) {
      setModalShow(true);
      setModalMessage('Better luck next time! :(');
      addValidatedToastMessage({
        body: 'Better luck next time! :(',
        title: 'toast!!',
        variant: 'Light',
      });
      return;
    }
    setInputOne('');
    return true;
  };

  const generateColorCode = (input) => {
    let verifiedLetters = [];
    return input.split('').map((letter, idx) => {
      const regEx = new RegExp(letter, 'g');
      let colorCode = GREY;
      if (verifiedLetters.includes(letter) && ((word.match(regEx)||[]).length <= (verifiedLetters.join('').match(regEx)||[]).length))  {
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
      return colorCode;
    });
  };

  const verifyBtn = () => {
    if (inputOne.length === WORD_LENGTH) {
      if (mock5LetterWords.includes(inputOne) || difficultyLevel === 'easy') {
        if (tries < MAX_TRIES) {
          setTries((prev) => ++prev);
          let currentColorCodes = generateColorCode(inputOne);
          setInputHistory([...inputHistory, inputOne]);
          setColorCodes([...colorCodes, currentColorCodes]);
          validationCallback(currentColorCodes);
        }
      } else {
        addValidatedToastMessage({
          body: `The word doesn't exist in the dictionary, try another word.`,
          title: 'toast!!',
          variant: 'Light',
        });
      }
    }
  };

  const setRandomWord = () => {
    const word = getRandomWord(0, mock5LetterWords.length);
    setWord(word);
  };

  const resetBtn = () => {
    setColorCodes([]);
    setStatus(0);
    setInputHistory([]);
    setTries(0);
    setRandomWord();
    setInputOne('');
    setToastMessage('');
  };

  useEffect(() => {
    setRandomWord();
  }, []);

  return (
    <>
      {status === 1 && (
        <Confetti width={width} height={height} numberOfPieces={200} />
      )}
      {toastMessage && (
        <ToastEmitter
          variant={'danger'}
          show={toastShow}
          message={toastMessage}
          setToastShow={setToastShow}
        />
      )}
      <div className='mb-3 w-50 m-auto'>
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
          autoComplete='off'
        ></input>
        <div className='d-flex'>
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
          <Button
            id='resetBtn'
            type='button'
            onClick={resetBtn}
            className={`btn btn-outline-secondary m-auto shadow-sm`}
            style={{ color: 'white' }}
            size={'lg'}
          >
            RESET
          </Button>
        </div>
      </div>
      {colorCodes.map((colorCode, idx) => (
        <Cubicles
          key={idx}
          colorCodes={colorCode}
          inputHistory={inputHistory[idx]}
        />
      ))}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        message={modalMessage}
      />
    </>
  );
};

export default Cubes;
