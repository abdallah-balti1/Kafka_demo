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
from repositories.governance import GovernanceRepository
from repositories.commitee import CommiteeRepository
from repositories.status_initiative import StatusInitiativeRepository
from repositories.governance_config import GovernanceConfigRepository
from repositories.initiative_commitee_date import InitiativeCommiteeDateRepository
from util.required_authentication import required_authentication
from util.required_plm_authentication import authorized_plm_roles


# ── Governance ────────────────────────────────────────────────────────────────

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
        """GET /governances - list all governances"""
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
        """POST /governances - create a governance"""
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
            GovernanceRepository.delete(id)
            return {}, 204


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


# ── Commitee ──────────────────────────────────────────────────────────────────

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
            return status.to_json(), 201


# ── StatusInitiative ──────────────────────────────────────────────────────────

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
            StatusInitiativeRepository.delete(id)
            return {}, 204


# ── GovernanceConfig ──────────────────────────────────────────────────────────

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


# ── InitiativeCommiteeDate ────────────────────────────────────────────────────

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
