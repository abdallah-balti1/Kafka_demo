"""
Define the StatusInitiative model
"""

from db import db


class StatusInitiative(db.Model):
    """The StatusInitiative model"""

    __tablename__ = "status_initiative"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    commitee_id = db.Column(db.Integer, db.ForeignKey("commitee.id"), nullable=False)
    is_final_status = db.Column(db.Boolean, nullable=False, default=False)

    # Relationships
    commitee = db.relationship(
        "Commitee",
        primaryjoin="StatusInitiative.commitee_id == Commitee.id",
        back_populates="status_initiatives",
    )
    governance_configs = db.relationship(
        "GovernanceConfig",
        primaryjoin="StatusInitiative.id == GovernanceConfig.status_initiative_id",
        back_populates="status_initiative",
    )
    initiatives = db.relationship(
        "Initiative",
        primaryjoin="StatusInitiative.id == Initiative.status_initiative_id",
        back_populates="status_initiative",
    )

    def __init__(self, name, commitee_id, is_final_status=False):
        """Create a new status initiative"""
        self.name = name
        self.commitee_id = commitee_id
        self.is_final_status = is_final_status

    def to_json(self):
        """Return a json representation of the StatusInitiative"""
        return {
            "id": self.id,
            "name": self.name,
            "commitee_id": self.commitee_id,
            "is_final_status": self.is_final_status,
        }
