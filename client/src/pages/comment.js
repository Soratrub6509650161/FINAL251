import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/comments.css'

const Comments = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:3001/comments`).then((response) => {
            setProducts(response.data);
            setLoading(false);
        }).catch((error) => {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล: ', error);
            setLoading(false);
        });
    }, []);

    return (
        <div className="wrap container">
            <h1>Comments</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="wrap-item1">
                    {products.map((product, index) => (
                        <div className="item" key={index}>
                            <div className="left">
                                <img className="img-product" src={product.productsData.photoP} alt="Product" />
                                <div className="details">
                                    <p className="head">{product.productsData.name}</p>
                                    <div className="wrap-rating">
                                    <i class="fa-solid fa-star"></i>
                                    <p>{product.averageRating.toFixed(1)} / 5</p>
                                    </div>
                                </div>
                            </div>
                            <div className="wrap-comment">
                                {product.reviews.map((review, index) => (
                                    <div className="comment-box" key={index}>
                                        <p>{review.description} - {review.username}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comments;
