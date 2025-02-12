import unidecode

def read_words_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        return set(unidecode.unidecode(word.strip()) for word in file.readlines())

def write_words_to_file(filepath, words):
    with open(filepath, 'w', encoding='utf-8') as file:
        for word in words:
            file.write(word + '\n')

def filter_words():
    words_fr = read_words_from_file('words_fr.txt')
    list_of_french_words = read_words_from_file('listOfFrenchWords.txt')

    # Filtrer les mots de 5 lettres qui ne sont pas déjà présents dans words_fr
    filtered_words = [word for word in list_of_french_words if len(word) == 5 and unidecode.unidecode(word) not in words_fr]

    # Écrire les mots filtrés dans complete_fr.txt
    write_words_to_file('complete_fr.txt', filtered_words)

if __name__ == '__main__':
    filter_words()