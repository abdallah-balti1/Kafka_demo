# Endpoint `/retrieve_fees_data` — Architecture & explication perf

## Le problème qu'on évite

Avec l'ADL in/out, une seule requête avec quelques `outerjoin` suffit
parce qu'il n'y a qu'un seul type de fee (4 critères de matching :
`sha_cd`, `specific_fees_cgy_cd`, `fees_lvl_cd`).

Si on généralise cette approche aux 15-20 types de fees (Management,
Distribution, Charity, Advisory, Subscription, Redemption, Conversion,
Other Costs, Foreign UCIs Tax, Taxe Abonnement...), il faudrait un
`outerjoin` différent sur `product_fee` **pour chaque colonne** — la
même table jointe 40 à 50 fois avec des conditions différentes.

Conséquences concrètes :
- Requête très lente à planifier et exécuter côté PostgreSQL
- Risque d'explosion du nombre de lignes retournées (chaque jointure
  supplémentaire peut multiplier les résultats)
- Ajouter un nouveau type de fee = retoucher une requête déjà énorme
- Debug quasi impossible si une valeur est fausse (laquelle des 40
  jointures a mal matché ?)

## La solution : séparer "aller chercher" de "organiser"

On découpe le travail en deux étapes qui ne se gênent pas :

1. **Une requête SQL simple** qui récupère TOUTES les lignes
   `product_fee` pour les shares demandés, sans essayer de les trier
   ou de les filtrer par type — juste `WHERE sha_cd IN (:sha_cds)`.
2. **Un tri en mémoire, côté Python**, qui classe chaque ligne brute
   dans la bonne colonne, piloté par une config déclarative
   (`FEE_GROUPS`) — pas de code à écrire pour chaque nouveau fee,
   juste une entrée de config à ajouter.

## Schéma du flux complet

```
┌───────────────────────────────────────────────────────────────────┐
│  POST /retrieve_fees_data   { "prod_cd_list": [...] }              │
└────────────────────────────────┬────────────────────────────────────┘
                                  ▼
                     ┌─────────────────────────┐
                     │  RetrieveFeesDataResource │
                     │  (orchestre, ne fait       │
                     │   pas de logique métier)    │
                     └────────────┬─────────────────┘
                                  │
          ┌───────────────────────┼────────────────────────┐
          ▼                       ▼                          │
┌──────────────────────┐  ┌─────────────────────────┐         │
│ single_export /        │  │ get_raw_fees(sha_cds)     │       │
│ subfund_export           │  │ (NOUVELLE méthode)          │      │
│ (EXISTANT, inchangé,       │  │                              │      │
│  ADL in/out inclus)          │  │ 1 SEULE requête :             │      │
│                                │  │   SELECT * FROM product_fee    │     │
│ → Umbrella / Subfund /          │  │   WHERE sha_cd IN (:sha_cds)     │    │
│   Share / ISIN / ADL              │  │   (index sur sha_cd)               │   │
└──────────────┬────────────────────┘  └───────────────┬──────────────────┘   │
               │                                         │                     │
               │ lignes "métadonnées"                    │ lignes "fees brutes"│
               │ (une par share, colonnes ADL              │ (toutes, non triées)│
               │  déjà remplies)                             │                    │
               ▼                                             ▼                    │
               └──────────────────┬──────────────────────────┘                    │
                                   ▼                                               │
                     ┌─────────────────────────────┐                              │
                     │  FeeExportService              │                             │
                     │  .build_fee_columns()            │                            │
                     │                                     │                           │
                     │  1 passage en mémoire sur les        │                          │
                     │  lignes brutes, chaque ligne           │                         │
                     │  matchée contre FEE_GROUPS (config)      │                       │
                     │  → aucun accès DB supplémentaire            │                    │
                     └──────────────────┬─────────────────────────┘                    │
                                        ▼                                               │
                        { sha_cd: {colonne: valeur} }                                  │
                                        │                                                │
                                        ▼                                                │
                          Merge dans les lignes de métadonnées ◄────────────────────────┘
                                        │
                                        ▼
                            Réponse JSON complète
                    (consommée par le 2e microservice qui
                     génère l'Excel et gère le téléchargement)
```

