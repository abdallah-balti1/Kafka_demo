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
  CREATE_COMMITEE,
  CREATE_COMMITEE_SUCCESS,
  CREATE_COMMITEE_FAILURE,
  DELETE_COMMITEE,
  DELETE_COMMITEE_SUCCESS,
  DELETE_COMMITEE_FAILURE,
  CREATE_STATUS_INITIATIVE,
  CREATE_STATUS_INITIATIVE_SUCCESS,
  CREATE_STATUS_INITIATIVE_FAILURE,
  DELETE_STATUS_INITIATIVE,
  DELETE_STATUS_INITIATIVE_SUCCESS,
  DELETE_STATUS_INITIATIVE_FAILURE,
} from './constants';

// ── Governance ────────────────────────────────────────────────────────────────

export const fetchGovernances = () => ({
  type: FETCH_GOVERNANCES,
});

export const fetchGovernancesSuccess = (governances: any) => ({
  type: FETCH_GOVERNANCES_SUCCESS,
  payload: governances,
});

export const fetchGovernancesFailure = (error: any) => ({
  type: FETCH_GOVERNANCES_FAILURE,
  payload: error,
});

export const createGovernance = (payload: { name: string, commitees: any[] }) => ({
  type: CREATE_GOVERNANCE,
  payload,
});

export const createGovernanceSuccess = (governance: any) => ({
  type: CREATE_GOVERNANCE_SUCCESS,
  payload: governance,
});

export const createGovernanceFailure = (error: any) => ({
  type: CREATE_GOVERNANCE_FAILURE,
  payload: error,
});

export const deleteGovernance = (id: number) => ({
  type: DELETE_GOVERNANCE,
  payload: id,
});

export const deleteGovernanceSuccess = (id: number) => ({
  type: DELETE_GOVERNANCE_SUCCESS,
  payload: id,
});

export const deleteGovernanceFailure = (error: any) => ({
  type: DELETE_GOVERNANCE_FAILURE,
  payload: error,
});

// ── Commitee ──────────────────────────────────────────────────────────────────

export const createCommitee = (payload: { governance_id: number, name: string, order?: number, statuses: any[] }) => ({
  type: CREATE_COMMITEE,
  payload,
});

export const createCommiteeSuccess = (commitee: any) => ({
  type: CREATE_COMMITEE_SUCCESS,
  payload: commitee,
});

export const createCommiteeFailure = (error: any) => ({
  type: CREATE_COMMITEE_FAILURE,
  payload: error,
});

export const deleteCommitee = (id: number) => ({
  type: DELETE_COMMITEE,
  payload: id,
});

export const deleteCommiteeSuccess = (id: number) => ({
  type: DELETE_COMMITEE_SUCCESS,
  payload: id,
});

export const deleteCommiteeFailure = (error: any) => ({
  type: DELETE_COMMITEE_FAILURE,
  payload: error,
});

// ── StatusInitiative ──────────────────────────────────────────────────────────

export const createStatusInitiative = (payload: { commitee_id: number, name: string, is_final_status: boolean }) => ({
  type: CREATE_STATUS_INITIATIVE,
  payload,
});

export const createStatusInitiativeSuccess = (status: any) => ({
  type: CREATE_STATUS_INITIATIVE_SUCCESS,
  payload: status,
});

export const createStatusInitiativeFailure = (error: any) => ({
  type: CREATE_STATUS_INITIATIVE_FAILURE,
  payload: error,
});

export const deleteStatusInitiative = (id: number) => ({
  type: DELETE_STATUS_INITIATIVE,
  payload: id,
});

export const deleteStatusInitiativeSuccess = (id: number) => ({
  type: DELETE_STATUS_INITIATIVE_SUCCESS,
  payload: id,
});

export const deleteStatusInitiativeFailure = (error: any) => ({
  type: DELETE_STATUS_INITIATIVE_FAILURE,
  payload: error,
});
