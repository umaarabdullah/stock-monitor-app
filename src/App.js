import logo from './logo.svg';
import './App.css';
import Header from './Header';
import NewsFeed from './NewsFeed';
import Stats from './Stats';

function App() {
  return (
    <div className="App">
      <div className='app_header'>
        <Header /> 
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
