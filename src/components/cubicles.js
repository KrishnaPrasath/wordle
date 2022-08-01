import React, { useEffect, useState } from 'react';
import { WHITE } from '../data/constants';

const Cubic = ({ id, colorCode, letter, idx, ...props }) => {
  const { setRowFinished, rowFinishedRef, resetIndicator, setResetIndicator } = props;
  const [customClassList, setCustomClassList] = useState([WHITE]);
  useEffect(() => {
    if (colorCode && colorCode !== 'white') {
      setRowFinished(false);
      rowFinishedRef.current = false;
      setTimeout(() => {
        setCustomClassList(['flip-card', `${colorCode}`]);
      }, 500 * idx);
      setTimeout(() => {
        setRowFinished(true);  
        rowFinishedRef.current = true;      
      }, 3000);
    }
  }, [colorCode, idx, setRowFinished, rowFinishedRef]);

  useEffect(() => {
    resetIndicator && setCustomClassList([WHITE]);
    setResetIndicator(false);
  }, [resetIndicator, setResetIndicator])
  

  return (
    <div id={id} className={`cubic rounded shadow ${customClassList?.length && customClassList.join(' ')}`} style={{ cursor: 'pointer' }}>
      {letter}
    </div>
  );
};

const Cubicles = ({ colorCodes, inputHistory, ...props }) => {
  return (
    <div className={`cubicles-wrapper`}>
      {colorCodes.map((colorCode, idx) => (
        <Cubic
          id={`cubic${idx}`}
          key={idx}
          idx={idx}
          colorCode={colorCode}
          letter={inputHistory ? inputHistory[idx] : ''}
          {...props}
        />
      ))}
    </div>
  );
};

export default Cubicles;
