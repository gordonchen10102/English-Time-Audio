import json, os
for d in [".","level-1","level-2","level-3","level-4","level-5","level-6"]:
    mp3=sorted(f for f in os.listdir(d) if f.lower().endswith(".mp3"))
    if d=="level-1" and not mp3: continue  # Level 1 audio lives in the main folder
    json.dump(mp3, open(os.path.join(d,"files.json"),"w"), ensure_ascii=False, indent=0)
    print(d, len(mp3))
