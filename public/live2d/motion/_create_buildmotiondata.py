import os
import json
import argparse

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

def create(dir: str):
    files = os.listdir(f"./{dir}")

    data = {
        "expressions": [],
        "motions": []
    }

    for file in files:
        if not ".motion3.json" in file:
            continue

        file = file.removesuffix(".motion3.json")
        if "face_" in file:
            data["expressions"].append(file)
            continue
        
        data["motions"].append(file)

    with open(f"./{dir}/BuildMotionData.json", "w") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    
if __name__ == "__main__":
    for folder in folders:
        create(folder)