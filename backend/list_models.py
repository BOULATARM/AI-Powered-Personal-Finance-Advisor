import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Liste les modèles dispo (et filtre ceux qui supportent generateContent)
models = client.models.list()

for m in models:
    name = getattr(m, "name", None)
    if name:
        print(name)
