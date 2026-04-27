# Dans repositories/initiative.py
# Remplace la méthode get_global_ratings par celle-ci

@staticmethod
def get_global_ratings(initiative_id: int) -> list[dict]:
    """
    Returns all tasks where assessment_sub_category name = 'global rating'
    for a given initiative, with their category and rating.
    Uses DISTINCT to avoid duplicates.
    """
    from models.task import InitiativeTask
    from models.template_config import TemplateConfig
    from models.assessment_category import AssessmentCategory
    from models.assessment_sub_category import AssessmentSubCategory

    initiative = db.session.scalars(
        select(Initiative).where(
            Initiative.id == initiative_id,
            Initiative.is_active.is_(True),
        )
    ).first()

    if initiative is None:
        raise EntityNotFound("initiative", initiative_id)

    results = (
        db.session.query(
            AssessmentCategory.name.label("category"),
            InitiativeTask.task_rating.label("rating"),
        )
        .select_from(InitiativeTask)
        .join(
            AssessmentSubCategory,
            AssessmentSubCategory.id == InitiativeTask.assessment_sub_cat_id,
        )
        .join(
            AssessmentCategory,
            AssessmentCategory.id == InitiativeTask.assessment_cat_id,
        )
        .join(
            TemplateConfig,
            TemplateConfig.assessment_category_id == AssessmentCategory.id,
        )
        .filter(
            TemplateConfig.template_id == initiative.template_id,
            db.func.lower(AssessmentSubCategory.name) == "global rating",
        )
        .distinct()                          # ✅ évite les doublons
        .order_by(AssessmentCategory.name)
        .all()
    )

    return [
        {
            "category": row.category,
            "rating":   row.rating,          # valeur brute ex: "MEDIUM", "VERY LOW"
        }
        for row in results
    ]
