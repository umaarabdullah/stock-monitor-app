import React from 'react'
import { Link } from 'react-router-dom'



function Transaction(props) {

    /** 
     *  Transactions data stored on firebase will of the following format:
     *  Each Transactions will have 5 items [share_count, stock_name, stock_price, date_and_time, buy/sell_flag]
     *                                          Number,     string,       Number       date,       'buy'/'sell
     *  Data stored in firestore in a long string with each consecutive 5 items representing 1 transaction data object
     * 
    */

    return (
    <div>
        <h1>Transaction</h1>
        <Link to="/">Go back to Home Page</Link>
    </div>
    )
}

export default Transaction