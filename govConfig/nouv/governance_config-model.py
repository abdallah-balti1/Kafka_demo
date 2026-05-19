"""
Define the GovernanceConfig model
"""

from db import db


class GovernanceConfig(db.Model):
    """The GovernanceConfig model"""

    __tablename__ = "governance_config"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    governance_id = db.Column(db.Integer, db.ForeignKey("governance.id"), nullable=False)
    status_initiative_id = db.Column(db.Integer, db.ForeignKey("status_initiative.id"), nullable=False)
    commitee_id = db.Column(db.Integer, db.ForeignKey("commitee.id"), nullable=False)

    # Relationships
    governance = db.relationship(
        "Governance",
        primaryjoin="GovernanceConfig.governance_id == Governance.id",
        back_populates="governance_configs",
    )
    status_initiative = db.relationship(
        "StatusInitiative",
        primaryjoin="GovernanceConfig.status_initiative_id == StatusInitiative.id",
        back_populates="governance_configs",
    )
    commitee = db.relationship(
        "Commitee",
        primaryjoin="GovernanceConfig.commitee_id == Commitee.id",
        back_populates="governance_configs",
    )

    def __init__(self, governance_id, status_initiative_id, commitee_id):
        """Create a new governance config"""
        self.governance_id = governance_id
        self.status_initiative_id = status_initiative_id
        self.commitee_id = commitee_id

    def to_json(self):
        """Return a json representation of the GovernanceConfig"""
        return {
            "id": self.id,
            "governance_id": self.governance_id,
            "status_initiative_id": self.status_initiative_id,
            "commitee_id": self.commitee_id,
        }
