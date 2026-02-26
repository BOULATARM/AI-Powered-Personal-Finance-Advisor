import os
from google import genai

SYSTEM_PROMPT = (
    "Tu es un assistant de gestion financière personnelle. "
    "Tu donnes des conseils clairs, responsables et pratiques. "
    "Tu ne remplaces pas un conseiller financier."
)

def ask_gemini(messages):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    client = genai.Client(api_key=api_key)

    user_text = messages[-1]["content"]
    prompt = f"{SYSTEM_PROMPT}\n\nUtilisateur : {user_text}"

    response = client.models.generate_content(
        model="models/gemini-flash-latest",
        contents=prompt
    )

    return response.text
