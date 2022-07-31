import React, { useState, useEffect } from 'react';

const Cubic = ({ id, colorCode, letter }) => {
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
    <div id={id} className={`cubic ${colorCode} rounded shadow ${animate && 'press'}`}>
      {letter}
    </div>
  );
};

const Cubicles = ({ colorCodes, inputHistory }) => {
  return (
    <div className={`cubicles-wrapper`}>
      {colorCodes.map((colorCode, idx) => (
        <Cubic id={`cubic${idx}`} key={idx} colorCode={colorCode} letter={inputHistory ? inputHistory[idx] : ''} />
      ))}
    </div>
  );
};

export default Cubicles;
