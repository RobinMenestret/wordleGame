import psycopg2
from dotenv import load_dotenv
import os

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Accéder à la variable d'environnement POSTGRE_MDP
POSTGRE_MDP = os.getenv('POSTGRE_MDP')

# ...votre code existant...
# Connexion à la base de données PostgreSQL
conn = psycopg2.connect(
    dbname="wordle", 
    user="postgres", 
    password=POSTGRE_MDP, 
    host="localhost", 
    port="5432"
)
cursor = conn.cursor()

# Ouvrir le fichier et filtrer les mots de 5 lettres
with open('words.txt', 'r', encoding= "utf8") as file:
    for line in file:
        word = line.strip()
        if len(word) == 5:  # Vérifier si le mot fait 5 lettres
            # Insérer le mot dans la table
            cursor.execute("INSERT INTO words (word) VALUES (%s)", (word.lower(),))

# Commit les changements et fermer la connexion
conn.commit()
cursor.close()
conn.close()
