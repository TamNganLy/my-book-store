// routes.js
import express from "express";
import db from "./DBConfig.js";

const router = express.Router();

// -------------------
// BACKEND API ROUTES
// -------------------

// GET All books
router.get("/API/books", async(req,res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY date_add;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})


// GET book by isbn
router.get("/API/books/isbn/:isbn", async(req,res) => {
  try {
    const isbn = req.params.isbn;
    const result = await db.query("SELECT * FROM books WHERE id = $1;", [isbn]);

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})

// GET book by genre
router.get("/API/books/genre", async(req,res) => {
  try {
    const genre = req.query.genre;
    const result = await db.query("SELECT * FROM books WHERE genre = $1 ORDER BY date_add;", [genre]);

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})

// GET book by name
router.get("/API/books/search", async(req,res) => {
  try {
    const title = req.query.title.toLowerCase();
    const result = await db.query("SELECT * FROM books WHERE LOWER(title) LIKE '%' || $1 || '%' ORDER BY date_add;", [title]);

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})

// GET review by book id
router.get("/API/reviews/:isbn", async(req,res) => {
  try {
    const isbn = req.params.isbn;
    const result = await db.query("SELECT * FROM reviews WHERE book_id = $1 ORDER BY id;", [isbn]);

    if (result.rows.length === 0) {
      return res.status(404).send("There is no review for this book. Please add one.");
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})

// POST a book
router.post("/API/books", async(req,res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const rate = req.body.rate;
  const genre = req.body.genre.toLowerCase();
  const author = req.body.author;

  try {
    const result = await db.query(
      "INSERT INTO books (id, title, description, rate, genre, author) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [id, title, description, rate, genre, author]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    if (err.code === '23505') { // duplicate key
      return res.status(400).send(`The book with the ISBN ${id} has already been added.`);
    }
    
    res.status(500).send("Server error");
  }
});

// POST a review
router.post("/API/reviews", async(req,res) => {
  const book_id = req.body.isbn;
  const review = req.body.review;

  try {
    const result = await db.query(
      "INSERT INTO reviews (book_id, text) VALUES ($1, $2) RETURNING *;",
      [book_id, review]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})

// UPDATE a book (one parameter)
router.patch("/API/books/:isbn", async(req,res) => {
  const isbn = req.params.isbn;
  const title = req.body.updatedTitle || null;
  const author = req.body.updatedAuthor || null;
  const description = req.body.updatedDescription || null;
  const rate = req.body.updatedRate !== undefined && req.body.updatedRate !== "" ? 
    parseInt(req.body.updatedRate) : null;
  const genre = req.body.updatedGenre.toLowerCase() || null;

  try {
    const result = await db.query(
      `UPDATE books
       SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         rate = COALESCE($3, rate),
         genre = COALESCE($4, genre),
         author = COALESCE($5, author)
       WHERE id = $6
       RETURNING *;`,
      [title, description, rate, genre, author, isbn]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})

// UPDATE a review (one parameter)
router.patch("/API/reviews/:id", async(req,res) => {
  const id = parseInt(req.params.id);
  const text = req.body.updatedReview;

  if (!text) {
    return res.status(400).send("No review text provided to update");
  }

  try {
    const result = await db.query(
      `UPDATE reviews SET text = $1 WHERE id = $2 RETURNING *;`,
      [text, id]
    );

      res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})

// DELETE a book
router.delete("/API/books/:isbn", async(req,res) => {
  const deletedId = req.params.isbn;

  try {
    await db.query("DELETE FROM reviews WHERE book_id = $1", [deletedId]);
    await db.query("DELETE FROM books WHERE id = $1", [deletedId]);
    res.status(200).send("Book deleted.");
  } catch (err) {
    res.status(500).send("Server error");
  }
})

// DELETE a review
router.delete("/API/reviews/:id", async(req,res) => {
  const deletedId = parseInt(req.params.id);

  try {
    await db.query("DELETE FROM reviews WHERE id = $1 RETURNING *", [deletedId]);
    res.status(200).send("Review deleted.");
  } catch (err) {
    res.status(500).send("Server error");
  }
})

// Get all genres
router.get("/API/genres", async(req,res) => {
  try {
    const result = await db.query("SELECT DISTINCT genre FROM books ORDER BY genre;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})


export default router;