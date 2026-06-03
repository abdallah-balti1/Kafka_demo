"""
Defines the Governance repository
"""

from errors import EntityNotFound
from sqlalchemy import select

from db import db
from models.governance import Governance


class GovernanceLinkedToInitiativeError(Exception):
    """Raised when trying to delete a governance that is linked to initiatives"""
    def __init__(self, governance_id: int, initiative_count: int):
        self.governance_id = governance_id
        self.initiative_count = initiative_count
        super().__init__(
            f"Governance {governance_id} is linked to {initiative_count} initiative(s) and cannot be deleted."
        )


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
        """Delete a governance entry — raises if linked to initiatives"""
        from models.initiative import Initiative

        governance = db.session.scalars(
            select(Governance).where(Governance.id == governance_id)
        ).first()
        if governance is None:
            raise EntityNotFound("governance", governance_id)

        # Check if any active initiative references this governance
        linked_initiatives = db.session.scalars(
            select(Initiative).where(
                Initiative.governance_id == governance_id,
                Initiative.is_active.is_(True),
            )
        ).all()

        if linked_initiatives:
            raise GovernanceLinkedToInitiativeError(governance_id, len(linked_initiatives))

        db.session.delete(governance)
        db.session.flush()
        return governance
