const express = require('express');
const router = express.Router();
const db = require('../ds');

router.use(express.json());

// Endpoint เพิ่มเข้ามาใหม่สำหรับดึงรีวิวและข้อมูลสินค้า
router.get('/', async (req, res) => {
    try {
        // ดึงรายการ itemID ทั้งหมด
        const itemIDs = await new Promise((resolve, reject) => {
            db.query('SELECT DISTINCT itemID FROM review', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.map(row => row.itemID));
                }
            });
        });

        const itemsData = await Promise.all(itemIDs.map(async (itemID) => {
            const [reviews, productsData] = await Promise.all([
                // สืบค้นรีวิวและข้อมูลผู้ใช้
                new Promise((resolve, reject) => {
                    db.query('SELECT review.*, users.username FROM review INNER JOIN users ON review.id = users.id WHERE review.itemID = ?', [itemID], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                }),
                // สืบค้นข้อมูลสินค้า
                new Promise((resolve, reject) => {
                    db.query('SELECT products.name, products.photoP FROM products WHERE itemID = ?', [itemID], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results[0]); 
                        }
                    });
                })
            ]);
            
            // คำนวณค่าเฉลี่ย rating
            const totalRating = reviews.reduce((total, review) => total + review.ratingR, 0);
            const averageRating = totalRating / reviews.length;
        
            return { itemID, reviews, productsData, averageRating };
        }));
        
        
        


        // ส่งผลลัพธ์กลับเป็น array object
        res.json(itemsData);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + error.stack);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
});

module.exports = router;
