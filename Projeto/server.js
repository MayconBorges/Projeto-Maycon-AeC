const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'Crud_Maycon_AEC'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Rota para criar um novo usuário
app.post('/criar-usuario', (req, res) => {
  const { nome, email } = req.body;

  // Insira os dados no banco de dados
  db.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email], (err, result) => {
    if (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).send('Erro ao criar usuário');
      return;
    }
    console.log('Usuário criado com sucesso:', result);
    res.status(201).send('Usuário criado com sucesso');
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
