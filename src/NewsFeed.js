import React from 'react'
import './NewsFeed.css'
import LineGraph from './LineGraph'
import TimeLine from './TimeLine'
import { useState } from 'react'
import { Chip } from '@material-ui/core'
import { Avatar } from '@material-ui/core'

function NewsFeed(props) {

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
              <h1>$114,234</h1>
              <p> +$53.34 (+0.05%) Today </p>
            </div>

            <div className='newsfeed_chart'>
              <LineGraph lineChartData={props.graphData}/>
              <TimeLine />
            </div>
          </div>
          <div className='newsfeed_buying_section'>
            <h2> Buying Power</h2>
            <h2>$44.11</h2>
          </div>
          <div className='newsfeed_market_section'>
            <div className='newsfeed_market_box'>
              <p> Markets Closed </p>
              <h1> Eid Mubarak </h1>
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