import os

x = os.listdir()

for file in x:
    if "jpg" in file or "png" in file:
        filename = file.split('.')[0]
        os.system("clear")
        print(f"Processing {file}")
        os.system(f"ffmpeg -n -i {file} -vf scale=300:-1 ../background_low_jpg/{filename}.jpg")