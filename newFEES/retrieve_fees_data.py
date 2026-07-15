from context_managers.session_critical_action_manager import SessionCriticalActionManager
from flasgger.utils import swag_from
from flask import jsonify, request
from flask_restful import Resource

from config import DEV_TEAM_EMAILS
from constants.export_query_constants import SHA_CD_LABEL
from db import db
from repositories.export_query_repository import ExportQueryRepository
from repositories.product import ProductRepository
from services.fee_export_service import FeeExportService
from utils.required_authentication import required_authentication


class RetrieveFeesDataResource(Resource):
    """Export toutes les fees (ADL in/out + Management/Distribution/Charity/
    Advisory/Specific & External/...) pour une liste de produits."""

    @staticmethod
    @required_authentication()
    @swag_from("../../swagger/retrieve_fees_data/POST.yml")
    def post(user):
        data = request.get_json(silent=True) or {}

        prod_cd_list = data.get("prod_cd_list", [])

        if not isinstance(prod_cd_list, list) or not prod_cd_list:
            return {"error": "prod_cd_list is required and must be a non-empty list"}, 400

        prod_cd_list = [str(x).strip() for x in prod_cd_list if str(x).strip()]
        if not prod_cd_list:
            return {"error": "prod_cd_list is empty"}, 400

        with SessionCriticalActionManager("last_file_version", db.session, DEV_TEAM_EMAILS):
            origins = ProductRepository.get_latest_origins(prod_cd_list)

            sin_list = [p for p in prod_cd_list if origins.get(p) == "SIN"]
            sub_list = [p for p in prod_cd_list if origins.get(p) == "SUB"]
            unknown = [p for p in prod_cd_list if origins.get(p) not in ("SIN", "SUB")]

            # 1. Requêtes existantes (ADL in/out déjà inclus) — INCHANGÉES
            result = {
                "SIN": ExportQueryRepository.single_export(sin_list) if sin_list else [],
                "SUB": ExportQueryRepository.subfund_export(sub_list) if sub_list else [],
                "unknown": unknown,
            }

            all_rows = result["SIN"] + result["SUB"]

            # 2. Nouveaux fees : fetch brut + pivot (ne recouvre pas ADL in/out)
            sha_cds = [row[SHA_CD_LABEL] for row in all_rows]
            raw_fees = ExportQueryRepository.get_raw_fees(sha_cds)
            fee_columns = FeeExportService.build_fee_columns(raw_fees)

            # 3. Merge : chaque ligne existante est enrichie avec les nouvelles colonnes
            for row in all_rows:
                row.update(fee_columns.get(row[SHA_CD_LABEL], {}))

        return result, 200
