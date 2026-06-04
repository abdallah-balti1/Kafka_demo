"""
Defines the StatusInitiative repository
"""

from errors import EntityNotFound, CustomException
from sqlalchemy import select

from db import db
from models.status_initiative import StatusInitiative
from models.initiative import Initiative


class StatusLinkedToInitiativeError(CustomException):
    def __init__(self, status_id: int, initiative_count: int):
        self.status_id = status_id
        self.initiative_count = initiative_count
        super().__init__(
            409,
            initiative_count,
            "STATUS_LINKED_TO_INITIATIVES",
            f"Status {status_id} is linked to {initiative_count} initiative(s) and cannot be deleted.",
        )


class StatusInitiativeRepository:
    """The repository for the status initiative"""

    @staticmethod
    def get_all() -> list[StatusInitiative]:
        """Get all status initiative entries"""
        return db.session.scalars(select(StatusInitiative)).all()

    @staticmethod
    def get(status_initiative_id: int) -> StatusInitiative:
        """Get a status initiative by id"""
        status = db.session.scalars(
            select(StatusInitiative).where(StatusInitiative.id == status_initiative_id)
        ).first()
        if status is None:
            raise EntityNotFound("status_initiative", status_initiative_id)
        return status

    @staticmethod
    def get_by_commitee_id(commitee_id: int) -> list[StatusInitiative]:
        """Get all statuses for a given commitee"""
        return db.session.scalars(
            select(StatusInitiative).where(StatusInitiative.commitee_id == commitee_id)
        ).all()

    @staticmethod
    def create(name: str, commitee_id: int, is_final_status: bool = False) -> StatusInitiative:
        """Create a new status initiative"""
        status = StatusInitiative(
            name=name,
            commitee_id=commitee_id,
            is_final_status=is_final_status,
        )
        status.save()
        return status

    @staticmethod
    def modify(status_initiative_id: int, **kwargs) -> StatusInitiative:
        """Update a status initiative entry"""
        status = db.session.scalars(
            select(StatusInitiative).where(StatusInitiative.id == status_initiative_id)
        ).first()
        if status is None:
            raise EntityNotFound("status_initiative", status_initiative_id)

        not_allowed = {"id"}
        for field, value in kwargs.items():
            if field in not_allowed:
                continue
            if not hasattr(status, field):
                continue
            if value is None:
                continue
            setattr(status, field, value)

        db.session.flush()
        return status

    @staticmethod
    def delete(status_initiative_id: int) -> StatusInitiative:
        """Delete a status initiative entry — raises if linked to initiatives"""
        status = db.session.scalars(
            select(StatusInitiative).where(StatusInitiative.id == status_initiative_id)
        ).first()
        if status is None:
            raise EntityNotFound("status_initiative", status_initiative_id)

        # Check if any active initiative references this status
        linked_initiatives = db.session.scalars(
            select(Initiative).where(
                Initiative.status_initiative_id == status_initiative_id,
                Initiative.is_active.is_(True),
            )
        ).all()

        if linked_initiatives:
            raise StatusLinkedToInitiativeError(status_initiative_id, len(linked_initiatives))

        db.session.delete(status)
        db.session.flush()
        return status
