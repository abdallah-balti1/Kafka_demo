# -----------------------------------------------------------------------------
# À AJOUTER à la fin de constants/export_query_constants.py (fichier existant)
# Ne pas écraser le fichier existant : ce sont des AJOUTS.
# -----------------------------------------------------------------------------

# --- Fees subtype codes (fees_typ_cd = "2") ---
MANAGEMENT_SUBTYPE = "1"
ADVISORY_SUBTYPE = "2"
DISTRIBUTION_SUBTYPE = "3"
CHARITY_SUBTYPE = "4"
SPECIFIC_EXTERNAL_SUBTYPE = "5"
PERFORMANCE_SUBTYPE = "6"
SUBSCRIPTION_SUBTYPE = "7"
REDEMPTION_SUBTYPE = "8"
CONVERSION_SUBTYPE = "9"

# --- Specific fees category codes (utilisés uniquement sous SPECIFIC_EXTERNAL_SUBTYPE) ---
TAXE_ABONNEMENT_CATEGORY = "1"
OTHER_COSTS_CATEGORY = "15"
FOREIGN_UCIS_TAX_CATEGORY = "41"
# NB : ADL_IN_CATEGORY = "19" et ADL_OUT_CATEGORY = "27" existent déjà dans le fichier existant

# --- Acquired / Not acquired ---
ACQUIRED = "1"
NOT_ACQUIRED = "2"

# --- Levels ---
MAX_LEVEL = "MAX"
REEL_LEVEL = "REEL"

# --- Column labels (nouvelles colonnes du pivot fees) ---
FEES_PCTG_FIELD = "fees_pctg"
BASIS_CALC_CD_FIELD = "basis_calc_cd"
CALC_FRQ_CD_FIELD = "calc_frq_cd"
PMT_FRQ_CD_FIELD = "pmt_frq_cd"
FEE_PAID_LBL_FIELD = "fee_paid_lbl"
