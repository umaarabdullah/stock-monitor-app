import React, { useState, useEffect } from 'react'
import './Stats.css'
import axios from 'axios';
import StatsRow from './StatsRow';


const token = "cgrime9r01qs9ra1td0gcgrime9r01qs9ra1td10";
const base_url = "https://finnhub.io/api/v1/quote";

function Stats() {

  const [stockData, setStockData] = useState([]);

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
              
            </div>
          </div>
          <div className='stats_header'>
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