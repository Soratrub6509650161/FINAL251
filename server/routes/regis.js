const express = require('express');
const router = express.Router();
const db = require('../ds'); // น่าจะเป็นการเชื่อมต่อกับฐานข้อมูล

router.use(express.json()); // เรียกใช้ middleware เพื่อให้ Express รับข้อมูล JSON

router.post('/', async (req, res) => {
    try {
        const userData = req.body; 
        const { fname, mname, lname, username, Password, Tel, email, gender, province, street, zipcode, district, about } = userData;
        
        // สร้างคำสั่ง SQL เพื่อใส่ข้อมูลลงในฐานข้อมูล
        const sql = `INSERT INTO users (fname, mname, lname, username, Password, Tel, email, gender, province, street, zipcode, district, about) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // Execute SQL query
        db.query(sql, [fname, mname, lname, username, Password, Tel, email, gender, province, street, zipcode, district, about], (err, results) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
                res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
            } else {
                res.status(201).json({ message: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
            }
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการรับข้อมูล:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการรับข้อมูล' });
    }
});

module.exports = router;
