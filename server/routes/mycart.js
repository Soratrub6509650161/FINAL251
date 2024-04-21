const express = require('express');
const router = express.Router();
const db = require('../ds');

router.use(express.json());


router.get('/', async (req, res) => {
    const userId = req.query.userId; 

    db.query('SELECT products.itemID, products.name, products.price, products.size, cart.quantity, products.photoP FROM products JOIN cart ON products.itemID = cart.itemId WHERE cart.id = ?', [userId], (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        res.json(results);
    });
});


router.put('/decrease', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    db.query('SELECT * FROM cart WHERE id = ? AND itemID = ?', [userId, productId], (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('ไม่พบสินค้าในตะกร้าของผู้ใช้');
            return;
        }

        const currentQuantity = results[0].quantity;

        // ตรวจสอบว่าสามารถลดจำนวนสินค้าได้หรือไม่
        if (currentQuantity <= 1) {
            res.status(400).send('ไม่สามารถลดจำนวนสินค้าได้เกินจำนวนที่กำหนด');
            return;
        }

        // ลดจำนวนสินค้าในตะกร้าของผู้ใช้
        db.query('UPDATE cart SET quantity = ? WHERE id = ? AND itemId = ?', [currentQuantity - 1, userId, productId], (err, result) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า: ' + err.stack);
                res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
                return;
            }
            res.status(200).send('ลดจำนวนสินค้าในตะกร้าสำเร็จ');
        });
    });
});

router.put('/increase', async (req, res) => {
    const { userId, productId } = req.body;
  
    // ทำการอัปเดตจำนวนสินค้าในตะกร้าของผู้ใช้ โดยเพิ่มทีละ 1
    db.query('UPDATE cart SET quantity = quantity + 1 WHERE id = ? AND itemId = ?', [userId, productId], (err, result) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า: ' + err.stack);
        res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).send('ไม่พบสินค้าในตะกร้าของผู้ใช้');
        return;
      }
  
      res.status(200).send('อัปเดตจำนวนสินค้าในตะกร้าสำเร็จ');
    });
});

router.post('/remove', async (req, res) => {
    const { userId, productId } = req.body;
  
    // ลบสินค้าออกจากตะกร้าของผู้ใช้
    db.query('DELETE FROM cart WHERE id = ? AND itemId = ?', [userId, productId], (err, result) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการลบสินค้า: ' + err.stack);
        res.status(500).send('เกิดข้อผิดพลาดในการลบสินค้า');
        return;
      }
  
      if (result.affectedRows === 0) {
        res.status(404).send('ไม่พบสินค้าในตะกร้าของผู้ใช้');
        return;
      }
  
      res.status(200).send('ลบสินค้าออกจากตะกร้าสำเร็จ');
    });
  });
  

  
  














module.exports = router;
