import React, { useEffect, useState } from 'react';
import Cubicles from './cubicles';
import Keypad from './Keypad';
import ToastEmitter from './ToastEmitter';
import Modal from './ReportModal';
import { mock5LetterWords } from '../data/words';
import { getRandomWord, useWindowSize, fillColorCodes } from '../utils/utils';
import { GREEN, GREY, YELLOW, MAX_TRIES, WORD_LENGTH } from '../data/constants';
import Confetti from 'react-confetti';
import wordleImage from './../icons/wordle.svg';
import replayIcon from './../icons/replay.svg';

const Cubes = () => {
  const [word, setWord] = useState('');
  const [inputOne, setInputOne] = useState('');
  const [inputHistory, setInputHistory] = useState([]);
  const [colorCodes, setColorCodes] = useState(fillColorCodes(GREY));
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState(null); // 0 = no win ; 1 = win;
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [toastShow, setToastShow] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const difficultyLevel = 'easy';

  // refs
  const inputOneRef = React.useRef(inputOne);
  const inputHistoryRef = React.useRef(inputHistory);
  const triesRef = React.useRef(tries);
  const wordRef = React.useRef(word);
  const statusRef = React.useRef(status);
  // decoy setStates
  const _setInputOne = (enteredKey, keyCode = null) => {
    if (keyCode === 'Backspace') {
      inputOneRef.current = inputOneRef.current.slice(0, -1);
      inputHistoryRef.current[triesRef.current] = inputOneRef.current;
    } else {
      inputOneRef.current = inputOneRef.current + enteredKey;
      inputHistoryRef.current[triesRef.current] = inputOneRef.current;
    }

    setInputOne(inputOneRef.current);
    setInputHistory((prev) => {
      let temp = [...prev];
      let _tries = triesRef.current;
      if (_tries + 1 >= temp.length) {
        temp[_tries] = inputHistoryRef.current[_tries];
      }
      return temp;
    });
  };

  const _incrementTries = () => {
    ++triesRef.current;
    setTries(triesRef.current);
  };

  const { width, height } = useWindowSize();

  const setRandomWord = () => {
    const word = getRandomWord(0, mock5LetterWords.length);
    wordRef.current = word;
    setWord(word);
  };

  const resetBtn = () => {
    updateRef({ statusRef: null, triesRef: 0, inputHistoryRef: [], inputOneRef: '' });
    setColorCodes(fillColorCodes(GREY));
    setRandomWord();
    setToastMessage('');
    setModalMessage('');
  };

  useEffect(() => {
    setRandomWord();
  }, []);

  const addValidatedToastMessage = (message) => {
    setToastShow(true);
    setToastMessage(message);
  };

  const updateRef = ({ ...refs }) => {
    if ('statusRef' in refs) {
      statusRef.current = refs.statusRef;
      setStatus(statusRef.current);
    }

    if ('triesRef' in refs) {
      triesRef.current = refs.triesRef;
      setTries(triesRef.current);
    }

    if ('inputHistoryRef' in refs) {
      inputHistoryRef.current = refs.inputHistoryRef;
      setInputHistory(inputHistoryRef.current);
    }

    if ('inputOneRef' in refs) {
      inputOneRef.current = refs.inputOneRef;
      setInputOne(inputOneRef.current);
    }
  };

  const validationCallback = (codes) => {
    if (codes.every((i) => i === GREEN)) {
      updateRef({ statusRef: 1 });
      setModalShow(true);
      setModalMessage('Congratulations! :)');
      addValidatedToastMessage({
        body: 'Congratulations!',
        title: 'toast!!',
        variant: 'Light',
      });
      return;
    } else if (triesRef.current >= MAX_TRIES) {
      updateRef({ statusRef: 0 });
      setModalShow(true);
      setModalMessage(`Better luck next time! :( \n word: ${wordRef.current}`);
      addValidatedToastMessage({
        body: 'Better luck next time! :(',
        title: 'toast!!',
        variant: 'Light',
      });
      return;
    }
    setInputOne('');
    inputOneRef.current = '';
    return true;
  };

  const generateColorCode = (input) => {
    let verifiedLetters = [];
    return input.split('').map((letter, idx) => {
      const regEx = new RegExp(letter, 'g');
      let colorCode = GREY;
      if (
        verifiedLetters.includes(letter) &&
        (wordRef.current.match(regEx) || []).length <= (verifiedLetters.join('').match(regEx) || []).length
      ) {
        verifiedLetters.push(letter);
        return colorCode;
      } else {
        verifiedLetters.push(letter);
      }
      if (wordRef.current.includes(letter)) {
        colorCode = YELLOW;
      }
      if (letter === wordRef.current[idx]) {
        colorCode = GREEN;
      }
      return colorCode;
    });
  };

  const verifyBtn = () => {
    if (inputOneRef.current.length === WORD_LENGTH) {
      if (mock5LetterWords.includes(inputOneRef.current) || difficultyLevel === 'easy') {
        if (triesRef.current < MAX_TRIES) {
          let currentColorCodes = generateColorCode(inputOneRef.current);
          setColorCodes((prev) => {
            let temp = [...prev];
            temp[triesRef.current] = currentColorCodes; // _incrementTries gets completed before this line
            return temp;
          });
          _incrementTries();
          validationCallback(currentColorCodes);
        }
      } else {
        addValidatedToastMessage({
          body: `The word doesn't exist in the dictionary, try another word.`,
          title: 'toast!!',
          variant: 'Light',
        });
      }
    } else {
      addValidatedToastMessage({
        body: `Please enter a five letter word!!`,
        title: 'Instruction',
        variant: 'Light',
      });
    }
  };

  const handleOnChange = (e, type = null) => {
    console.log(e, type);
    if (type === 'CLICK') {
      if (e === 'SUBMIT') {
        verifyBtn();
        return;
      }
      if (e === 'DELETE' && inputOneRef.current.length > 0) {
        inputOneRef.current.length && _setInputOne('', 'Backspace');
        return;
      }
      if (e !== 'DELETE' && e !== 'SUBMIT' && inputOneRef.current.length < 5) {
        _setInputOne(e.toLowerCase());
        return;
      }
    }
    if (statusRef.current === null) {
      if (e.code === 'Enter') {
        verifyBtn();
        return;
      }
      if (e.code === 'Backspace' && inputOneRef.current.length > 0) {
        inputOneRef.current.length && _setInputOne('', e.code);
        return;
      }
      const charCode = e.keyCode;
      if (((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) && inputOneRef.current.length < 5) {
        _setInputOne(e.key.toLowerCase());
        return;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleOnChange);

    return () => document.addEventListener('keydown', handleOnChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {status === 1 && <Confetti width={width} height={height} numberOfPieces={200} />}
      {toastMessage && (
        <ToastEmitter variant={'danger'} show={toastShow} message={toastMessage} setToastShow={setToastShow} />
      )}
      <div className="mb-3">
        <div className="d-flex align-items-center title-container justify-content-around px-2">
          <div className="">
            <img src={wordleImage} className="w-icon rounded" alt="toast identifier" width={75} height={75} />
          </div>
          <h1 className="title col">Wordle</h1>
          <div>
            <img
              id="resetBtn"
              type="button"
              onClick={resetBtn}
              src={replayIcon}
              className="rounded reset-icon"
              alt="toast identifier"
              width={50}
              height={50}
            />
          </div>
        </div>
      </div>
      <div className="cubicles-container">
        {colorCodes.map((colorCode, idx) => (
          <Cubicles key={idx} index={idx} colorCodes={colorCode} inputHistory={inputHistory[idx]} />
        ))}
      </div>
      <div className="key-cube-container">
        <Keypad id={'keyPad'} handleOnChange={handleOnChange} />
      </div>
      <Modal show={modalShow} onHide={() => setModalShow(false)} message={modalMessage} />
    </>
  );
};

export default Cubes;
