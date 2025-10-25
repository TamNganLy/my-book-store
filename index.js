import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    // console.log(response.data);
    res.render("index.ejs", {
      nav: "main",
      books: response.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const book_response = await axios.get(`${API_URL}/books/${isbn}`);
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
      reviewMessage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
