import unicodedata

def remove_accents(word):
    return ''.join(
        (c for c in unicodedata.normalize('NFD', word) if unicodedata.category(c) != 'Mn')
    )

def filter_words(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as infile:
        words = infile.readlines()

    filtered_words = [
        remove_accents(word.strip()) for word in words if len(word.strip()) == 5
    ]

    with open(output_file, 'w', encoding='utf-8') as outfile:
        for word in filtered_words:
            outfile.write(word.lower() + '\n')

if __name__ == "__main__":
    input_file = 'liste_francais.txt'  # Remplacez par le chemin de votre fichier d'entrée
    output_file = 'output.txt'  # Remplacez par le chemin de votre fichier de sortie
    filter_words(input_file, output_file)