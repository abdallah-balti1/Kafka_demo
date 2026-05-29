"""
Resources for StatusInitiative endpoints
"""

from context_managers.session_critical_action_manager import SessionCriticalActionManager
from flask_restful import Resource
from flask_restful.reqparse import Argument

from config import DEV_TEAM_EMAILS
from constants.roles import InitiativeRoleEnum
from db import db
from decorators import parse_params
from repositories.status_initiative import StatusInitiativeRepository
from repositories.governance_config import GovernanceConfigRepository
from repositories.commitee import CommiteeRepository
from util.required_authentication import required_authentication
from util.required_plm_authentication import authorized_plm_roles


class CommiteeStatusesResource(Resource):
    """GET statuses for a commitee / POST a new status"""

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
        """GET /commitees/<id>/statuses"""
        with SessionCriticalActionManager("Get statuses by commitee", db.session, DEV_TEAM_EMAILS):
            statuses = StatusInitiativeRepository.get_by_commitee_id(id)
            return [s.to_json() for s in statuses], 200

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
        Argument("is_final_status", type=bool, location="json"),
    )
    def post(user, id: int, name, is_final_status):
        """POST /commitees/<id>/statuses"""
        with SessionCriticalActionManager("Create status initiative", db.session, DEV_TEAM_EMAILS):
            status = StatusInitiativeRepository.create(
                name=name,
                commitee_id=id,
                is_final_status=is_final_status or False,
            )

            # Auto-create governance_config entry
            commitee = CommiteeRepository.get(id)
            GovernanceConfigRepository.create(
                governance_id=commitee.governance_id,
                status_initiative_id=status.id,
                commitee_id=id,
            )

            return status.to_json(), 201


class StatusInitiativeByIdResource(Resource):
    """Verbs relative to a single StatusInitiative by id"""

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
        """GET /statuses/<id>"""
        with SessionCriticalActionManager("Get status initiative by id", db.session, DEV_TEAM_EMAILS):
            status = StatusInitiativeRepository.get(id)
            return status.to_json(), 200

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
        Argument("is_final_status", type=bool, location="json"),
    )
    def put(user, id: int, name, is_final_status):
        """PUT /statuses/<id>"""
        with SessionCriticalActionManager("Update status initiative", db.session, DEV_TEAM_EMAILS):
            status = StatusInitiativeRepository.modify(
                id, name=name, is_final_status=is_final_status
            )
            return status.to_json(), 200

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
        """DELETE /statuses/<id>"""
        with SessionCriticalActionManager("Delete status initiative", db.session, DEV_TEAM_EMAILS):
            # Delete associated governance_config entries first
            configs = GovernanceConfigRepository.get_by_status_initiative_id(id)
            for config in configs:
                GovernanceConfigRepository.delete(config.id)

            StatusInitiativeRepository.delete(id)
            return {}, 204
