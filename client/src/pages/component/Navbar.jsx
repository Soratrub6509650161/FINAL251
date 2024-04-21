import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TLLogo from './img/TL.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    if (loggedInUserId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  return (
    <nav id="navbar-fixed" className="mynav">
      <div className="nav-container">
        <Link to="/">
          <img src={TLLogo} className="logonav" alt="logo" />
        </Link>
        <div className="nav-profile">
          {isLoggedIn ? (
            <>
              <Link to="/store">
                <i className="fa-brands fa-product-hunt"></i>
              </Link>
              <div className="dropdown">
                <i className="fa-solid fa-user dropdown-toggle" id="userDropdown"></i>
                <div className="dropdown-menu" aria-labelledby="userDropdown">
                  <Link className="dropdown-item" to="/information">Profile</Link>
                  <Link className="dropdown-item" to="/history">History</Link>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="/" onClick={() => setIsLoggedIn(false)}>Logout</Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="log">
                <p>SIGN IN</p>
              </Link>
              <Link to="/Register" className="log">
                <p>SIGN UP</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
