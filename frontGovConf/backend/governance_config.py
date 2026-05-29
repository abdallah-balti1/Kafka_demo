"""Defines the Governance config repository"""

from errors import EntityNotFound
from sqlalchemy import select

from db import db
from models.governance_config import GovernanceConfig


class GovernanceConfigRepository:
    """The repository for the Governance table"""

    @staticmethod
    def get_all() -> list[GovernanceConfig]:
        """Get all governance config entries"""
        return db.session.scalars(select(GovernanceConfig)).all()

    @staticmethod
    def get(governance_config_id: int) -> GovernanceConfig:
        """Get a governance config by id"""
        config = db.session.scalars(
            select(GovernanceConfig).where(GovernanceConfig.id == governance_config_id)
        ).first()
        if config is None:
            raise EntityNotFound("governance_config", governance_config_id)
        return config

    @staticmethod
    def get_by_governance_id(governance_id: int) -> list[GovernanceConfig]:
        """Get all configs for a given governance"""
        return db.session.scalars(
            select(GovernanceConfig).where(GovernanceConfig.governance_id == governance_id)
        ).all()

    @staticmethod
    def get_by_status_initiative_id(status_initiative_id: int) -> list[GovernanceConfig]:
        """Get all configs for a given status initiative"""
        return db.session.scalars(
            select(GovernanceConfig).where(
                GovernanceConfig.status_initiative_id == status_initiative_id
            )
        ).all()

    @staticmethod
    def create(governance_id: int, status_initiative_id: int, commitee_id: int) -> GovernanceConfig:
        """Create a new governance config"""
        config = GovernanceConfig(
            governance_id=governance_id,
            status_initiative_id=status_initiative_id,
            commitee_id=commitee_id,
        )
        config.save()
        return config

    @staticmethod
    def modify(governance_config_id: int, **kwargs) -> GovernanceConfig:
        """Update a governance config entry"""
        config = db.session.scalars(
            select(GovernanceConfig).where(GovernanceConfig.id == governance_config_id)
        ).first()
        if config is None:
            raise EntityNotFound("governance_config", governance_config_id)

        not_allowed = {"id"}
        for field, value in kwargs.items():
            if field in not_allowed:
                continue
            if not hasattr(config, field):
                continue
            if value is None:
                continue
            setattr(config, field, value)

        db.session.flush()
        return config

    @staticmethod
    def delete(governance_config_id: int) -> GovernanceConfig:
        """Delete a governance config entry"""
        config = db.session.scalars(
            select(GovernanceConfig).where(GovernanceConfig.id == governance_config_id)
        ).first()
        if config is None:
            raise EntityNotFound("governance_config", governance_config_id)
        db.session.delete(config)
        db.session.flush()
        return config
