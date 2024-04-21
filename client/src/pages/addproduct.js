import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../css/register.module.css';
import Swal from 'sweetalert2';

const AddnewProduct = ({ userId }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [productName, setProductName] = useState('');
    const [url, setUrl] = useState('');
    const [formData, setFormData] = useState({
        ProductName: '',
        Price: '',
        description: '',
        Size: '', // Added
        TypeProduct: '', // Added
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (location.state && location.state.productName) {
            setProductName(location.state.productName);
        }
    }, [location.state]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataCloudinary = new FormData();
            formDataCloudinary.append('file', selectedFile);
            formDataCloudinary.append("upload_preset", "myCloud");
            formDataCloudinary.append("cloud_name", "ddlsqqncv");

            const cloudinaryRes = await axios.post('https://api.cloudinary.com/v1_1/dbyoondqs/image/upload', formDataCloudinary);

            const cloudData = cloudinaryRes.data;
            setUrl(cloudData.url);

            await axios.post('http://localhost:3001/product/Add', {
                ProductName: formData.ProductName,
                Price: formData.Price,
                description: formData.description,
                Size: formData.Size, // Changed
                TypeProduct: formData.TypeProduct, // Changed
                imageUrl: cloudData.url,
                amID : userId
            });
            Swal.fire({
                title: 'เพิ่มสินค้าสำเร็จ!',
                text: 'Data updated successfully',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            })
            navigate('/store');
        } catch (error) {
            console.error('Error updating product data:', error);
        }
    };


    return (
        <main className={styles.backgroundimage}>
            <div className="container1">
                <h2 className="h2">AddnewProduct{productName}</h2>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="ProductName"
                                    id="ProductName"
                                    className="form-control"
                                    value={formData.ProductName || ''}
                                    onChange={handleChange}
                                    placeholder="Product Name"
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="Price"
                                    id="Price"
                                    className="form-control"
                                    value={formData.Price}
                                    onChange={handleChange}
                                    placeholder="Price"
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="description"
                                    id="description"
                                    className="form-control"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                {/* Size dropdown */}
                                <select
                                    id="Size"
                                    name="Size"
                                    value={formData.Size}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option Value="">Size</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="">-</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <select
                                    id="TypeProduct"
                                    name="TypeProduct"
                                    value={formData.TypeProduct}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option disabled selected>TypeProduct</option>
                                    <option value="S">Shirt</option>
                                    <option value="P">Pant</option>
                                    <option value="H">Hat</option>
                                    <option value="B">Bag</option>
                                    <option value="N">Necklace</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="district">Upload Picture</label>
                                <input type="file" onChange={handleFileChange} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" id="config">
                            Confirm Edit
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AddnewProduct;
