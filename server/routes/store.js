const express = require('express');
const router = express.Router(); // 
const db = require('../ds');

router.use(express.json()); // แก้ไขบรรทัดนี้

router.get('/', async (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        res.json(results);
    });
});


module.exports = router;
