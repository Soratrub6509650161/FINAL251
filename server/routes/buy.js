const express = require('express');
const router = express.Router();
const db = require('../ds');

router.use(express.json());



router.get('/:id', async (req, res) => {
    const { id } = req.params;

    db.query('SELECT products.itemID, products.name, products.price, products.size, cart.quantity, products.photoP FROM products JOIN cart ON products.itemID = cart.itemId WHERE cart.id = ?', [id], (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        res.json(results);
    });
});


router.post('/:id', async (req, res) => {
    const userId = req.params.id;
    const paymentMethod = req.body.paymentMethod;
    const thaiDateTime = req.body.thaiDateTime;

    try {
        // 1. ดึงรายการสินค้าในตะกร้าของผู้ใช้
        db.query('SELECT * FROM cart WHERE id = ?', [userId], (err, cartItems) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า: ' + err.stack);
                res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า');
                return;
            }

            cartItems.forEach(item => {
                const itemId = item.itemID;
                const quantity = item.quantity;

                // ดึงจำนวนสินค้าในตารางสินค้า
                db.query('SELECT * FROM products WHERE itemID = ?', [itemId], (err, product) => {
                    if (err) {
                        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า: ' + err.stack);
                        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
                        return;
                    }

                    if (product.length === 0) {
                        console.error('ไม่พบสินค้าที่ต้องการอัปเดต: ' + itemId);
                        res.status(404).send('ไม่พบสินค้าที่ต้องการอัปเดต');
                        return;
                    }

                    const currentStock = product[0].total_amount;
                    const updatedStock = currentStock - quantity;

                    // อัปเดตจำนวนสินค้าในตารางสินค้า
                    db.query('UPDATE products SET total_amount = ? WHERE itemID = ?', [updatedStock, itemId], (err, result) => {
                        if (err) {
                            console.error('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า: ' + err.stack);
                            res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า');
                            return;
                        }
                        console.log('อัปเดตจำนวนสินค้าเรียบร้อยแล้ว');
                    });
                });
            });

            // 2. Insert สินค้าที่ซื้อไปยังตารางสินค้าที่ถูกซื้อแล้ว
            cartItems.forEach(item => {
                const { itemID , quantity } = item;
                db.query('INSERT INTO purchased_products (itemID,id,Payment_method,Date_time,LogisName,Logiscost,quantity_product) VALUES (?, ?, ?, ?, ?, ?, ?)', [itemID,userId, paymentMethod,thaiDateTime,"Kerry",35,quantity], (err, result) => {
                    if (err) {
                        console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลสินค้าที่ถูกซื้อแล้ว: ' + err.stack);
                        res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มข้อมูลสินค้าที่ถูกซื้อแล้ว');
                        return;
                    }
                    console.log('เพิ่มข้อมูลสินค้าที่ถูกซื้อแล้วเรียบร้อยแล้ว');
                });
            });

            // 3. ลบรายการสินค้าในตะกร้า
            db.query('DELETE FROM cart WHERE id = ?', [userId], (err, result) => {
                if (err) {
                    console.error('เกิดข้อผิดพลาดในการลบรายการสินค้าในตะกร้า: ' + err.stack);
                    res.status(500).send('เกิดข้อผิดพลาดในการลบรายการสินค้าในตะกร้า');
                    return;
                }
                console.log('ลบรายการสินค้าในตะกร้าเรียบร้อยแล้ว');

                res.status(200).send('ทำการสั่งซื้อสินค้าเรียบร้อยแล้ว');
            });
        });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).send('เกิดข้อผิดพลาดในการประมวลผลคำสั่ง');
    }
});





module.exports = router;