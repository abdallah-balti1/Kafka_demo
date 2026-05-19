"""
Defines the InitiativeCommiteeDate repository
"""

from errors import EntityNotFound
from sqlalchemy import select

from db import db
from models.initiative_commitee_date import InitiativeCommiteeDate


class InitiativeCommiteeDateRepository:
    """The repository for the initiative commitee date"""

    @staticmethod
    def get_all() -> list[InitiativeCommiteeDate]:
        """Get all initiative commitee date entries"""
        return db.session.scalars(select(InitiativeCommiteeDate)).all()

    @staticmethod
    def get(initiative_commitee_date_id: int) -> InitiativeCommiteeDate:
        """Get an initiative commitee date by id"""
        entry = db.session.scalars(
            select(InitiativeCommiteeDate).where(
                InitiativeCommiteeDate.id == initiative_commitee_date_id
            )
        ).first()
        if entry is None:
            raise EntityNotFound("initiative_commitee_date", initiative_commitee_date_id)
        return entry

    @staticmethod
    def get_by_initiative_id(initiative_id: str) -> list[InitiativeCommiteeDate]:
        """Get all commitee dates for a given initiative"""
        return db.session.scalars(
            select(InitiativeCommiteeDate).where(
                InitiativeCommiteeDate.initiative_id == initiative_id
            )
        ).all()

    @staticmethod
    def create(initiative_id: str, commitee_id: int, date=None) -> InitiativeCommiteeDate:
        """Create a new initiative commitee date"""
        entry = InitiativeCommiteeDate(
            initiative_id=initiative_id,
            commitee_id=commitee_id,
            date=date,
        )
        entry.save()
        return entry

    @staticmethod
    def upsert(initiative_id: str, commitee_id: int, date=None) -> InitiativeCommiteeDate:
        """Create or update an initiative commitee date for a given initiative + commitee pair"""
        entry = db.session.scalars(
            select(InitiativeCommiteeDate).where(
                InitiativeCommiteeDate.initiative_id == initiative_id,
                InitiativeCommiteeDate.commitee_id == commitee_id,
            )
        ).first()
        if entry is None:
            entry = InitiativeCommiteeDate(
                initiative_id=initiative_id,
                commitee_id=commitee_id,
                date=date,
            )
            entry.save()
        else:
            entry.date = date
            db.session.flush()
        return entry

    @staticmethod
    def delete(initiative_commitee_date_id: int) -> InitiativeCommiteeDate:
        """Delete an initiative commitee date entry"""
        entry = db.session.scalars(
            select(InitiativeCommiteeDate).where(
                InitiativeCommiteeDate.id == initiative_commitee_date_id
            )
        ).first()
        if entry is None:
            raise EntityNotFound("initiative_commitee_date", initiative_commitee_date_id)
        db.session.delete(entry)
        db.session.flush()
        return entry
