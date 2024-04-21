const express = require('express');
const router = express.Router(); 
const db = require('../ds');

router.use(express.json()); 

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

router.get('/byId/:id', async (req, res) => {
    const itemID = req.params.id; // เปลี่ยนชื่อตัวแปรเป็น itemID

    db.query('SELECT * FROM products WHERE itemID = ?', [itemID], (err, results) => { // ใช้ itemID แทน id
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        res.json(results);
    }); 
});




router.post('/', async (req, res) => {
    const { name, price, description } = req.body; 
    const product = { name, price ,  description }; 
    
    db.query('INSERT INTO products SET ?', product, (err, result) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
            return;
        }
        res.status(201).send('เพิ่มสินค้าเรียบร้อยแล้ว');
    });
});

module.exports = router;
