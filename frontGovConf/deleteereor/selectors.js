// @flow

export const selectGovernances = (state: any) =>
  state.entities.governance.governances || [];

export const selectGovernancesLoading = (state: any) =>
  state.entities.governance.loading || false;

export const selectGovernancesError = (state: any) =>
  state.entities.governance.error || null;

export const selectGovernancesCreating = (state: any) =>
  state.entities.governance.creating || false;

export const selectGovernancesCreatingError = (state: any) =>
  state.entities.governance.creatingError || null;

export const selectGovernanceDeleteLinkedError = (state: any) =>
  state.entities.governance.deleteLinkedError || null;
