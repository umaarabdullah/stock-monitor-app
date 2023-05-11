import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import './LineGraph.css'

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
  const { onStockRowClick } = props;

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [graphDataByDay, setGraphDataByDay] = useState(false);

  useEffect(() => {

    console.log('onStockRowClick');
    console.log(onStockRowClick);
    
    if(onStockRowClick){
      handleGraphDataByDay();
    }
    else{
      handleDefaultGraphData();
    }

  }, [onStockRowClick]);


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

  function handleGraphDataByDay(){
    
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