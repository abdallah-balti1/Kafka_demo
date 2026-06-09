# Ticket 265120 — Committee Agenda : restriction rôles

## FICHIER 1 : OpenedMenu.js

### 1a. Ajouter USER_ROLE_INITIATIVE_COORDINATOR dans les imports (si absent)
Ligne ~10, dans le bloc import depuis 'constants/app' :
```js
import {
  USER_ROLE_ADMIN,
  USER_ROLE_MANAGER,
  USER_ROLE_MASS_UPDATER,
  USER_ROLE_OBSERVER,
  USER_ROLE_PROJECT_OWNER,
  USER_ROLE_USER,
  USER_ROLE_INITIATIVE_COORDINATOR,  // ✅ AJOUTER
} from 'constants/app';
```

### 1b. Ajouter la variable isUserAllowedForCommitteeAgenda
Après la ligne isUserAllowedToCreateInitiative (~ligne 63) :
```js
const isUserAllowedForCommitteeAgenda =
  user.roles.includes(USER_ROLE_ADMIN) ||
  user.roles.includes(USER_ROLE_INITIATIVE_COORDINATOR);
```

### 1c. Remplacer la condition du lien Committee Agenda (~ligne 112)
```js
// ❌ AVANT
{isUserAllowedForInitiativePipelines && (
  <Style.SubNavLink
    to="/committee-agenda"
    activeClassName="menu__nav-link--selected"
    isActive={(match, location) =>
      matchPath(location.pathname, { path: COMMITTEE_AGENDA })
    }
  >
    <FormattedMessage id="MENU.COMMITTEE_AGENDA" />
  </Style.SubNavLink>
)}

// ✅ APRÈS
{isUserAllowedForCommitteeAgenda && (
  <Style.SubNavLink
    to="/committee-agenda"
    activeClassName="menu__nav-link--selected"
    isActive={(match, location) =>
      matchPath(location.pathname, { path: COMMITTEE_AGENDA })
    }
  >
    <FormattedMessage id="MENU.COMMITTEE_AGENDA" />
  </Style.SubNavLink>
)}
```

---

## FICHIER 2 : CommitteeAgenda.js

### 2a. Ajouter les imports
```js
import { USER_ROLE_ADMIN, USER_ROLE_INITIATIVE_COORDINATOR } from 'constants/app';
```

### 2b. Ajouter user dans MapStateToPropsType (~ligne 26)
```js
export type MapStateToPropsType = {
  selectedColumns: string[],
  tableConfig: PipelineConfigType,
  user: UserType,  // ✅ AJOUTER
};
```

### 2c. Ajouter le guard dans render() après le destructuring (~ligne 120)
```js
render() {
  const { selectedColumns, user } = this.props;  // ✅ ajouter user
  const {
    isFilterOpen,
    isCustomizeModalOpen,
    filters,
    sorts,
    initiativeTablePage,
    selectedWeek,
  } = this.state;

  // ✅ AJOUTER : guard rôles
  const isAllowed =
    user.roles.includes(USER_ROLE_ADMIN) ||
    user.roles.includes(USER_ROLE_INITIATIVE_COORDINATOR);

  if (!isAllowed) {
    return <Redirect to="/" />;
  }

  // ... reste du render inchangé
```

---

## FICHIER 3 : CommitteeAgenda.wrap.js

Vérifier que `user` est mappé depuis le store. Ajouter si absent :
```js
const mapStateToProps = (state) => ({
  // ... existant ...
  user: state.user,  // ✅ AJOUTER si absent (adapter selon le chemin exact du store)
});
```
