// ── 1. Dans Import.js — ajouter le lien dans la nav ──────────────────────────
// Ajoute "Governance Config" dans la liste des liens en haut de la page Import

import GovernanceConfig from './GovernanceConfig';

// Dans le JSX de Import.js, ajoute le lien :
<Style.NavLink to="/upload/governance-config">Governance Config</Style.NavLink>

// ── 2. Dans Import.js — ajouter la Route ─────────────────────────────────────
<Route path="/upload/governance-config" component={GovernanceConfig} />

// ── 3. Dans le root saga (ex: sagas/index.js ou rootSaga.js) ─────────────────
import governanceSaga from 'redux/entities/governance/sagas';

// Dans le fork/spawn des sagas :
yield fork(governanceSaga);
// ou
yield spawn(governanceSaga);

// ── 4. Dans le root reducer (ex: reducers/index.js ou rootReducer.js) ────────
import governance from 'redux/entities/governance/reducer';

const rootReducer = combineReducers({
  // ...existing reducers...
  governance,
});
