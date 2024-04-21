const express = require('express');
const router = express.Router();
const db = require('../ds'); // น่าจะเป็นการเชื่อมต่อกับฐานข้อมูล

router.use(express.json()); // เรียกใช้ middleware เพื่อให้ Express รับข้อมูล JSON

router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params; // รับ id จาก URL
        const { itemID, rating, review } = req.body; // รับข้อมูลรีวิวจาก request body

        // ทำการบันทึกข้อมูลรีวิวลงในฐานข้อมูล
        db.query('INSERT INTO review (itemID , id , description , ratingR ) VALUES (?, ?, ?, ?)', [itemID,id,review,rating], (err, results) => {
            if (err) {
                console.error('Error adding review:', err.stack);
                res.status(500).send('Error adding review');
                return;
            }
            console.log('Review added successfully');
            res.status(200).send('Review added successfully');
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Error adding review');
    }
});

module.exports = router;
