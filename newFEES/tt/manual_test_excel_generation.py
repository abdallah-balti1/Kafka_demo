"""
Script de test manuel : appelle l'endpoint /retrieve_fees_data en local,
puis génère le fichier Excel avec FeeExcelGenerator, pour vérifier le
rendu avec des données réelles.

Usage :
    python manual_test_excel_generation.py 42735 15747

Prérequis :
    - Le serveur Flask doit tourner en local (port 5001 dans ton cas)
    - pip install requests (si pas déjà présent)
    - Lancer ce script depuis la racine du projet flowr-cosmos-api
      (ou ajuster sys.path.insert ci-dessous) pour que les imports
      "from services.fee_excel_generator import ..." fonctionnent
"""

import sys
from pathlib import Path

import requests

# Adapte le chemin si ce script n'est pas à la racine du projet
sys.path.insert(0, str(Path(__file__).resolve().parent))

from services.fee_excel_generator import FeeExcelGenerator  # noqa: E402

BASE_URL = "http://127.0.0.1:5001"
ENDPOINT = "/retrieve_fees_data"  # adapte si tu as un prefix (ex: /smartgps/retrieve_fees_data)

# Colle ici ton token / auth si nécessaire, ex :
HEADERS = {
    "Content-Type": "application/json",
    # "Authorization": "Bearer <TON_TOKEN>",
}


def fetch_fees_data(prod_cd_list: list[str]) -> dict:
    response = requests.post(
        f"{BASE_URL}{ENDPOINT}",
        json={"prod_cd_list": prod_cd_list},
        headers=HEADERS,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def main():
    prod_cd_list = sys.argv[1:] or ["42735"]  # défaut : le produit de ton test

    print(f"→ Appel de {BASE_URL}{ENDPOINT} avec prod_cd_list={prod_cd_list}")
    data = fetch_fees_data(prod_cd_list)

    all_rows = data.get("SIN", []) + data.get("SUB", [])
    if not all_rows:
        print("⚠️  Aucune ligne retournée par l'endpoint, rien à générer.")
        return

    print(f"→ {len(all_rows)} ligne(s) récupérée(s), génération du fichier Excel...")
    excel_buffer = FeeExcelGenerator.generate(all_rows)

    output_path = Path("test_fees_output.xlsx")
    output_path.write_bytes(excel_buffer.read())

    print(f"✅ Fichier généré : {output_path.resolve()}")
    print("   Ouvre-le et compare visuellement avec le template de référence.")


if __name__ == "__main__":
    main()
