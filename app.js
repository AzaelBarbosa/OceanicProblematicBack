const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3350;

const app = express();

app.use(bodyParser.json());

// MySql
const connection = mysql.createConnection({
    host: 'fishsavior.mysql.database.azure.com',
    database: 'fishsaviordb',
    user: 'fishadmin@fishsavior',
    password: 'M@st3rkey'
});

// Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// all locations
app.get('/locations', (req, res) => {
  const sql = "SELECT  *, replace(fishsaviordb.locations.coordenadas,' ','') as coord FROM fishsaviordb.locations";

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});


// all alerts
app.get('/alerts', (req, res) => {
    const sql = "SELECT  * FROM fishsaviordb.alerts";
  
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json(results);
      } else {
        res.send('Not result');
      }
    });
  });

  // alerts by id
app.get('/alerts/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT  * FROM fishsaviordb.alerts WHERE id = ${id}}`;
  
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json(results);
      } else {
        res.send('Not result');
      }
    });
  });


// location by id
app.get('/location/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM fishsaviordb.locations WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('Not result');
    }
  });
});


// add location
app.post('/add', (req, res) => {
  const sql = 'INSERT INTO fishsaviordb.locations SET ?';

  const customerObj = {
    id: req.body.id,
    nombre: req.body.nombre,
    hora: req.body.hora,
    fecha: req.body.fecha,
    coordenadas: req.body.coordenadas,
    altura: req.body.altura,
    temperatura: req.body.temperatura,
    velicidadviento: req.body.velicidadviento,
    observaciones: req.body.observaciones
  };

  connection.query(sql, customerObj, error => {
    if (error) throw error;
    res.send('Location created!');
  });
});


// add alert
app.post('/add', (req, res) => {
    const sql = 'INSERT INTO fishsaviordb.alerts SET ?';
  
    const customerObj = {
      id: req.body.id,
      idalert: req.body.idalert,
      nombre: req.body.nombre,
      hora: req.body.hora,
      fecha: req.body.fecha,
      coordenadas: req.body.coordenadas,
      altura: req.body.altura,
      temperatura: req.body.temperatura,
      velicidadviento: req.body.velicidadviento
    };
  
    connection.query(sql, customerObj, error => {
      if (error) throw error;
      res.send('Alert created!');
    });
  });


app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, city } = req.body;
  const sql = `UPDATE fishsaviordb.locations SET nombre = '${name}' WHERE id =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Location updated!');
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM fishsaviordb.locations WHERE id= ${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Location deleted');
  });
});

// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));