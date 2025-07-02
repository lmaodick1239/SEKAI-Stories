import json

def load_keys(json_data, parent_key=""):
    keys = []
    for key, value in json_data.items():
        full_key = f"{parent_key}.{key}" if parent_key else key
        keys.append(full_key)
        if isinstance(value, dict):
            keys.extend(load_keys(value, full_key))
    return keys

def main():
    en_json = "./en-US.json"
    with open(en_json, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    en_keys = load_keys(en_data)

    json_locales = [
        "./es-ES.json", 
        "./fil-PH.json",
        "./pl-PL.json",
        "./zh-CN.json"
    ]

    for locale in json_locales:
        with open(locale, "r", encoding="utf-8") as f:
            locale_data = json.load(f)

        locale_keys = load_keys(locale_data)

        missing_keys = set(en_keys) - set(locale_keys)
        if missing_keys:
            print(f"Missing keys in {locale}:")
            for key in sorted(missing_keys):
                print(f"  {key}")
        else:
            print(f"All keys are present in {locale}.")

if __name__ == "__main__":
    main()
