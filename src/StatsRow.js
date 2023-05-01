import React, { useEffect, useRef, useState } from 'react'
import './StatsRow.css'
import StockSVG from './stock.svg'
import { db } from './firebase_db';

function StatsRow(props) {

  const percentage = ((props.price - props.openPrice)/props.openPrice) * 100;
  const isPositive = percentage >= 0;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropDownRef = useRef(null);

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // remove event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [dropDownRef]);

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  const buyStock = () => {
    // cross-check with firestore database
    db.collection('myStocks')
    .where("ticker", "==", props.name)
    .get()
    .then((querySnapshot) => {

      if(querySnapshot.docs.length > 0){
        // Update existing record
        querySnapshot.forEach((doc) => {
          db.collection('myStocks')
          .doc(doc.id)
          .update({
            shares: doc.data().shares +=1
          })
        });
      }
      else{
        // Add a new record
        db.collection('myStocks')
        .doc().set({
          ticker: props.name,
          shares: 1
        })
        console.log("added in firestore db");
      }
      
    })

  };

  return (
    <div className="row" ref={dropDownRef} onClick={toggleDropdown}>
        {dropdownOpen && (
          <div className="dropdown-content">
            <a href="#" onClick={buyStock}>Buy</a>
            <a href="#">View</a>
          </div>
        )}
        <div className="row_intro">
            <h1>{props.name}</h1>
            <p>{props.shares && 
              (props.shares + " Shares")
            }</p>
        </div>
        <div className="row_chart">
            <img src={StockSVG} height={16}/>
        </div>
        <div className="row_numbers">
            <p className="row_price">{props.price}</p>
            <p className="row_percentage" style={{ color: isPositive ? '#5AC53B' : 'red' }}> {Number(percentage).toFixed(2)}%</p>
        </div>
    </div>
  )
}

export default StatsRow