import psycopg2
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Accéder à la variable d'environnement POSTGRE_MDP
POSTGRE_MDP = os.getenv('POSTGRE_MDP_ONLINE')

# Connexion à la base de données PostgreSQL online
conn = psycopg2.connect(
    dbname="wordle_gtjb", 
    user="wordle_gtjb_user", 
    password="POSTGRE_MDP_ONLINE", 
    host="dpg-cuj4qhaj1k6c73e1uf7g-a.oregon-postgres.render.com", 
    port="5432"
)

cursor = conn.cursor()

# Ouvrir le fichier et filtrer les mots de 5 lettres
batch_size = 100  # Taille du lot
words_batch = []

with open('complete_fr.txt', 'r', encoding='utf-8') as file:
    i = 0
    for line in file:
        i += 1
        print(i)
        word = line.strip()
        if len(word) == 5:
            words_batch.append((word.lower(),))
            print(word)
        # Insérer les mots par lots
        if len(words_batch) >= batch_size:
            cursor.executemany("INSERT INTO words (word) VALUES (%s)", words_batch)
            words_batch = []

# Insérer les mots restants
if words_batch:
    cursor.executemany("INSERT INTO words (word) VALUES (%s)", words_batch)

# Commit les changements et fermer la connexion
conn.commit()
cursor.close()
conn.close()