require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;
const host = '0.0.0.0';


// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Create a route to handle the form submission
app.post('/process_form', (req, res) => {
  const { full_name, email, phone_number, web_site, message } = req.body; // Retrieve other form fields if needed
  const terms = req.body.terms;
  
  
  // Check if terms are accepted
  if (!terms) {
    return res.status(400).send('Please accept the terms and conditions.');
  }


  // Execute the SQL statement to insert the form data into the database
  const sql = 'INSERT INTO contact (full_name, email, phone_number, web_site, message) VALUES (?, ?, ?, ?, ?)';
  // Add other columns and form fields to the SQL statement if needed
  pool.query(sql, [full_name, email, phone_number, web_site, message], (error, results) => {
    if (error) {
      console.error('Error: ', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Form submitted successfully');
    }
  });
});

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (you can specify a specific origin instead of '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // Allow the specified HTTP methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allow the specified headers
  next();
});

// Start the server
app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
