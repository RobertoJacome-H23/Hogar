const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:3333'
}));
// Middleware para parsear JSON
app.use(express.json());


// Conexión a la base de datos
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tareashogardb'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});

// Ruta para obtener las tareas
app.get('/tareas', (req, res) => {
  connection.query('SELECT * FROM tarea', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener las tareas por id 
app.get('/tareas/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM tarea WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Tarea no encontrada' });
      return;
    }
    res.json(results[0]);
  });
});

// Ruta para registrar las tareas
app.post('/tareas', (req, res) => {
  const { nombre, descripcion, fecha_creacion, fecha_vencimiento, estado, prioridad, responsable, notas } = req.body;
  connection.query(
    'INSERT INTO tarea (nombre, descripcion, fecha_creacion, fecha_vencimiento, estado, prioridad, responsable, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre, descripcion, fecha_creacion, fecha_vencimiento, estado, prioridad, responsable, notas],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: results.insertId, nombre, descripcion, fecha_creacion, fecha_vencimiento, estado, prioridad, responsable, notas });
    }
  );
});

// Ruta para editar las tareas
app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fecha_creacion, fecha_vencimiento, estado, prioridad, responsable, notas } = req.body;
  connection.query(
    'UPDATE tarea SET nombre = ?, descripcion = ?, fecha_creacion = ?, fecha_vencimiento = ?, estado = ?, prioridad = ?, responsable = ?, notas = ? WHERE id = ?',
    [nombre, descripcion, fecha_creacion, fecha_vencimiento, estado, prioridad, responsable, notas, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.sendStatus(204);
    }
  );
});

// Ruta para borrar las tareas
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tarea WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.sendStatus(204);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
