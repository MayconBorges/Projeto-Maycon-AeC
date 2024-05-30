CREATE DATABASE Crud_Maycon_AEC;

USE Crud_Maycon_AEC;


CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    funcao VARCHAR(100),
    salario DECIMAL(10, 2),
    cep VARCHAR(10),
    logradouro VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(100)
);


SELECT * FROM Crud_Maycon_AEC
