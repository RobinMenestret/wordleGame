-- -- Crée la base de données 'wordle'. Cette commande doit être exécutée avec les privilèges nécessaires.
-- CREATE DATABASE wordle;

-- -- Se connecte à la base de données 'wordle'. Cette commande est spécifique à psql.
-- \c wordle;

-- -- Assurez-vous que l'extension 'pgcrypto' est installée pour utiliser 'gen_random_uuid()'.
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -- Crée la table 'users'.
-- CREATE TABLE users (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     email VARCHAR(255) UNIQUE NOT NULL,
--     username VARCHAR(50) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     email_verified BOOLEAN DEFAULT FALSE,
--     two_factor_enabled BOOLEAN DEFAULT FALSE,
--     reset_token VARCHAR(255),
--     reset_token_expires BIGINT,
--     is_google_account BOOLEAN DEFAULT FALSE
-- );

-- -- Crée la table 'games'.
-- CREATE TABLE games (
--     id SERIAL PRIMARY KEY,
--     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--     score INT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     searched_word VARCHAR(5)
-- );

-- -- Crée la table 'words'.
-- CREATE TABLE words (
--     id SERIAL PRIMARY KEY,
--     word VARCHAR(5) NOT NULL
-- );

-- Crée la table 'easy_words'.
CREATE TABLE easy_words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(5) NOT NULL
);