import os
import json

list = os.listdir("./")
data = {
    "background": []
}

for i in list:
    if i.endswith(".png"):
        data["background"].append(i)


data["background"].sort()
print(data)

with open("_background.json", 'w') as f:
    json.dump(data, f, indent=4)