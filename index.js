import { name } from "ejs";
import express from "express";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

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
    console.log('Received form submission:');
    console.log('Request body:', req.body);


    const name = req.body.name;
    const email = req.body.email;
    const title = req.body.title;
    const content = req.body.content;

       // Here, you can handle the form data as you wish, such as saving it to a database or logging it
       console.log('Submitted form data:');
       console.log('Name:', name);
       console.log('Email:', email);
       console.log('Title:', title);
       console.log('Content:', content);
      
      
    
  });
  
  




 
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  