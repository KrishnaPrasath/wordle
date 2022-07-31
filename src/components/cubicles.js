import React, { useState, useEffect, useRef } from 'react';

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
    <div id={id} className={`cubic ${colorCode} rounded shadow ${animate && 'press'}`} style={{cursor: 'pointer'}}>
      {letter}
    </div>
  );
};

const Cubicles = ({ colorCodes, inputHistory, index }) => {
  const decoyInputReference = useRef(null);

  useEffect(() => {
    decoyInputReference?.current?.focus();
  }, [])
  

  return (
    <div className={`cubicles-wrapper`}>
      { index === 0  && <input className={`decoy d-none`} ref={decoyInputReference}/>}
      {colorCodes.map((colorCode, idx) => (
        <Cubic id={`cubic${idx}`} key={idx} colorCode={colorCode} letter={inputHistory ? inputHistory[idx] : ''} autoFocus={idx === 0 &&  index === 0}/>
      ))}
    </div>
  );
};

export default Cubicles;
