const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ProgramozasKarrier2023',
  database: 'db1',
});

// Create a route to handle the form submission
app.post('/process_form', (req, res) => {
  const { full_name, email, phone_number, web_site, message } = req.body;
  // Retrieve other form fields if needed

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
