const express = require('express');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RP738964$',
    database: 'c237_supermarketapp'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


// ==========================
// HOME PAGE
// ==========================
app.get('/', (req, res) => {

    const sql = 'SELECT * FROM products';

    connection.query(sql, (error, results) => {

        if (error) {
            console.error(error);
            return res.send('Error retrieving products');
        }

        res.render('index', {
            products: results
        });

    });

});


// ==========================
// PRODUCT DETAILS
// ==========================
app.get('/product/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'SELECT * FROM products WHERE productId = ?';

    connection.query(sql, [id], (error, results) => {

        if (error) {
            console.error(error);
            return res.send('Error retrieving product');
        }

        res.render('product', {
            product: results[0]
        });

    });

});


// ==========================
// SHOW ADD PRODUCT PAGE
// ==========================
app.get('/addProduct', (req, res) => {

    res.render('addProduct');

});


// ==========================
// ADD PRODUCT
// ==========================
app.post('/addProduct', (req, res) => {

    const { name, quantity, price, image } = req.body;

    const sql = `
        INSERT INTO products
        (productName, quantity, price, image)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [name, quantity, price, image],
        (error, results) => {

            if (error) {
                console.error(error);
                return res.send('Error adding product');
            }

            res.redirect('/');

        }
    );

});


// ==========================
// SHOW UPDATE PAGE
// ==========================
app.get('/updateProduct/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'SELECT * FROM products WHERE productId = ?';

    connection.query(sql, [id], (error, results) => {

        if (error) {
            console.error(error);
            return res.send('Error retrieving product');
        }

        res.render('updateProduct', {
            product: results[0]
        });

    });

});


// ==========================
// UPDATE PRODUCT
// ==========================
app.post('/updateProduct/:id', (req, res) => {

    const id = req.params.id;

    const { name, quantity, price, image } = req.body;

    const sql = `
        UPDATE products
        SET
            productName = ?,
            quantity = ?,
            price = ?,
            image = ?
        WHERE productId = ?
    `;

    connection.query(
        sql,
        [name, quantity, price, image, id],
        (error, results) => {

            if (error) {
                console.error(error);
                return res.send('Error updating product');
            }

            res.redirect('/');

        }
    );

});


// ==========================
// DELETE PRODUCT
// ==========================
app.get('/deleteProduct/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'DELETE FROM products WHERE productId = ?';

    connection.query(sql, [id], (error, results) => {

        if (error) {
            console.error(error);
            return res.send('Error deleting product');
        }

        res.redirect('/');

    });

});


// ==========================
// START SERVER
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});