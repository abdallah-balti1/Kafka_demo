"""
Resources for Governance endpoints
"""

from context_managers.session_critical_action_manager import SessionCriticalActionManager
from flask_restful import Resource
from flask_restful.reqparse import Argument

from config import DEV_TEAM_EMAILS
from constants.roles import InitiativeRoleEnum
from db import db
from decorators import parse_params
from repositories.governance import GovernanceRepository, GovernanceLinkedToInitiativeError
from util.required_authentication import required_authentication
from util.required_plm_authentication import authorized_plm_roles


class GovernancesResource(Resource):
    """Verbs relative to Governance collection"""

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
        """GET /governances"""
        with SessionCriticalActionManager("Get all governances", db.session, DEV_TEAM_EMAILS):
            governances = GovernanceRepository.get_all()
            return [g.to_json() for g in governances], 200

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
        Argument("name", type=str, location="json", required=True),
    )
    def post(user, name):
        """POST /governances"""
        with SessionCriticalActionManager("Create a governance", db.session, DEV_TEAM_EMAILS):
            governance = GovernanceRepository.create(name=name)
            return governance.to_json(), 201


class GovernanceByIdResource(Resource):
    """Verbs relative to a single Governance by id"""

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
        """GET /governances/<id>"""
        with SessionCriticalActionManager("Get governance by id", db.session, DEV_TEAM_EMAILS):
            governance = GovernanceRepository.get(id)
            return governance.to_json(), 200

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
        Argument("name", type=str, location="json"),
    )
    def put(user, id: int, name):
        """PUT /governances/<id>"""
        with SessionCriticalActionManager("Update governance", db.session, DEV_TEAM_EMAILS):
            governance = GovernanceRepository.modify(id, name=name)
            return governance.to_json(), 200

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
        """DELETE /governances/<id>"""
        try:
            with SessionCriticalActionManager("Delete governance", db.session, DEV_TEAM_EMAILS):
                GovernanceRepository.delete(id)
                return {}, 204
        except GovernanceLinkedToInitiativeError as e:
            return {
                "error": "GOVERNANCE_LINKED_TO_INITIATIVES",
                "message": f"This governance is linked to {e.initiative_count} initiative(s) and cannot be deleted.",
                "initiative_count": e.initiative_count,
            }, 409
