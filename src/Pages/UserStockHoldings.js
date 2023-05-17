import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './UserStockHoldings.css'
import Chart from 'chart.js/auto';

// View holdings
function UserStockHoldings() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { holdingsData } = location.state || {};

    const [holdingsDataState, setHoldingsDataState] = useState([]);

    const chartRef = useRef(null);

    useEffect(() => {

        if (holdingsData) {
            // console.log(holdingsData);
            setHoldingsDataState(holdingsData);
        }

    }, [holdingsData]);

    useEffect(() => {

        if (chartRef.current && holdingsDataState.length > 0) {
            const labels = holdingsDataState.map((holdings) => holdings.name);
            const data = holdingsDataState.map((holdings) => holdings.shares);
            const backgroundColors = holdingsDataState.map((holdings) => getRandomColor());
        
                new Chart(chartRef.current, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: backgroundColors,
                        },
                    ],
                },
            });
        }

    }, [holdingsDataState]);


    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
      
    function handleBackClick(event) {
        event.preventDefault();
        navigate("/");
    }
    

    return (
        <div className='holdings-page'>
            <div className='holdings_page_back_button'>
                <button type='button' className='back_button' onClick={handleBackClick}>Back</button>
            </div>
            <div className='holdings_page_title'>
                <h1>Holdings</h1>
            </div>
            <div className="container">
                <table>
                    <thead>
                        <tr>
                            <th>S/No</th>
                            <th>Symbol</th>
                            <th>Shares</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {holdingsDataState && holdingsDataState.length > 0 ? (
                            holdingsDataState.map((holdings, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{holdings.name}</td>
                                <td>{holdings.shares}</td>
                                <td>{Number(holdings.info.c).toFixed(2)}</td>
                                <td> ${Number(holdings.shares*holdings.info.c).toFixed(2)} </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="6">No holdings data available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserStockHoldings