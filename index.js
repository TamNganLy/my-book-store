import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

const footer = [
  [{
    title: "Home",
    id: "hero"
  },
  {
    title: "Books",
    id: "books_grid",
  }],
  [{
    title: "Book Detail",
    id: "book-detail"
  },
  {
    title: "Reviews",
    id: "reviews",
  }  ]   
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

let genres = await fetchGenre();

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books`);

    // let footer = [
    //   {
    //     title: "Home",
    //     id: "hero"
    //   },
    //   {
    //     title: "Books",
    //     id: "books_grid",
    //   }   
    // ];
    
    res.render("index.ejs", {
      nav: "main",
      books: response.data,
      genres,
      footer: footer[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/genre/:genre", async (req, res) => {
  const genre = req.params.genre;

  try {
    const response = await axios.get(`${API_URL}/books/genre`, {
      params: {genre: genre}
    });

    // let footer = [
    //   {
    //     title: "Home",
    //     id: "hero"
    //   },
    //   {
    //     title: "Books",
    //     id: "books_grid",
    //   }   
    // ];
    
    res.render("index.ejs", {
      nav: "main",
      books: response.data,
      genres,
      footer: footer[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/search", async (req, res) => {
  const title = req.query.search

  try {
    const response = await axios.get(`${API_URL}/books/search`, {
      params: {title: title}
    });
    
    res.render("index.ejs", {
      nav: "main",
      books: response.data,
      genres,
      footer: footer[0]
    });
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.data);

      return res.render("index.ejs", {
        nav: "main",
        genres,
        error: err.response?.data,
        footer: footer[0]
      });
    } else {
      console.error(err);
    }
    res.status(500).send("Server error");
  }
});

app.get("/add-book", async (req, res) => {
  res.render("index.ejs", {
      nav: "add-book",
      genres
    });
});

app.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const book_response = await axios.get(`${API_URL}/books/isbn/${isbn}`);
    const book = book_response.data[0];

    let reviews = [];
    let reviewMessage = null;
    
    try {
      const review_response = await axios.get(`${API_URL}/reviews/${isbn}`);
      reviews = review_response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        reviewMessage = err.response.data;
      } else {
        throw err;
      }
    }
    
    res.render("index.ejs", {
      nav: "book",
      book,
      reviews,
      reviewMessage,
      genres,
      footer: footer[1]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/add-book", async(req, res) => {
  try {
    await axios.post(`${API_URL}/books`, req.body);
    genres = await fetchGenre();
    res.redirect("/");
  } catch (error) {
    console.error(error.response?.data);
    res.render("index.ejs", {
      nav: "add-book",
      error: error.response?.data,
      new_book: req.body
    });
  }
})

app.post("/isbn/:isbn/edit-book", async(req, res) => {
    const isbn = req.params.isbn;

  try {
    await axios.patch(`${API_URL}/books/${isbn}`, req.body);
    genres = await fetchGenre();
    res.redirect(`/isbn/${isbn}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error edit book" });
  }
})

app.post("/isbn/:isbn/delete-book", async(req, res) => {
  const isbn = req.params.isbn;

  try {
    await axios.delete(`${API_URL}/books/${isbn}`);
    genres = await fetchGenre();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error delete book" });
  }
})


app.post("/isbn/:isbn/add-review", async(req, res) => {
    const isbn = req.params.isbn;

  try {
    await axios.post(`${API_URL}/reviews`, req.body);
    res.redirect(`/isbn/${isbn}`);
  } catch (error) {
    res.status(500).json({ message: "Error creating review" });
  }
})

app.post("/isbn/:isbn/edit-review", async(req, res) => {
    const isbn = req.params.isbn;
    const id = req.body.id;

  try {
    await axios.patch(`${API_URL}/reviews/${id}`, req.body);
    res.redirect(`/isbn/${isbn}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error edit review" });
  }
})

app.post("/isbn/:isbn/delete-review", async(req, res) => {
    const isbn = req.params.isbn;
    const id = req.body.id;

  try {
    await axios.delete(`${API_URL}/reviews/${id}`);
    res.redirect(`/isbn/${isbn}`);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error delete review" });
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/********************/
// Helper Functions */
/********************/

async function fetchGenre() {
  try {
    const response = await axios.get(`${API_URL}/genres`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error: ", error.message);
  }
}