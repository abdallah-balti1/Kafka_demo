// @flow

export const selectGovernances = (state: any) =>
  state.governance.governances || [];

export const selectGovernancesLoading = (state: any) =>
  state.governance.loading || false;

export const selectGovernancesError = (state: any) =>
  state.governance.error || null;

export const selectGovernancesCreating = (state: any) =>
  state.governance.creating || false;

export const selectGovernancesCreatingError = (state: any) =>
  state.governance.creatingError || null;
