import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = (
    "Tu es un assistant de gestion financière personnelle. "
    "Tu donnes des conseils généraux, clairs et actionnables. "
    "Tu ne remplaces pas un conseiller financier. "
    "Si l'utilisateur demande quelque chose d'illégal ou dangereux, refuse."
)

def ask_openai(messages, model="gpt-5.2"):
    """
    messages: liste de dicts [{role: 'user'|'assistant'|'system', content: '...'}]
    """
    # OpenAI recommande l'API Responses pour les nouveaux projets. :contentReference[oaicite:6]{index=6}
    # Ici on convertit en "input" simple (texte) via un format minimal.
    # Option: tu peux aussi passer tout l'historique concaténé.
    input_text = "\n".join([f"{m['role']}: {m['content']}" for m in messages])

    resp = client.responses.create(
        model=model,
        input=input_text,
    )
    return resp.output_text
