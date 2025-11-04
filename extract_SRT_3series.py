#!/usr/bin/env python3
import os
import re
import argparse
from pathlib import Path
from collections import Counter

def extract_text_from_srt(content: str) -> str:
    """Extrait le texte brut d'un fichier SRT"""
    lines = content.split('\n')
    text_lines = []
    for line in lines:
        line = line.strip()
        # Ignorer lignes vides, numéros, timestamps ou coordonnées X/Y/Z
        if not line or line.isdigit() or '-->' in line or re.match(r'[XYZ]\d+:', line):
            continue
        text_lines.append(line)
    return ' '.join(text_lines)

def clean_text(text: str) -> str:
    """Nettoie le texte en supprimant balises et caractères spéciaux"""
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('\u2019', "'").replace('\u2018', "'")
    text = text.replace('\u2013', ' ').replace('\u2014', ' ').replace('\u2212', ' ')
    return text

def count_words_in_file(file_path: Path) -> Counter:
    """Compte les mots d'un fichier SRT"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except:
        return Counter()
    
    text = extract_text_from_srt(content)
    text = clean_text(text).lower()
    tokens = re.findall(r"\w+(?:['-]\w+)*", text, flags=re.UNICODE)
    return Counter(tokens)

def count_words_in_series(series_dir: Path) -> Counter:
    """Compte les mots dans tous les fichiers SRT d'une série (y compris sous-dossiers)"""
    total_counter = Counter()
    for root, dirs, files in os.walk(series_dir):
        for file in files:
            if file.lower().endswith(".srt"):
                file_path = Path(root) / file
                total_counter.update(count_words_in_file(file_path))
    return total_counter

def save_word_count(counter: Counter, output_file: Path):
    with open(output_file, 'w', encoding='utf-8') as f:
        for word, count in counter.most_common():
            f.write(f"{word}:{count}\n")

def main():
    parser = argparse.ArgumentParser(description="Compter les mots dans les fichiers SRT de chaque série")
    parser.add_argument('--data-dir', type=str, required=True,
                        help="Dossier contenant les séries (chaque sous-dossier = une série, éventuellement avec sous-dossiers)")
    args = parser.parse_args()
    
    data_dir = Path(args.data_dir)
    if not data_dir.exists():
        print(f"❌ Dossier introuvable : {data_dir}")
        return

    word_freq_dir = data_dir.parent / "data_word_frequency"
    word_freq_dir.mkdir(exist_ok=True)
    
    # Liste des séries à traiter
    series_list = ["friends", "journeyman", "thepretender"]
    
    for series_name in series_list:
        series_dir = data_dir / series_name
        if not series_dir.exists():
            print(f"⚠️ {series_name}: dossier introuvable")
            continue

        word_counter = count_words_in_series(series_dir)
        if word_counter:
            output_file = word_freq_dir / f"{series_name}.txt"
            save_word_count(word_counter, output_file)
            print(f"✅ {series_name}: {sum(word_counter.values())} mots traités -> {output_file}")
        else:
            print(f"⚠️ {series_name}: aucun fichier SRT trouvé ou vide")

    print("Extraction terminée ! Tous les fichiers texte sont dans data_word_frequency.")

if __name__ == "__main__":
    main()
