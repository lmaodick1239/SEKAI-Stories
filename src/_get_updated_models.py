import json
import requests

output_file = "./sorted_model_list.json"
models: list = requests.get("https://storage.sekai.best/sekai-live2d-assets/live2d/model_list.json").json()
character_models = {
    "01ichika":"ichika",
    "02saki":"saki",
    "03honami":"honami",
    "04shiho":"shiho",
    "05minori":"minori",
    "06haruka":"haruka",
    "07airi":"airi",
    "08shizuku":"shizuku",
    "09kohane":"kohane",
    "10an":"an",
    "11akito":"akito",
    "12touya":"touya",
    "13tsukasa":"tsukasa",
    "14emu":"emu",
    "15nene":"nene",
    "16rui":"rui",
    "17kanade":"kanade",
    "18mafuyu":"mafuyu",
    "19ena":"ena",
    "20mizuki":"mizuki",
    "21miku":"miku",
    "22rin":"rin",
    "23len":"len",
    "24luka":"luka",
    "25meiko":"meiko",
    "26kaito":"kaito",
}

sorted_models = sorted(models, key=lambda x: x["modelBase"]) 

character_data: dict[str, list] = {}

for model in sorted_models:
    model_prefix = ""
    character = "others"
    if any(cm in model["modelBase"] for cm in character_models.keys()):
        model_prefix = [cm for cm in character_models.keys() if cm in model["modelBase"]][0]
        character = character_models[model_prefix]

    if character in character_data:
        character_data[character].append(model)
        continue
    character_data[character] = [model]

with open("new_character.json", "w", encoding="utf-8") as f:
    json.dump(character_data, f, indent=4, ensure_ascii=False)