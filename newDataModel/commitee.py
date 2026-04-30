"""
Define the Commitee model
"""

from db import db


class Commitee(db.Model):
    """The Commitee model"""

    __tablename__ = "commitee"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    governance_id = db.Column(db.Integer, db.ForeignKey("governance.id"), nullable=False)
    order = db.Column(db.Integer, nullable=True)

    # Relationships
    governance = db.relationship(
        "Governance",
        primaryjoin="Commitee.governance_id == Governance.id",
        back_populates="commitees",
    )
    status_initiatives = db.relationship(
        "StatusInitiative",
        primaryjoin="Commitee.id == StatusInitiative.commitee_id",
        back_populates="commitee",
    )
    governance_configs = db.relationship(
        "GovernanceConfig",
        primaryjoin="Commitee.id == GovernanceConfig.commitee_id",
        back_populates="commitee",
    )
    initiative_commitee_dates = db.relationship(
        "InitiativeCommiteeDate",
        primaryjoin="Commitee.id == InitiativeCommiteeDate.commitee_id",
        back_populates="commitee",
    )

    def __init__(self, name, governance_id, order=None):
        """Create a new commitee"""
        self.name = name
        self.governance_id = governance_id
        self.order = order

    def to_json(self):
        """Return a json representation of the Commitee"""
        return {
            "id": self.id,
            "name": self.name,
            "governance_id": self.governance_id,
            "order": self.order,
        }
