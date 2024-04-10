import express from "express";

const app = express();
const port = 3000;
app.use(express.static("public"));

app.get("/", (req, res)=> {
  res.render("blogs.ejs")
  });
  
  app.get("/about", (req, res)=> {
    res.render("about.ejs")
  });
  
  app.get("/blogs", (req, res)=> {
    res.render("blogs.ejs")
  });

  app.get("/write", (req, res)=> {
    res.render("write.ejs")
  });
  
  
 
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  