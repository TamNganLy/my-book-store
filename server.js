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
    const result = await db.query("SELECT * FROM book;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
})


// GET book by isbn
app.get("/books/isbn/:id", async(req,res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.query("SELECT * FROM book WHERE id = $1;", [id]);

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
    const result = await db.query("SELECT * FROM book WHERE genre = $1;", [genre]);

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
    const result = await db.query("SELECT * FROM book WHERE LOWER(title) LIKE '%' || $1 || '%';", [title]);

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
app.get("/review/:id", async(req,res) => {
  
})

// POST a book
app.post("/books", async(req,res) => {
  
})

// UPDATE a book (one parameter)
app.patch("/books/:id", async(req,res) => {
  
})

// DELETE a book
app.delete("/books/:id", async(req,res) => {
  
})



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
})