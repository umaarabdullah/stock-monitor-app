import React, { useState } from 'react'
import './TimeLine.css'

function TimeLine(props) {

  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  }

  return (
    <div className="timeline__container">
        <div className="timeline__buttons__container">

            {isActive && <div className="timeline__button active" onClick={handleClick}>LIVE</div>}
            {!isActive && <div className="timeline__button" onClick={handleClick}>LIVE</div>}

            {isActive && <div className="timeline__button active" onClick={handleClick}>1D</div>}
            {!isActive && <div className="timeline__button" onClick={handleClick}>1D</div>}

            {isActive && <div className="timeline__button active" onClick={handleClick}>1W</div>}
            {!isActive && <div className="timeline__button" onClick={handleClick}>1W</div>}

            {isActive && <div className="timeline__button active" onClick={handleClick}>3M</div>}
            {!isActive && <div className="timeline__button" onClick={handleClick}>3M</div>}

            {isActive && <div className="timeline__button active" onClick={handleClick}>1Y</div>}
            {!isActive && <div className="timeline__button" onClick={handleClick}>1Y</div>}

            {isActive && <div className="timeline__button active" onClick={handleClick}>ALL</div>}
            {!isActive && <div className="timeline__button" onClick={handleClick}>ALL</div>}                                                                           
        </div>
    </div>
  )
}

export default TimeLine