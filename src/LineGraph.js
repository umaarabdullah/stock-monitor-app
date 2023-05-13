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
  const { setActiveButton } = props;

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {

    console.log(`row clicked linechart useEffect 1 : ${onStockRowClick}`);
    
    if(onStockRowClick){    // By default chart will be active with resolution: D that is daily candles
      setChartTitle(onStockRowClick.toString());
      setActiveButton(2);   // set timeline button D with index=2 as active
      handleRowClickGraphData();    // API Call for stock candle with resolution 'D'
    }
    else{
      setChartTitle('Default');
      handleDefaultGraphData();
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
      setChartTitle('Default');
      handleDefaultGraphData();
    }
    
  }, [timeLineButtonActiveClick]);


  // handles graphdata when a row_intro is clicked
  function handleRowClickGraphData(){
    
    let graphdata = [];
    console.log(lineChartData);
    graphdata = lineChartData[0].data.data.c;     // c means closing prices
    setData(graphdata);

    const currentDate = new Date();
    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    let dates = [];
    let date = januaryFirst;
    // Generate the dates of each day from januaryFirst to current
    while (date <= currentDate) {
      dates.push(date.toString());
      date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }
    setLabels(dates);

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
      /* live means yesterday live data */
      const currentDate = new Date(); 
      const yesterday = new Date(currentDate); 
      yesterday.setDate(currentDate.getDate() - 1); 
      const midnight = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0); 
      const midnightTimestamp = Math.floor(midnight.getTime() / 1000);       // Convert to timestamp in seconds
      const currentTimeYesterday = Math.floor(yesterday.getTime() / 1000);   // Convert to timestamp in seconds
      
      getGraphData(resolution, midnightTimestamp, currentTimeYesterday);
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
      // console.log(`In getGraphData linechart: ${stockCandleData[0].name}`);
      setData(stockCandleData[0].data.data.c);
      
      /* setLabels */
      const fromDate = new Date(fromTimeStamp * 1000);
      const toDate = new Date(toTimeStamp * 1000);
      const allDates = [];
      let currentDate = new Date(fromDate);

      // Find the dates required as per requested data resolution
      if(resolution === 'D'){   // Daily/Year
        while (currentDate <= toDate) {
          allDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);    
        }
      }
      else if(resolution === 'W'){   // Weekly
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
        while (currentDate <= toDate) {
          allDates.push(new Date(currentDate));
          currentDate.setTime(currentDate.getTime() + oneWeek);
        }
      }
      else if(resolution === 'M'){   // Monthly
        while (currentDate <= toDate) {
          allDates.push(new Date(currentDate));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }
      else if(resolution === '1'){   // Live
        const oneMinute = 60; // in seconds
        let currentTimestamp = fromTimeStamp;
        while (currentTimestamp <= toTimeStamp) {
            const currentDate = new Date(currentTimestamp * 1000);
            allDates.push(currentDate);
            currentTimestamp += oneMinute;
        }
      }
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


  function handleDefaultGraphData() {
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