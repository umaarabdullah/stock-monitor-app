import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import './LineGraph.css'
import axios from 'axios';

const token = "cgrime9r01qs9ra1td0gcgrime9r01qs9ra1td10";
const base_url = "https://finnhub.io/api/v1";

const options = {
  plugins: {
    legend: {
        display: false,
    }
  },
  hover: {
    intersect: false
  },
  elements: {
    line: {
      tension: 0
    },
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: true,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
    },
  },
  scales: {
    x: { 
      ticks: {
        display: false
      }
    },
    y: { 
      ticks: {
        display: false
      }
    },
  },
};

function LineGraph(props) {

  const { lineChartData } = props;
  const { onStockRowClick } = props;    // stock name of the row clicked
  const { setChartTitle } = props;
  const { timeLineButtonActiveClick } = props;
  const { setTimeLineButtonActiveClick } = props;
  const { setActiveButton } = props;

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {

    console.log(`row clicked linechart useEffect 1 : ${onStockRowClick}`);
    
    if(onStockRowClick){    // By default chart will be active with resolution: D that is daily candles
      setChartTitle(onStockRowClick.toString());
      setActiveButton(2);           // set timeline button D with index=2 as active
      setTimeLineButtonActiveClick("D");
      handleRowClickGraphData();    // API Call for stock candle with resolution 'D'
    }
    else{
      setChartTitle('Total Portfolio Value');
      handleTotalPortfolioGraphData();
    }

  }, [onStockRowClick]);


  useEffect(() => {

    console.log('Timeline button clicked linechart useEffect 2');

    if(timeLineButtonActiveClick !== 'inActive' && timeLineButtonActiveClick !== ""){
      console.log(`Candle stock resolution ${timeLineButtonActiveClick}`);
      setChartTitle(onStockRowClick.toString());
      handleGraphDataOnTimelineButtonClick(timeLineButtonActiveClick);    // API call for stock candle data with different resolution
    }
    else{
      setChartTitle('Total Portfolio Value');
      handleTotalPortfolioGraphData();
    }

    // while LIVE timeline button is active useEffect will be triggered every 30 seconds.
    const myEffect = () => {
      console.log(`myEffect resolution:${timeLineButtonActiveClick} every 30 Second`);
      setChartTitle(onStockRowClick.toString());
      handleGraphDataOnTimelineButtonClick(timeLineButtonActiveClick);    // API call for stock candle data with different resolution
    };
    // Call the effect initially if the condition is met
    if (timeLineButtonActiveClick === "1") {
      myEffect();
    }
    // Set up the interval to run the effect every 1 minute
    if (timeLineButtonActiveClick === "1") {
      const interval = setInterval(() => {
        myEffect();
      }, 1 * 60 * 1000);
      
      // Clean up the interval when the component is unmounted or the dependency array changes
      return () => {
        clearInterval(interval);
      };
    }
    
  }, [timeLineButtonActiveClick]);


  // handles graphdata when a row_intro is clicked
  function handleRowClickGraphData(){
    
    /** setData */
    let graphdata = [];
    console.log(lineChartData);
    graphdata = lineChartData[0].data.data.c;     // c means closing prices
    setData(graphdata);

    /** setLabels */
    let allDates = [];
    // loop through the timestamps returned from the API Call
    lineChartData[0].data.data.t.forEach((currentTimeStamp) => {
      const currentDate = new Date(currentTimeStamp*1000);
      allDates.push(currentDate);
    });
    setLabels(allDates);

    console.log(lineChartData[0].name);
  }

  
  // Function for handling timeline button click graph change
  async function handleGraphDataOnTimelineButtonClick(resolution) {
    
    if(resolution === 'Y'){       // handle 1Y timestamp differently
      const currentDate = new Date();
      const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
      const oneYearPreviousFromCurrentDate = new Date(currentDate.getFullYear() - 1, 0, 1); // Subtract 1 year from current year
      const oneYearPreviousFromCurrentTimestamp = Math.floor(oneYearPreviousFromCurrentDate.getTime() / 1000);

      getGraphData('D', oneYearPreviousFromCurrentTimestamp, currentTimestamp);  
    }
    else if(resolution === '1'){    // handle live timeline button differently
      /* live means 2 days back live replay of stock behaviour data */
      const currentDate = new Date();
      const fewDaysBack = new Date(currentDate);
      fewDaysBack.setDate(currentDate.getDate() - 1);
      const midnight = new Date(fewDaysBack.getFullYear(), fewDaysBack.getMonth(), fewDaysBack.getDate(), 0, 0, 0);   // Midnight date and timestamp from two days back
      const midnightTimestamp = Math.floor(midnight.getTime() / 1000);
      const currentTimestamp = Math.floor(fewDaysBack.getTime() / 1000);    // Current date and timestamp from two days back

      console.log("Midnight Date:", midnight);
      console.log("Midnight Timestamp:", midnightTimestamp);
      console.log("Current Date:", fewDaysBack);
      console.log("Current Timestamp:", currentTimestamp);
      
      getGraphData(resolution, midnightTimestamp, currentTimestamp);
    }
    else{                         // handle anyother timeline buttons 1D, 1W, M
      const currentDate = new Date();
      const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
      const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
      const januaryFirstTimestamp = Math.floor(januaryFirst.getTime() / 1000);
      
      getGraphData(resolution, januaryFirstTimestamp, currentTimestamp);
    }

  };
  // Handles Sending graph data
  const getGraphData = async (resolution, fromTimeStamp, toTimeStamp) => {
    
    let stockCandleData = [];

    try {
      const res = await getHistoricalStockData(onStockRowClick, resolution, fromTimeStamp, toTimeStamp);
      // console.log(res);
      stockCandleData.push({
        name: onStockRowClick,
        data: res
      });
      
      /* setData */
      console.log(`In getGraphData linechart: ${stockCandleData[0].name}`);
      console.log(stockCandleData);
      setData(stockCandleData[0].data.data.c);
      
      /* setLabels */
      let allDates = [];
      // loop through the timestamps returned from the API Call
      stockCandleData[0].data.data.t.forEach((currentTimeStamp) => {
        const currentDate = new Date(currentTimeStamp*1000);
        allDates.push(currentDate);
      });
      // console.log(allDates);
      setLabels(allDates);

    } 
    catch(err) {
      console.error(err);
    }
  };
  // API Call for stock candles i.e historical data (1Y (Each Day), Monthly, Weekly, Per minute (Live))
  const getHistoricalStockData = async (stock, resolution, fromTimeStamp, toTimeStamp) => {
    const url = `${base_url}/stock/candle?symbol=${stock}&resolution=${resolution}&from=${fromTimeStamp}&to=${toTimeStamp}&token=${token}`;   // resolution for daily intervalled candles and time from janurary first to current
    console.log(url);
    return axios
      .get(url)
      .catch((error) => {
        console.error("Error", error.message);
      });
  };


  // show minute by minute portfolio value upto how long user stays on the website
  function handleTotalPortfolioGraphData() {
    // LineChart data to show by default
    let xLabels = [];
    let sample_data = [];
    let value = 50;
    for(var i = 0; i < 100; i++){
      let date = new Date();
      date.setHours(0,0,0,0);
      date.setDate(i);
      value += Math.round((Math.random() < 0.5 ? 1 : 0) * Math.random() * 10);
      xLabels.push(date.toString());
      sample_data.push(value);
    }
    setData(sample_data);
    setLabels(xLabels);
  }


  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            labels : labels,  // x-coordinates
            datasets: [       // y-coordinates
              {
                label : '$',
                type: 'line',
                backgroundColor: "black",
                borderColor: "#dde26a",
                borderWidth: 2,
                pointBorderColor: 'rgba(0, 0, 0, 0)',
                pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                pointHoverBackgroundColor: '#dde26a',
                pointHoverBorderColor: '#000000',
                pointHoverBorderWidth: 4,
                pointHoverRadius: 6,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;