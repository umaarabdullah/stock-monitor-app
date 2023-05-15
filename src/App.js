import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NewsFeed from './NewsFeed';
import Stats from './Stats';
import { useState } from 'react';
import LoginPage from './LoginPage';

function App() {

  const [showLoginPage, setShowLoginPage] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);      // logged in flag

  const [graphData, setGraphData] = useState([]);
  const [onStockRowClick, setOnStockRowClick] = useState(false);
  const [timeLineButtonActiveClick, setTimeLineButtonActiveClick] = useState("");
  const [TotalHoldingsValue, setTotalHoldingsValue] = useState(0.0);   // Initialize with 0.0
  const [TotalPurchasePrice, setTotalPurchasePrice] = useState(0.0);   // Initialize with 0.0


  function handleShowLoginPage() {
    setShowLoginPage(true);
  }

  function handleCancelLoginPage(){
    setShowLoginPage(false);
  }

  function handleHideLoginPage() {
    setloggedIn(true);        // flag to show logout button
    setShowLoginPage(false);
  }

  function handleOnLoggedOut(){
    setloggedIn(false);        // flag to show login button
  }

  return (
    <div className="App">
      {showLoginPage && 
                        <LoginPage 
                          onHideLoginPage={handleHideLoginPage} 
                          onCancelLoginPage={handleCancelLoginPage}
                        />}
      <div className='app_header'>
        <Header 
          onShowLoginPage={handleShowLoginPage} 
          onShowLoggedIn={loggedIn} 
          onLoggedOut={handleOnLoggedOut}
          setTotalHoldingsValue={setTotalHoldingsValue}
        /> 
      </div>
      <div className='app_body'>
        <div className='app_container'>
          <NewsFeed 
            graphData={graphData} 
            onStockRowClick={onStockRowClick} 
            setTimeLineButtonActiveClick={setTimeLineButtonActiveClick}
            timeLineButtonActiveClick={timeLineButtonActiveClick}
            TotalHoldingsValue={TotalHoldingsValue}
            TotalPurchasePrice={TotalPurchasePrice}
          />
          <Stats 
            onLoggedIn={loggedIn} 
            onSetGraphData={setGraphData} 
            OnSetOnStockRowClick={setOnStockRowClick}
            setTotalHoldingsValue={setTotalHoldingsValue}
            setTotalPurchasePrice={setTotalPurchasePrice}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
