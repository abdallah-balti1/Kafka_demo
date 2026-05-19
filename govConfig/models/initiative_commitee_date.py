"""
Define the InitiativeCommiteeDate model
"""

from db import db


class InitiativeCommiteeDate(db.Model):
    """The InitiativeCommiteeDate model"""

    __tablename__ = "initiative_commitee_date"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    initiative_id = db.Column(db.String(100), db.ForeignKey("initiative.id"), nullable=False)
    commitee_id = db.Column(db.Integer, db.ForeignKey("commitee.id"), nullable=False)
    date = db.Column(db.Date, nullable=True)

    # Relationships
    initiative = db.relationship(
        "Initiative",
        primaryjoin="InitiativeCommiteeDate.initiative_id == Initiative.id",
        back_populates="initiative_commitee_dates",
    )
    commitee = db.relationship(
        "Commitee",
        primaryjoin="InitiativeCommiteeDate.commitee_id == Commitee.id",
        back_populates="initiative_commitee_dates",
    )

    def __init__(self, initiative_id, commitee_id, date=None):
        """Create a new initiative commitee date"""
        self.initiative_id = initiative_id
        self.commitee_id = commitee_id
        self.date = date

    def to_json(self):
        """Return a json representation of the InitiativeCommiteeDate"""
        return {
            "id": self.id,
            "initiative_id": self.initiative_id,
            "commitee_id": self.commitee_id,
            "date": str(self.date) if self.date else None,
        }
