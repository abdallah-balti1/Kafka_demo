"""
Mapping entre les champs bruts de product_fee et les "type" de la table
own_26967_plmsmartgps.field_value.

Types CONFIRMÉS en base :
  - BASIS_OF_CALCULATION
  - FEE_CALCULATION_FREQUENCY  (codes du style "D", "M", "3M", "6M", "Y"...)
  - PAYMENT_FREQUENECY         (codes numériques "1".."5" — référentiel
                                 DIFFÉRENT, non utilisé par pmt_frq_cd,
                                 confirmé par test : pmt_frq_cd contient
                                 des valeurs "M"/"3M" qui n'existent QUE
                                 dans FEE_CALCULATION_FREQUENCY)
  - FEES_PAID_TO

Champs du modèle ProductFee CONFIRMÉS :
  - calc_frq_cd
  - pmt_frq_cd   -> utilise FEE_CALCULATION_FREQUENCY_TYPE (PAS
                    PAYMENT_FREQUENECY_TYPE, qui est un référentiel à
                    codes numériques non compatible)
  - basis_calc_cd
  - fees_paid_cd
"""

FIELD_CALC_FRQ = "calc_frq_cd"
FIELD_PMT_FRQ = "pmt_frq_cd"
FIELD_BASIS_CALC = "basis_calc_cd"
FIELD_PAID_TO = "fees_paid_cd"

FEE_CALCULATION_FREQUENCY_TYPE = "FEE_CALCULATION_FREQUENCY"
BASIS_OF_CALCULATION_TYPE = "BASIS_OF_CALCULATION"
FEES_PAID_TO_TYPE = "FEES_PAID_TO"

# NB : PAYMENT_FREQUENECY existe en base mais n'est PAS utilisé ici —
# ses codes numériques (1-5) ne correspondent pas aux valeurs réelles
# de pmt_frq_cd (qui utilise le même référentiel que calc_frq_cd).
# Gardé en commentaire pour mémoire, au cas où un autre champ en aurait
# besoin plus tard :
# PAYMENT_FREQUENECY_TYPE = "PAYMENT_FREQUENECY"

# Mapping {nom du champ brut ProductFee: type field_value correspondant}
# Les champs absents de ce dict ne sont pas traduits (laissés tels quels).
FIELD_TO_FIELD_VALUE_TYPE = {
    FIELD_CALC_FRQ: FEE_CALCULATION_FREQUENCY_TYPE,
    FIELD_PMT_FRQ: FEE_CALCULATION_FREQUENCY_TYPE,  # corrigé : même type que calc_frq_cd
    FIELD_BASIS_CALC: BASIS_OF_CALCULATION_TYPE,
    FIELD_PAID_TO: FEES_PAID_TO_TYPE,
}
