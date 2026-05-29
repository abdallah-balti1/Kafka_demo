"""
Define the Governance model
"""

from abstract_base_model import BaseModel

from db import db
from models.commitee import Commitee


class Governance(db.Model, BaseModel):
    """The Governance model"""

    __tablename__ = "governance"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

    # Relationships
    commitees = db.relationship("Commitee", cascade="all, delete-orphan")
    governance_configs = db.relationship("GovernanceConfig", cascade="all, delete-orphan")
    initiatives = db.relationship("Initiative")

    def __init__(self, name):
        """Create a new governance"""
        self.name = name

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "commitees": [
                {
                    "id": c.id,
                    "name": c.name,
                    "governance_id": c.governance_id,
                    "order": c.order,
                    "status_initiatives": [
                        {
                            "id": s.id,
                            "name": s.name,
                            "commitee_id": s.commitee_id,
                            "is_final_status": s.is_final_status,
                        }
                        for s in (c.status_initiatives or [])
                    ],
                }
                for c in (self.commitees or [])
            ],
        }
