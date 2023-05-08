import React, { useEffect, useRef, useState } from 'react'
import Logo from './image.png'
import { makeStyles } from '@material-ui/core';
import './Header.css' 
import { Search } from '@material-ui/icons'

function Header(props) {

    const [menuItemsdropdownOpen, setmenuItemsDropdownOpen] = useState(false);
    const menuItemsdropDownRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (event) => {
          if (menuItemsdropDownRef.current && !menuItemsdropDownRef.current.contains(event.target)) {
            setmenuItemsDropdownOpen(false);
          }
        };
    
        document.addEventListener("menuitemsmousedown", handleClickOutside);
    
        // remove event listener when the component unmounts
        return () => {
          document.removeEventListener("menuitemsmousedown", handleClickOutside);
        };
    
    }, [menuItemsdropDownRef]);

    function togglemenuItemsDropdown() {
        setmenuItemsDropdownOpen(!menuItemsdropdownOpen);
    }

    // handles login click
    function handleLoginClick() {
        props.onShowLoginPage();
    }

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
                <a href='#' onClick={togglemenuItemsDropdown}>Account</a>
                {menuItemsdropdownOpen && (
                <div className="menuItems_dropdown_content" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown_item_signup" href="#" onClick={handleLoginClick}>login</a>
                </div>
                )}
            </div>
        </div>
    )
}

export default Header;