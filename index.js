const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require ('cors')
const app = express();






app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies, sessions)
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = mysql.createConnection({
  host: 'localhost',
  user:"root",
    password: '',
    database: 'crpms'
});
// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});



// Insert data into the Service table
app.post('/addservice', (req, res) => {
  const { ServiceCode, ServiceNumber, ServicePrice } = req.body;
  const sql = 'INSERT INTO Service (ServiceCode, ServiceNumber, ServicePrice) VALUES (?, ?, ?)';
  db.query(sql, [ServiceCode, ServiceNumber, ServicePrice], (err, result) => {
    if (err) {
      console.error('Error inserting data into the Service table:', err);
      res.status(500).json({ error: 'Error inserting data into the Service table' });
      return;
    }
    res.status(200).json({ message: 'Data inserted successfully into Service table', result });
  });
});

app.post('/addcar', (req, res) => {
  const { PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
  const sql = 'INSERT INTO Car (PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName], (err, result) => {
    if (err) {
      console.error('Error inserting data into the Car table:', err);
      res.status(500).json({ error: 'Error inserting data into the Car table' });
      return;
    }
    res.status(200).json({ message: 'Car added successfully', result });
  });
});

// Insert data into the ServiceRecord table
app.post('/addservicerecord', (req, res) => {
  const { RecordNumber, ServiceDate, ServiceCode, PlateNumber } = req.body;

  // Check if ServiceCode exists
  const checkServiceSql = 'SELECT * FROM Service WHERE ServiceCode = ?';
  db.query(checkServiceSql, [ServiceCode], (err, serviceResult) => {
    if (err) {
      console.error('Error checking ServiceCode:', err);
      res.status(500).json({ error: 'Error checking ServiceCode' });
      return;
    }

    if (serviceResult.length === 0) {
      res.status(400).json({ error: `ServiceCode ${ServiceCode} does not exist` });
      return;
    }

    // Check if PlateNumber exists
    const checkCarSql = 'SELECT * FROM Car WHERE PlateNumber = ?';
    db.query(checkCarSql, [PlateNumber], (err, carResult) => {
      if (err) {
        console.error('Error checking PlateNumber:', err);
        res.status(500).json({ error: 'Error checking PlateNumber' });
        return;
      }

      if (carResult.length === 0) {
        res.status(400).json({ error: `PlateNumber ${PlateNumber} does not exist` });
        return;
      }

      // Insert into ServiceRecord
      const sql = 'INSERT INTO ServiceRecord (RecordNumber, ServiceDate, ServiceCode, PlateNumber) VALUES (?, ?, ?, ?)';
      db.query(sql, [RecordNumber, ServiceDate, ServiceCode, PlateNumber], (err, result) => {
        if (err) {
          console.error('Error inserting data into the ServiceRecord table:', err);
          res.status(500).json({ error: 'Error inserting data into the ServiceRecord table' });
          return;
        }
        res.status(200).json({ message: 'Data inserted successfully into ServiceRecord table', result });
      });
    });
  });
});
app.get('/cars', (req, res) => {
  const sql = 'SELECT * FROM Car';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching cars:', err);
      res.status(500).json({ error: 'Error fetching cars' });
      return;
    }
    res.status(200).json(result);
  });
});


app.put('/updatecar/:PlateNumber', (req, res) => {
  const { PlateNumber } = req.params;
  const { type, Model, ManufacturingYear, DriverPhone, MechanicName } = req.body;
  const sql = 'UPDATE Car SET type = ?, Model = ?, ManufacturingYear = ?, DriverPhone = ?, MechanicName = ? WHERE PlateNumber = ?';
  db.query(sql, [type, Model, ManufacturingYear, DriverPhone, MechanicName, PlateNumber], (err, result) => {
    if (err) {
      console.error('Error updating car:', err);
      res.status(500).json({ error: 'Error updating car' });
      return;
    }
    res.status(200).json({ message: 'Car updated successfully', result });
  });
});

app.delete('/deletecar/:PlateNumber', (req, res) => {
  const { PlateNumber } = req.params;
  const sql = 'DELETE FROM Car WHERE PlateNumber = ?';
  db.query(sql, [PlateNumber], (err, result) => {
    if (err) {
      console.error('Error deleting car:', err);
      res.status(500).json({ error: 'Error deleting car' });
      return;
    }
    res.status(200).json({ message: 'Car deleted successfully', result });
  });
});
// Insert data into the Payment table
app.post('/addpayment', (req, res) => {
  const { PaymentNumber, AmountPaid, PaymentDate, RecordNumber } = req.body;
  const sql = 'INSERT INTO Payment (PaymentNumber, AmountPaid, PaymentDate, RecordNumber) VALUES (?, ?, ?, ?)';
  db.query(sql, [PaymentNumber, AmountPaid, PaymentDate, RecordNumber], (err, result) => {
    if (err) {
      console.error('Error inserting data into the Payment table:', err);
      res.status(500).json({ error: 'Error inserting data into the Payment table' });
      return;
    }
    res.status(200).json({ message: 'Data inserted successfully into Payment table', result });
  });
});

