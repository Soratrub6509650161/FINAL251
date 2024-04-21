import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/register.module.css'
import Swal from 'sweetalert2';


const Signup = () => {
    const [userData, setUserData] = useState({
        fname: '',
        mname: '',
        lname: '',
        username: '',
        Password:'',
        Tel: '',
        email: '',
        gender: '',
        province: '',
        street: '',
        zipcode: '',
        district: '',
        about: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/Signup', userData); // เปลี่ยน YOUR_API_ENDPOINT เป็น URL ของ API ของคุณ
            Swal.fire({
                title: 'สมัครสำเร็จ!',
                text: 'ขอบคุณที่ทำการสมัครสมาชิกกับเรา',
                icon: 'success',
                confirmButtonText: 'ตกลง'
              }) 
            navigate('/login');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
        }
    };

    return (
        <main className={styles.backgroundimage}>
            <div className="container1">
                <h2 className="h2">SIGN UP</h2>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="fname">ชื่อ : </label>
                                <input
                                    type="text"
                                    name="fname"
                                    id="fname"
                                    value={userData.fname}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="mname">ชื่อกลาง : </label>
                                <input
                                    type="text"
                                    name="mname"
                                    id="mname"
                                    value={userData.mname}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="lname">นามสกุล : </label>
                                <input
                                    type="text"
                                    name="lname"
                                    id="lname"
                                    value={userData.lname}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="username">User Name : </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={userData.username}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="username">Password : </label>
                                <input
                                    type="Password"
                                    name="Password"
                                    id="Password"
                                    value={userData.Password}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            
                        </div>
                        <div className="row">
                        <div className="col-md-4">
                                <label htmlFor="Tel">เบอร์โทรศัพท์ :</label>
                                <input
                                    type="text"
                                    name="Tel"
                                    id="Tel"
                                    value={userData.Tel}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="email">อีเมล : </label>
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    value={userData.email}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="gender">เพศ : </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={userData.gender}
                                    className="form-control"
                                    onChange={handleChange}
                                >
                                    <option value="">เลือกเพศ</option>
                                    <option value="M">ชาย</option>
                                    <option value="F">หญิง</option>
                                    <option value="L">LGBTQ+</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="province">จังหวัด : </label>
                                <input
                                    type="text"
                                    name="province"
                                    id="province"
                                    value={userData.province}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="street">ถนน : </label>
                                <input
                                    type="text"
                                    name="street"
                                    id="street"
                                    value={userData.street}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="zipcode">รหัสไปรษณีย์ : </label>
                                <input
                                    type="text"
                                    name="zipcode"
                                    id="zipcode"
                                    value={userData.zipcode}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="district">อำเภอ : </label>
                                <input
                                    type="text"
                                    name="district"
                                    id="district"
                                    value={userData.district}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="about">ที่อยู่ : </label>
                                <input
                                    type="text"
                                    name="about"
                                    id="about"
                                    value={userData.about}
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" id="config">Sign Up</button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Signup;
