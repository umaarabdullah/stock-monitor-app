import React, { useState, useEffect } from 'react'
import './Stats.css'
import axios from 'axios';
import StatsRow from './StatsRow';
import { db } from './firebase_db';


const token = "cgrime9r01qs9ra1td0gcgrime9r01qs9ra1td10";
const base_url = "https://finnhub.io/api/v1/quote";

function Stats() {

  const [stockData, setStockData] = useState([]);
  const [myStocks, setMyStocks] = useState([]);

  // Firebase Call
  const getMyStocks = () => {
    db
    .collection('myStocks')
    .onSnapshot(snapshot => {
      console.log(snapshot);
      let promises = [];
      let tempData = []

      // fetch userStock information from firebase
      snapshot.docs.map((doc) => {
        // console.log(doc.data());
        promises.push(getStockData(doc.data().ticker)
        .then(res => {
          tempData.push({
            id: doc.id,
            data: doc.data(),
            info: res.data
          })
        })
      )})

      // fetch stock information of userStocks from finnhub
      Promise.all(promises).then(()=>{
        // console.log(tempData);
        setMyStocks(tempData);
      })

    })
  };

  // API Call
  const getStockData = (stock) => {
    return axios
      .get(`${base_url}?symbol=${stock}&token=${token}`)
      .catch((error) => {
        console.error("Error", error.message);
      });
  };
  
  useEffect(() => {

    let tempStocksData = []
    const stocksList = ["AAPL", "MSFT", "TSLA", "FB", "BABA", "UBER", "DIS", "SBUX"];
    let promises = [];

    getMyStocks();
    stocksList.map((stock) => {
      promises.push(
        getStockData(stock)
        .then((res) => {
          console.log(res);
          tempStocksData.push({   // push response to tempStockData
            name: stock,
            ...res.data   // response data
          });
        })
      )
    });

    Promise.all(promises).then(()=>{
      tempStocksData.sort(function(a, b){return b.c - a.c});  // Sort data based on price (API attribute 'c')
      console.log(tempStocksData);
      setStockData(tempStocksData);
    })
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