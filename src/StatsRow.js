import './StatsRow.css'
import Swal from 'sweetalert2';
import StockSVG from './stock.svg'
import axios from 'axios';
import { db } from './firebase_db';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useEffect, useRef, useState } from 'react';

const token = "cgrime9r01qs9ra1td0gcgrime9r01qs9ra1td10";
const base_url = "https://finnhub.io/api/v1";

const currentDate = new Date();
const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
const januaryFirstTimestamp = Math.floor(januaryFirst.getTime() / 1000);

function StatsRow(props) {

  const { onBuyGetMyStock } = props;
  const { OnSetOnStockRowClick } = props;
  
  let userId;

  const percentage = ((props.price - props.openPrice)/props.openPrice) * 100;
  const isPositive = percentage >= 0;
  let new_shares = 0;   // Initialize new_shares with 0
  let shares_to_sell = 0;

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
  };

  // buy stock share function. /** This function is triggered when buy button is clicked */
  async function buyStock () {

    let num_shares = 0;

    // First check if the user is logged in
    if(!checkUserLogInStatus()){
      return;
    }

    // Input how many shares user wants to buy
    Swal.fire({
      title: `Purchase ${props.name} Stock`,
      input: 'number',
      inputLabel: 'Number of Shares',
      inputPlaceholder: 'Enter number of shares you want to purchase',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        if (value === '0') {
          return 'Invalid input: Number of shares cannot be zero';
        }
      }
    }).then((result) => {           /** Number of shares bought must be greater than 0 */
      if (result.isConfirmed) {

        const inputValue = result.value;
        num_shares = inputValue;
        // Handle the input value when the user clicks the submit button
        console.log('Input value:', inputValue);

        new_shares = num_shares;
        const num_shares_tmp = new_shares;
        console.log(`Number of shares purchased ${new_shares}`);

        let totalPurchasePriceOfNewShares = Number(props.price*new_shares).toFixed(2);
        console.log(`Total Purchase Price of New Shares of ${props.name} stock: ${totalPurchasePriceOfNewShares}`);
        
        // Authenticate with firebase
        const uid = firebase.auth().currentUser.uid;
        userId = uid;
    
        let old_shares = 0;
        let myArray = [props.name, new_shares];     // an array composed of company name and new_shares count
        const companyName = props.name;             // Variable for firestore label name ***uses computed property names syntax***
    
        /** Must Check if user has purchased stocks of this company before */
        console.log(userId);
        const userDocRef = db.collection("users").doc(userId);
        userDocRef
        .get()
        .then((doc) => {      /* Everything has to be done inside the then block */
          if (doc.exists) {
            const userData = doc.data(); // get the user data
            // console.log(userData);
            // Traverse userData list
            const userDataList = Object.keys(userData).map((key) => ({
              key,
              value: userData[key],
            }));
            userDataList.forEach((item) => {
              if(item.key == props.name){
                // console.log(item.key, item.value);
                // console.log(item.value[1]);
                old_shares = parseInt(item.value[1]);
                new_shares = parseInt(new_shares);
                new_shares = new_shares + old_shares;
              }
            });
          } 
          else {
            console.log("No such user document");
          }
    
          // Update database accordingly
          myArray = [props.name, new_shares];
          // Save to database with company as the label thus making it easier to query
          db.collection('users').doc(uid).update({
              [companyName]: myArray                    /** array to push into firestore will have the items as such: item[0]=companyName, item[1]=shareCount */
            })
            .then(() => {
              console.log('User data updated successfully.');
            })
            .catch((error) => {
              console.error('Error updating user data:', error);
            });
          if (num_shares_tmp) {
            // sweetalert success pop up
            Swal.fire({
              title: `${num_shares_tmp} Shares of ${props.name} Stock has been Purchased`,
              icon: 'success',
              text: props.name,
            });
            onBuyGetMyStock();    // used it as well just to see if it works or not !! Surprise Surprise It works !!
          }
          console.log(`${new_shares} shares owned by Client`);
        })
        .catch((error) => {
          console.log("Error getting user document:", error);
        });
    
        // trigger fetch from firebase to get recently modified data
        onBuyGetMyStock();

        /** 
         * Record total purchase price of the new shares
         * Check if total purchase price exists or not
         * if it exists then add to the previous value else create it
        **/ 
        userDocRef
        .get()
        .then((doc) => {      /* Everything has to be done inside the then block */
          if (doc.exists) {
            const userData = doc.data(); // get the user data
            // console.log(userData);
            if (userData.hasOwnProperty('Total Purchase Price')) {
              console.log("Total Purchase Price Field exists");
              const oldTotalPurchasePrice = userData['Total Purchase Price'];
              console.log(`oldTotalPurchasePrice: ${oldTotalPurchasePrice}`);
              totalPurchasePriceOfNewShares = parseInt(totalPurchasePriceOfNewShares) + parseInt(oldTotalPurchasePrice);
            }
          } 
          else {
            console.log("No such user document");
          }

          // Update database accordingly
          myArray = [props.name, new_shares];
          // Save to database
          db.collection('users').doc(uid).update({
            'Total Purchase Price': totalPurchasePriceOfNewShares
            })
            .then(() => {
              console.log('User data updated successfully.');
            })
            .catch((error) => {
              console.error('Error updating user data:', error);
            });
        })
        .catch((error) => {
          console.log("Error getting user document:", error);
        });

        // Record the buy transaction in firebase

      } else {
        // Handle the case when the user clicks the cancel button
        console.log('User cancelled the input');
      }
    });

  };

  async function sellStock () {
    
    let num_shares = 0;

    // Input how many shares user wants to sell
    Swal.fire({
      title: `Sell ${props.name} Stock`,
      input: 'number',
      inputLabel: 'Number of Shares',
      inputPlaceholder: 'Enter number of shares you want to sell',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
        if (value === '0') {
          return 'Invalid input: Number of shares cannot be zero';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const inputValue = result.value;
        num_shares = inputValue;
        // Handle the input value when the user clicks the submit button
        console.log('Input value:', inputValue);

        shares_to_sell = num_shares;
        const num_shares_tmp = shares_to_sell;
        console.log(`Number of shares to sell ${shares_to_sell}`);
    
        // Authenticate with firebase
        const uid = firebase.auth().currentUser.uid;
        userId = uid;
    
        let old_shares = 0;
        let myArray = [props.name, shares_to_sell];     // an array composed of company name and new_shares count
        const companyName = props.name;                 // Variable for firestore label name ***uses computed property names syntax***
    
        /* Must check that user isn't trying to sell more shares then he already has */
        console.log(userId);
        const userDocRef = db.collection("users").doc(userId);
        userDocRef
        .get()
        .then((doc) => {      /* Everything has to be done inside the then block */
          if (doc.exists) {
            const userData = doc.data(); // get the user data
            // Traverse userData list
            const userDataList = Object.keys(userData).map((key) => ({
              key,
              value: userData[key],
            }));
            userDataList.forEach((item) => {
              if(item.key == props.name){
                // console.log(item.key, item.value);             // console.log(item.value[1]);
                old_shares = parseInt(item.value[1]);
                shares_to_sell = parseInt(shares_to_sell);
                if(shares_to_sell > old_shares){
                  // user is trying to request to sell more shares than he already own
                  // set shares to sell to 0 and warn user 
                  shares_to_sell = 0;   
                  Swal.fire({
                    title: 'Invalid Transaction',
                    text: 'You are trying to sell more shares than you own.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                  });                                  
                }
                shares_to_sell = old_shares - shares_to_sell;
              }
            });
          } 
          else {
            console.log("No such user document");
          }
    
          // Update database accordingly
          if(shares_to_sell > 0){
            myArray = [props.name, shares_to_sell];
            db.collection('users').doc(uid).update({
                [companyName]: myArray
              })
              .then(() => {
                console.log('User data updated successfully.');
              })
              .catch((error) => {
                console.error('Error updating user data:', error);
              });
          }
          else{     //  delete a specific field [companyName] from a document, we need to use the FieldPath and FieldValue classes provided by Firebase Firestore.
            db.collection('users').doc(uid).update({
              [companyName]: firebase.firestore.FieldValue.delete()
            })
            .then(() => {
              console.log('Field deleted successfully.');
            })
            .catch((error) => {
              console.error('Error deleting field:', error);
            });
          }
    
          if (num_shares_tmp) {
            // sweetalert success pop up
            Swal.fire({
              title: `${num_shares_tmp} Shares of ${props.name} Stock has been Sold`,
              icon: 'success',
              text: props.name,
            });
            onSellGetMyStock();    // used it as well just to see if it works or not !! Surprise Surprise It works !!
          }
          console.log(`${shares_to_sell} shares owned by Client`);
        })
        .catch((error) => {
          console.log("Error getting user document:", error);
        });
    
        // trigger fetch from firebase to get recently modified data
        onSellGetMyStock();

        // Record the sell transaction in firebase

      } else {
        // Handle the case when the user clicks the cancel button
        console.log('User cancelled the input');
      }
    });

  };

  function onSellGetMyStock() {
    onBuyGetMyStock();
  }

  // API Call for stock candles i.e historical data (1Y (Each Day), Monthly, Weekly, Per minute (Live))
  const getHistoricalStockData = async (stock, resolution) => {
    const url = `${base_url}/stock/candle?symbol=${stock}&resolution=${resolution}&from=${januaryFirstTimestamp}&to=${currentTimestamp}&token=${token}`;   // resolution for daily intervalled candles and time from janurary first to current
    console.log(url);
    return axios
      .get(url)
      .catch((error) => {
        console.error("Error", error.message);
      });
  };
  

  // Handles Sending graph data to linechart from statrow
  const getGraphData = async (resolution) => {
    
    let tempData = [];
    try {
      const res = await getHistoricalStockData(props.name, resolution);
      // console.log(res);
      tempData.push({
        name: props.name,
        data: res
      });
      
      console.log(`In getGraphData statsRow: ${tempData[0].name}`);
      props.onSetGraphData(tempData);   // pass to graphData i.e stock name to newsfeed 
      
      // needs to change each time to trigger useEffect of linechart
      OnSetOnStockRowClick(props.name);    // props function redirects to linechart 
    } 
    catch(err) {
      console.error(err);
    }
  }
  async function handleRowClick() {
    getGraphData('D');   // API Call to fetch stock candle data by Resolution:Day 
  }

  return (
    <div className="row">
        <div className='buy_button_container'>
          {!props.shares &&
            <button id='buy_button' className='button-37' onClick={buyStock}>Buy</button>
          }
          {props.shares > 0 &&
            <button id='sell_button' className='button-37' onClick={sellStock}>Sell</button>
          }
        </div>
        <div className="row_intro" onClick={handleRowClick}>
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