import os
import argparse
import json

data = {
    "background": {},
    "cards": []
}

file_convention = {
    "general": "bg_a",
    "mmj": "bg_b",
    "vbs": "bg_c",
    "wxs": "bg_d",
    "n25": "bg_e",
    "ln": "bg_f",
    "vs": "bg_g",
    "split": "bg_h",
    "temp": "bg_i",
    "cards": "bg_s"
}

def convert(starting_dir, compressed_dir, preview_dir, save_json):
    x = sorted(os.listdir(f'./{starting_dir}/'))
    if not os.path.exists(compressed_dir):
        os.mkdir(compressed_dir)
    if not os.path.exists(preview_dir):
        os.mkdir(preview_dir)

    for file in x:
        if file.lower().endswith(('.jpg', '.png')):
            filename = os.path.splitext(file)[0]
            if not save_json:
                os.system("cls")
                print(f"Processing {file}")

                compressed_path = os.path.join(compressed_dir, f"{filename}.jpg")
                preview_path = os.path.join(preview_dir, f"{filename}.jpg")
                input_path = os.path.join(starting_dir, file)
                os.system(f'ffmpeg -hide_banner -loglevel error -n -i "{input_path}" -vf scale=300:-1 "{preview_path}" ')
                os.system(f'ffmpeg -hide_banner -loglevel error -n -i "{input_path}" "{compressed_path}"')
            
            for key, prefix in file_convention.items():
                if filename.startswith(prefix):
                    if key == "cards":
                        data["cards"].append(filename)
                    else:
                        if not key in data["background"]:
                            data["background"][key] = []
                        data["background"][key].append(filename)
                    break
    
    with open("_background.json", 'w') as f:
        json.dump(data, f, indent=4)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="compress and make low-res jpg preview")
    parser.add_argument("starting_dir", help="directory containing images to convert")
    parser.add_argument("--compressed_dir", help="directory to save compressed jpg", default="./background_compressed/")
    parser.add_argument("--preview_dir", help="directory to save low preview jpg", default="./background_low_jpg/")
    parser.add_argument("--json", help="only save json", action="store_true")

    args = parser.parse_args()
    
    convert(args.starting_dir, args.compressed_dir, args.preview_dir, args.json)