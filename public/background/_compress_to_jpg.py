import os

x = os.listdir()

for file in x:
    if "jpg" in file or "png" in file:
        filename = file.split('.')[0]
        print(filename)
        os.system("clear")
        print(f"Processing {file}")
        os.system(f"ffmpeg -n -i {file} ../background_compressed/{filename}.jpg")