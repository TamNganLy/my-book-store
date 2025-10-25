import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", async(req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    // console.log(response.data);
    res.render("index.ejs", {books: response.data})
  } catch(err) {
    
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});