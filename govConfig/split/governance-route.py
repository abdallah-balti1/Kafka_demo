"""
Defines blueprints for governance-related routes
"""

from flask import Blueprint
from flask_restful import Api

from resources.governance.governance import (
    GovernancesResource,
    GovernanceByIdResource,
)
from resources.governance.commitee import (
    GovernanceCommiteesResource,
    CommiteeByIdResource,
)
from resources.governance.status_initiative import (
    CommiteeStatusesResource,
    StatusInitiativeByIdResource,
)
from resources.governance.governance_config import (
    GovernanceConfigsResource,
    GovernanceConfigByIdResource,
)
from resources.governance.initiative_commitee_date import (
    InitiativeCommiteeDatesResource,
    InitiativeCommiteeDateByIdResource,
)

# ── Governance ────────────────────────────────────────────────────────────────
GOVERNANCES_BLUEPRINT = Blueprint("governances", __name__)
Api(GOVERNANCES_BLUEPRINT).add_resource(
    GovernancesResource,
    "/governances",
    endpoint="governances",
)

GOVERNANCE_BLUEPRINT = Blueprint("governance", __name__)
Api(GOVERNANCE_BLUEPRINT).add_resource(
    GovernanceByIdResource,
    "/governances/<int:id>",
    endpoint="governance",
)

GOVERNANCE_COMMITEES_BLUEPRINT = Blueprint("governance_commitees", __name__)
Api(GOVERNANCE_COMMITEES_BLUEPRINT).add_resource(
    GovernanceCommiteesResource,
    "/governances/<int:id>/commitees",
    endpoint="governance_commitees",
)

# ── Commitee ──────────────────────────────────────────────────────────────────
COMMITEE_BLUEPRINT = Blueprint("commitee", __name__)
Api(COMMITEE_BLUEPRINT).add_resource(
    CommiteeByIdResource,
    "/commitees/<int:id>",
    endpoint="commitee",
)

COMMITEE_STATUSES_BLUEPRINT = Blueprint("commitee_statuses", __name__)
Api(COMMITEE_STATUSES_BLUEPRINT).add_resource(
    CommiteeStatusesResource,
    "/commitees/<int:id>/statuses",
    endpoint="commitee_statuses",
)

# ── StatusInitiative ──────────────────────────────────────────────────────────
STATUS_INITIATIVE_BLUEPRINT = Blueprint("status_initiative", __name__)
Api(STATUS_INITIATIVE_BLUEPRINT).add_resource(
    StatusInitiativeByIdResource,
    "/statuses/<int:id>",
    endpoint="status_initiative",
)

# ── GovernanceConfig ──────────────────────────────────────────────────────────
GOVERNANCE_CONFIGS_BLUEPRINT = Blueprint("governance_configs", __name__)
Api(GOVERNANCE_CONFIGS_BLUEPRINT).add_resource(
    GovernanceConfigsResource,
    "/governance-configs",
    endpoint="governance_configs",
)

GOVERNANCE_CONFIG_BLUEPRINT = Blueprint("governance_config", __name__)
Api(GOVERNANCE_CONFIG_BLUEPRINT).add_resource(
    GovernanceConfigByIdResource,
    "/governance-configs/<int:id>",
    endpoint="governance_config",
)

# ── InitiativeCommiteeDate ────────────────────────────────────────────────────
INITIATIVE_COMMITEE_DATES_BLUEPRINT = Blueprint("initiative_commitee_dates", __name__)
Api(INITIATIVE_COMMITEE_DATES_BLUEPRINT).add_resource(
    InitiativeCommiteeDatesResource,
    "/initiatives/<string:initiative_id>/commitee-dates",
    endpoint="initiative_commitee_dates",
)

INITIATIVE_COMMITEE_DATE_BLUEPRINT = Blueprint("initiative_commitee_date", __name__)
Api(INITIATIVE_COMMITEE_DATE_BLUEPRINT).add_resource(
    InitiativeCommiteeDateByIdResource,
    "/commitee-dates/<int:id>",
    endpoint="initiative_commitee_date",
)
