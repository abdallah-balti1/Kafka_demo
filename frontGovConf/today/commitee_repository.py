"""Defines the Governance config repository"""

from errors import EntityNotFound, CustomException
from sqlalchemy import select

from db import db
from models import Commitee
from models.initiative import Initiative


class CommiteeLinkedToInitiativeError(CustomException):
    def __init__(self, commitee_id: int, initiative_count: int):
        self.commitee_id = commitee_id
        self.initiative_count = initiative_count
        super().__init__(
            409,
            initiative_count,
            "COMMITEE_LINKED_TO_INITIATIVES",
            f"Commitee {commitee_id} is linked to {initiative_count} initiative(s) and cannot be deleted.",
        )


class CommiteeRepository:
    """The repository for the Governance table"""

    @staticmethod
    def get_committee_id_from_governance(governance_id):
        commitees = Commitee.query.filter_by(governance_id=governance_id).order_by(Commitee.order).all()
        return [commitee.to_json() for commitee in commitees]

    @staticmethod
    def get_all() -> list[Commitee]:
        """Get all commitee entries"""
        return db.session.scalars(select(Commitee)).all()

    @staticmethod
    def get(commitee_id: int) -> Commitee:
        """Get a commitee by id"""
        commitee = db.session.scalars(select(Commitee).where(Commitee.id == commitee_id)).first()
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
        commitee = db.session.scalars(select(Commitee).where(Commitee.id == commitee_id)).first()
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
        """Delete a commitee entry — raises if linked to initiatives"""
        commitee = db.session.scalars(select(Commitee).where(Commitee.id == commitee_id)).first()
        if commitee is None:
            raise EntityNotFound("commitee", commitee_id)

        # Check if any active initiative references this commitee via status_initiative
        linked_initiatives = db.session.scalars(
            select(Initiative).where(
                Initiative.status_initiative_id.in_(
                    [s.id for s in commitee.status_initiatives]
                ),
                Initiative.is_active.is_(True),
            )
        ).all()

        if linked_initiatives:
            raise CommiteeLinkedToInitiativeError(commitee_id, len(linked_initiatives))

        db.session.delete(commitee)
        db.session.flush()
        return commitee
