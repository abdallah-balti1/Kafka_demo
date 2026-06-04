// @flow

import { call, put, takeLatest } from 'redux-saga/effects';
import authenticatedCall from 'redux/utils/authenticatedCall';
import { handleAPIExceptions } from 'utils/api';

import {
  fetchGovernancesSuccess,
  fetchGovernancesFailure,
  createGovernanceSuccess,
  createGovernanceFailure,
  deleteGovernanceSuccess,
  deleteGovernanceFailure,
  deleteGovernanceLinkedError,
  createCommiteeSuccess,
  createCommiteeFailure,
  deleteCommiteeSuccess,
  deleteCommiteeFailure,
  deleteCommiteeLinkedError,
  createStatusInitiativeSuccess,
  createStatusInitiativeFailure,
  deleteStatusInitiativeSuccess,
  deleteStatusInitiativeFailure,
  deleteStatusLinkedError,
  fetchGovernances,
} from './actions';

import {
  fetchGovernancesApi,
  createGovernanceApi,
  deleteGovernanceApi,
  updateGovernanceApi,
  createCommiteeApi,
  deleteCommiteeApi,
  updateCommiteeApi,
  createStatusInitiativeApi,
  deleteStatusInitiativeApi,
  updateStatusInitiativeApi,
} from './api';

import {
  FETCH_GOVERNANCES,
  CREATE_GOVERNANCE,
  DELETE_GOVERNANCE,
  UPDATE_GOVERNANCE,
  CREATE_COMMITEE,
  DELETE_COMMITEE,
  UPDATE_COMMITEE,
  CREATE_STATUS_INITIATIVE,
  DELETE_STATUS_INITIATIVE,
  UPDATE_STATUS_INITIATIVE,
} from './constants';

import { modelizeGovernance, modelizeCommitee, modelizeStatusInitiative } from './modelize';

// ── Fetch ─────────────────────────────────────────────────────────────────────

export function* fetchGovernancesSaga(): Saga<*> {
  try {
    const response = yield authenticatedCall(fetchGovernancesApi);
    const governances = Array.isArray(response.data)
      ? response.data.map(modelizeGovernance)
      : [];
    yield put(fetchGovernancesSuccess(governances));
  } catch (error) {
    yield call(handleAPIExceptions, error);
    yield put(fetchGovernancesFailure(error));
  }
}

// ── Create Governance (cascade) ───────────────────────────────────────────────

export function* createGovernanceSaga(action: any): Saga<*> {
  try {
    const { name, commitees = [] } = action.payload;

    const govResponse = yield authenticatedCall(createGovernanceApi, { name });
    const governance = modelizeGovernance(govResponse.data);
    yield put(createGovernanceSuccess(governance));

    for (let ci = 0; ci < commitees.length; ci++) {
      const commitee = commitees[ci];
      const commiteeResponse = yield authenticatedCall(createCommiteeApi, {
        governance_id: governance.id,
        name: commitee.name,
        order: ci + 1,
      });
      const newCommitee = modelizeCommitee(commiteeResponse.data);
      yield put(createCommiteeSuccess(newCommitee));

      const statuses = commitee.statuses || [];
      for (let si = 0; si < statuses.length; si++) {
        const status = statuses[si];
        const statusResponse = yield authenticatedCall(createStatusInitiativeApi, {
          commitee_id: newCommitee.id,
          name: status.name,
          is_final_status: status.is_final_status || false,
        });
        const newStatus = modelizeStatusInitiative(statusResponse.data);
        yield put(createStatusInitiativeSuccess(newStatus));
      }
    }

    yield put(fetchGovernances());
  } catch (error) {
    yield call(handleAPIExceptions, error);
    yield put(createGovernanceFailure(error));
  }
}

// ── Delete Governance ─────────────────────────────────────────────────────────

export function* deleteGovernanceSaga(action: any): Saga<*> {
  try {
    yield authenticatedCall(deleteGovernanceApi, action.payload);
    yield put(deleteGovernanceSuccess(action.payload));
  } catch (error) {
    if (error && error.response && error.response.status === 409) {
      const data = error.response.data || {};
      yield put(deleteGovernanceLinkedError({
        message: data.message || 'This governance is linked to initiatives and cannot be deleted.',
        initiative_count: data.value || 0,
      }));
    } else {
      yield call(handleAPIExceptions, error);
      yield put(deleteGovernanceFailure(error));
    }
  }
}

