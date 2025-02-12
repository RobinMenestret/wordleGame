def read_words_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        return set(word.strip() for word in file.readlines())

def write_words_to_file(filepath, words):
    with open(filepath, 'w', encoding='utf-8') as file:
        for word in words:
            file.write(word + '\n')

def find_unique_words(easy_words, complete_words):
    # Trouver les mots qui sont dans easy_fr.txt mais pas dans complete_fr.txt
    unique_words = easy_words - complete_words
    return sorted(unique_words)  # Trier les mots pour une meilleure lisibilité

def main():
    # Lire les mots des fichiers easy_fr.txt et complete_fr.txt
    easy_words = read_words_from_file('easy_fr.txt')
    complete_words = read_words_from_file('complete_fr.txt')

    # Trouver les mots uniques
    unique_words = find_unique_words(easy_words, complete_words)

    # Écrire les mots uniques dans un nouveau fichier
    write_words_to_file('unique_easy_words.txt', unique_words)

if __name__ == '__main__':
    main()