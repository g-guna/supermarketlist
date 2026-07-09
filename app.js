const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');

const app = express();

// ==========================
// Middleware
// ==========================
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// ==========================
// Multer Configuration
// ==========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

// ==========================
// MySQL Connection
// ==========================
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RP738964$',
    database: 'c237_supermarketapp'
});

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
app.post('/addProduct', upload.single('image'), (req, res) => {

    const { name, quantity, price } = req.body;

    let image = null;

    if (req.file) {
        image = req.file.filename;
    }

    const sql = `
        INSERT INTO products
        (productName, quantity, price, image)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [name, quantity, price, image],
        (error) => {

            if (error) {
                console.error(error);
                return res.send('Error adding product');
            }

            res.redirect('/');

        }
    );

});

// ==========================
// SHOW UPDATE PRODUCT PAGE
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
app.post('/updateProduct/:id', upload.single('image'), (req, res) => {

    const id = req.params.id;

    const { name, quantity, price, currentImage } = req.body;

    let image = currentImage;

    if (req.file) {
        image = req.file.filename;
    }

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
        (error) => {

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

    connection.query(sql, [id], (error) => {

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

    console.log(`Server running at http://localhost:${PORT}`);

});