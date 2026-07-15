# -----------------------------------------------------------------------------
# À AJOUTER dans la classe ExportQueryRepository existante
# (repositories/export_query_repository.py), à côté de single_export
# et subfund_export. Ne remplace rien : c'est une nouvelle méthode.
# -----------------------------------------------------------------------------

    @staticmethod
    def get_raw_fees(sha_cds: list[str]) -> list[dict]:
        """
        Fetch brut de toutes les lignes product_fee pour les shares donnés,
        sans filtrage par type/subtype/category : le filtrage/pivot se fait
        ensuite côté FeeExportService, piloté par FEE_GROUPS.

        Ne touche pas aux jointures ADL in/out existantes dans
        single_export / subfund_export : ADL reste géré tel quel.
        """
        if not sha_cds:
            return []

        rows = (
            db.session.query(ProductFee)
            .filter(ProductFee.sha_cd.in_(sha_cds))
            .all()
        )

        return [
            {
                "sha_cd": r.sha_cd,
                "fees_typ_cd": r.fees_typ_cd,
                "fees_subtype_cd": r.fees_subtype_cd,
                "fees_lvl_cd": r.fees_lvl_cd,
                "acq_or_not_acq_fees_cd": r.acq_or_not_acq_fees_cd,
                "specific_fees_cgy_cd": r.specific_fees_cgy_cd,
                "fees_pctg": r.fees_pctg,
                "basis_calc_cd": r.basis_calc_cd,
                "calc_frq_cd": r.calc_frq_cd,
                "pmt_frq_cd": r.pmt_frq_cd,
                "fee_paid_lbl": getattr(r, "fee_paid_lbl", None),
            }
            for r in rows
        ]
