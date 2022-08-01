import React, { useEffect, useState } from 'react';
import backspaceIcon from './../icons/backspace.svg';
import checkIcon from './../icons/check.svg';

const keyPadRow_one = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];

const keyPadRow_two = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];

const keyPadRow_three = ['DELETE', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'SUBMIT'];

const MAP = {
  SUBMIT: checkIcon,
  DELETE: backspaceIcon,
};

const KeyCube = (props) => {
  const { letter, handleOnChange, colorCodeMapper, resetIndicator } = props;

  const [animate, setAnimate] = useState(false);
  const [customClassList, setCustomClassList] = useState([]);

  useEffect(() => {
    if (letter) {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 1000);
    }
    setTimeout(() => {
      setCustomClassList([colorCodeMapper[letter.toUpperCase()]]);      
    }, resetIndicator ? 0: 3000);
  }, [letter, colorCodeMapper, resetIndicator]);

  const specialKey = letter in MAP;

  return (
    <div
      className={`key-cube  rounded shadow ${animate && 'press'} ${specialKey && 'special_key'} ${customClassList?.length && customClassList.join(' ')}`}
      style={{ cursor: 'pointer' }}
      onClick={(e) => handleOnChange(letter, 'CLICK')}
      value={letter}
    >
      {specialKey ? <img src={MAP[letter]} alt={letter} /> : letter}
    </div>
  );
};

const Keypad = (props) => {

  return (
    <>
      <div className="key-cube-container">
        {keyPadRow_one.map((key, idx) => {
          return <KeyCube key={idx} letter={key} {...props} />;
        })}
      </div>
      <div className="key-cube-container">
        {keyPadRow_two.map((key, idx) => {
          return <KeyCube key={idx} letter={key} {...props} />;
        })}
      </div>
      <div className="key-cube-container">
        {keyPadRow_three.map((key, idx) => {
          return <KeyCube key={idx} letter={key} {...props} />;
        })}
      </div>
    </>
  );
};

export default Keypad;
