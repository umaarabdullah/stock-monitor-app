import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NewsFeed from './NewsFeed';
import Stats from './Stats';
import { useState } from 'react';
import LoginPage from './LoginPage';

function App() {

  const [showLoginPage, setShowLoginPage] = useState(false);

  function handleShowLoginPage() {
    setShowLoginPage(true);
  }

  function handleHideLoginPage() {
    setShowLoginPage(false);
  }

  return (
    <div className="App">
      {showLoginPage && <LoginPage onHideLoginPage={handleHideLoginPage} />}
      <div className='app_header'>
        <Header onShowLoginPage={handleShowLoginPage} /> 
      </div>
      <div className='app_body'>
        <div className='app_container'>
          <NewsFeed />
          <Stats />
        </div>
      </div>
    </div>
  );
}

export default App;