// ── Update Governance ─────────────────────────────────────────────────────────

export function* updateGovernanceSaga(action: any): Saga<*> {
  try {
    yield authenticatedCall(updateGovernanceApi, action.payload);
    yield put(fetchGovernances());
  } catch (error) {
    yield call(handleAPIExceptions, error);
  }
}

// ── Create Commitee ───────────────────────────────────────────────────────────

export function* createCommiteeSaga(action: any): Saga<*> {
  try {
    const response = yield authenticatedCall(createCommiteeApi, action.payload);
    const commitee = modelizeCommitee(response.data);
    yield put(createCommiteeSuccess(commitee));
  } catch (error) {
    yield call(handleAPIExceptions, error);
    yield put(createCommiteeFailure(error));
  }
}

// ── Delete Commitee ───────────────────────────────────────────────────────────

export function* deleteCommiteeSaga(action: any): Saga<*> {
  try {
    yield authenticatedCall(deleteCommiteeApi, action.payload);
    yield put(deleteCommiteeSuccess(action.payload));
  } catch (error) {
    if (error && error.response && error.response.status === 409) {
      const data = error.response.data || {};
      yield put(deleteCommiteeLinkedError({
        message: data.message || 'This committee is linked to initiatives and cannot be deleted.',
        initiative_count: data.value || 0,
      }));
    } else {
      yield call(handleAPIExceptions, error);
      yield put(deleteCommiteeFailure(error));
    }
  }
}

// ── Update Commitee ───────────────────────────────────────────────────────────

export function* updateCommiteeSaga(action: any): Saga<*> {
  try {
    yield authenticatedCall(updateCommiteeApi, action.payload);
    yield put(fetchGovernances());
  } catch (error) {
    yield call(handleAPIExceptions, error);
  }
}

// ── Create StatusInitiative ───────────────────────────────────────────────────

export function* createStatusInitiativeSaga(action: any): Saga<*> {
  try {
    const response = yield authenticatedCall(createStatusInitiativeApi, action.payload);
    const status = modelizeStatusInitiative(response.data);
    yield put(createStatusInitiativeSuccess(status));
  } catch (error) {
    yield call(handleAPIExceptions, error);
    yield put(createStatusInitiativeFailure(error));
  }
}

// ── Delete StatusInitiative ───────────────────────────────────────────────────

export function* deleteStatusInitiativeSaga(action: any): Saga<*> {
  try {
    yield authenticatedCall(deleteStatusInitiativeApi, action.payload);
    yield put(deleteStatusInitiativeSuccess(action.payload));
  } catch (error) {
    if (error && error.response && error.response.status === 409) {
      const data = error.response.data || {};
      yield put(deleteStatusLinkedError({
        message: data.message || 'This status is linked to initiatives and cannot be deleted.',
        initiative_count: data.value || 0,
      }));
    } else {
      yield call(handleAPIExceptions, error);
      yield put(deleteStatusInitiativeFailure(error));
    }
  }
}

// ── Update StatusInitiative ───────────────────────────────────────────────────

export function* updateStatusInitiativeSaga(action: any): Saga<*> {
  try {
    yield authenticatedCall(updateStatusInitiativeApi, action.payload);
    yield put(fetchGovernances());
  } catch (error) {
    yield call(handleAPIExceptions, error);
  }
}

// ── Root Saga ─────────────────────────────────────────────────────────────────

export default function* sagas(): Saga<*> {
  yield takeLatest(FETCH_GOVERNANCES, fetchGovernancesSaga);
  yield takeLatest(CREATE_GOVERNANCE, createGovernanceSaga);
  yield takeLatest(DELETE_GOVERNANCE, deleteGovernanceSaga);
  yield takeLatest(UPDATE_GOVERNANCE, updateGovernanceSaga);
  yield takeLatest(CREATE_COMMITEE, createCommiteeSaga);
  yield takeLatest(DELETE_COMMITEE, deleteCommiteeSaga);
  yield takeLatest(UPDATE_COMMITEE, updateCommiteeSaga);
  yield takeLatest(CREATE_STATUS_INITIATIVE, createStatusInitiativeSaga);
  yield takeLatest(DELETE_STATUS_INITIATIVE, deleteStatusInitiativeSaga);
  yield takeLatest(UPDATE_STATUS_INITIATIVE, updateStatusInitiativeSaga);
}
