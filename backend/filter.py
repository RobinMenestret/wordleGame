import psycopg2

# Connexion à la base de données PostgreSQL
conn = psycopg2.connect(
    dbname="wordle", 
    user="postgres", 
    password="", 
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
