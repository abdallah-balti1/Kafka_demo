# ── Add these imports in app.py ───────────────────────────────────────────────
from routes.governance import (
    COMMITEE_BLUEPRINT,
    COMMITEE_STATUSES_BLUEPRINT,
    GOVERNANCE_BLUEPRINT,
    GOVERNANCE_COMMITEES_BLUEPRINT,
    GOVERNANCE_CONFIG_BLUEPRINT,
    GOVERNANCE_CONFIGS_BLUEPRINT,
    GOVERNANCES_BLUEPRINT,
    STATUS_INITIATIVE_BLUEPRINT,
)

# ── Register in app.py (inside create_app or wherever blueprints are registered)
app.register_blueprint(GOVERNANCES_BLUEPRINT)
app.register_blueprint(GOVERNANCE_BLUEPRINT)
app.register_blueprint(GOVERNANCE_COMMITEES_BLUEPRINT)
app.register_blueprint(COMMITEE_BLUEPRINT)
app.register_blueprint(COMMITEE_STATUSES_BLUEPRINT)
app.register_blueprint(STATUS_INITIATIVE_BLUEPRINT)
app.register_blueprint(GOVERNANCE_CONFIGS_BLUEPRINT)
app.register_blueprint(GOVERNANCE_CONFIG_BLUEPRINT)
