
const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
    res.send("Welcome to Mamatha Bookstore Management!");
});

// READ: Get all books
app.get("/books", (req, res) => {
    db.query("SELECT * FROM books", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// READ: Get one book
app.get("/books/:book_id", (req, res) => {
    db.query(
        "SELECT * FROM books WHERE book_id = ?",
        [req.params.book_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.json(results[0]);
        }
    );
});
//CREATE: ADD A BOOK
app.post("/books", (req, res) => {
    const { book_id, title, author, category, price, stock } = req.body;

    if (
        book_id === undefined || book_id === "" ||
        !title || !author || !category ||
        price === undefined || price === "" ||
        stock === undefined || stock === ""
    ) {
        return res.status(400).json({
            message: "Please enter all required fields"
        });
    }

    const sql = `INSERT INTO books
        (book_id, title, author, category, price, stock)
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [book_id, title, author, category, price, stock],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Book added successfully!",
                book_id: book_id
            });
        }
    );
});

// UPDATE: Edit a book
app.put("/books/:book_id", (req, res) => {
    const { title, author, category, price, stock } = req.body;

    if (
        !title || !author || !category ||
        price === undefined || price === "" ||
        stock === undefined || stock === ""
    ) {
        return res.status(400).json({
            message: "Please enter all required fields"
        });
    }

    const sql = `UPDATE books
        SET title=?, author=?, category=?, price=?, stock=?
        WHERE book_id=?`;

    db.query(
        sql,
        [title, author, category, price, stock, req.params.book_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.json({ message: "Book updated successfully!" });
        }
    );
});



// DELETE: Remove a book
app.delete("/books/:book_id", (req, res) => {
    db.query(
        "DELETE FROM books WHERE book_id = ?",
        [req.params.book_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Book not found" });
            }
            res.json({ message: "Book deleted successfully!" });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
