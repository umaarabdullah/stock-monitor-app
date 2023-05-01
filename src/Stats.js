import React, { useState, useEffect } from 'react'
import './Stats.css'
import axios from 'axios';
import StatsRow from './StatsRow';
import { db } from './firebase_db';

const token = "cgrime9r01qs9ra1td0gcgrime9r01qs9ra1td10";
const base_url = "https://finnhub.io/api/v1";

const currentDate = new Date();
const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
const januaryFirstTimestamp = Math.floor(januaryFirst.getTime() / 1000);

function Stats() {

  const [stockData, setStockData] = useState([]);
  const [myStocks, setMyStocks] = useState([]);
  const [stockCandles, setStockCandles] = useState([]);

  // Fetch myStock data from Firebase 
  const getMyStocks = () => {
    db
    .collection('myStocks')
    .onSnapshot(snapshot => {
      // console.log(snapshot);
      let promises = [];
      let tempData = []
      // fetch userStock information from firebase
      snapshot.docs.map((doc) => {
        //console.log(doc.data());
        promises.push(getStockData(doc.data().ticker)
        .then(res => {
          tempData.push({
            id: doc.id,         // firestore database key
            data: doc.data(),   // firestore feteched data
            info: res.data      // API Response from finnhub
          })
        })
      )})
      // fetch stock information of userStocks from finnhub
      Promise.all(promises).then(()=>{
        // console.log(tempData[0].data.ticker);
        /* Sort based on number of shares */
        tempData.sort(function(a, b){return b.data.shares - a.data.shares});  // Sort data based on number of shares already purchased by the user
        setMyStocks(tempData);
      })

    })
  };

  // API Call for real-time quote data for US stocks
  const getStockData = (stock) => {
    return axios
      .get(`${base_url}/quote?symbol=${stock}&token=${token}`)
      .catch((error) => {
        console.error("Error", error.message);
      });
  };

  // API Call for 1 year of historical data and new updates
  const getHistoricalStockData = (stock) => {
    console.log(januaryFirst);
    console.log(currentDate);

    return axios
      .get(`${base_url}/stock/candle?symbol=${stock}&resolution=D&from=${januaryFirstTimestamp}&to=${currentTimestamp}&token=${token}`)   // resolution for daily intervalled candles and time from janurary first to current
      .catch((error) => {
        console.error("Error", error.message);
      });
  };
  
  useEffect(() => {

    let tempStocksData = [];
    let tempHistoricalStockData = [];

    const stocksList = ["AAPL", "MSFT", "TSLA", "META", "BABA", "UBER", "DIS", "SBUX", "AMZN", "NIO", "IBM"];
    let promises = [];
    let historicalPromise = [];

    getMyStocks();
    
    stocksList.map((stock) => {
      promises.push(
        getStockData(stock)
        .then((res) => {
          // console.log(res);
          tempStocksData.push({   // push response to tempStockData
            name: stock,
            ...res.data   // response data
          });
        })
      )
    });
    Promise.all(promises).then(()=>{
      tempStocksData.sort(function(a, b){return b.c - a.c});  // Sort data based on price (API attribute 'c')
      // console.log(tempStocksData);
      setStockData(tempStocksData);
    });

    stocksList.map((stock) => {
      historicalPromise.push(
        getHistoricalStockData(stock)
        .then((res) => {
          // console.log(res);
          tempHistoricalStockData.push({
            name: stock,
            ...res.data
          });
        })
      )
    });
    Promise.all(historicalPromise).then(()=>{
      console.log(tempHistoricalStockData);
      setStockCandles(tempHistoricalStockData);
    });


  }, []);

  return (
    <div className='stats'>
        <div className='stats_container'>
          <div className='stats_header'>
            <p>Stocks</p>
          </div>
          <div className='stats_content'>
            <div className='stats_rows'>
              {myStocks.map((stock) => (
                <StatsRow
                  key={stock.data.ticker}
                  name={stock.data.ticker}
                  openPrice={stock.info.o}
                  shares={stock.data.shares}
                  price={stock.info.c}
                />
              ))}
            </div>
          </div>
          <div className='stats_header stats_lists'>
            <p>Lists</p>
          </div>
          <div className='stats_content'>
            <div className='stats_rows'>
              {stockData.map((stock) => (
                <StatsRow
                  key={stock.name}
                  name={stock.name}
                  openPrice={stock.o}
                  price={stock.c}
                />
              ))}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Stats