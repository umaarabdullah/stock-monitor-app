import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CashPage from './Pages/CashPage';
import Transaction from './Pages/Transaction';
import UserStockHoldings from './Pages/UserStockHoldings';

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/cash-page",
      element: <CashPage />,
    },
    {
      path: "/transaction-page",
      element: <Transaction />,
    },
    {
      path: "/holdings-page",
      element: <UserStockHoldings />,
    },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
