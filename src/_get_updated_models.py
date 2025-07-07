import json
import requests

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

def fetch_model_list():
    response = requests.get("https://storage.sekai.best/sekai-live2d-assets/live2d/model_list.json")
    response.raise_for_status()
    return response.json()

def arrange_models_by_character(models):
    character_data = {}
    for model in models:
        model_prefix = ""
        character = "others"
        if any(cm in model["modelBase"] for cm in character_models.keys()):
            model_prefix = [cm for cm in character_models.keys() if cm in model["modelBase"]][0]
            character = character_models[model_prefix]

        if character in character_data:
            character_data[character].append(model)
            continue
        character_data[character] = [model]
    return character_data

def compare_models(old_models, new_models):
    updated_models = {}
    for character, models in new_models.items():
        if character in old_models:
            new_model_ids = [model["modelName"] for model in models]
            old_model_ids = [model["modelName"] for model in old_models[character]]
            updated_model_ids = [model_id for model_id in new_model_ids if model_id not in old_model_ids]
            if updated_model_ids:
                updated_models[character] = updated_model_ids
    return updated_models

def main():
    print("Fetching models from Sekai Live2D Assets...")
    models = fetch_model_list()
    print("Models fetched successfully.")

    sorted_models = sorted(models, key=lambda x: x["modelBase"]) 

    character_data: dict[str, list[dict]] = arrange_models_by_character(sorted_models)

    with open("new_character.json", "w", encoding="utf-8") as f:
        json.dump(character_data, f, indent=4, ensure_ascii=False)

    old_character_data = {}
    with open("character_sekai.json", "r", encoding="utf-8") as f:
        old_character_data = json.load(f)
    updated_models = compare_models(old_character_data, character_data)

    if not updated_models:
        print("No new models found.")
        return
    
    print("New models found:")
    for character, model_ids in updated_models.items():
        if model_ids:
            print(f"{character}: {model_ids}")

if __name__ == "__main__":
    main()