import json

file = "./sorted_model_list.json"

with open(file, "r", encoding="utf-8") as f:
    model_data: dict = json.load(f)

sorted_models = sorted(model_data, key=lambda x: x["modelBase"]) 

print(sorted_models)

with open("character2.json", "w", encoding="utf-8") as f:
    json.dump(sorted_models, f, indent=4, ensure_ascii=False)