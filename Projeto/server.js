const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'CRUD_Maycon_Clientes'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


// Rota para inserir um novo cliente
app.post('/clientes', (req, res) => {
    const { nome, funcao, salario, cep, logradouro, cidade, estado } = req.body;
    const query = 'INSERT INTO clientes (nome, funcao, salario, cep, logradouro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, funcao, salario, cep, logradouro, cidade, estado], (err, result) => {
      if (err) {
        console.error('Erro ao inserir cliente:', err);
        res.status(500).send('Erro ao inserir cliente');
        return;
      }
      console.log('Cliente inserido com sucesso:', result);
      res.status(201).send('Cliente inserido com sucesso');
    });
  });
  
  // Rota para obter todos os clientes
  app.get('/clientes', (req, res) => {
    db.query('SELECT * FROM clientes', (err, result) => {
      if (err) {
        console.error('Erro ao recuperar clientes:', err);
        res.status(500).send('Erro ao recuperar clientes');
        return;
      }
      console.log('Clientes recuperados com sucesso:', result);
      res.status(200).json(result);
    });
  });


  // No arquivo server.js

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// No arquivo server.js (ou onde você configurou seu servidor Node.js)

app.post('/clientes', (req, res) => {
    const { nome, funcao, salario, cep, logradouro, cidade, estado } = req.body;
    const query = 'INSERT INTO clientes (nome, funcao, salario, cep, logradouro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [nome, funcao, salario, cep, logradouro, cidade, estado], (err, result) => {
      if (err) {
        console.error('Erro ao inserir cliente:', err);
        res.status(500).send('Erro ao inserir cliente');
        return;
      }
      console.log('Cliente inserido com sucesso:', result);
      res.status(201).send('Cliente inserido com sucesso');
    });
  });
  