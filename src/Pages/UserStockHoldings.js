import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './UserStockHoldings.css'

// View holdings
function UserStockHoldings() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const { holdingsData } = location.state || {};

    useEffect(() => {

        console.log(holdingsData);

    }, []);

    function handleBackClick(event) {
        event.preventDefault();
        navigate("/");
    }

    return (
        <div>
            <div className='holdings_page_back_button'>
                <button type='button' className='back_button' onClick={handleBackClick}>Back</button>
            </div>
            <div className="container">
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Shares</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Column 5</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Cell 1</td>
                            <td>Cell 2</td>
                            <td>Cell 3</td>
                            <td>Cell 4</td>
                            <td>Cell 5</td>
                        </tr>
                        <tr>
                            <td>Cell 1</td>
                            <td>Cell 2</td>
                            <td>Cell 3</td>
                            <td>Cell 4</td>
                            <td>Cell 5</td>
                        </tr>
                        <tr>
                            <td>Cell 1</td>
                            <td>Cell 2</td>
                            <td>Cell 3</td>
                            <td>Cell 4</td>
                            <td>Cell 5</td>
                        </tr>
                        <tr>
                            <td>Cell 1</td>
                            <td>Cell 2</td>
                            <td>Cell 3</td>
                            <td>Cell 4</td>
                            <td>Cell 5</td>
                        </tr>
                        <tr>
                            <td>Cell 1</td>
                            <td>Cell 2</td>
                            <td>Cell 3</td>
                            <td>Cell 4</td>
                            <td>Cell 5</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserStockHoldings