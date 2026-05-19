"""
Define the Governance model
"""

from db import db


class Governance(db.Model):
    """The Governance model"""

    __tablename__ = "governance"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

    # Relationships
    commitees = db.relationship(
        "Commitee",
        primaryjoin="Governance.id == Commitee.governance_id",
        back_populates="governance",
    )
    governance_configs = db.relationship(
        "GovernanceConfig",
        primaryjoin="Governance.id == GovernanceConfig.governance_id",
        back_populates="governance",
    )
    initiatives = db.relationship(
        "Initiative",
        primaryjoin="Governance.id == Initiative.governance_id",
        back_populates="governance",
    )

    def __init__(self, name):
        """Create a new governance"""
        self.name = name

    def to_json(self):
        """Return a json representation of the Governance"""
        return {
            "id": self.id,
            "name": self.name,
        }