## Pourquoi cette approche règle le problème de perf

| Approche ADL généralisée (évitée) | Approche retenue ici |
|---|---|
| 1 requête avec 40-50 `outerjoin` sur `product_fee` | 1 requête simple, filtrée sur `sha_cd IN (...)` |
| Risque d'explosion cartésienne | Pas de jointure répétée → pas de multiplication de lignes |
| Ajouter un fee type = retoucher la requête SQL | Ajouter un fee type = une entrée dans `FEE_GROUPS`, zéro SQL |
| Un seul index ne suffit pas à couvrir toutes les combinaisons | Un seul index nécessaire : `product_fee(sha_cd)` |
| Debug difficile (quelle jointure a raté ?) | Debug facile : on inspecte les lignes brutes indépendamment du pivot |

## Ce qui n'est PAS touché

- `single_export` et `subfund_export` restent identiques aux fichiers
  actuellement en prod, ADL in/out y compris — zéro risque de
  régression sur l'endpoint ADL existant.
- Aucun modèle SQLAlchemy modifié.

## Point d'attention pour la prod

Vérifier qu'un **index existe sur `product_fee.sha_cd`** (et
idéalement un index composite `(sha_cd, fees_typ_cd)` si les volumes
sont importants) — c'est le vrai levier de perf de cette architecture,
plus que la façon dont la requête est écrite.

## Fichiers livrés dans ce package

| Fichier | Action | Destination |
|---|---|---|
| `constants/export_query_constants_ADDITIONS.py` | Copier le contenu à la fin de `src/constants/export_query_constants.py` (ne pas écraser) | `src/constants/export_query_constants.py` |
| `constants/fee_groups_config.py` | Nouveau fichier | `src/constants/fee_groups_config.py` |
| `repositories/export_query_repository_ADDITION.py` | Copier la méthode `get_raw_fees` dans la classe `ExportQueryRepository` existante | `src/repositories/export_query_repository.py` |
| `services/fee_export_service.py` | Nouveau fichier | `src/services/fee_export_service.py` |
| `resources/retrieve_fees_data.py` | Nouveau fichier | `src/resources/retrieve_fees_data.py` |
| `routes/retrieve_fees_data.py` | Nouveau fichier | `src/routes/retrieve_fees_data.py` |
| `swagger/retrieve_fees_data/POST.yml` | Nouveau fichier | `src/swagger/retrieve_fees_data/POST.yml` |

## Étapes restantes

1. Placer les fichiers selon le tableau ci-dessus
2. Enregistrer le blueprint dans `app.py` :
   ```python
   from routes.retrieve_fees_data import RETRIEVE_FEES_DATA_BLUEPRINT
   app.register_blueprint(RETRIEVE_FEES_DATA_BLUEPRINT, url_prefix="/api")
   ```
3. Vérifier en base que les codes utilisés dans `fee_groups_config.py`
   (`MANAGEMENT_SUBTYPE="1"`, `OTHER_COSTS_CATEGORY="15"`, etc.)
   correspondent bien à des lignes réelles pour un `sha_cd` connu
4. Tester `get_raw_fees` isolément
5. Tester `FeeExportService.build_fee_columns` sans DB, avec des
   lignes construites à la main
6. Tester l'endpoint complet avec un `prod_cd_list` dont tu connais
   déjà les valeurs attendues (comparer avec le fichier Excel de
   référence "ABDALLAH Template fees Update")

## Ce qui reste à valider avec le métier

- Hedging fees et Performance fees ne sont pas encore dans
  `FEE_GROUPS` — codes DB à confirmer avant de les ajouter
- Charity est traité ici comme un subtype direct (`CHARITY_SUBTYPE="4"`)
  — à confirmer que c'est le bon mécanisme
