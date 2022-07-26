import React, {useEffect, useState} from 'react';

const Cubic = ({ id, colorCode, letter }) => {
  return <div id={id} className={`cubic ${colorCode} rounded shadow-sm`}>{letter}</div>;
};

const Cubicles = ({colorCodes, inputHistory}) => {

  return (
    <div className={`cubicles-wrapper`}>
      {colorCodes.map((colorCode, idx) => (
        <Cubic id={`cubic${idx}`} key={idx} colorCode={colorCode} letter={inputHistory[idx]}/>
      ))}
    </div>
  );
};

export default Cubicles;
