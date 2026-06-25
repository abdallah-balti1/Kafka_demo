# Ticket 265729 — Tooltip comment sur INITIATIVE TASKS

## Fichier 1 : columns.js
src/pages/InitiativePipelineCard/components/InitiativePipelineTasksTab/columns.js

### AVANT (à chercher, vers ligne 205)
```js
{
  id: 'comment',
  Header: <TableHeader label="COMMENT" />,
  accessor: 'comment',
  Cell: ({ value }: { value: any }) => value ?? '',
  Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
},
```

### APRÈS (à remplacer par)
```js
{
  id: 'comment',
  Header: <TableHeader label="COMMENT" />,
  accessor: 'comment',
  Cell: ({ value }: { value: any }) =>
    value ? (
      <Icon name="comment" size={18} data-tip={value} style={{ cursor: 'pointer' }} />
    ) : (
      ''
    ),
  Filter: (props: FilterComponentPropsType) => <FilterInputWithPlaceholder {...props} />,
},
```

Rien d'autre à changer dans ce fichier (Icon est déjà importé en haut).

---

## Fichier 2 : InitiativePipelineTasksTab.js
src/pages/InitiativePipelineCard/components/InitiativePipelineTasksTab/InitiativePipelineTasksTab.js

### 1) Ajouter en haut du fichier, avec les autres imports
```js
import ReactTooltip from 'react-tooltip';
import { ReactTooltipContainer } from 'styles';
```

### 2) Dans render(), juste après la balise <Table ... /> existante, ajouter
```js
<ReactTooltipContainer>
  <ReactTooltip type="light" effect="solid" delayShow={200} multiline />
</ReactTooltipContainer>
```

---

## Résultat attendu
- Tâche avec commentaire → icône comment visible → hover affiche le texte en tooltip
- Tâche sans commentaire → pas d'icône, pas de tooltip
- Tooltip en lecture seule (comportement natif de react-tooltip)
- multiline gère les textes longs / retours à la ligne sans bug d'affichage
