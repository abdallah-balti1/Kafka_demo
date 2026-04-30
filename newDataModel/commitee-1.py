"""
Defines the Commitee repository
"""

from errors import EntityNotFound
from sqlalchemy import select

from db import db
from models.commitee import Commitee


class CommiteeRepository:
    """The repository for the commitee"""

    @staticmethod
    def get_all() -> list[Commitee]:
        """Get all commitee entries"""
        return db.session.scalars(select(Commitee)).all()

    @staticmethod
    def get(commitee_id: int) -> Commitee:
        """Get a commitee by id"""
        commitee = db.session.scalars(
            select(Commitee).where(Commitee.id == commitee_id)
        ).first()
        if commitee is None:
            raise EntityNotFound("commitee", commitee_id)
        return commitee

    @staticmethod
    def get_by_governance_id(governance_id: int) -> list[Commitee]:
        """Get all commitees for a given governance"""
        return db.session.scalars(
            select(Commitee).where(Commitee.governance_id == governance_id)
        ).all()

    @staticmethod
    def create(name: str, governance_id: int, order: int = None) -> Commitee:
        """Create a new commitee"""
        commitee = Commitee(name=name, governance_id=governance_id, order=order)
        commitee.save()
        return commitee

    @staticmethod
    def modify(commitee_id: int, **kwargs) -> Commitee:
        """Update a commitee entry"""
        commitee = db.session.scalars(
            select(Commitee).where(Commitee.id == commitee_id)
        ).first()
        if commitee is None:
            raise EntityNotFound("commitee", commitee_id)

        not_allowed = {"id"}
        for field, value in kwargs.items():
            if field in not_allowed:
                continue
            if not hasattr(commitee, field):
                continue
            if value is None:
                continue
            setattr(commitee, field, value)

        db.session.flush()
        return commitee

    @staticmethod
    def delete(commitee_id: int) -> Commitee:
        """Delete a commitee entry"""
        commitee = db.session.scalars(
            select(Commitee).where(Commitee.id == commitee_id)
        ).first()
        if commitee is None:
            raise EntityNotFound("commitee", commitee_id)
        db.session.delete(commitee)
        db.session.flush()
        return commitee
