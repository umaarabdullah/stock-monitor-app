import React, { useState } from 'react'
import './TimeLine.css'

function TimeLine(props) {

  const { chartTitle } = props;

  const [activeButton, setActiveButton] = useState(0);

  /*  At a time only one timeline button will remain active. The one clicked
  **  +Ve means active and -Ve means not active
  */
  const handleButtonClick = (index) => {
    // if index is +ve it means a non-active button was clicked
    if(index > 0){  
      console.log('non-active button clicked');
    }
    else{   // if index is -ve it means an already active button was clicked
      console.log('active button clicked');
    }
    setActiveButton(index);
  }

  return (
    <div className="timeline__container">
      <div className="timeline__buttons__container">

        {activeButton === 1 && <div className="timeline__button active" onClick={() => handleButtonClick(-1)}>LIVE</div>}
        {activeButton !== 1 && <div className="timeline__button" onClick={() => handleButtonClick(1)}>LIVE</div>}

        {activeButton === 2 && <div className="timeline__button active" onClick={() => handleButtonClick(-2)}>1D</div>}
        {activeButton !== 2 && <div className="timeline__button" onClick={() => handleButtonClick(2)}>1D</div>}

        {activeButton === 3 && <div className="timeline__button active" onClick={() => handleButtonClick(-3)}>1W</div>}
        {activeButton !== 3 && <div className="timeline__button" onClick={() => handleButtonClick(3)}>1W</div>}

        {activeButton === 4 && <div className="timeline__button active" onClick={() => handleButtonClick(-4)}>3M</div>}
        {activeButton !== 4 && <div className="timeline__button" onClick={() => handleButtonClick(4)}>3M</div>}

        {activeButton === 5 && <div className="timeline__button active" onClick={() => handleButtonClick(-5)}>1Y</div>}
        {activeButton !== 5 && <div className="timeline__button" onClick={() => handleButtonClick(5)}>1Y</div>}
      
      </div>
        <div className='chart_title'>
          <h2>{chartTitle}</h2>
        </div>
    </div>
  )
}

export default TimeLine