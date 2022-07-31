import React, { useEffect, useState } from 'react';

const ALPHABETS = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'DELETE',
  'SUBMIT',
];

const MAP = {
  DUMMY: 'DEL',
  SUBMIT: 'SUB',
  DELETE: 'DEL',
};

const KeyCube = (props) => {
  const { letter, handleOnChange } = props;

  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (letter) {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }
  }, [letter]);

  return (
    <div
      className={`key-cube  rounded shadow ${animate && 'press'}`}
      style={{ cursor: 'pointer' }}
      onClick={(e) => handleOnChange(letter, 'CLICK')}
      value={letter}
    >
      {letter in MAP ? MAP[letter] : letter}
    </div>
  );
};

const Keypad = (props) => {
  return (
    <>
      {ALPHABETS.map((key, idx) => {
        return <KeyCube key={idx} letter={key} {...props} />;
      })}
    </>
  );
};

export default Keypad;
