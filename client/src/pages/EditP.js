import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styles from '../css/register.module.css';
import Swal from 'sweetalert2';

const EditP = ({ userId }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [productName, setProductName] = useState('');
    const [url, setUrl] = useState('');
    const [formData, setFormData] = useState({
        ProductName: '',
        Price: '',
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const { itemID } = useParams();

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
            
            await axios.post('http://localhost:3001/product/Edit', {
                ProductName: formData.ProductName,
                price: formData.Price,
                description: formData.description,
                productName: productName,
                imageUrl: cloudData.url,
                amID : userId,
                itemID : itemID
            });
            Swal.fire({
                title: 'อัพเดทสำเร็จ!',
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
                <h2 className="h2">Edit Product: {productName}</h2>
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

export default EditP;
