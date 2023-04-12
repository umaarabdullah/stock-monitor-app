import React from 'react'
import './NewsFeed.css'
import LineGraph from './LineGraph'

function NewsFeed() {
  return (
    <div className='newsfeed'>
        <div className='newsfeed_container'>
          <div className='newsfeed_chartSection'>

            <div className='newsfeed_portfolio'>
              <h1>$114,234</h1>
              <p> +$53.34 (+0.05%) Today </p>
            </div>

            <div className='newsfeed_chart'>
              <LineGraph />
            </div>

          </div>
        </div>
    </div>
  )
}

export default NewsFeed