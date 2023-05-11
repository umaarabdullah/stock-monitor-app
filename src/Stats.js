import React, { useState, useEffect } from 'react'
import './Stats.css'
import axios from 'axios';
import StatsRow from './StatsRow';
import { db } from './firebase_db';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

const token = "cgrime9r01qs9ra1td0gcgrime9r01qs9ra1td10";
const base_url = "https://finnhub.io/api/v1";

const stocksList = ["AAPL", "MSFT", "TSLA", "META", "BABA", "UBER", "DIS", "SBUX", "AMZN", "NIO", "IBM"];

function Stats(props) {

  const {OnSetOnStockRowClick} = props;
  const {onSetGraphData} = props;

  const [stockData, setStockData] = useState([]);
  const [myStocks, setMyStocks] = useState([]);

  // Fetch myStock data from Firebase 
  async function getMyStocks () {

    // First check if the user is logged in
    if(!props.onLoggedIn){
      return;
    }

    const userId = firebase.auth().currentUser.uid;     // must use async function inorder for this to work

    db.collection("users").doc(userId)
    .get()
    .then((doc) => {      /* Everything has to be done inside the then block */
      if (doc.exists) {
        let promises = [];
        let tempData = [];
        const userData = doc.data(); // get the user data
        // console.log(userData);
        /** MUST use userData in the the block */
        const userDataList = Object.keys(userData).map((key) => ({
          key,
          value: userData[key],
        }));

        userDataList.forEach((item) => {
          if(stocksList.includes(item.key)){
            // console.log("Match");
            console.log(item.key, item.value);
            promises.push(getStockData(item.key)
            .then(res => {
              tempData.push({
                id: doc.id,               // firestore database key
                name: item.key,           // firestore feteched data company name
                shares: item.value[1],    // shares
                info: res.data            // API Response from finnhub
              })
            }));

          }
        });
        Promise.all(promises).then(()=>{
          // console.log(tempData);
          /* Sort based on number of shares */
          tempData.sort(function(a, b){return b.shares - a.shares});  // Sort data based on number of shares already purchased by the user
          setMyStocks(tempData);
        });
      } 
      else {
        console.log("No such user document");
      }
    })
    .catch((error) => {
      console.log("Error getting user document:", error);
    });

    // console.log('myStocks');
    // console.log(myStocks);

  };

  // API Call for real-time quote data for US stocks
  const getStockData = (stock) => {
    return axios
      .get(`${base_url}/quote?symbol=${stock}&token=${token}`)
      .catch((error) => {
        console.error("Error", error.message);
      });
  };
  
  useEffect(() => {

    let tempStocksData = [];
    let promises = [];

    // Get user stock data from firebase
    getMyStocks();
    
    /**  Stock Quota API CAll **/
    // In this API call the attribute 'c' means current price
    stocksList.map((stock) => {
      promises.push(
        getStockData(stock)
        .then((res) => {
          tempStocksData.push({   // push response to tempStockData
            name: stock,
            ...res.data   // response data
          });
        })
      )
    });
    Promise.all(promises)
      .then(()=>{
        tempStocksData.sort(function(a, b){return b.c - a.c});  // Sort data based on current price (API attribute 'c')
        setStockData(tempStocksData);
        console.log('Stock Quota Data Fetched Successfully');
      });

  }, []);

  return (
    <div className='stats'>
        <div className='stats_container'>
          <div className='stats_header'>
            <p onClick={getMyStocks}>Stocks</p>
          </div>
          <div className='stats_content'>
            <div className='stats_rows'>
              {props.onLoggedIn && myStocks.map((stock) => (
                <StatsRow
                  onBuyGetMyStock = {getMyStocks}
                  key={stock.name}
                  name={stock.name}
                  openPrice={stock.info.o}
                  shares={stock.shares}
                  price={stock.info.c}
                  onSetGraphData = {onSetGraphData}
                  OnSetOnStockRowClick = {OnSetOnStockRowClick}
                />
              ))}
            </div>
          </div>
          <div className='stats_header stats_lists'>
            <p>Lists</p>
          </div>
          <div className='stats_content'>
            <div className='stats_rows' >
              {stockData.map((stock) => (
                <StatsRow
                  onBuyGetMyStock = {getMyStocks}
                  isLoggedIn = {props.onLoggedIn}
                  key={stock.name}
                  name={stock.name}
                  openPrice={stock.o}
                  price={stock.c}
                  onSetGraphData = {onSetGraphData}
                  OnSetOnStockRowClick = {OnSetOnStockRowClick}
                />
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Stats