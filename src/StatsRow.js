import React from 'react'
import './StatsRow.css'
import StockSVG from './stock.svg'

function StatsRow(props) {
  return (
    <div className="row" >
        <div className="row_intro">
            <h1>{props.name}</h1>
            <p>{props.shares && 
              (props.shares + " shares")
            }</p>
        </div>
        <div className="row_chart">
            <img src={StockSVG} height={16}/>
        </div>
        <div className="row_numbers">
            <p className="row_price">{props.price}</p>
            <p className="row_percentage"> +200%</p>
        </div>
    </div>
  )
}

export default StatsRow