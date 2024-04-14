import { name } from "ejs";
import express from "express";
import sql from "mssql";
import config from './config.cjs';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

let submitted = false;




// Connect to the database
sql.connect(config)
  .then(pool => {
    console.log('Connected to SQL Server database');
    // Query data or perform other database operations here
  })
  .catch(err => {
    console.error('Error connecting to SQL Server database:', err);
});






app.get("/", (req, res)=> {
  res.render("index.ejs")
});
  
  
/*   app.get("/blogs", (req, res)=> {
    res.render("blogs.ejs")
  }); */

app.get("/write", (req, res)=> {
  res.render("write.ejs")
});


  app.post("/submit", (req, res) => {
    
    const today = new Date();
    submitted = true;

    const post = ({
       name: req.body.name,
       email:  req.body.email,
       title: req.body.title,
       content: req.body.content,
       date : today
    });


   

    // Here, you can handle the form data as you wish, such as saving it to a database or logging it
    console.log('Submitted form data:');
    console.log('Post:', post);

    console.log('Submitted:', submitted);
    console.log('today:', today);

    // Redirect or render a thank you page
    res.render("index.ejs", {locals: post});
  
});
  
  




 
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  