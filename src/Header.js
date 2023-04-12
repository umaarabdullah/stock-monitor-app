import React from 'react'
import Logo from './image.png'
import { makeStyles } from '@material-ui/core';
import './Header.css' 
import { Search } from '@material-ui/icons'

function Header() {
  return (
    <div className='header_wrapper'>
        
        <div className='header_logo'>
            <img src={Logo} width={25} />
        </div>

        <div className='header_search'>
            <div className='header_searchContainer'>
                <Search className='header_searchIcon' />
                <input className='header_searchInput' placeholder='Search' type="text" />
            </div>
        </div>

        <div className='header_menuItems'>
            {/* <a href='#'>My Stocks</a> */}
            <a href='#'>Portfolio</a>
            {/* <a href='#'>Cash</a> */}
            <a href='#'>Messages</a>
            <a href='#'>Account</a>
        </div>
        
    </div>
  )
}

export default Header