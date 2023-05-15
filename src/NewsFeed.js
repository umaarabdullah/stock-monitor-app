import React from 'react'
import './NewsFeed.css'
import LineGraph from './LineGraph'
import TimeLine from './TimeLine'
import { useState } from 'react'
import { Chip } from '@material-ui/core'
import { Avatar } from '@material-ui/core'

function NewsFeed(props) {

  const { onStockRowClick } = props;
  const { setTimeLineButtonActiveClick } = props;
  const { timeLineButtonActiveClick } = props;
  const { TotalHoldingsValue } = props;
  const { TotalPurchasePrice } = props;

  const [chartTitle, setChartTitle] = useState("");   // initialise with empty string
  const [activeButton, setActiveButton] = useState(0);

  const OverallProfitOrLoss = ((TotalHoldingsValue - TotalPurchasePrice)/ TotalPurchasePrice) * 100;
  const isPositive = OverallProfitOrLoss >= 0;

  const popularTopics = [
    "Technology",
    "Top Movies",
    "Upcoming Earnings",
    "Crypto",
    "Cannabis",
    "Healthcare Supplies",
    "Index ETFs",
    "China",
    "Pharma",
  ];

  const handleClick = () => {
    console.log('clicked');
    // console.log(props.graphData);
  };

  return (
    <div className='newsfeed'>
        <div className='newsfeed_container'>
          <div className='newsfeed_chartSection'>
            <div className='newsfeed_portfolio'>
              {TotalHoldingsValue !== 0 ? (
                <h1>${Number(TotalHoldingsValue).toFixed(2)}</h1>
              ) : (
                <h1>Total Holdings Value</h1>
              )}
              {/* +/-Profit/Loss in $ +/-(Profit/Loss in %) Today*/}
              {/* <p className="protfit_loss_percentage" style={{ color: isPositive ? '#5AC53B' : 'red' }}> {Number(OverallProfitOrLoss).toFixed(2)}%</p> */}
              {!isNaN(OverallProfitOrLoss) && (
                <p className="profit_loss_percentage" style={{ color: isPositive ? '#5AC53B' : 'red' }}>
                  {Number(OverallProfitOrLoss).toFixed(2)}%   <span style={{ color: '#ffffff' }}>Today</span>
                </p>
              )}
            </div>

            <div className='newsfeed_chart'>
              <LineGraph 
                lineChartData={props.graphData} 
                onStockRowClick={onStockRowClick} 
                setChartTitle={setChartTitle}
                timeLineButtonActiveClick={timeLineButtonActiveClick}
                setTimeLineButtonActiveClick={setTimeLineButtonActiveClick}
                setActiveButton={setActiveButton}
              />
              <TimeLine 
                chartTitle={chartTitle} 
                setTimeLineButtonActiveClick={setTimeLineButtonActiveClick}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
              />
            </div>
          </div>
          <div className='newsfeed_buying_section'>
            {/* <h2>Buying Power</h2>
            <h2>$44.11</h2> */}
          </div>
          <div className='newsfeed_market_section'>
            <div className='newsfeed_market_box'>
              <p> Markets Open </p>
              <h1> Trade Away </h1>
            </div>
          </div>
          <div className='newsfeed_popularlists_sections'>
            <div className="newsfeed_popularlists_intro">
            <h1>Popular lists</h1>
            <p>Show More</p>
          </div>
          <div className='newsfeed_popularlists_badges'>
            {popularTopics.map(tag => (
              <Chip
                variant="outlined"
                style={{ borderColor:'#31363a',  color: 'white' }}
                label={tag} 
                key={tag}
                onClick={handleClick}
                avatar={<Avatar src={`https://avatars.dicebear.com/api/human/${tag}.svg`} />} 
              />
            ))}
          </div>
          </div>
        </div>
    </div>
  )
}

export default NewsFeed