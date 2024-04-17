import { name } from "ejs";
import express from "express";
import sql from "mssql";
import config from './config.cjs';

const app = express();
const port = 3000;

let selectedPost = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  // Connect to the database
  sql.connect(config)
    .then(pool => {
      console.log('Connected to SQL Server database');

      // Create a new request object
      const request = pool.request();

      // Define the SQL query
      const query = 'SELECT * FROM Posts';

      // Execute the query
      return request.query(query);
    })
    .then(result => {
      //console.log('Fetched posts:', result.recordset); // Log the fetched posts

      // Check if any posts were fetched
      const posts = result.recordset || [];

      // Reverse the order of posts to display the newest at the top
      const reversedPosts = posts.reverse();

      // Render the EJS template with the reversed posts
      res.render("index.ejs", { posts: reversedPosts });

      // Close the SQL connection after rendering the template
      sql.close();
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      // Render the EJS template with an empty array (or handle the error differently)
      res.render("index.ejs", { posts: [] });

      // Close the SQL connection in case of error
      sql.close();
    });
});

  

app.get("/write", (req, res)=> {
  res.render("write.ejs")
});

app.post("/submit", (req, res) => {
  
  const today = new Date();
  today = date.toDateString();
 
  const post = ({
      name: req.body.name,
      code: req.body.code,
      email:  req.body.email,
      title: req.body.title,
      content: req.body.content,
      date : today
  });

  // Here, you can handle the form data as you wish, such as saving it to a database or logging it
  //console.log('Submitted form data:');
  //console.log('Post:', post);
  // console.log('Submitted:', submitted);
  //console.log('today:', today);

  // Redirect or render a thank you page
 res.redirect('/');

  // Connect to the database
  sql.connect(config)
  .then(pool => {
    console.log('Connected to SQL Server database');

    // Create a new request object
    const request = pool.request();

    // Define the SQL query with parameters
    const query = `
      INSERT INTO posts (Name, Code, Email, Title, Content, Date)
      VALUES (@name, @code, @email, @title, @content, @date)
    `;

    // Add parameters to the request
    request.input('name', sql.NVarChar, post.name);
    request.input('code', sql.NVarChar, post.code);
    request.input('email', sql.NVarChar, post.email);
    request.input('title', sql.NVarChar, post.title);
    request.input('content', sql.NVarChar, post.content);
    request.input('date', sql.DateTime, post.date);

    // Execute the query
    return request.query(query);
  })
  .then(result => {
    console.log('Post inserted successfully');
    sql.close();
  })
  .catch(err => {
    console.error('Error inserting post:', err);
    sql.close();
  });


});
  


app.get('/blog/:postId', (req, res) => {
  const postId = req.params.postId;
  
  sql.connect(config)
    .then(pool => {
      const request = pool.request();
      const query = 'SELECT * FROM Posts WHERE id = @postId';
      request.input('postId', sql.Int, postId);
      return request.query(query);
    })
    .then(result => {
      const post = result.recordset[0]; // Assuming postId is unique
      selectedPost = {
        id: post.id,
        title: post.title,
        code: post.code,
        name: post.name,
        date: post.date,
        content: post.content
        // Add other properties as needed
        
      };
      
      res.render('selected.ejs', { selectedPost: selectedPost });
      sql.close();
    })
    .catch(err => {
      console.error('Error fetching post data:', err);
      // Handle error rendering selected post page
      res.status(500).send('Error fetching post data');
      sql.close();
    });


  app.get("/delete", (req, res)=> {
    res.render("delete.ejs")

    app.post("/delete-code", (req, res) => {
      const enteredCode = req.body.code;
      console.log(enteredCode + selectedPost.code);

      if(enteredCode.trim() == selectedPost.code.trim()){
      sql.connect(config)
      .then(pool => {
        console.log('Connected to SQL Server database');
    
        // Create a new request object
        const request = pool.request();
    
        // Define the SQL query with parameters
        const deleteQuery = `
          DELETE FROM posts WHERE code = @enteredCode
        `;
        
        // Bind the parameter
        request.input('enteredCode', sql.NVarChar, enteredCode);
        
        // Execute the query
        return request.query(deleteQuery);
      })
      .then(result => {
        console.log('Post deleted successfully');
        sql.close();
        res.render("index.ejs")
      })
      .catch(err => {
        console.error('Error inserting post:', err);
        sql.close();
      });
    }
    else
    {
      console.log("wrong code")
    } 
  
    
  });




  });





});


/*  
app.get("/delete", (req, res)=> {
  res.render("delete.ejs")
});

  app.post("/delete-code", (req, res) => {
    const enteredCode = req.body.code;
     if(enteredCode == selectedPost.code){
    sql.connect(config)
    .then(pool => {
      console.log('Connected to SQL Server database');
  
      // Create a new request object
      const request = pool.request();
  
      // Define the SQL query with parameters
      const deleteQuery = `
        DELETE FROM posts WHERE code = @code
      `;
  
      // Execute the query
      return request.query(deleteQuery,[enteredCode]);
    })
    .then(result => {
      console.log('Post deleted successfully');
      sql.close();
    })
    .catch(err => {
      console.error('Error inserting post:', err);
      sql.close();
    });
  }
  else
  {
    console.log("wrong code")
  } 

  
});*/



    
  






















app.get("/edit", (req, res)=> {
  res.render("edit.ejs")
});



 
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
  