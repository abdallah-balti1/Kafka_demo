# Fees Export — nouveaux fichiers

## Où placer chaque fichier dans `flowr-cosmos-api`

| Fichier livré | Action | Destination |
|---|---|---|
| `constants/export_query_constants_ADDITIONS.py` | Copier le **contenu** à la fin du fichier existant `src/constants/export_query_constants.py` (ne pas écraser) | `src/constants/export_query_constants.py` |
| `constants/fee_groups_config.py` | Nouveau fichier | `src/constants/fee_groups_config.py` |
| `constants/excel_layout_config.py` | Nouveau fichier — mise en page du template Excel (sections, couleurs, colonnes) | `src/constants/excel_layout_config.py` |
| `repositories/export_query_repository_ADDITION.py` | Copier la méthode `get_raw_fees` **dans** la classe `ExportQueryRepository` existante (à côté de `single_export`/`subfund_export`), et ajouter l'import de `ProductFee` s'il n'y est pas déjà | `src/repositories/export_query_repository.py` |
| `services/fee_export_service.py` | Nouveau fichier (créer le dossier `services/` s'il n'existe pas) | `src/services/fee_export_service.py` |
| `services/fee_excel_generator.py` | Nouveau fichier — génère le .xlsx (openpyxl) à partir des lignes de données | `src/services/fee_excel_generator.py` |
| `resources/retrieve_fees_data.py` | Nouveau fichier — endpoint qui renvoie les données JSON (preview/debug) | `src/resources/retrieve_fees_data.py` |
| `resources/generate_fees_excel.py` | Nouveau fichier — endpoint qui renvoie directement le fichier .xlsx | `src/resources/generate_fees_excel.py` |
| `routes/retrieve_fees_data.py` | Nouveau fichier | `src/routes/retrieve_fees_data.py` |
| `routes/generate_fees_excel.py` | Nouveau fichier | `src/routes/generate_fees_excel.py` |
| `swagger/retrieve_fees_data/POST.yml` | Nouveau fichier | `src/swagger/retrieve_fees_data/POST.yml` |
| `swagger/generate_fees_excel/POST.yml` | Nouveau fichier | `src/swagger/generate_fees_excel/POST.yml` |

## Deux endpoints, deux usages

- `POST /retrieve_fees_data` → renvoie le JSON brut (preview frontend avant
  téléchargement, ou debug)
- `POST /generate_fees_excel` → renvoie directement le fichier `.xlsx`
  prêt à télécharger (`send_file`, `as_attachment=True`)

Les deux réutilisent exactement la même logique de données
(`single_export`/`subfund_export` + `get_raw_fees` + `build_fee_columns`) —
aucune duplication.

## Étapes restantes après avoir placé les fichiers

1. **Enregistrer le blueprint** — dans `app.py` (ou l'équivalent où
   `RETRIEVE_ADL_FEES_DATA_BLUEPRINT` est enregistré), ajouter :
   ```python
   from routes.retrieve_fees_data import RETRIEVE_FEES_DATA_BLUEPRINT
   app.register_blueprint(RETRIEVE_FEES_DATA_BLUEPRINT, url_prefix="/api")
   ```
   (adapter `url_prefix` à ta convention existante)

2. **Vérifier les codes DB** — les valeurs suivantes dans
   `fee_groups_config.py` viennent de ton export de codes, à re-vérifier
   sur un enregistrement `product_fee` connu avant de coder en dur en prod :
   - `MANAGEMENT_SUBTYPE = "1"`, `ADVISORY_SUBTYPE = "2"`,
     `DISTRIBUTION_SUBTYPE = "3"`, `CHARITY_SUBTYPE = "4"`,
     `SPECIFIC_EXTERNAL_SUBTYPE = "5"`
   - `OTHER_COSTS_CATEGORY = "15"`, `FOREIGN_UCIS_TAX_CATEGORY = "41"`,
     `TAXE_ABONNEMENT_CATEGORY = "1"`

3. **Vérifier le champ `fee_paid_lbl`** — dans `get_raw_fees`, j'ai mis
   `getattr(r, "fee_paid_lbl", None)` par précaution : si le modèle
   `ProductFee` a un nom de colonne différent pour "Paid To"
   (ex. `fees_paid_lbl`, `paid_to_cd`...), corrige le nom du champ.

4. **Tester `FeeExportService` sans DB** — exemple de test unitaire :
   ```python
   def test_management_max():
       raw = [{
           "sha_cd": "ABC", "fees_typ_cd": "2", "fees_subtype_cd": "1",
           "fees_lvl_cd": "MAX", "acq_or_not_acq_fees_cd": None,
           "specific_fees_cgy_cd": None, "fees_pctg": 0.5,
           "basis_calc_cd": "1", "calc_frq_cd": "M", "pmt_frq_cd": "M",
           "fee_paid_lbl": None,
       }]
       result = FeeExportService.build_fee_columns(raw)
       assert result["ABC"]["Max Management fees Rate"] == 0.5
   ```

5. **Tester l'endpoint** avec un `prod_cd_list` connu et comparer aux
   valeurs déjà présentes dans le fichier Excel de référence
   ("ABDALLAH Template fees Update").

## Ce qui n'est PAS touché

- `single_export` et `subfund_export` dans `export_query_repository.py`
  restent identiques, ADL in/out y compris — aucune régression possible
  sur l'endpoint `/retrieve_adl_fees_data` existant.
- Aucune modification de modèles SQLAlchemy.

## Ce qui reste à faire côté métier

- Les codes "Charity" n'apparaissaient pas clairement dans ton export de
  `SPECIFIC_FEES_CATEGORY` — Charity est traité ici comme un subtype
  direct (`CHARITY_SUBTYPE = "4"`), à confirmer que c'est bien le bon
  mécanisme et pas via une `specific_fees_cgy_cd` à part.
- Les colonnes "Hedging fees" et "Performance fees" visibles sur tes
  captures Excel (zone encadrée en rouge "CES FEES N'EXISTENT PAS ENCORE
  DANS LE PIVOT FEE") ne sont pas dans `FEE_GROUPS` — à ajouter une fois
  les codes confirmés, sur le même modèle que les autres groupes.
