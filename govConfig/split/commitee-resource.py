"""
Resources for Commitee endpoints
"""

from context_managers.session_critical_action_manager import SessionCriticalActionManager
from flask_restful import Resource
from flask_restful.reqparse import Argument

from config import DEV_TEAM_EMAILS
from constants.roles import InitiativeRoleEnum
from db import db
from decorators import parse_params
from repositories.commitee import CommiteeRepository
from util.required_authentication import required_authentication
from util.required_plm_authentication import authorized_plm_roles


class GovernanceCommiteesResource(Resource):
    """GET commitees for a governance / POST a new commitee"""

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
        """GET /governances/<id>/commitees"""
        with SessionCriticalActionManager("Get commitees by governance", db.session, DEV_TEAM_EMAILS):
            commitees = CommiteeRepository.get_by_governance_id(id)
            return [c.to_json() for c in commitees], 200

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
        Argument("order", type=int, location="json"),
    )
    def post(user, id: int, name, order):
        """POST /governances/<id>/commitees"""
        with SessionCriticalActionManager("Create commitee", db.session, DEV_TEAM_EMAILS):
            commitee = CommiteeRepository.create(name=name, governance_id=id, order=order)
            return commitee.to_json(), 201


class CommiteeByIdResource(Resource):
    """Verbs relative to a single Commitee by id"""

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
        """GET /commitees/<id>"""
        with SessionCriticalActionManager("Get commitee by id", db.session, DEV_TEAM_EMAILS):
            commitee = CommiteeRepository.get(id)
            return commitee.to_json(), 200

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
        Argument("order", type=int, location="json"),
    )
    def put(user, id: int, name, order):
        """PUT /commitees/<id>"""
        with SessionCriticalActionManager("Update commitee", db.session, DEV_TEAM_EMAILS):
            commitee = CommiteeRepository.modify(id, name=name, order=order)
            return commitee.to_json(), 200

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
        """DELETE /commitees/<id>"""
        with SessionCriticalActionManager("Delete commitee", db.session, DEV_TEAM_EMAILS):
            CommiteeRepository.delete(id)
            return {}, 204
