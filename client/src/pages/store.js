import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // เพิ่ม import นี้
import Slide from "./component/slide";
import '../css/Store.css';
import { numberWithCommas } from '../js/opesto';
import Swal from 'sweetalert2';

function Store({ isLoggedIn }) {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [modelProduct, setModelProduct] = useState(null);
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate(); // สร้าง navigate function

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    const loggedInUserType = localStorage.getItem("userType");
    if (loggedInUserId) {
      setUserId(loggedInUserId);
      setUserType(loggedInUserType);
    }
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:3001/Store`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterProducts = (searchTerm, category) => {
    let filteredProductsSet = new Set();
    let filteredProductsMap = new Map();

    listOfPosts.forEach((product) => {
      if ((category === "all" || product.product_type === category) &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
        if (!filteredProductsMap.has(product.name)) {
          filteredProductsSet.add(product);
          filteredProductsMap.set(product.name, product);
        }
      }
    });

    return Array.from(filteredProductsSet);
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setIsModelOpen(true);
    setModelProduct(product);
    if (product.product_type === 'S' || product.product_type === 'P') {
      setSelectedSize("S");
    } else {
      setSelectedSize("");
    }
  };

  const handleEditProduct = (productName, previousPrice, previousDescription, previousphotoP) => {
    navigate(`/Edit-product/${selectedProduct.itemID}`, { state: { productName, previousPrice, previousDescription, previousphotoP } });
  };




  const closeModel = () => {
    setIsModelOpen(false);
  };

  const addToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!selectedSize && (selectedProduct.product_type === 'S' || selectedProduct.product_type === 'P')) {
      alert("Please select a size");
      return;
    }

    axios.post(`http://localhost:3001/cart/add`, {
      userId: userId,
      productId: selectedProduct.itemID,
      productName: selectedProduct.name,
      productPrice: selectedProduct.price,
      size: selectedSize,
    }).then((response) => {
      // เปลี่ยนการแจ้งเตือนจาก alert เป็น SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product added to cart successfully',
      });

      console.log("Product added to cart successfully:", response.data);
    }).catch((error) => {
      Swal.fire({
        icon: 'warning',
        title: 'Out of stock!',
        text: 'Out of stock!',
      });
    });
  };

  const handleDeleteProduct = (productName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/product/delete/${productName}`)
          .then((response) => {
            Swal.fire(
              'Deleted!',
              'The product has been deleted.',
              'success'
            );
            // หลังจากลบสำเร็จให้ทำการโหลดสินค้าใหม่
            axios.get(`http://localhost:3001/Store`).then((response) => {
              setListOfPosts(response.data);
            });
          })
          .catch((error) => {
            console.error('Error deleting product:', error);
            Swal.fire(
              'Error!',
              'An error occurred while deleting the product.',
              'error'
            );
          });
      }
    });
  };


  return (
    <div>
      <Slide />
      <div className="container">
        <div className="sidebar">
          <input onChange={handleSearchChange} id="txt_search" type="text" className="sidebar-search" placeholder="SEARCH" />
          <a href="#" onClick={() => setSelectedCategory("all")} className="sidebar-items">All</a>
          <a href="#" onClick={() => setSelectedCategory("S")} className="sidebar-items">Shirt</a>
          <a href="#" onClick={() => setSelectedCategory("P")} className="sidebar-items">Pant</a>
          <a href="#" onClick={() => setSelectedCategory("H")} className="sidebar-items">Hat</a>
          <a href="#" onClick={() => setSelectedCategory("B")} className="sidebar-items">Bag</a>
          <a href="#" onClick={() => setSelectedCategory("N")} className="sidebar-items">Necklace</a>

        </div>
        <div className="product">
          {filterProducts(searchTerm, selectedCategory).map((product, key) => (
            <div key={key}>
              <div className={`product-items ${product.product_type}`} onClick={() => openProductDetail(product)}>
                <img className="product-img" src={product.photoP} alt={product.name} />
                <p className="headnp">{product.name}</p>
                <p className="footnp">{numberWithCommas(product.price)} THB</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModelOpen && (
        <div className="model">
          <div className="model-bg" onClick={closeModel}></div>
          <div className="model-page">
            <h2 className="detailmodel">Detail</h2>
            <div className="model-content">
              <img className="modeldesc-img" src={modelProduct.photoP} alt={modelProduct.name} />
              <div className="modeldesc-detail">
                <p className="Pdname">{modelProduct.name}</p>
                <p className="Price">{numberWithCommas(modelProduct.price)} THB</p>
                <p className="pddetails">{modelProduct.description}</p>
                {selectedProduct.product_type === 'S' || selectedProduct.product_type === 'P' ? (
                  <div>
                    <label>Select Size : </label>
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                ) : null}
                <div className="btn-control">
                  <button className="btn1" onClick={closeModel}>Close</button>
                  {userType === "admin" ? (
                    <button className="btn1 btn-buy" onClick={() => handleEditProduct(modelProduct.name, modelProduct.price, modelProduct.description, modelProduct.photoP)}>Edit Product</button>
                  ) : (
                    <button className="btn1 btn-buy" onClick={addToCart}>Add to cart</button>
                  )}
                  {userType === "admin" && (
                    <button className="btn1 btn-buy" onClick={() => handleDeleteProduct(modelProduct.name)}>Delete Product</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;
