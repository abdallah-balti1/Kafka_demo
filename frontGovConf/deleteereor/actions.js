// @flow

import {
  FETCH_GOVERNANCES,
  FETCH_GOVERNANCES_SUCCESS,
  FETCH_GOVERNANCES_FAILURE,
  CREATE_GOVERNANCE,
  CREATE_GOVERNANCE_SUCCESS,
  CREATE_GOVERNANCE_FAILURE,
  DELETE_GOVERNANCE,
  DELETE_GOVERNANCE_SUCCESS,
  DELETE_GOVERNANCE_FAILURE,
  DELETE_GOVERNANCE_LINKED_ERROR,
  UPDATE_GOVERNANCE,
  CREATE_COMMITEE,
  CREATE_COMMITEE_SUCCESS,
  CREATE_COMMITEE_FAILURE,
  DELETE_COMMITEE,
  DELETE_COMMITEE_SUCCESS,
  DELETE_COMMITEE_FAILURE,
  UPDATE_COMMITEE,
  CREATE_STATUS_INITIATIVE,
  CREATE_STATUS_INITIATIVE_SUCCESS,
  CREATE_STATUS_INITIATIVE_FAILURE,
  DELETE_STATUS_INITIATIVE,
  DELETE_STATUS_INITIATIVE_SUCCESS,
  DELETE_STATUS_INITIATIVE_FAILURE,
  UPDATE_STATUS_INITIATIVE,
  CLEAR_GOVERNANCE_ERROR,
} from './constants';

// ── Governance ────────────────────────────────────────────────────────────────

export const fetchGovernances = () => ({ type: FETCH_GOVERNANCES });
export const fetchGovernancesSuccess = (governances: any) => ({ type: FETCH_GOVERNANCES_SUCCESS, payload: governances });
export const fetchGovernancesFailure = (error: any) => ({ type: FETCH_GOVERNANCES_FAILURE, payload: error });

export const createGovernance = (payload: any) => ({ type: CREATE_GOVERNANCE, payload });
export const createGovernanceSuccess = (governance: any) => ({ type: CREATE_GOVERNANCE_SUCCESS, payload: governance });
export const createGovernanceFailure = (error: any) => ({ type: CREATE_GOVERNANCE_FAILURE, payload: error });

export const deleteGovernance = (id: number) => ({ type: DELETE_GOVERNANCE, payload: id });
export const deleteGovernanceSuccess = (id: number) => ({ type: DELETE_GOVERNANCE_SUCCESS, payload: id });
export const deleteGovernanceFailure = (error: any) => ({ type: DELETE_GOVERNANCE_FAILURE, payload: error });
export const deleteGovernanceLinkedError = (payload: { message: string, initiative_count: number }) => ({
  type: DELETE_GOVERNANCE_LINKED_ERROR,
  payload,
});

export const updateGovernance = (id: number, payload: any) => ({
  type: UPDATE_GOVERNANCE,
  payload: { id, ...payload },
});

// ── Commitee ──────────────────────────────────────────────────────────────────

export const createCommitee = (payload: any) => ({ type: CREATE_COMMITEE, payload });
export const createCommiteeSuccess = (commitee: any) => ({ type: CREATE_COMMITEE_SUCCESS, payload: commitee });
export const createCommiteeFailure = (error: any) => ({ type: CREATE_COMMITEE_FAILURE, payload: error });

export const deleteCommitee = (id: number) => ({ type: DELETE_COMMITEE, payload: id });
export const deleteCommiteeSuccess = (id: number) => ({ type: DELETE_COMMITEE_SUCCESS, payload: id });
export const deleteCommiteeFailure = (error: any) => ({ type: DELETE_COMMITEE_FAILURE, payload: error });

export const updateCommitee = (id: number, payload: any) => ({
  type: UPDATE_COMMITEE,
  payload: { id, ...payload },
});

// ── StatusInitiative ──────────────────────────────────────────────────────────

export const createStatusInitiative = (payload: any) => ({ type: CREATE_STATUS_INITIATIVE, payload });
export const createStatusInitiativeSuccess = (status: any) => ({ type: CREATE_STATUS_INITIATIVE_SUCCESS, payload: status });
export const createStatusInitiativeFailure = (error: any) => ({ type: CREATE_STATUS_INITIATIVE_FAILURE, payload: error });

export const deleteStatusInitiative = (id: number) => ({ type: DELETE_STATUS_INITIATIVE, payload: id });
export const deleteStatusInitiativeSuccess = (id: number) => ({ type: DELETE_STATUS_INITIATIVE_SUCCESS, payload: id });
export const deleteStatusInitiativeFailure = (error: any) => ({ type: DELETE_STATUS_INITIATIVE_FAILURE, payload: error });

export const updateStatusInitiative = (id: number, payload: any) => ({
  type: UPDATE_STATUS_INITIATIVE,
  payload: { id, ...payload },
});

// ── Misc ──────────────────────────────────────────────────────────────────────

export const clearGovernanceError = () => ({ type: CLEAR_GOVERNANCE_ERROR });
