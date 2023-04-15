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

// const labels = ["January", "February", "March", "April", "May", "June"];

function LineGraph({ casesType }) {

  const [data, setData] = useState({});
  const [labels, setLabels] = useState({});

  useEffect(() => {
    
    let data = [];
    let labels = [];
    let value = 50;
    for(var i = 0; i < 366; i++){
      let date = new Date();
      date.setHours(0,0,0,0);
      date.setDate(i);
      value += Math.round((Math.random() < 0.5 ? 1 : 0) * Math.random() * 10);
      labels.push(date.toString());
      data.push(value);
    }
    // data = [0, 10, 5, 2, 20, 30, 45];
    setData(data);
    setLabels(labels);

  }, []);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            labels : labels,  // x-coordinates
            datasets: [       // y-coordinates
              {
                label : 'Chart',
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