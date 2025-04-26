import os

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

files = os.listdir()

for folder in folders:
    if folder in files:
        continue
    os.mkdir(folder)