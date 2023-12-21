const client = require("./client.js");
const bodyparser=require('body-parser')
const express=require('express');
const app = express();
app.use(bodyparser.json());

app.get('/', function(req, res)
{
    client.getAllNews({}, (error, response) => {
        if (error) {
          console.error("Error:", error);
        } else {
            res.json(response.news);
          console.log("Received news:", response.news);
        }
      });
})
app.delete('/deletenews', function(req, res) {
    console.log(req.body)
    client.deletenews(
      req.body,
        (error, news) => {
          if (error) throw error;
          console.log(news)
          res.send(news)
          console.log("Successfully created a news.");
        }
      );
})
  client.addNews(
    {
      title: "Title news 3",
      body: "Body content 3",
      postImage: "Image URL here",
    },
    (error, news) => {
      if (error) throw error;
      console.log(news)
      console.log("Successfully created a news.");
    }
  );

app.listen(8000)