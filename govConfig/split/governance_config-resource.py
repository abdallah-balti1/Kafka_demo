"""
Resources for GovernanceConfig endpoints
"""

from context_managers.session_critical_action_manager import SessionCriticalActionManager
from flask_restful import Resource
from flask_restful.reqparse import Argument

from config import DEV_TEAM_EMAILS
from constants.roles import InitiativeRoleEnum
from db import db
from decorators import parse_params
from repositories.governance_config import GovernanceConfigRepository
from util.required_authentication import required_authentication
from util.required_plm_authentication import authorized_plm_roles


class GovernanceConfigsResource(Resource):
    """GET all governance configs / POST a new one"""

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
    def get(user):
        """GET /governance-configs"""
        with SessionCriticalActionManager("Get all governance configs", db.session, DEV_TEAM_EMAILS):
            configs = GovernanceConfigRepository.get_all()
            return [c.to_json() for c in configs], 200

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
        Argument("governance_id", type=int, location="json", required=True),
        Argument("status_initiative_id", type=int, location="json", required=True),
        Argument("commitee_id", type=int, location="json", required=True),
    )
    def post(user, governance_id, status_initiative_id, commitee_id):
        """POST /governance-configs"""
        with SessionCriticalActionManager("Create governance config", db.session, DEV_TEAM_EMAILS):
            config = GovernanceConfigRepository.create(
                governance_id=governance_id,
                status_initiative_id=status_initiative_id,
                commitee_id=commitee_id,
            )
            return config.to_json(), 201


class GovernanceConfigByIdResource(Resource):
    """Verbs relative to a single GovernanceConfig by id"""

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
    def get(user, id: int):
        """GET /governance-configs/<id>"""
        with SessionCriticalActionManager("Get governance config by id", db.session, DEV_TEAM_EMAILS):
            config = GovernanceConfigRepository.get(id)
            return config.to_json(), 200

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
        """DELETE /governance-configs/<id>"""
        with SessionCriticalActionManager("Delete governance config", db.session, DEV_TEAM_EMAILS):
            GovernanceConfigRepository.delete(id)
            return {}, 204
