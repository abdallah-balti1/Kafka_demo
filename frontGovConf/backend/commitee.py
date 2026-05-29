"""
Define the Commitee model
"""

from abstract_base_model import BaseModel

from db import db
from models.governance_config import GovernanceConfig
from models.initiative_commitee_date import InitiativeCommiteeDate


class Commitee(db.Model, BaseModel):
    """The Commitee model"""

    __tablename__ = "commitee"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    governance_id = db.Column(db.Integer, db.ForeignKey("governance.id"), nullable=False)
    order = db.Column(db.Integer, nullable=True)

    # Relationships
    governance = db.relationship("Governance")
    status_initiatives = db.relationship("StatusInitiative", cascade="all, delete-orphan")
    governance_configs = db.relationship("GovernanceConfig", cascade="all, delete-orphan")
    initiative_commitee_dates = db.relationship("InitiativeCommiteeDate", cascade="all, delete-orphan")

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
