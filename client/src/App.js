import React, { useState, useEffect } from 'react';
import './css/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Store from "./pages/store";
import Login from "./pages/signin";
import TLLogo from './img/TL.png';
import Comments from './pages/comment';
import Profile from './pages/profile';
import Edit from './pages/edit';
import Buy from './pages/buy';
import History from './pages/History';
import Home from './pages/Home';
import Signup from './pages/singup'
import EditP from './pages/EditP';
import AddnewProduct from './pages/addproduct';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    const loggedInUserType = localStorage.getItem("userType");
    if (loggedInUserId) {
      setUserId(loggedInUserId);
      setUserType(loggedInUserType);
    }
  }, [isLoggedIn]);


  useEffect(() => {
    if (isLoggedIn) {
      renderLoggedInNavbar();
    } else {
      renderLoggedOutNavbar();
    }
  }, [isLoggedIn]);

  const renderLoggedInNavbar = () => {
    return (
      <nav id="navbar-fixed" className="mynav">
        <div className="nav-container">
          <Link to="/">
            <img src={TLLogo} className="logonav" alt="logo" />
          </Link>
          <div className="nav-profile">
            <>
              {userType === "admin" ? (
                <>
                  <Link to="/AddnewProduct">
                    <i className="fa-solid fa-plus"></i>
                  </Link>
                  <Link to="/store">
                    <i className="fa-brands fa-product-hunt"></i>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/Comments">
                    <i className="fa-solid fa-star"></i>
                  </Link>
                  <Link to="/store">
                    <i className="fa-brands fa-product-hunt"></i>
                  </Link>
                  <div className="dropdown">
                    <i className="fa-solid fa-user dropdown-toggle" id="userDropdown"></i>
                    <div className="dropdown-menu" aria-labelledby="userDropdown">
                      <Link className="dropdown-item" to={`/Profile/${userId}`}>Profile</Link>
                      <Link className="dropdown-item" to={`/History/${userId}`}>History</Link>
                      <div className="dropdown-divider"></div>
                      <Link className="dropdown-item" to="/" onClick={handleLogout}>Logout</Link>
                    </div>
                  </div>
                  <div onClick={openCart} className="nav-profile-cart">
                    <i className="fas fa-cart-shopping"></i>
                    <div id="cartcount" className="cartcount" style={{ display: 'none' }}></div>
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      </nav>
    );
  };

  const renderLoggedOutNavbar = () => {
    return (
      <nav id="navbar-fixed" className="mynav">
        <div className="nav-container">
          <Link to="/">
            <img src={TLLogo} className="logonav" alt="logo" />
          </Link>
          <div className="nav-profile">
            <>
              <Link to="/login" className="log">
                <p>SIGN IN</p>
              </Link>
              <Link to="/signup" className="log">
                <p>SIGN UP</p>
              </Link>
            </>
          </div>
        </div>
      </nav>
    );
  };




  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`http://localhost:3001/mycart`, { params: { userId: userId } })
        .then((response) => {
          setCartItems(response.data);
          console.log(cartItems)
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, [isCartOpen]);


  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);


    const removedProductId = cartItems[index].itemID;
    axios.post('http://localhost:3001/mycart/remove', { userId: userId, productId: removedProductId })
      .then(response => {
        console.log('Item removed from cart:', response.data);
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
      });
  };


  const decreaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity--;
      setCartItems(newCartItems);
      // เรียกใช้ API เพื่อลดจำนวนสินค้าในตะกร้าของผู้ใช้
      const updatedProductId = newCartItems[index].itemID;
      axios.put('http://localhost:3001/mycart/decrease', { userId: userId, productId: updatedProductId, quantity: newCartItems[index].quantity })
        .then(response => {
          console.log('Item quantity updated:', response.data);
        })
        .catch(error => {
          console.error('Error updating item quantity:', error);
        });
    } else {
      removeFromCart(index);
    }
  };



  const increaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity++;
    setCartItems(newCartItems);
    // เรียกใช้ API เพื่อเพิ่มจำนวนสินค้าในตะกร้าของผู้ใช้
    const updatedProductId = cartItems[index].itemID;
    axios.put('http://localhost:3001/mycart/increase', { userId: userId, productId: updatedProductId, quantity: newCartItems[index].quantity })
      .then(response => {
        console.log('Item quantity updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating item quantity:', error);
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserId("");
    setUserType("");
    setIsLoggedIn(false);
    setIsCartOpen(false);
  };

  return (
    <div className="App">
      <Router>
        <div>
          {isLoggedIn ? renderLoggedInNavbar() : renderLoggedOutNavbar()}
        </div>
        {isCartOpen && (
          <div className="model">
            <div className="model-bg" onClick={closeCart}></div>
            <div className="model-page">
              <h2 className='Headcart'>Shopping Cart</h2>
              {cartItems.map((item, index) => (
                <div key={index}>
                  <div className="cartlist-items">
                    <div className="cartlist-left">
                      <img src={item.photoP} alt={item.name} />
                      <div className="cartlist-detail">
                        <p className='cartpd'>{item.name}</p>
                        <p className='cartpri'>{item.price} THB</p>
                        <p className="cartsize">Size:{item.size}</p>
                      </div>
                    </div>
                    <div className="cartlist-right">
                      <p onClick={() => decreaseQuantity(index)} className="btnc">-</p>
                      <p className="countinc">{item.quantity}</p>
                      <p onClick={() => increaseQuantity(index)} className="btnc">+</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="btn-control">
                <button className="btn1" onClick={closeCart}>Close</button>
                <Link to={`/buy/${userId}`}>
                  <button className="btn1 btn-buy">Buy</button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/store" element={<Store isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Comments" element={<Comments />} />
          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/Profile/edit/:id" element={<Edit />} />
          <Route path="/buy/:id" element={<Buy />} />
          <Route path="/History/:id" element={<History />} />
          <Route path="/Edit-product/:itemID" element={<EditP userId={userId}/>}/> 
          <Route path="/AddnewProduct" element={<AddnewProduct userId={userId}/>}/>
        </Routes>
      </Router >
    </div >
  );
}

export default App;
