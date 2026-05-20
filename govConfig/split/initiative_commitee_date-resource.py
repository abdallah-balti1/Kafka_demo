"""
Resources for InitiativeCommiteeDate endpoints
"""

from context_managers.session_critical_action_manager import SessionCriticalActionManager
from flask_restful import Resource
from flask_restful.reqparse import Argument

from config import DEV_TEAM_EMAILS
from constants.roles import InitiativeRoleEnum
from db import db
from decorators import parse_params
from repositories.initiative_commitee_date import InitiativeCommiteeDateRepository
from util.required_authentication import required_authentication
from util.required_plm_authentication import authorized_plm_roles


class InitiativeCommiteeDatesResource(Resource):
    """GET commitee dates for an initiative / POST (upsert) a new one"""

    @staticmethod
    @required_authentication()
    @authorized_plm_roles(
        [
            InitiativeRoleEnum.INITIATIVE_OWNER.value,
            InitiativeRoleEnum.INITIATIVE_COORDINATOR.value,
            InitiativeRoleEnum.INITIATIVE_OBSERVER.value,
            InitiativeRoleEnum.INITIATIVE_ASSESSOR.value,
            "ADMIN",
        ]
    )
    def get(user, initiative_id: str):
        """GET /initiatives/<initiative_id>/commitee-dates"""
        with SessionCriticalActionManager("Get commitee dates by initiative", db.session, DEV_TEAM_EMAILS):
            entries = InitiativeCommiteeDateRepository.get_by_initiative_id(initiative_id)
            return [e.to_json() for e in entries], 200

    @staticmethod
    @required_authentication()
    @authorized_plm_roles(
        [
            InitiativeRoleEnum.INITIATIVE_OWNER.value,
            InitiativeRoleEnum.INITIATIVE_COORDINATOR.value,
            "ADMIN",
        ]
    )
    @parse_params(
        Argument("commitee_id", type=int, location="json", required=True),
        Argument("date", type=str, location="json"),
    )
    def post(user, initiative_id: str, commitee_id, date):
        """POST /initiatives/<initiative_id>/commitee-dates - upsert"""
        with SessionCriticalActionManager("Upsert initiative commitee date", db.session, DEV_TEAM_EMAILS):
            entry = InitiativeCommiteeDateRepository.upsert(
                initiative_id=initiative_id,
                commitee_id=commitee_id,
                date=date,
            )
            return entry.to_json(), 200


class InitiativeCommiteeDateByIdResource(Resource):
    """Verbs relative to a single InitiativeCommiteeDate by id"""

    @staticmethod
    @required_authentication()
    @authorized_plm_roles(
        [
            InitiativeRoleEnum.INITIATIVE_OWNER.value,
            InitiativeRoleEnum.INITIATIVE_COORDINATOR.value,
            "ADMIN",
        ]
    )
    def delete(user, id: int):
        """DELETE /commitee-dates/<id>"""
        with SessionCriticalActionManager("Delete initiative commitee date", db.session, DEV_TEAM_EMAILS):
            InitiativeCommiteeDateRepository.delete(id)
            return {}, 204
