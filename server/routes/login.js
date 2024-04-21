// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../ds');

router.use(express.json());

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบในตาราง users (ผู้ใช้ทั่วไป)
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, userResults) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูลผู้ใช้: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการค้นหาข้อมูลผู้ใช้');
            return;
        }
        if (userResults.length > 0) {
            res.status(200).json({ success: true, userId: userResults[0].id, userType: 'user', message: 'เข้าสู่ระบบสำเร็จ' });
            return;
        }

        db.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password], (err, adminResults) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการค้นหาข้อมูลผู้ดูแลระบบ: ' + err.stack);
                res.status(500).send('เกิดข้อผิดพลาดในการค้นหาข้อมูลผู้ดูแลระบบ');
                return;
            }
            if (adminResults.length > 0) {
                res.status(200).json({ success: true, userId: adminResults[0].amID, userType: 'admin', message: 'เข้าสู่ระบบสำเร็จ' });
            } else {
                res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
            }
        });
    });
});

module.exports = router;
