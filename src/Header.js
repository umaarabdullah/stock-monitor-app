import React, { useEffect, useRef, useState } from 'react'
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import Logo from './image.png'
import { makeStyles } from '@material-ui/core';
import './Header.css' 
import { Search } from '@material-ui/icons'
import Swal from 'sweetalert2';
import { Link, navigate } from 'react-router-dom';

function Header(props) {

    const {setTotalHoldingsValue} = props;

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

    function handleLogoutClick() {
        // firebase signout
        firebase.auth().signOut()
            .then(() => {
            // redirect the user to the login page here
            /** Clear User stock information and show only dashboard stocks **/
                props.onLoggedOut();    // change login flag to remove log out button 
                console.log("User signed out successfully");
                Swal.fire({   // Pop up Alert
                    title: 'You\'ve been logged out',
                    icon: 'success',
                    text: 'You have successfully logged out of the application',
                });
            })
            .catch(error => {
                console.log(error);
            });
        setTotalHoldingsValue(0);
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
                <div className='header_menuItems_mystock_wrapper'>
                    <a href='#'>My Stocks</a>
                </div>
                <div className='menuItems_dropdown_content_portfolio_wrapper'>
                    <a href='#'>Portfolio</a>
                    <div className="menuItems_dropdown_content">
                        {/* <a href="#">Cash</a> */}
                        {props.onShowLoggedIn ? (
                            <a href="#"><Link to="/transaction-page">Transactions</Link></a>
                        ) : (
                            <a href="#">Transactions</a>
                        )}
                    </div>
                </div>
                <div className='menuItems_dropdown_content_account_wrapper'>
                    <a href='#'>Account</a>
                    <div className="menuItems_dropdown_content">
                    {!props.onShowLoggedIn && (
                        <a className="dropdown_item_signup" href="#" onClick={handleLoginClick}>Login</a>
                    )}
                    {props.onShowLoggedIn && (
                        <a className="dropdown_item_signout" href="#" onClick={handleLogoutClick}>Logout</a>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;