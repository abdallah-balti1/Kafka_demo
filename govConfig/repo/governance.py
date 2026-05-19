"""
Defines the Governance repository
"""

from errors import EntityNotFound
from sqlalchemy import select

from db import db
from models.governance import Governance


class GovernanceRepository:
    """The repository for the governance"""

    @staticmethod
    def get_all() -> list[Governance]:
        """Get all governance entries"""
        return db.session.scalars(select(Governance)).all()

    @staticmethod
    def get(governance_id: int) -> Governance:
        """Get a governance by id"""
        governance = db.session.scalars(
            select(Governance).where(Governance.id == governance_id)
        ).first()
        if governance is None:
            raise EntityNotFound("governance", governance_id)
        return governance

    @staticmethod
    def create(name: str) -> Governance:
        """Create a new governance"""
        governance = Governance(name=name)
        governance.save()
        return governance

    @staticmethod
    def modify(governance_id: int, **kwargs) -> Governance:
        """Update a governance entry"""
        governance = db.session.scalars(
            select(Governance).where(Governance.id == governance_id)
        ).first()
        if governance is None:
            raise EntityNotFound("governance", governance_id)

        not_allowed = {"id"}
        for field, value in kwargs.items():
            if field in not_allowed:
                continue
            if not hasattr(governance, field):
                continue
            if value is None:
                continue
            setattr(governance, field, value)

        db.session.flush()
        return governance

    @staticmethod
    def delete(governance_id: int) -> Governance:
        """Delete a governance entry"""
        governance = db.session.scalars(
            select(Governance).where(Governance.id == governance_id)
        ).first()
        if governance is None:
            raise EntityNotFound("governance", governance_id)
        db.session.delete(governance)
        db.session.flush()
        return governance
