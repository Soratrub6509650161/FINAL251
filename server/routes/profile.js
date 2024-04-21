const express = require('express');
const router = express.Router(); // 
const db = require('../ds');

router.use(express.json()); // 

router.get('/:id', async (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params; 
    let { fname, mname, lname, username, Tel, email, gender, province, street, zipcode, district, about } = req.body; // รับข้อมูลที่ต้องการอัปเดต

    const formData = { fname, mname, lname, username, Tel, email, gender, province, street, zipcode, district, about };
    
    try {
        db.query('UPDATE users SET ? WHERE id = ?', [formData, id], (err, results) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ' + err.stack);
                res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
                return;
            }
            console.log('ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
            res.status(200).send('ข้อมูลถูกอัปเดตเรียบร้อยแล้ว');
        });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
});





module.exports = router;
