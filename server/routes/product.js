const express = require('express');
const router = express.Router();
const db = require('../ds').promise();

router.use(express.json());

router.post('/Edit', async (req, res) => {
    try {
        const { ProductName, price, description, productName, imageUrl, amID, itemID, size, countproduct } = req.body;
     
            await db.query('UPDATE products SET name = ?, description = ?, price = ?, photoP = ? WHERE name = ?', [ProductName, description, price, imageUrl, productName]);

            const [existingProduct] = await db.query('SELECT * FROM products WHERE name = ? AND size = ?', [productName, size]);

            if (existingProduct) {
                await db.query('UPDATE products SET total_amount = ? WHERE name = ? AND size = ?', [countproduct, productName, size]);
            } else {
                res.status(400).json({ error: 'This item does not have the selected size' });
                return;
            }
        

        await db.query('INSERT INTO edit_product (itemID, amID) VALUES (?, ?)', [itemID, amID]);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'An error occurred while updating product' });
    }
});



router.post('/Add', async (req, res) => {
    try {
        const { ProductName, Price, description, Size, TypeProduct,countproduct, imageUrl, amID } = req.body;

        if (!ProductName) {
            return res.status(400).json({ error: 'Product name is required' });
        }

        console.log(countproduct)
        await db.query('INSERT INTO products (name, description, price, size, product_type, total_amount,photoP) VALUES (?, ?, ?, ?, ?, ?, ?)', [ProductName, description, Price, Size, TypeProduct, countproduct,imageUrl]);


        const [rows, fields] = await db.query('SELECT LAST_INSERT_ID() as itemID');
        const itemID = rows[0].itemID;

        await db.query('INSERT INTO add_product (amID, itemID) VALUES (?, ?)', [amID, itemID]);

        res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'An error occurred while adding product' });
    }
});

router.delete('/delete/:name', async (req, res) => {
    const { name } = req.params;

    try {
        // ส่งคำสั่ง SQL ไปยังฐานข้อมูลเพื่อลบข้อมูลที่มี itemID เท่ากับ id ที่ระบุ
        const result = await db.query("DELETE FROM products WHERE name = ?", [name]);

        // ตรวจสอบว่ามีการลบข้อมูลหรือไม่
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // ส่งข้อความแจ้งผลลัพธ์กลับไปยัง client
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;
