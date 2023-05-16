import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase_db';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



function Transaction() {

    const history = useNavigate();

    useEffect(() => {

      const handleBrowserBack = () => {
        // Perform any additional actions if needed
        console.log('browser back clicked');
        history('/');
      };
  
      window.addEventListener('popstate', handleBrowserBack);
  
      return () => {
        window.removeEventListener('popstate', handleBrowserBack);
      };
    }, [history]);

    let userId;

    /** 
     *  Transactions data stored on firebase will of the following format:
     *  Each Transactions will have 5 items [share_count, stock_name, stock_price, date_and_time, buy/sell_flag]
     *                                          Number,     string,       Number       date,       'buy'/'sell
     *  Data stored in firestore in a long string with each consecutive 5 items representing 1 transaction data object
     * 
    */

    function getTransactionData() {

        const uid = firebase.auth().currentUser.uid;
        userId = uid;
    
        const userDocRef = db.collection("users").doc(userId);
        userDocRef
        .get()
        .then((doc) => {      /* Everything has to be done inside the then block */
          if (doc.exists) {
            const userData = doc.data(); // get the user data
            // console.log(userData);
    
            // if previous transactions happened
            if (userData.hasOwnProperty('Transactions')) {
    
              console.log("Transaction.js: Transactions exists");
              console.log(userData['Transactions']);
              let tempTransactionArray = userData['Transactions'];
              console.log(tempTransactionArray);
            }
          } 
          else {
            console.log("No such user document");
          }
    
        })
        .catch((error) => {
          console.log("Error getting user document:", error);
        });
    }

    function handleTransactionClick() {
        getTransactionData();
    }

    return (
    <div>
        <h1 style={{ color: 'white' }} onClick={handleTransactionClick}>Transaction</h1>
        <Link to="/">Go back to Home Page</Link>
    </div>
    )
}

export default Transaction