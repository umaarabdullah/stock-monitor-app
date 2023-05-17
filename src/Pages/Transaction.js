import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db } from '../firebase_db';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './Transaction.css'
import { useLocation } from 'react-router-dom';


function Transaction() {
    
    const location = useLocation();
    const navigate = useNavigate();

    const [transactionData, setTransactionData] = useState([]);

    useEffect(() => {
      
      getTransactionData();

    }, [])

    useEffect(() => {

      console.log('TransactionData Triggered useEffect');
      // console.log(transactionData);
      
    }, [transactionData]);
    
    

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
                // console.log(userData['Transactions']);
                let tempTransactionArray = userData['Transactions'];
                // console.log(tempTransactionArray);

                let formattedTransactionData = [];
                // format transaction data such that each object has the following
                for(let i=0; i<tempTransactionArray.length; i+=5){

                  const shareCount = tempTransactionArray[i];
                  const stockName = tempTransactionArray[i + 1];
                  const stockPrice = tempTransactionArray[i + 2];
                  const dateTime = tempTransactionArray[i + 3];
                  const buySellFlag = tempTransactionArray[i + 4];

                  const transactionObj = {
                      shareCount,
                      stockName,
                      stockPrice,
                      dateTime,
                      buySellFlag
                    };
                  
                  formattedTransactionData.push(transactionObj);
                } 
                setTransactionData(formattedTransactionData);
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

    function handleBackClick(event) {
      event.preventDefault();
      navigate("/");
    }

    return (
      <div className="transaction-page">
        <div className='transaction_page_back_button'>
          <button type='button' className='back_button' onClick={handleBackClick}>Back</button>
        </div>
        <div className='transaction_page_title'>
          <h1>Transaction Page</h1>
        </div>
        <div className='transaction_page_table'>
          <table>
          <thead>
          <tr>
              <th>S/No</th>
              <th>Transaction Type</th>
              <th>Shares</th>
              <th>Stock Name</th>
              <th>Date & Time</th>
              <th>Cost per Share</th>
              <th>Net Amount</th>
          </tr>
          </thead>
          <tbody>
            {transactionData.length > 0 ? (
              transactionData.map((transaction, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{transaction.buySellFlag}</td>
                  <td>{transaction.shareCount}</td>
                  <td>{transaction.stockName}</td>
                  <td style={{ paddingRight: '20px' }}> {transaction.dateTime.toString()} </td>
                  <td>${Number(transaction.stockPrice).toFixed(2)}</td>
                  <td> ${Number(transaction.stockPrice*transaction.shareCount).toFixed(2)} </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No transaction data available.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    )
}

export default Transaction