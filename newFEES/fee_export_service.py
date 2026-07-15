"""
Service de pivot : transforme les lignes brutes product_fee (issues de
ExportQueryRepository.get_raw_fees) en un dict {sha_cd: {colonne_excel: valeur}},
piloté par la config déclarative FEE_GROUPS.

Aucune requête DB ici : logique métier pure, testable sans DB en lui
passant des listes de dicts construites à la main.
"""

from constants.fee_groups_config import FEE_GROUPS


class FeeExportService:

    @staticmethod
    def build_fee_columns(raw_fees: list[dict]) -> dict[str, dict]:
        """
        raw_fees : liste de dicts (une entrée par ligne product_fee brute),
                   au format renvoyé par ExportQueryRepository.get_raw_fees.

        Retourne : {sha_cd: {excel_column_name: value, ...}, ...}
        Chaque sha_cd présent dans raw_fees a une entrée avec TOUTES les
        colonnes connues (valeur à None si le fee n'existe pas pour ce share).
        """
        if not raw_fees:
            return {}

        # Index (sha_cd, group_key) -> ligne brute matchée
        indexed: dict[tuple, dict] = {}
        for row in raw_fees:
            for group in FEE_GROUPS:
                if FeeExportService._matches(row, group["match"]):
                    indexed[(row["sha_cd"], group["key"])] = row
                    break  # une ligne ne devrait matcher qu'un seul groupe

        result: dict[str, dict] = {}
        sha_cds = {row["sha_cd"] for row in raw_fees}

        for sha_cd in sha_cds:
            result[sha_cd] = {}
            for group in FEE_GROUPS:
                matched_row = indexed.get((sha_cd, group["key"]))
                for excel_col, field in group["columns"].items():
                    result[sha_cd][excel_col] = (
                        matched_row.get(field) if matched_row else None
                    )

        return result

    @staticmethod
    def _matches(row: dict, criteria: dict) -> bool:
        return all(row.get(k) == v for k, v in criteria.items())
