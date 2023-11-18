// Servidor Backend en Express.js
// Siempre que se actulice el package-lock.json y package.json
// ejecutar npm install
// Para correr el servidor ejecutar >node server.js

let express = require('express');
let mysql = require('mysql');
let app = express();
// Se agrega la libreria Cors dado que tiraba errores al hacer los requests desde la app
// de Angular
const cors = require('cors');
var corsOptions = {
  origin: 'http://localhost:4200', // solo permite este origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // metodos permitidos
  optionsSuccessStatus: 200 // status
 }
app.use(cors(corsOptions));

// Toma las variables del archivo local para seguridad 
require('dotenv').config({ debug: true });
// console.log(process.env);
let db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER, // importante crear el usuario y dar privilegios para acceder a mydb
  password: process.env.DB_PASS, // y colocar esta password
  database: 'mydb'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado al Database');
});

app.get('/api/productos', (req, res) => {
  let sql = 'SELECT gp.id_producto, p.nombre, g.nombre AS nombreGondola, '+
   'pres.desc_presentacion FROM Gondola_Producto AS gp INNER JOIN producto AS '+
   'p on gp.id_producto = p.id_producto INNER JOIN gondola AS g on gp.id_gondola = g.id_gondola '+
   'INNER JOIN presentacion AS pres on gp.Presentacion_id_presentacion = pres.id_presentacion'
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

app.get(`/api/productos/repositor/id_repo`, (req, res) => {
  const idRepositor = req.params.id;
  let sql = 'SELECT gp.id_producto, p.nombre, g.nombre AS nombreGondola,'+
   'pres.desc_presentacion FROM Gondola_Producto AS gp INNER JOIN producto AS '+
   'p on gp.id_producto = p.id_producto INNER JOIN gondola AS g on gp.id_gondola = g.id_gondola'+
   'INNER JOIN presentacion AS pres on gp.Presentacion_id_presentacion = pres.id_presentacion'+
   'INNER JOIN Gondola_Productor_Repositor AS gpr on gp.id_producto = gpr.id_producto'+
   `AND gp.id_gondola = gpr.id_gondola WHERE gpr.id_repositor = ?`
  db.query(sql, [idRepositor], (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });  
});

app.get(`/api/productos/sector/${id_sect}`, (req, res) => {
  let sql = 'SELECT gp.id_producto, p.nombre, g.nombre AS nombreGondola, pres.desc_presentacion, g.id_sector FROM Gondola_Producto AS gp'+ 
  'INNER JOIN producto AS p on gp.id_producto = p.id_producto INNER JOIN gondola AS g on gp.id_gondola = g.id_gondola'+
  `INNER JOIN presentacion AS pres on gp.Presentacion_id_presentacion = pres.id_presentacion WHERE g.id_sector = ${id_sect}` 
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });  
});


/* const usuarioJSON$ = this.httpClient.get<UsuarioJSON>(
  `${REST_SERVER_URL}/Usuario/${UsuarioLogin.getInstance().id}`
) */

/* 'SELECT gp.id_producto, p.nombre, g.nombre AS nombreGondola, pres.desc_presentacion, g.id_sector FROM Gondola_Producto AS gp'+ 
'INNER JOIN producto AS p on gp.id_producto = p.id_producto INNER JOIN gondola AS g on gp.id_gondola = g.id_gondola'+
`INNER JOIN presentacion AS pres on gp.Presentacion_id_presentacion = pres.id_presentacion WHERE g.id_sector = ${id_sector}` */

app.get('/api/sectores', (req, res) => {
  let sql = 'SELECT id_sector, desc_sector FROM Sector';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
 });

app.get('/api/repositores', (req, res) => {
  let sql = 'SELECT id_repositor, nombre FROM Repositor';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
 });

app.get('/api/repositores/:id', (req, res) => {
  const idRepositor = req.params.id;
  const query = 'SELECT * FROM Repositor WHERE id_repositor = ?';

  db.query(query, [idRepositor], (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});


app.listen('3000', () => {
  console.log('Server corriendo en el puerto 3000');
});
