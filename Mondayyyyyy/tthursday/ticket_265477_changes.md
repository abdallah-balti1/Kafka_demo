# Ticket 265477 — Confirmation avant fermeture du task pop-up

## Fichier à modifier
`src/pages/InitiativePipelineCard/components/InitiativePipelineTasksTab/InitiativePipelineTasksTab.js`

---

## CHANGEMENT 1 — Ajouter isLeaveTaskConfirmOpen dans le state (constructeur)

Chercher dans le constructeur le bloc this.state = { ... } et ajouter la ligne :

```js
// Ajouter dans this.state = { ... } après isOnGoingTaskModalOpen: false,
isLeaveTaskConfirmOpen: false,
```

---

## CHANGEMENT 2 — Ajouter 3 nouvelles méthodes après closeRatingEditModal

Coller ces 3 méthodes juste APRÈS la fermeture de closeRatingEditModal = () => { ... };

```js
// ✅ Détecte si le formulaire a été modifié par rapport aux valeurs initiales du task
isRatingFormDirty = () => {
  const { ratingEditValues, ratingEditingTaskId } = this.state;
  const tasks = (
    this.props.teamInitiativeRelationshipWithTasks?.flatMap(rel => rel.tasks ?? []) ?? []
  );
  const originalTask = tasks.find(t => String(t.id) === String(ratingEditingTaskId));
  if (!originalTask) return false;

  return (
    (ratingEditValues.comment || '') !== (originalTask.comment || '') ||
    ratingEditValues.risks !== originalTask.rating ||
    (ratingEditValues.type || '') !== (originalTask.type || '') ||
    (ratingEditValues.name || '') !== (originalTask.name || '') ||
    (ratingEditValues.team || '') !== (originalTask.team || '') ||
    (ratingEditValues.status || '') !== (originalTask.status || '') ||
    ratingEditValues.expectedFor !== (originalTask.expectedFor || null) ||
    (ratingEditValues.description || '') !== (originalTask.description || '')
  );
};

// ✅ Intercepte le close — affiche confirmation si form modifié
handleCloseRatingEditModal = () => {
  if (this.isRatingFormDirty()) {
    this.setState({ isLeaveTaskConfirmOpen: true });
  } else {
    this.closeRatingEditModal();
  }
};

// ✅ Confirme la sortie sans sauvegarder
confirmLeaveTask = () => {
  this.setState({ isLeaveTaskConfirmOpen: false });
  this.closeRatingEditModal();
};

// ✅ Annule la sortie — reste dans le modal
cancelLeaveTask = () => {
  this.setState({ isLeaveTaskConfirmOpen: false });
};
```

---

## CHANGEMENT 3 — Remplacer onCloseClick du modal rating

Chercher (environ ligne 770) :
```jsx
<Modal
  isOpen={isRatingEditModalOpen}
  height="95vh"
  width="97vw"
  onCloseClick={this.closeRatingEditModal}
>
```

Remplacer par :
```jsx
<Modal
  isOpen={isRatingEditModalOpen}
  height="95vh"
  width="97vw"
  onCloseClick={this.handleCloseRatingEditModal}
>
```

---

## CHANGEMENT 4 — Ajouter le modal de confirmation

Chercher la fermeture `</TabContainer>` à la fin du return() et ajouter JUSTE AVANT :

```jsx
{/* ✅ Modal confirmation "Leave Task Page" */}
{isLeaveTaskConfirmOpen && (
  <Modal
    isOpen={isLeaveTaskConfirmOpen}
    onCloseClick={this.cancelLeaveTask}
    width="400px"
    height="220px"
  >
    <div style={{ padding: '32px 24px 24px 24px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <span style={{ fontWeight: 700, fontSize: 16, textTransform: 'uppercase' }}>
          Leave Task Page
        </span>
      </div>
      <p style={{ fontSize: 14, color: '#444', marginBottom: 24 }}>
        Are you sure you want to leave the page without saving? All data input will be lost.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={this.cancelLeaveTask}
          style={{
            padding: '8px 24px',
            border: `2px solid ${BNPColors.tropicalRainForest}`,
            background: 'white',
            color: BNPColors.tropicalRainForest,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            textTransform: 'uppercase',
          }}
        >
          Cancel
        </button>
        <button
          onClick={this.confirmLeaveTask}
          style={{
            padding: '8px 24px',
            background: BNPColors.tropicalRainForest,
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 13,
            textTransform: 'uppercase',
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  </Modal>
)}
```

---

## CHANGEMENT 5 — Ajouter isLeaveTaskConfirmOpen dans le destructuring du state (render)

Dans le render(), chercher le destructuring de this.state qui contient isRatingEditModalOpen et ajouter :

```js
// Chercher :
const {
  selectedTaskId,
  expandedParents,
  isRatingEditModalOpen,
  // ...
} = this.state;

// Ajouter isLeaveTaskConfirmOpen dans cette liste :
const {
  selectedTaskId,
  expandedParents,
  isRatingEditModalOpen,
  isLeaveTaskConfirmOpen,  // ✅ AJOUTER
  // ...
} = this.state;
```

---

## Résumé des changements

| # | Quoi | Où |
|---|---|---|
| 1 | `isLeaveTaskConfirmOpen: false` dans state | constructeur |
| 2 | 4 nouvelles méthodes | après `closeRatingEditModal` |
| 3 | `onCloseClick={this.handleCloseRatingEditModal}` | Modal rating ~ligne 770 |
| 4 | Modal confirmation JSX | avant `</TabContainer>` |
| 5 | `isLeaveTaskConfirmOpen` dans destructuring state | render() |
