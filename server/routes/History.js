const express = require('express');
const router = express.Router();
const db = require('../ds');

router.use(express.json());


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    db.query('SELECT products.itemID, products.name, products.price, products.size, purchased_products.quantity_product, products.photoP, purchased_products.Date_time, purchased_products.Payment_method, purchased_products.LogisName, purchased_products.Logiscost FROM products JOIN purchased_products ON products.itemID = purchased_products.itemID WHERE purchased_products.id = ?', [id], (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + err.stack);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        res.json(results);
    });
});


module.exports = router;