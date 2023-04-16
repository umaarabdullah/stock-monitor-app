import React from 'react'
import './StatsRow.css'
import StockSVG from './stock.svg'
import { db } from './firebase_db';

function StatsRow(props) {

  const percentage = ((props.price - props.openPrice)/props.openPrice) * 100;

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
    <div className="row" onClick={buyStock}>
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
            <p className="row_percentage"> {Number(percentage).toFixed(2)}%</p>
        </div>
    </div>
  )
}

export default StatsRow