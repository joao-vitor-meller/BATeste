-- Tabela usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) UNIQUE, -- CPF (11 dígitos),
    cnpj VARCHAR(14) UNIQUE,  -- CPF ou CNPJ (com até 14 caracteres)
);

-- Tabela estados
CREATE TABLE estados (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sigla CHAR(2) NOT NULL
);

-- Tabela cidades
CREATE TABLE cidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    id_estado INT NOT NULL,
    FOREIGN KEY (id_estado) REFERENCES estados(id) ON DELETE CASCADE
);

-- Tabela propriedades
CREATE TABLE propriedades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    id_cidade INT NOT NULL,
    area_total DECIMAL(10, 2) NOT NULL CHECK (area_total > 0),
    area_agricultavel DECIMAL(10, 2) NOT NULL CHECK (area_agricultavel >= 0),
    area_vegetacao DECIMAL(10, 2) NOT NULL CHECK (area_vegetacao >= 0),
    FOREIGN KEY (id_cidade) REFERENCES cidades(id) ON DELETE CASCADE
);

-- Tabela propriedades_usuarios
CREATE TABLE propriedades_usuarios (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_propriedade INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_propriedade) REFERENCES propriedades(id),
    CONSTRAINT unique_usuario_propriedade UNIQUE (id_usuario, id_propriedade) -- Evita duplicidade
);

-- Tabela safras
CREATE TABLE safras (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL, -- Nome da safra (ex.: Safra 2021)
    ano INT NOT NULL
);

-- Tabela culturas
CREATE TABLE culturas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL -- Nome da cultura (ex.: Soja, Milho)
);

-- Tabela propriedades_safras
CREATE TABLE propriedades_safras (
    id SERIAL PRIMARY KEY,
    id_propriedade INT NOT NULL,
    id_safra INT NOT NULL,
    FOREIGN KEY (id_propriedade) REFERENCES propriedades(id) ON DELETE CASCADE,
    FOREIGN KEY (id_safra) REFERENCES safras(id) ON DELETE CASCADE
);

-- Tabela propriedades_safras_culturas
CREATE TABLE propriedades_safras_culturas (
    id SERIAL PRIMARY KEY,
    id_propriedade_safra INT NOT NULL,
    id_cultura INT NOT NULL,
    FOREIGN KEY (id_propriedade_safra) REFERENCES propriedades_safras(id) ON DELETE CASCADE,
    FOREIGN KEY (id_cultura) REFERENCES culturas(id) ON DELETE CASCADE,
    CONSTRAINT unique_propriedade_safra_cultura UNIQUE (id_propriedade_safra, id_cultura) -- Evita duplicidade
);

-- INSERTS de dados para testes

-- Inserindo dados na tabela usuarios
INSERT INTO usuarios (nome, cpf) VALUES
('João Silva', '12345678901'),
('Maria Oliveira', '98765432100'),
('Pedro Santos', '45678912300');

-- Inserindo dados na tabela estados
INSERT INTO estados (nome, sigla) VALUES
('São Paulo', 'SP'),
('Minas Gerais', 'MG'),
('Paraná', 'PR');

-- Inserindo dados na tabela cidades
INSERT INTO cidades (nome, id_estado) VALUES
('São Paulo', 1),
('Belo Horizonte', 2),
('Curitiba', 3),
('Campinas', 1),
('Uberlândia', 2);

-- Inserindo dados na tabela propriedades
INSERT INTO propriedades (nome, id_cidade, area_total, area_agricultavel, area_vegetacao) VALUES
('Fazenda Boa Vista', 1, 500.00, 300.00, 200.00),
('Fazenda Primavera', 2, 800.00, 600.00, 200.00),
('Fazenda Vale Verde', 3, 1200.00, 1000.00, 200.00);

-- Inserindo dados na tabela propriedades_usuarios
INSERT INTO propriedades_usuarios (id_usuario, id_propriedade) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Inserindo dados na tabela safras
INSERT INTO safras (nome, ano) VALUES
('Safra 2021', 2021),
('Safra 2022', 2022),
('Safra 2023', 2023);

-- Inserindo dados na tabela culturas
INSERT INTO culturas (nome) VALUES
('Soja'),
('Milho'),
('Trigo'),
('Café');

-- Inserindo dados na tabela propriedades_safras
INSERT INTO propriedades_safras (id_propriedade, id_safra) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 2);

-- Inserindo dados na tabela propriedades_safras_culturas
INSERT INTO propriedades_safras_culturas (id_propriedade_safra, id_cultura) VALUES
(1, 1), -- Soja para a safra da propriedade 1
(1, 2), -- Milho para a safra da propriedade 1
(2, 3), -- Trigo para a safra da propriedade 2
(3, 4), -- Café para a safra da propriedade 3
(4, 1), -- Soja para a safra da propriedade 4
(5, 2); -- Milho para a safra da propriedade 5
