import os 
import json

folders = [
    "01ichika",
    "02saki",
    "03honami",
    "04shiho",
    "05minori",
    "06haruka",
    "07airi",
    "08shizuku",
    "09kohane",
    "10an",
    "11akito",
    "12touya",
    "13tsukasa",
    "14emu",
    "15nene",
    "16rui",
    "17kanade",
    "18mafuyu",
    "19ena",
    "20mizuki",
    "21miku",
    "22rin",
    "23len",
    "24luka",
    "25meiko",
    "26kaito"
]

data = {}

for folder in folders:
    models = os.listdir(f'./{folder}')

    character = folder.lstrip("0123456789")

    data[character] = models

with open("character.json", 'w') as f:
    json.dump(data, f, indent=4)