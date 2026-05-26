// @flow

export const modelizeGovernance = (governance: any) => ({
  id: governance.id,
  name: governance.name,
  commitees: Array.isArray(governance.commitees)
    ? governance.commitees.map(modelizeCommitee)
    : [],
});

export const modelizeCommitee = (commitee: any) => ({
  id: commitee.id,
  name: commitee.name,
  governance_id: commitee.governance_id,
  order: commitee.order,
  status_initiatives: Array.isArray(commitee.status_initiatives)
    ? commitee.status_initiatives.map(modelizeStatusInitiative)
    : [],
});

export const modelizeStatusInitiative = (status: any) => ({
  id: status.id,
  name: status.name,
  commitee_id: status.commitee_id,
  is_final_status: status.is_final_status,
});
