import './StatsRow.css'
import Swal from 'sweetalert2';
import StockSVG from './stock.svg'
import { db } from './firebase_db';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

function StatsRow(props) {

  const percentage = ((props.price - props.openPrice)/props.openPrice) * 100;
  const isPositive = percentage >= 0;

  const buyStock = () => {
    
    // cross-check with firestore database

    // db.collection('users')
    // .where("ticker", "==", props.name)
    // .get()
    // .then((querySnapshot) => {

    //   if(querySnapshot.docs.length > 0){
    //     // Update existing record
    //     querySnapshot.forEach((doc) => {
    //       db.collection('myStocks')
    //       .doc(doc.id)
    //       .update({
    //         shares: doc.data().shares +=1
    //       })
    //     });
    //   }
    //   else{
    //     // Add a new record
    //     db.collection('myStocks')
    //     .doc().set({
    //       ticker: props.name,
    //       shares: 1
    //     })
    //     console.log("added in firestore db");
    //   }
    // })

  };

  return (
    <div className="row" >
        <div className='buy_button_container'>
          <button className='button-37' onClick={buyStock}>Buy</button>
        </div>
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
            <p className="row_price">{Number(props.price).toFixed(2)}</p>
            <p className="row_percentage" style={{ color: isPositive ? '#5AC53B' : 'red' }}> {Number(percentage).toFixed(2)}%</p>
        </div>
    </div>
  )
}

export default StatsRow