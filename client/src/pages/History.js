import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import styles from '../css/history.module.css';


function PurchaseHistory() {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [reviews, setReviews] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:3001/History/${id}`)
            .then(response => {
                setPurchaseHistory(response.data);
            })
            .catch(error => {
                console.error('Error fetching purchase history:', error);
            });
    }, [id]);

    const handleRatingClick = (purchaseIndex, starIndex) => {
        const updatedPurchaseHistory = [...purchaseHistory];
        updatedPurchaseHistory[purchaseIndex].rating = starIndex + 1;
        setPurchaseHistory(updatedPurchaseHistory);
    };

    const handleReviewSubmit = (purchaseIndex) => {
        const reviewTextElement = document.getElementById(`review${purchaseIndex}`);
        const reviewText = reviewTextElement.value;
        const updatedPurchaseHistory = [...purchaseHistory];
        const reviewData = {
            itemID: purchaseHistory[purchaseIndex].itemID,
            rating: purchaseHistory[purchaseIndex].rating,
            review: reviewText
        };
        axios.post(`http://localhost:3001/reviews/${id}`, reviewData)
            .then(response => {
                console.log('Review submitted successfully:', response.data);
                // Reset review text and rating
                reviewTextElement.value = '';
                updatedPurchaseHistory[purchaseIndex].rating = 0; // Reset rating to 0
                setPurchaseHistory(updatedPurchaseHistory);
                setReviews([...reviews, response.data]);
                Swal.fire({
                    title: 'คอมเมนต์สำเร็จ!',
                    text: 'ขอบคุณที่แสดงความคิดเห็นของคุณ',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                });
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });
    };


    return (
        <div className={styles.wrap}>
            <h1>Purchase history</h1>
            {purchaseHistory.map((purchase, purchaseIndex) => (
                <div className={styles['wrap-item']} key={purchaseIndex}>
                    <div className={styles.item}>
                        <div className={styles.left}>
                            <img className={styles['img-product']} src={purchase.photoP} alt={purchase.productName} />
                            <div className={styles.details}>
                                <p className={styles.head}>{purchase.name}</p>
                                <p className={styles.state}>Price : {purchase.price}</p>
                                <p className={styles.ddt}>Size : {purchase.size}</p>
                                <p className={styles.count}>x{purchase.quantity_product}</p>
                                <p className={styles.state}>TrackID : {purchase.trackID}</p>
                                <p className={styles.state}>DATE : {purchase.Date_time}</p>
                                <p className={styles.state}>Payment methods : {purchase.Payment_method}</p>
                                <p className={styles.state}>Logistic : {purchase.LogisName}</p>
                                <p className={styles.state}>Logistic cost : {purchase.Logiscost}</p>
                            </div>
                        </div>
                        <div className={styles.right}>
                            <p>{(purchase.price * purchase.quantity_product) + purchase.Logiscost} THB</p>
                        </div>
                    </div>
                    <div className={styles['wrap-review']}>
                        <div>
                            <form id={`reviewForm${purchaseIndex}`} className={styles['review-form']}>
                                <div className={styles['form-group']}>
                                    <label htmlFor={`rating${purchaseIndex}`}>Review:</label>
                                    <textarea className={styles['form-control']} id={`review${purchaseIndex}`} rows="3" placeholder="Enter your review here..."></textarea>
                                </div>
                                <div className={styles['form-group']}>
                                    <div className={styles['rating-box']}>
                                        <label htmlFor={`rating${purchaseIndex}`} className={styles.howwas}>How was your experience?</label>
                                        <div className={styles.stars}>
                                            {[...Array(5)].map((_, starIndex) => (
                                                <i
                                                    key={starIndex}
                                                    className={`fa-solid fa-star ${starIndex < purchase.rating ? styles.active : ''}`}
                                                    onClick={() => handleRatingClick(purchaseIndex, starIndex)}
                                                ></i>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-dark" onClick={() => handleReviewSubmit(purchaseIndex)}>Submit Review</button>
                            </form>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PurchaseHistory;
