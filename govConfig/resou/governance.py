"""
Resources for Governance endpoints
"""

from flask_restful import Resource
from flask_restful.reqparse import Argument

from decorators import parse_params
from repositories.governance import GovernanceRepository
from repositories.commitee import CommiteeRepository
from repositories.status_initiative import StatusInitiativeRepository
from repositories.governance_config import GovernanceConfigRepository
from util.required_authentication import required_authentication
from db import db


class GovernancesResource(Resource):
    """Verbs relative to Governance collection"""

    @staticmethod
    @required_authentication()
    def get(user):
        """GET /governances - list all governances"""
        governances = GovernanceRepository.get_all()
        return [g.to_json() for g in governances], 200

    @staticmethod
    @required_authentication()
    @parse_params(
        Argument("name", type=str, location="json", required=True),
    )
    def post(user, name):
        """POST /governances - create a governance"""
        with db.session.begin_nested():
            governance = GovernanceRepository.create(name=name)
        db.session.commit()
        return governance.to_json(), 201


class GovernanceByIdResource(Resource):
    """Verbs relative to a single Governance by id"""

    @staticmethod
    @required_authentication()
    def get(user, id: int):
        """GET /governances/<id>"""
        governance = GovernanceRepository.get(id)
        return governance.to_json(), 200

    @staticmethod
    @required_authentication()
    @parse_params(
        Argument("name", type=str, location="json"),
    )
    def put(user, id: int, name):
        """PUT /governances/<id>"""
        with db.session.begin_nested():
            governance = GovernanceRepository.modify(id, name=name)
        db.session.commit()
        return governance.to_json(), 200

    @staticmethod
    @required_authentication()
    def delete(user, id: int):
        """DELETE /governances/<id>"""
        with db.session.begin_nested():
            GovernanceRepository.delete(id)
        db.session.commit()
        return {}, 204


class GovernanceCommiteesResource(Resource):
    """GET commitees for a governance / POST a new commitee"""

    @staticmethod
    @required_authentication()
    def get(user, id: int):
        """GET /governances/<id>/commitees"""
        commitees = CommiteeRepository.get_by_governance_id(id)
        return [c.to_json() for c in commitees], 200

    @staticmethod
    @required_authentication()
    @parse_params(
        Argument("name", type=str, location="json", required=True),
        Argument("order", type=int, location="json"),
    )
    def post(user, id: int, name, order):
        """POST /governances/<id>/commitees"""
        with db.session.begin_nested():
            commitee = CommiteeRepository.create(name=name, governance_id=id, order=order)
        db.session.commit()
        return commitee.to_json(), 201


class CommiteeByIdResource(Resource):
    """Verbs relative to a single Commitee by id"""

    @staticmethod
    @required_authentication()
    def get(user, id: int):
        """GET /commitees/<id>"""
        commitee = CommiteeRepository.get(id)
        return commitee.to_json(), 200

    @staticmethod
    @required_authentication()
    @parse_params(
        Argument("name", type=str, location="json"),
        Argument("order", type=int, location="json"),
    )
    def put(user, id: int, name, order):
        """PUT /commitees/<id>"""
        with db.session.begin_nested():
            commitee = CommiteeRepository.modify(id, name=name, order=order)
        db.session.commit()
        return commitee.to_json(), 200

    @staticmethod
    @required_authentication()
    def delete(user, id: int):
        """DELETE /commitees/<id>"""
        with db.session.begin_nested():
            CommiteeRepository.delete(id)
        db.session.commit()
        return {}, 204


class CommiteeStatusesResource(Resource):
    """GET statuses for a commitee / POST a new status"""

    @staticmethod
    @required_authentication()
    def get(user, id: int):
        """GET /commitees/<id>/statuses"""
        statuses = StatusInitiativeRepository.get_by_commitee_id(id)
        return [s.to_json() for s in statuses], 200

    @staticmethod
    @required_authentication()
    @parse_params(
        Argument("name", type=str, location="json", required=True),
        Argument("is_final_status", type=bool, location="json"),
    )
    def post(user, id: int, name, is_final_status):
        """POST /commitees/<id>/statuses"""
        with db.session.begin_nested():
            status = StatusInitiativeRepository.create(
                name=name,
                commitee_id=id,
                is_final_status=is_final_status or False,
            )
        db.session.commit()
        return status.to_json(), 201


class StatusInitiativeByIdResource(Resource):
    """Verbs relative to a single StatusInitiative by id"""

    @staticmethod
    @required_authentication()
    def get(user, id: int):
        """GET /statuses/<id>"""
        status = StatusInitiativeRepository.get(id)
        return status.to_json(), 200

    @staticmethod
    @required_authentication()
    @parse_params(
        Argument("name", type=str, location="json"),
        Argument("is_final_status", type=bool, location="json"),
    )
    def put(user, id: int, name, is_final_status):
        """PUT /statuses/<id>"""
        with db.session.begin_nested():
            status = StatusInitiativeRepository.modify(
                id, name=name, is_final_status=is_final_status
            )
        db.session.commit()
        return status.to_json(), 200

    @staticmethod
    @required_authentication()
    def delete(user, id: int):
        """DELETE /statuses/<id>"""
        with db.session.begin_nested():
            StatusInitiativeRepository.delete(id)
        db.session.commit()
        return {}, 204


class GovernanceConfigsResource(Resource):
    """GET all governance configs / POST a new one"""

    @staticmethod
    @required_authentication()
    def get(user):
        """GET /governance-configs"""
        configs = GovernanceConfigRepository.get_all()
        return [c.to_json() for c in configs], 200

    @staticmethod
    @required_authentication()
    @parse_params(
        Argument("governance_id", type=int, location="json", required=True),
        Argument("status_initiative_id", type=int, location="json", required=True),
        Argument("commitee_id", type=int, location="json", required=True),
    )
    def post(user, governance_id, status_initiative_id, commitee_id):
        """POST /governance-configs"""
        with db.session.begin_nested():
            config = GovernanceConfigRepository.create(
                governance_id=governance_id,
                status_initiative_id=status_initiative_id,
                commitee_id=commitee_id,
            )
        db.session.commit()
        return config.to_json(), 201


class GovernanceConfigByIdResource(Resource):
    """Verbs relative to a single GovernanceConfig by id"""

    @staticmethod
    @required_authentication()
    def get(user, id: int):
        """GET /governance-configs/<id>"""
        config = GovernanceConfigRepository.get(id)
        return config.to_json(), 200

    @staticmethod
    @required_authentication()
    def delete(user, id: int):
        """DELETE /governance-configs/<id>"""
        with db.session.begin_nested():
            GovernanceConfigRepository.delete(id)
        db.session.commit()
        return {}, 204