app.get('/getcar', (req, res) => {
  const sql = 'SELECT * FROM car';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).json({ error: 'Error fetching data from the database' });
      return;
    }
    else{
    res.status(200).json(result);
    }
  });
});

 
// Get all data from the Service table
app.get('/getservices', (req, res) => {
  const sql = 'SELECT * FROM Service';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data from the Service table:', err);
      res.status(500).json({ error: 'Error fetching data from the Service table' });
      return;
    }
    res.status(200).json(result);
  });
});

// Get all data from the Car table
app.get('/getcars', (req, res) => {
  const sql = 'SELECT * FROM Car';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data from the Car table:', err);
      res.status(500).json({ error: 'Error fetching data from the Car table' });
      return;
    }
    res.status(200).json(result);
  });
});

// Get all data from the ServiceRecord table
app.get('/getservicerecords', (req, res) => {
  const sql = 'SELECT * FROM ServiceRecord';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data from the ServiceRecord table:', err);
      res.status(500).json({ error: 'Error fetching data from the ServiceRecord table' });
      return;
    }
    res.status(200).json(result);
  });
});

// Get all data from the Payment table
app.get('/getpayments', (req, res) => {
  const sql = 'SELECT * FROM Payment';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching data from the Payment table:', err);
      res.status(500).json({ error: 'Error fetching data from the Payment table' });
      return;
    }
    res.status(200).json(result);
  });
});

// Retrieve all records from the ServiceRecord table
app.get('/servicerecords', (req, res) => {
  const sql = 'SELECT * FROM ServiceRecord';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving data from the ServiceRecord table:', err);
      res.status(500).json({ error: 'Error retrieving data from the ServiceRecord table' });
      return;
    }
    res.status(200).json(result);
  });
});

// Update a specific record in the ServiceRecord table
app.put('/updateservicerecord/:RecordNumber', (req, res) => {
  const { RecordNumber } = req.params;
  const { ServiceDate, ServiceCode, PlateNumber } = req.body;
  const sql = 'UPDATE ServiceRecord SET ServiceDate = ?, ServiceCode = ?, PlateNumber = ? WHERE RecordNumber = ?';
  db.query(sql, [ServiceDate, ServiceCode, PlateNumber, RecordNumber], (err, result) => {
    if (err) {
      console.error('Error updating data in the ServiceRecord table:', err);
      res.status(500).json({ error: 'Error updating data in the ServiceRecord table' });
      return;
    }
    res.status(200).json({ message: 'ServiceRecord updated successfully', result });
  });
});

// Delete a specific record from the ServiceRecord table
app.delete('/deleteservicerecord/:RecordNumber', (req, res) => {
  const { RecordNumber } = req.params;
  const sql = 'DELETE FROM ServiceRecord WHERE RecordNumber = ?';
  db.query(sql, [RecordNumber], (err, result) => {
    if (err) {
      console.error('Error deleting data from the ServiceRecord table:', err);
      res.status(500).json({ error: 'Error deleting data from the ServiceRecord table' });
      return;
    }
    res.status(200).json({ message: 'ServiceRecord deleted successfully', result });
  });
});



const bcrypt = require('bcrypt');

// Register a new user
app.post('/register', async (req, res) => {
  const { Username, Password } = req.body;
console.log(Username, Password);

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(Password, 10);

    const sql = 'INSERT INTO User (Username, Password) VALUES (?, ?)';
    db.query(sql, [Username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Error registering user' });
        return;
      }
      res.status(200).json({ message: 'User registered successfully', result });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Error hashing password' });
  }
});





app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ status: 400, message: "Username and password are required" });
  }

  const sql = `SELECT * FROM User WHERE Username = ?`;

  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ status: 500, message: "Internal server error", error: err });
    }

    // Check if user exists
    if (result.length === 0) {
      return res.status(401).json({ status: 401, message: "Invalid username or password" });
    }

    const user = result[0];

    try {
      // Compare the provided password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(password, user.Password);

      if (isPasswordMatch) {
        // Set session data
        req.session.userlogin = true;
        req.session.userId = user.id;
        req.session.username = user.Username;

        return res.status(200).json({
          status: 200,
          message: "Login successful",
          data: { username: user.Username },
        });
      } else {
        return res.status(401).json({ status: 401, message: "Invalid username or password" });
      }
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return res.status(500).json({ status: 500, message: "Error comparing passwords", error });
    }
  });
});

// Get daily report
app.get('/dailyreport', (req, res) => {
  const sql = `
    SELECT 
      Car.PlateNumber,
      Service.ServiceNumber,
      Service.ServicePrice,
      Payment.AmountPaid,
      Payment.PaymentDate
    FROM 
      ServiceRecord
    INNER JOIN 
      Car ON ServiceRecord.PlateNumber = Car.PlateNumber
    INNER JOIN 
      Service ON ServiceRecord.ServiceCode = Service.ServiceCode
    INNER JOIN 
      Payment ON ServiceRecord.RecordNumber = Payment.RecordNumber
    WHERE 
      Payment.PaymentDate = CURDATE(); -- Filter for today's date
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching daily report:', err);
      res.status(500).json({ error: 'Error fetching daily report' });
      return;
    }
    res.status(200).json(result);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});