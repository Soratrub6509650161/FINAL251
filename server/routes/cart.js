const express = require('express');
const router = express.Router();  
const db = require('../ds');


router.use(express.json()); 

router.post('/add', async (req, res) => {
    const { userId, productId, productName, productPrice, size } = req.body;

    db.query('SELECT * FROM products WHERE name = ? AND size = ?', [productName, size], (err, results) => {
        if (err) {
            console.error('Error searching product:', err.stack);
            res.status(500).send('Error searching product');
            return;
        }

        if (results.length === 0 || results[0].total_amount === 0) {
            console.log('Product not found or out of stock');
            res.status(404).send('Product not found or out of stock');
            return;
        }
        

        const productId = results[0].itemID;

        // ตรวจสอบว่ามีสินค้านี้อยู่ในตะกร้าของผู้ใช้แล้วหรือไม่
        db.query('SELECT * FROM cart WHERE id = ? AND itemID = ?', [userId, productId], (err, results) => {
            if (err) {
                console.error('Error checking cart:', err.stack);
                res.status(500).send('Error checking cart');
                return;
            }

            if (results.length > 0) {
                // ถ้ามีสินค้านี้อยู่ในตะกร้าแล้ว ให้เพิ่มจำนวนสินค้า
                db.query('UPDATE cart SET quantity = quantity + 1 WHERE id = ? AND itemID = ?', [userId, productId], (err, results) => {
                    if (err) {
                        console.error('Error updating cart:', err.stack);
                        res.status(500).send('Error updating cart');
                        return;
                    }
                    console.log('Product quantity updated in cart');
                    res.status(200).send('Product quantity updated in cart');
                });
            } else {
                // ถ้ายังไม่มีสินค้านี้ในตะกร้า ให้เพิ่มสินค้าใหม่
                db.query('INSERT INTO cart (id, itemID, productName, productPrice, quantity) VALUES (?, ?, ?, ?, 1)', [userId, productId, productName, productPrice], (err, results) => {
                    if (err) {
                        console.error('Error adding product to cart:', err.stack);
                        res.status(500).send('Error adding product to cart');
                        return;
                    }
                    console.log('Product added to cart');
                    res.status(200).send('Product added to cart');
                });
            }
        });
    });
});

module.exports = router;
