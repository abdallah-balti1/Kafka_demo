"""
Config déclarative des colonnes Excel de fees.

Chaque "groupe" définit :
  - "key"     : identifiant technique unique du groupe (usage interne, pivot)
  - "match"   : critères à matcher sur une ligne brute product_fee
  - "columns" : mapping {nom de colonne Excel: nom de champ de la ligne brute}

Ajouter un nouveau type de fee = ajouter une entrée ici, sans toucher
au repository ni au service.
"""

from constants.export_query_constants import (
    ACQUIRED,
    ADVISORY_SUBTYPE,
    CHARITY_SUBTYPE,
    CONVERSION_SUBTYPE,
    DISTRIBUTION_SUBTYPE,
    FOREIGN_UCIS_TAX_CATEGORY,
    MANAGEMENT_SUBTYPE,
    MAX_LEVEL,
    NOT_ACQUIRED,
    OTHER_COSTS_CATEGORY,
    REDEMPTION_SUBTYPE,
    REEL_LEVEL,
    SPECIFIC_EXTERNAL_SUBTYPE,
    SUBSCRIPTION_SUBTYPE,
    TAXE_ABONNEMENT_CATEGORY,
)

FEES_TYP_DIRECT = "2"  # FEES_TYPE = 2 => "Direct Fees"


def _direct_fee_group(key_prefix: str, subtype: str, label: str) -> list[dict]:
    """
    Fees "directs" simples : Management / Distribution / Charity / Advisory.
    Matching uniquement sur fees_typ_cd + fees_subtype_cd + fees_lvl_cd.
    4 colonnes (Rate, Basis, CalcFreq, PmtFreq) x 2 niveaux (Max/Real).
    """
    groups = []
    for level, level_name in ((MAX_LEVEL, "Max"), (REEL_LEVEL, "Real")):
        groups.append(
            {
                "key": f"{key_prefix}_{level_name.lower()}",
                "match": {
                    "fees_typ_cd": FEES_TYP_DIRECT,
                    "fees_subtype_cd": subtype,
                    "fees_lvl_cd": level,
                },
                "columns": {
                    f"{level_name} {label} Rate": "fees_pctg",
                    f"{level_name} {label} Basis of Calculation": "basis_calc_cd",
                    f"{level_name} {label} Calculation Frequency": "calc_frq_cd",
                    f"{level_name} {label} Payment Frequency": "pmt_frq_cd",
                },
            }
        )
    return groups


def _specific_fee_group(
    key_prefix: str, category: str, label: str, with_paid_to: bool = True
) -> list[dict]:
    """
    Fees "spécifiques / externes" : Other Costs / Foreign UCIs Tax / Taxe abonnement.
    Matching sur fees_typ_cd + fees_subtype_cd (=5, Specific/External)
    + specific_fees_cgy_cd + fees_lvl_cd.
    """
    groups = []
    for level, level_name in ((MAX_LEVEL, "Max"), (REEL_LEVEL, "Real")):
        cols = {
            f"{level_name} {label} Rate": "fees_pctg",
            f"{level_name} {label} Basis of Calculation": "basis_calc_cd",
            f"{level_name} {label} Calculation Frequency": "calc_frq_cd",
            f"{level_name} {label} Payment Frequency": "pmt_frq_cd",
        }
        if with_paid_to:
            cols[f"{level_name} {label} Paid To"] = "fee_paid_lbl"
        groups.append(
            {
                "key": f"{key_prefix}_{level_name.lower()}",
                "match": {
                    "fees_typ_cd": FEES_TYP_DIRECT,
                    "fees_subtype_cd": SPECIFIC_EXTERNAL_SUBTYPE,
                    "specific_fees_cgy_cd": category,
                    "fees_lvl_cd": level,
                },
                "columns": cols,
            }
        )
    return groups


FEE_GROUPS: list[dict] = [
    # --- Subscription / Redemption / Conversion fees ---
    {
        "key": "subscription_acquired_max",
        "match": {
            "fees_typ_cd": FEES_TYP_DIRECT,
            "fees_subtype_cd": SUBSCRIPTION_SUBTYPE,
            "acq_or_not_acq_fees_cd": ACQUIRED,
            "fees_lvl_cd": MAX_LEVEL,
        },
        "columns": {"Subscription Acquired MAX Rate": "fees_pctg"},
    },
    {
        "key": "subscription_non_acquired_max",
        "match": {
            "fees_typ_cd": FEES_TYP_DIRECT,
            "fees_subtype_cd": SUBSCRIPTION_SUBTYPE,
            "acq_or_not_acq_fees_cd": NOT_ACQUIRED,
            "fees_lvl_cd": MAX_LEVEL,
        },
        "columns": {"Subscription Non Acquired MAX Rate": "fees_pctg"},
    },
    {
        "key": "redemption_acquired_max",
        "match": {
            "fees_typ_cd": FEES_TYP_DIRECT,
            "fees_subtype_cd": REDEMPTION_SUBTYPE,
            "acq_or_not_acq_fees_cd": ACQUIRED,
            "fees_lvl_cd": MAX_LEVEL,
        },
        "columns": {"Redemption Acquired MAX Rate": "fees_pctg"},
    },
    {
        "key": "redemption_non_acquired_max",
        "match": {
            "fees_typ_cd": FEES_TYP_DIRECT,
            "fees_subtype_cd": REDEMPTION_SUBTYPE,
            "acq_or_not_acq_fees_cd": NOT_ACQUIRED,
            "fees_lvl_cd": MAX_LEVEL,
        },
        "columns": {"Redemption Non Acquired MAX Rate": "fees_pctg"},
    },
    {
        "key": "conversion",
        "match": {
            "fees_typ_cd": FEES_TYP_DIRECT,
            "fees_subtype_cd": CONVERSION_SUBTYPE,
        },
        "columns": {"Conversion Rate": "fees_pctg"},
    },
    # --- Direct fees : Management / Distribution / Charity / Advisory ---
    *_direct_fee_group("management", MANAGEMENT_SUBTYPE, "Management fees"),
    *_direct_fee_group("distribution", DISTRIBUTION_SUBTYPE, "Distribution fees"),
    *_direct_fee_group("charity", CHARITY_SUBTYPE, "Charity fees"),
    *_direct_fee_group("advisory", ADVISORY_SUBTYPE, "Advisory fees"),
    # --- Specific & External fees ---
    *_specific_fee_group("other_costs", OTHER_COSTS_CATEGORY, "Other Costs"),
    *_specific_fee_group(
        "foreign_ucis_tax", FOREIGN_UCIS_TAX_CATEGORY, "Foreign UCIs Tax"
    ),
    *_specific_fee_group(
        "taxe_abonnement", TAXE_ABONNEMENT_CATEGORY, "Taxe Abonnement"
    ),
]
