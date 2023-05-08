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

  /** Function return meanings: 
   * True = user logged in ------ False = user not logged in */
  const checkUserLogInStatus = () => {
    if(!props.isLoggedIn){
      // sweetalert error pop up
      Swal.fire({
        title: 'Must Log In!',
        icon: 'error',
        text: 'You must login inorder to purchase your desired stock',
      });
      return false;
    }
    return true;
  }

  async function buyStock () {

    // First check if the user is logged in
    if(!checkUserLogInStatus()){
      return;
    }

    // Input how many shares user wants to buy
    const { value: num_shares } = await Swal.fire({
      title: `Purchase ${props.name} Stock`,
      input: 'number',
      inputLabel: 'Number of Shares',
      inputPlaceholder: 'Enter number of shares you want to purchase',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    })

    console.log(`Number of shares purchased ${num_shares}`);

    if (num_shares) {
      // sweetalert success pop up
      Swal.fire({
        title: `${num_shares} Shares of ${props.name} Stock has been Purchased`,
        icon: 'success',
        text: props.name,
      });
    }

    // const uid = firebase.auth().currentUser.uid;
    // const dataToUpdate = {
    //   // Data to update
    //   company: props.name,
    //   shares: /* Number of new shares User wants to purchase */
    // };

    // /** Must Check if user has purchased stocks of this ticker before then decide to set or update shares */
    // db.collection('users').doc(uid).update(dataToUpdate)
    //   .then(() => {
    //     console.log('User data updated successfully.');
    //   })
    //   .catch((error) => {
    //     console.error('Error updating user data:', error);
    //   });

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