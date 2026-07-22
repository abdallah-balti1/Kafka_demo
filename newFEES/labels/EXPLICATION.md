# Traduction des codes fees → labels (field_value)

## Le principe retenu : traduire une fois, en amont, avec cache

Au lieu de requêter `field_value` à chaque ligne ou à chaque appel
d'endpoint, on fait **une seule requête** qui charge tous les labels
nécessaires, **mise en cache en mémoire** avec une durée de vie (TTL),
et on traduit chaque code **avant** le pivot (`FeeExportService` et
`FEE_GROUPS` ne changent pas du tout).

## Schéma

```
┌─────────────────────────────────────────────────────────────┐
│  get_raw_fees(sha_cds)                                       │
└───────────────────────────┬─────────────────────────────────┘
                             │
          ┌──────────────────┼───────────────────┐
          ▼                                        ▼
┌──────────────────────┐              ┌──────────────────────────┐
│ SELECT * FROM           │              │ get_cached_labels_map()    │
│ product_fee               │              │                             │
│ WHERE sha_cd IN (...)       │              │ Vérifie le cache mémoire     │
│                               │              │ (TTL 1h) → si expiré ou       │
│ (1 seule requête, comme        │              │ vide, 1 SEULE requête :        │
│  avant)                          │              │ SELECT * FROM field_value        │
└──────────────┬────────────────────┘              │ WHERE type IN (tous les types)    │
               │                                     └──────────────┬─────────────────────┘
               │ lignes brutes                                       │
               │ (basis_calc_cd="1", calc_frq_cd="M"...)               │ {type: {code: label_en}}
               ▼                                                       ▼
               └───────────────────────┬───────────────────────────────┘
                                       ▼
                     Pour chaque ligne, chaque champ concerné :
                     _translate(field_name, code) → label_en
                     (basis_calc_cd="1" devient "Net Asset Value",
                      calc_frq_cd="M" devient "Monthly", etc.)
                                       │
                                       ▼
                     Lignes brutes avec labels déjà traduits,
                     renvoyées à FeeExportService.build_fee_columns
                     (AUCUN changement nécessaire dans le pivot)
```

## Pourquoi c'est performant

- **1 requête `product_fee`** (comme avant, inchangé)
- **1 requête `field_value`** pour TOUS les types nécessaires en une fois
  (`WHERE type IN (...)`), peu importe qu'on traduise 10 lignes ou 10 000
- **Cache en mémoire avec TTL** (1h par défaut) : les appels suivants à
  l'endpoint, dans l'heure qui suit, ne retouchent PAS la DB pour les
  labels — seulement `product_fee` est requêté à nouveau (les fees
  changent plus souvent que les tables de référence)
- Total : **2 requêtes DB par appel d'endpoint au pire cas** (cache froid),
  **1 seule requête** dans le cas normal (cache chaud)

## Fichiers livrés

| Fichier | Action | Destination |
|---|---|---|
| `constants/field_value_types_config.py` | Nouveau fichier — mapping champ → type field_value | `src/constants/field_value_types_config.py` |
| `repositories/field_value_repository.py` | Nouveau fichier | `src/repositories/field_value_repository.py` |
| `repositories/modele_field_value_A_CREER_SI_ABSENT.py` | À copier dans `src/models/` **seulement si** le modèle `FieldValue` n'existe pas déjà (vérifie avec `grep -r "class FieldValue" src/models/`) | `src/models/field_value.py` (si besoin) |
| `repositories/export_query_repository_get_raw_fees_v2.py` | **Remplace** la méthode `get_raw_fees` précédente dans `ExportQueryRepository` | `src/repositories/export_query_repository.py` |
| `services/field_value_cache.py` | Nouveau fichier — cache en mémoire avec TTL | `src/services/field_value_cache.py` |
| `tests/test_field_value_cache.py` | Test unitaire (sans DB, avec mock) — **testé et validé**, voir sortie ci-dessous | `tests/test_field_value_cache.py` |
| `tests/test_excel_fees.py` | Script de test end-to-end (appelle l'endpoint réel + génère l'Excel) | à la racine du projet ou dans `tests/` |

## Résultat des tests unitaires (déjà exécutés)

```
✅ test_single_query_for_multiple_lookups OK
✅ test_translation_mapping OK
✅ test_fallback_on_unknown_code OK

🎉 Tous les tests passent.
```

Ces tests vérifient, sans DB (avec un mock) :
1. Qu'un seul appel DB est fait même si le cache est sollicité plusieurs fois
2. Que le mapping code → label_en est correct
3. Que le fallback sur le code brut fonctionne si le label est introuvable
   (jamais de perte d'info silencieuse)

## Étapes pour toi

1. **Vérifier le nom exact du type field_value pour `basis_calc_cd`** —
   dans `field_value_types_config.py`, j'ai mis `"FEE_BASIS_CALCULATION"`
   à titre d'exemple, mais ce n'est pas confirmé. Lance :
   ```sql
   SELECT DISTINCT type FROM own_26967_plmsmartgps.field_value;
   ```
   et repère le bon nom.

2. **Vérifier si `pmt_frq_cd` (payment frequency) utilise le même type
   que `calc_frq_cd`** (`FEE_CALCULATION_FREQUENCY`) ou un type séparé
   (`FEE_PAYMENT_FREQUENCY` par exemple) — j'ai supposé le même type par
   défaut, à confirmer.

3. **Vérifier si le modèle `FieldValue` existe déjà** dans `src/models/`
   — probable vu que la table est déjà utilisée ailleurs. Si oui, ignore
   `modele_field_value_A_CREER_SI_ABSENT.py` et adapte juste l'import
   dans `field_value_repository.py`.

4. **Placer les fichiers** selon le tableau ci-dessus, remplacer
   `get_raw_fees` par la nouvelle version.

5. **Lancer le test unitaire** :
   ```bash
   python tests/test_field_value_cache.py
   ```

6. **Lancer le test end-to-end** (`tests/test_excel_fees.py`) — colle ton
   token, ajuste l'`ENDPOINT` si besoin, puis :
   ```bash
   python tests/test_excel_fees.py 42735
   ```
   Le script affiche un aperçu des colonnes traduites avant de générer
   le fichier, pour vérifier rapidement sans ouvrir l'Excel :
   ```
   Max Management fees Basis of Calculation: 'Net Asset Value'
   Max Management fees Calculation Frequency: 'Monthly'
   ```
   Si tu vois encore des codes bruts (`'1'`, `'M'`) au lieu de labels,
   c'est que le type field_value ne matche pas (retourne au point 1/2).

## Ce qui n'est pas touché

- `single_export` / `subfund_export` (ADL in/out) restent identiques
- `FeeExportService.build_fee_columns` et `FEE_GROUPS` ne changent pas
- `FeeExcelGenerator` ne change pas
