import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mybookStore',
  password: '1234',
  port: 5432
})

db.connect();


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// GET All books
app.get("/books", async(req,res) => {
  try {
    const result = await db.query("SELECT * FROM books;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})


// GET book by isbn
app.get("/books/:isbn", async(req,res) => {
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
app.get("/books/genre", async(req,res) => {
  try {
    const genre = req.query.genre;
    const result = await db.query("SELECT * FROM books WHERE genre = $1;", [genre]);

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
app.get("/books/search", async(req,res) => {
  try {
    const title = req.query.search.toLowerCase();
    const result = await db.query("SELECT * FROM books WHERE LOWER(title) LIKE '%' || $1 || '%';", [title]);

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
app.get("/reviews/:isbn", async(req,res) => {
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
app.post("/books", async(req,res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;
  const rate = req.body.rate;
  const genre = req.body.genre;

  try {
    const result = await db.query(
      "INSERT INTO books (id, title, description, rate, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [id, title, description, rate, genre]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST a review
app.post("/reviews", async(req,res) => {
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
app.patch("/books/:isbn", async(req,res) => {
  const isbn = req.params.isbn;
  const title = req.body.updatedTitle || null;
  const description = req.body.updatedDescription || null;
  const rate = req.body.updatedRate !== undefined && req.body.updatedRate !== "" ? 
    parseInt(req.body.updatedRate) : null;
  const genre = req.body.updatedGenre || null;

  try {
    const result = await db.query(
      `UPDATE books
       SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         rate = COALESCE($3, rate),
         genre = COALESCE($4, genre)
       WHERE id = $5
       RETURNING *;`,
      [title, description, rate, genre, isbn]
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
app.patch("/reviews/:id", async(req,res) => {
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
app.delete("/books/:isbn", async(req,res) => {
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
app.delete("/reviews/:id", async(req,res) => {
  const deletedId = parseInt(req.params.id);

  try {
    await db.query("DELETE FROM reviews WHERE id = $1 RETURNING *", [deletedId]);
    res.status(200).send("Review deleted.");
  } catch (err) {
    res.status(500).send("Server error");
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
})