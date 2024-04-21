const express = require('express');
const router = express.Router();
const db = require('../ds').promise();

router.use(express.json());

router.post('/Edit', async (req, res) => {
    try {
        const { ProductName, price, description, productName, imageUrl, amID, itemID } = req.body;

        await db.query('UPDATE products SET name = ?, description = ?, price = ?, photoP = ? WHERE name = ?', [ProductName, description, price, imageUrl, productName]);
        await db.query('INSERT INTO edit_product (itemID, amID) VALUES (?, ?)', [itemID, amID]);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'An error occurred while updating product' });
    }
});

router.post('/Add', async (req, res) => {
    try {
        const { ProductName, Price, description, Size, TypeProduct, imageUrl, amID } = req.body;

        if (!ProductName) {
            return res.status(400).json({ error: 'Product name is required' });
        }


        await db.query('INSERT INTO products (name, description, price, size, product_type, photoP) VALUES (?, ?, ?, ?, ?, ?)', [ProductName, description, Price, Size, TypeProduct, imageUrl]);


        const [rows, fields] = await db.query('SELECT LAST_INSERT_ID() as itemID');
        const itemID = rows[0].itemID;

        await db.query('INSERT INTO add_product (amID, itemID) VALUES (?, ?)', [amID, itemID]);

        res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'An error occurred while adding product' });
    }
});




module.exports = router;
