import React, { useEffect, useRef, useState } from 'react'
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import Logo from './image.png'
import { makeStyles } from '@material-ui/core';
import './Header.css' 
import { Search } from '@material-ui/icons'
import Swal from 'sweetalert2';
import { Link, navigate, useNavigate } from 'react-router-dom';

function Header(props) {

    const {setTotalHoldingsValue} = props;
    const {holdingsData} = props;

    const [gotHoldingData, setGotHoldingData] = useState(false);

    const [menuItemsdropdownOpen, setmenuItemsDropdownOpen] = useState(false);
    const menuItemsdropDownRef = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {

        // console.log(holdingsData);
        setGotHoldingData(true);
      
    }, [holdingsData]);
    
    function handleLoggedInHoldinsClick() {
        navigate('/holdings-page', { state: {holdingsData: holdingsData} });
    }


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

    function handleNotLoggedInClick() {

        Swal.fire({
            title: 'Must Log In!',
            icon: 'error',
            text: 'You must login inorder to access transactions',
        });
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
                        {props.onShowLoggedIn ? (
                            <Link to="/transaction-page">Transactions</Link>
                        ) : (
                            <a href="#" onClick={handleNotLoggedInClick}>Transactions</a>
                        )}

                        {props.onShowLoggedIn ? (
                            <a href="#" onClick={gotHoldingData ? handleLoggedInHoldinsClick : undefined}>
                                Holdings
                            </a>
                        ) : (
                            <a href="#" onClick={handleNotLoggedInClick}>Holdings</a>
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