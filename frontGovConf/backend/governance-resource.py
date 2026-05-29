from context_managers.session_critical_action_manager import SessionCriticalActionManager
from flasgger.utils import swag_from
from flask import request
from flask_restful import Resource
from flask_restful.reqparse import Argument

from config import DEV_TEAM_EMAILS
from constants.roles import InitiativeRoleEnum
from db import db
from decorators import parse_params
from repositories import GovernanceRepository
from repositories.commitee import CommiteeRepository
from repositories.status_initiative import StatusInitiativeRepository
from repositories.governance_config import GovernanceConfigRepository
from util.required_authentication import required_authentication
from util.required_plm_authentication import authorized_plm_roles


class GovernanceResource(Resource):
    """Verbs relative to a Initiative Timeline Status"""

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
    @swag_from("../../swagger/governance/GET.yml")
    def get(user):
        with SessionCriticalActionManager("Get all all governances", db.session, DEV_TEAM_EMAILS):
            governances = GovernanceRepository.get_all()
            return [governance.to_json() for governance in governances]

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
        with SessionCriticalActionManager("Delete governance", db.session, DEV_TEAM_EMAILS):
            # 1. Supprimer tous les governance_config liés à cette governance
            configs = GovernanceConfigRepository.get_by_governance_id(id)
            for config in configs:
                GovernanceConfigRepository.delete(config.id)

            # 2. Pour chaque commitee, supprimer ses status_initiatives
            commitees = CommiteeRepository.get_by_governance_id(id)
            for commitee in commitees:
                statuses = StatusInitiativeRepository.get_by_commitee_id(commitee.id)
                for status in statuses:
                    StatusInitiativeRepository.delete(status.id)

            # 3. Supprimer tous les commitees
            for commitee in commitees:
                CommiteeRepository.delete(commitee.id)

            # 4. Supprimer la governance
            GovernanceRepository.delete(id)
            return {}, 204
