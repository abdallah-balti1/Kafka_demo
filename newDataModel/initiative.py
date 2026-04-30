"""
Define the Initiative model
"""

from datetime import datetime

from abstract_base_model import BaseModel
from sqlalchemy import func, select

from db import db


def generate_custom_id(context):
    conn = context.connection
    result = conn.execute(select(func.count()).select_from(Initiative.__table__))
    count = result.scalar_one()
    return f"I{count + 1}"


class Initiative(db.Model, BaseModel):
    """The initiative model"""

    __tablename__ = "initiative"

    id = db.Column(db.String(100), primary_key=True, default=generate_custom_id, nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey("template.id"), nullable=True)
    name = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.String(255), nullable=False)
    product_type = db.Column(db.String(40), nullable=True)
    initiative_type = db.Column(db.String(40), nullable=True)
    sponsor = db.Column(db.String(40), nullable=False)
    sponsor_country = db.Column(db.String(40), nullable=False)
    asset_class = db.Column(db.String(40), nullable=True)
    management_company = db.Column(db.Text, nullable=True)
    committee_date = db.Column(db.Date, nullable=True)
    expected_for = db.Column(db.Date, nullable=True)
    distribution_channel = db.Column(db.String(40), nullable=False)
    governance_required = db.Column(db.String(40), nullable=False)
    legal_form = db.Column(db.String(40), nullable=True)
    initiative_owner = db.Column(db.String(40), nullable=False)
    cosmos_id = db.Column(db.Integer, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    assessment_team = db.Column(db.String(200), nullable=True)
    manager_team = db.Column(db.String(255), nullable=True)
    created_by_id = db.Column(db.Integer, nullable=True)
    salesforce_id_opportunity = db.Column(db.String(100), nullable=True)
    client_description = db.Column(db.String(255), nullable=True)
    client_name = db.Column(db.String(100), nullable=True)
    client_type = db.Column(db.String(100), nullable=True)
    existing_holdings = db.Column(db.Boolean, nullable=True, default=False)
    rfp = db.Column(db.Text(), nullable=True)
    implementation_date = db.Column(db.Date, nullable=True)
    lead_wallet_manager_name = db.Column(db.String(100), nullable=True)
    lead_wallet_manager_team = db.Column(db.String(100), nullable=True)
    shareclass_name = db.Column(db.Text(), nullable=True)
    benchmark = db.Column(db.String(255), nullable=True)
    instruments_details = db.Column(db.Text(), nullable=True)
    investment_strategy_guidelines = db.Column(db.Text(), nullable=True)
    additional_licence_needed = db.Column(db.Boolean, nullable=True, default=False)
    product_name_data = db.Column(db.String(100), nullable=True)
    legal_structure = db.Column(db.String(100), nullable=True)
    regulatory_status = db.Column(db.String(100), nullable=True)
    country_of_domiciliation = db.Column(db.String(100), nullable=True)
    investment_management = db.Column(db.String(100), nullable=True)
    investment_management_delegated = db.Column(db.Text(), nullable=True)
    standard_service = db.Column(db.Boolean, nullable=True, default=False)
    specific_service_desc = db.Column(db.Text(), nullable=True)
    aum_expected = db.Column(db.String(100), nullable=True)
    fees_desc = db.Column(db.String(100), nullable=True)
    comments_buisness = db.Column(db.Text(), nullable=True)

    # NEW FKs
    governance_id = db.Column(db.Integer, db.ForeignKey("governance.id"), nullable=True)
    status_initiative_id = db.Column(db.Integer, db.ForeignKey("status_initiative.id"), nullable=True)

    # Relationships
    teams = db.relationship(
        "InitiativeTeamRelationship",
        primaryjoin="Initiative.id == InitiativeTeamRelationship.initiative_id",
    )
    governance = db.relationship(
        "Governance",
        primaryjoin="Initiative.governance_id == Governance.id",
        back_populates="initiatives",
    )
    status_initiative = db.relationship(
        "StatusInitiative",
        primaryjoin="Initiative.status_initiative_id == StatusInitiative.id",
        back_populates="initiatives",
    )
    initiative_commitee_dates = db.relationship(
        "InitiativeCommiteeDate",
        primaryjoin="Initiative.id == InitiativeCommiteeDate.initiative_id",
        back_populates="initiative",
    )

    def __init__(
        self,
        name,
        summary,
        product_type,
        initiative_type,
        sponsor,
        sponsor_country,
        asset_class,
        management_company,
        committee_date,
        expected_for,
        distribution_channel,
        governance_required,
        legal_form,
        initiative_owner,
        cosmos_id,
        assessment_team,
        manager_team,
        template_id=None,
        created_by_id=None,
        salesforce_id_opportunity=None,
        client_description=None,
        client_name=None,
        client_type=None,
        existing_holdings=None,
        rfp=None,
        implementation_date=None,
        lead_wallet_manager_name=None,
        lead_wallet_manager_team=None,
        shareclass_name=None,
        benchmark=None,
        instruments_details=None,
        investment_strategy_guidelines=None,
        additional_licence_needed=None,
        product_name_data=None,
        legal_structure=None,
        regulatory_status=None,
        country_of_domiciliation=None,
        investment_management=None,
        investment_management_delegated=None,
        standard_service=None,
        specific_service_desc=None,
        aum_expected=None,
        fees_desc=None,
        comments_buisness=None,
        governance_id=None,
        status_initiative_id=None,
    ):
        """Create a new initiative"""
        self.name = name
        self.summary = summary
        self.product_type = product_type
        self.initiative_type = initiative_type
        self.template_id = template_id
        self.sponsor = sponsor
        self.sponsor_country = sponsor_country
        self.asset_class = asset_class
        self.management_company = management_company
        self.committee_date = committee_date
        self.expected_for = expected_for
        self.distribution_channel = distribution_channel
        self.governance_required = governance_required
        self.legal_form = legal_form
        self.initiative_owner = initiative_owner
        self.cosmos_id = cosmos_id
        self.assessment_team = assessment_team
        self.manager_team = manager_team
        self.created_by_id = created_by_id
        self.salesforce_id_opportunity = salesforce_id_opportunity
        self.client_description = client_description
        self.client_name = client_name
        self.client_type = client_type
        self.existing_holdings = existing_holdings
        self.rfp = rfp
        self.implementation_date = implementation_date
        self.lead_wallet_manager_name = lead_wallet_manager_name
        self.lead_wallet_manager_team = lead_wallet_manager_team
        self.shareclass_name = shareclass_name
        self.benchmark = benchmark
        self.instruments_details = instruments_details
        self.investment_strategy_guidelines = investment_strategy_guidelines
        self.additional_licence_needed = additional_licence_needed
        self.product_name_data = product_name_data
        self.legal_structure = legal_structure
        self.regulatory_status = regulatory_status
        self.country_of_domiciliation = country_of_domiciliation
        self.investment_management = investment_management
        self.investment_management_delegated = investment_management_delegated
        self.standard_service = standard_service
        self.specific_service_desc = specific_service_desc
        self.aum_expected = aum_expected
        self.fees_desc = fees_desc
        self.comments_buisness = comments_buisness
        self.governance_id = governance_id
        self.status_initiative_id = status_initiative_id

    def to_json(self):
        """Return a json representation of the Initiative"""
        from models.task import InitiativeTask
        from models.template_config import TemplateConfig
        from models.assessment_category import AssessmentCategory
        from models.assessment_sub_category import AssessmentSubCategory
        from models.initiative_team_relationship import InitiativeTeamRelationship

        global_ratings = []
        if self.template_id:
            rows = (
                db.session.query(
                    AssessmentCategory.name.label("category"),
                    InitiativeTask.task_rating.label("rating"),
                )
                .select_from(InitiativeTask)
                .join(InitiativeTeamRelationship, InitiativeTeamRelationship.id == InitiativeTask.relationship_id)
                .join(AssessmentSubCategory, AssessmentSubCategory.id == InitiativeTask.assessment_sub_cat_id)
                .join(AssessmentCategory, AssessmentCategory.id == InitiativeTask.assessment_cat_id)
                .join(TemplateConfig, TemplateConfig.assessment_category_id == AssessmentCategory.id)
                .filter(
                    InitiativeTeamRelationship.initiative_id == self.id,
                    TemplateConfig.template_id == self.template_id,
                    db.func.lower(AssessmentSubCategory.name) == "global risk",
                )
                .distinct()
                .order_by(AssessmentCategory.name)
                .all()
            )
            global_ratings = [
                {"category": r.category, "rating": r.rating}
                for r in rows
            ]

        initiative = {
            "id": str(self.id),
            "name": self.name,
            "summary": self.summary,
            "product_type": self.product_type,
            "initiative_type": self.initiative_type,
            "template_id": self.template_id,
            "sponsor": self.sponsor,
            "sponsor_country": self.sponsor_country,
            "asset_class": self.asset_class,
            "management_company": self.management_company,
            "committee_date": str(self.committee_date) if self.committee_date else None,
            "expected_for": str(self.expected_for) if self.expected_for else None,
            "distribution_channel": self.distribution_channel,
            "governance_required": self.governance_required,
            "legal_form": self.legal_form,
            "initiative_owner": self.initiative_owner,
            "cosmos_id": self.cosmos_id,
            "is_active": self.is_active,
            "assessment_team": self.assessment_team,
            "manager_team": self.manager_team,
            "created_by_id": self.created_by_id,
            "salesforce_id_opportunity": self.salesforce_id_opportunity,
            "client_description": self.client_description,
            "client_name": self.client_name,
            "client_type": self.client_type,
            "existing_holdings": self.existing_holdings,
            "rfp": self.rfp,
            "implementation_date": (str(self.implementation_date) if self.implementation_date else None),
            "lead_wallet_manager_name": self.lead_wallet_manager_name,
            "lead_wallet_manager_team": self.lead_wallet_manager_team,
            "shareclass_name": self.shareclass_name,
            "benchmark": self.benchmark,
            "instruments_details": self.instruments_details,
            "investment_strategy_guidelines": self.investment_strategy_guidelines,
            "additional_licence_needed": self.additional_licence_needed,
            "product_name_data": self.product_name_data,
            "legal_structure": self.legal_structure,
            "regulatory_status": self.regulatory_status,
            "country_of_domiciliation": self.country_of_domiciliation,
            "investment_management": self.investment_management,
            "investment_management_delegated": self.investment_management_delegated,
            "standard_service": self.standard_service,
            "specific_service_desc": self.specific_service_desc,
            "aum_expected": self.aum_expected,
            "fees_desc": self.fees_desc,
            "comments_buisness": self.comments_buisness,
            # NEW fields
            "governance_id": self.governance_id,
            "status_initiative_id": self.status_initiative_id,
            "governance": self.governance.to_json() if self.governance else None,
            "status_initiative": self.status_initiative.to_json() if self.status_initiative else None,
            "initiative_commitee_dates": [
                icd.to_json() for icd in self.initiative_commitee_dates
            ] if self.initiative_commitee_dates else [],
            "teams": [
                {
                    "relationship_id": team.id,
                    "accountant_id": team.accountant_id,
                    "team_id": team.team_id,
                    "team_members_ids": [member.user_id for member in team.team_members if member.user_id],
                }
                for team in self.teams
                if team.team_id
            ],
            "global_ratings": global_ratings,
        }

        return initiative
