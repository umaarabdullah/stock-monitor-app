import React, { useState } from 'react'
import './TimeLine.css'

function TimeLine(props) {

  const { chartTitle } = props;

  const [activeButton, setActiveButton] = useState(0);

  const handleButtonClick = (index) => {
    setActiveButton(index);
  }

  return (
    <div className="timeline__container">
      <div className="timeline__buttons__container">

        {activeButton === 0 && <div className="timeline__button active" onClick={() => handleButtonClick(-1)}>LIVE</div>}
        {activeButton !== 0 && <div className="timeline__button" onClick={() => handleButtonClick(0)}>LIVE</div>}

        {activeButton === 1 && <div className="timeline__button active" onClick={() => handleButtonClick(-1)}>1D</div>}
        {activeButton !== 1 && <div className="timeline__button" onClick={() => handleButtonClick(1)}>1D</div>}

        {activeButton === 2 && <div className="timeline__button active" onClick={() => handleButtonClick(-1)}>1W</div>}
        {activeButton !== 2 && <div className="timeline__button" onClick={() => handleButtonClick(2)}>1W</div>}

        {activeButton === 3 && <div className="timeline__button active" onClick={() => handleButtonClick(-1)}>3M</div>}
        {activeButton !== 3 && <div className="timeline__button" onClick={() => handleButtonClick(3)}>3M</div>}

        {activeButton === 4 && <div className="timeline__button active" onClick={() => handleButtonClick(-1)}>1Y</div>}
        {activeButton !== 4 && <div className="timeline__button" onClick={() => handleButtonClick(4)}>1Y</div>}
      
      </div>
        <div className='chart_title'>
          <h2>{chartTitle}</h2>
        </div>
    </div>
  )
}

export default TimeLine