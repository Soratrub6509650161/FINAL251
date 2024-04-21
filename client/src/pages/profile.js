import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../css/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/profile/${id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <section className="profile">
        <div className="form-group">
          <h2 className="h2">ข้อมูลส่วนตัว</h2>
          {userData && userData.map((user, index) => (
            <div key={index} className="row">
              <div className="col-md-12">
                <label htmlFor="name">ชื่อ : {user.fname}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="midname">ชื่อกลาง : {user.mname}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="surname">นามสกุล : {user.lname}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="user-name">User Name : {user.username}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="user-id">User ID : {user.id}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="tel-phone">เบอร์โทรศัพท์ : {user.Tel}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="email">Email : {user.email}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="sex">เพศ : {user.gender}</label>
              </div>
              <h2 className="h2 col-md-12">ที่อยู่</h2>
              <div className="col-md-3">
                <label htmlFor="province">จังหวัด : {user.province}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="street">ถนน : {user.street}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="zipcode">รหัสไปรษณีย์ : {user.zipcode}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="district">อำเภอ : {user.district}</label>
              </div>
              <div className="col-md-12">
                <label htmlFor="about">ที่อยู่ : {user.about}</label>
              </div>
              <Link to={`/Profile/edit/${user.id}`} className="col-md-12">
                <button type="button" id="config" className="btn btn-primary">แก้ไข</button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Profile;
