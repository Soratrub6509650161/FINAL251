import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from '../css/buy.module.css';
import qr from '../img/qr.jpg';
import Swal from 'sweetalert2';

function Buy() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    if (paymentMethod) {
      handlePayment();
    }
  }, [paymentMethod]);

  const handleCreditCardPayment = () => {
    setPaymentMethod('Credit Card');
  };

  const handleBankTransferPayment = () => {
    setPaymentMethod('Bank Transfer');
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };
  const [selectedFile, setSelectedFile] = useState(null);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePayment = async () => {
    try {
      const currentTime = new Date();
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Bangkok' };
      const thaiDateTime = new Intl.DateTimeFormat('th-TH', options).format(currentTime);

      console.log(thaiDateTime)
      await axios.post(`http://localhost:3001/buy/${id}`, { paymentMethod, thaiDateTime });
      console.log('Payment response:');
      Swal.fire({
        title: 'ซื้อสำเร็จ!',
        text: 'ขอบคุณที่ทำการสั่งซื้อสินค้ากับเรา',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      })
      navigate(`/History/${id}`)
    } catch (error) {
      console.error('Error handling payment:', error);
    }
  };



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/profile/${id}`);
        setUserData(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (cartItems) {
      axios.get(`http://localhost:3001/buy/${id}`)
        .then((response) => {
          setCartItems(response.data);
          console.log(cartItems);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.headbuy}>ชำระเงิน</h1>
      <div className={styles.wrapadd}>
        <div className={styles.wrapitem}>
          <h2 className={styles.headbuy2}>ที่อยู่สำหรับการจัดส่ง</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>ชื่อ: {userData.fname} {userData.lname}</p>
              <p>เบอร์โทร: {userData.Tel}</p>
              <p>ที่อยู่: {userData.about} ถนน{userData.street} เขต{userData.district} {userData.zipcode} {userData.province}</p>
              <Link to={`/Profile/edit/${id}`}>
                <button className={styles.butbuy}>แก้ไข</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className={styles.wrapadd}>
        <div className={styles.wrapitem}>
          <h2 className={styles.headbuy2}>รายการสินค้า</h2>
          {cartItems.map((item, index) => (
            <div key={index}>
              <div className={styles.wrapphoto}>
                <img src={item.photoP} alt={item.name} className={styles.imgbuy}></img>
              </div>
              <div className={styles.wrapdesc}>
                <p>ชื่อสินค้า : {item.name}</p>
                <p>ราคา : {item.price}</p>
                <p>จำนวน : {item.quantity}</p>
                <p>Size : {item.size}</p>
              </div>
            </div>
          ))}
          <div className={styles.wrapdescbuy}>
            <p>ยอดรวมสินค้า: {calculateTotalPrice()} บาท</p>
            <p>ค่าจัดส่ง 35</p>
            <p className={styles.totalbuy}>ยอดที่ต้องชำระทั้งหมด: {calculateTotalPrice() + 35} บาท</p>
          </div>
        </div>
      </div>
      <div className={styles.wrapadd}>
        <div className={styles.wrapitem}>
          <h2 className={styles.headbuy2}>CREDIT CARD</h2>
          <form>
            <label htmlFor="namec">Name on Card : </label>
            <input
              type="text"
              name="namec"
              id="namec"
              className={styles.inputbuy}
            />
            <label htmlFor="cnum">Card Number : </label>
            <input
              type="text"
              name="cnum"
              id="cnum"
              className={styles.inputbuy}
            />
            <label htmlFor="EX">Expriation Date : </label>
            <input
              type="text"
              name="EX"
              id="EX"
              className={styles.inputbuy}
              placeholder='MM/YY'
            />
            <label htmlFor="CV">CVV : </label>
            <input
              type="text"
              name="CV"
              id="CV"
              className={styles.inputbuy}
            />
            <Link onClick={handleCreditCardPayment}>
              <button className={styles.butbuy}>Pay now</button>
            </Link>
          </form>
        </div>
      </div>
      <div className={styles.wrapadd}>
        <div className={styles.wrapitem}>
          <h2 className={styles.headbuy2}>สลิปการโอนเงิน</h2>
          <img src={qr} className={styles.imgbuy1} alt="qr"></img>
          <p>สลิปการโอนเงิน(หากชำระเงินผ่านธนาคาร)</p>
          <input type="file" onChange={handleFileChange} />
          <Link onClick={handleBankTransferPayment}>
            <button className={styles.butbuy}>Pay now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Buy;
