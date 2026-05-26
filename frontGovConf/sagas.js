// @flow

import { call, put, select, takeLatest } from 'redux-saga/effects';

import { selectToken } from 'redux/entities/user/selectors';

import {
  fetchGovernancesSuccess,
  fetchGovernancesFailure,
  createGovernanceSuccess,
  createGovernanceFailure,
  deleteGovernanceSuccess,
  deleteGovernanceFailure,
  createCommiteeSuccess,
  createCommiteeFailure,
  deleteCommiteeSuccess,
  deleteCommiteeFailure,
  createStatusInitiativeSuccess,
  createStatusInitiativeFailure,
  deleteStatusInitiativeSuccess,
  deleteStatusInitiativeFailure,
  fetchGovernances,
} from './actions';

import {
  fetchGovernancesApi,
  createGovernanceApi,
  deleteGovernanceApi,
  createCommiteeApi,
  deleteCommiteeApi,
  createStatusInitiativeApi,
  deleteStatusInitiativeApi,
} from './api';

import {
  FETCH_GOVERNANCES,
  CREATE_GOVERNANCE,
  DELETE_GOVERNANCE,
  CREATE_COMMITEE,
  DELETE_COMMITEE,
  CREATE_STATUS_INITIATIVE,
  DELETE_STATUS_INITIATIVE,
} from './constants';

import { modelizeGovernance, modelizeCommitee, modelizeStatusInitiative } from './modelize';

// ── Fetch Governances ─────────────────────────────────────────────────────────

function* fetchGovernancesSaga(): Generator<any, any, any> {
  try {
    const token = yield select(selectToken);
    const response = yield call(fetchGovernancesApi, token);
    const governances = Array.isArray(response)
      ? response.map(modelizeGovernance)
      : [];
    yield put(fetchGovernancesSuccess(governances));
  } catch (error) {
    yield put(fetchGovernancesFailure(error));
  }
}

// ── Create Governance (with commitees + statuses cascade) ─────────────────────

function* createGovernanceSaga(action: any): Generator<any, any, any> {
  try {
    const token = yield select(selectToken);
    const { name, commitees = [] } = action.payload;

    // 1. Create governance
    const govResponse = yield call(createGovernanceApi, token, { name });
    const governance = modelizeGovernance(govResponse);

    yield put(createGovernanceSuccess(governance));

    // 2. Create commitees with their statuses
    for (let ci = 0; ci < commitees.length; ci++) {
      const commitee = commitees[ci];
      const commiteeResponse = yield call(createCommiteeApi, token, {
        governance_id: governance.id,
        name: commitee.name,
        order: ci + 1,
      });
      const newCommitee = modelizeCommitee(commiteeResponse);
      yield put(createCommiteeSuccess(newCommitee));

      // 3. Create statuses for each commitee
      const statuses = commitee.statuses || [];
      for (let si = 0; si < statuses.length; si++) {
        const status = statuses[si];
        const statusResponse = yield call(createStatusInitiativeApi, token, {
          commitee_id: newCommitee.id,
          name: status.name,
          is_final_status: status.is_final_status || false,
        });
        const newStatus = modelizeStatusInitiative(statusResponse);
        yield put(createStatusInitiativeSuccess(newStatus));
      }
    }

    // 4. Refresh list
    yield put(fetchGovernances());
  } catch (error) {
    yield put(createGovernanceFailure(error));
  }
}

// ── Delete Governance ─────────────────────────────────────────────────────────

function* deleteGovernanceSaga(action: any): Generator<any, any, any> {
  try {
    const token = yield select(selectToken);
    yield call(deleteGovernanceApi, token, action.payload);
    yield put(deleteGovernanceSuccess(action.payload));
  } catch (error) {
    yield put(deleteGovernanceFailure(error));
  }
}

// ── Create Commitee ───────────────────────────────────────────────────────────

function* createCommiteeSaga(action: any): Generator<any, any, any> {
  try {
    const token = yield select(selectToken);
    const response = yield call(createCommiteeApi, token, action.payload);
    const commitee = modelizeCommitee(response);
    yield put(createCommiteeSuccess(commitee));
  } catch (error) {
    yield put(createCommiteeFailure(error));
  }
}

// ── Delete Commitee ───────────────────────────────────────────────────────────

function* deleteCommiteeSaga(action: any): Generator<any, any, any> {
  try {
    const token = yield select(selectToken);
    yield call(deleteCommiteeApi, token, action.payload);
    yield put(deleteCommiteeSuccess(action.payload));
  } catch (error) {
    yield put(deleteCommiteeFailure(error));
  }
}

// ── Create StatusInitiative ───────────────────────────────────────────────────

function* createStatusInitiativeSaga(action: any): Generator<any, any, any> {
  try {
    const token = yield select(selectToken);
    const response = yield call(createStatusInitiativeApi, token, action.payload);
    const status = modelizeStatusInitiative(response);
    yield put(createStatusInitiativeSuccess(status));
  } catch (error) {
    yield put(createStatusInitiativeFailure(error));
  }
}

// ── Delete StatusInitiative ───────────────────────────────────────────────────

function* deleteStatusInitiativeSaga(action: any): Generator<any, any, any> {
  try {
    const token = yield select(selectToken);
    yield call(deleteStatusInitiativeApi, token, action.payload);
    yield put(deleteStatusInitiativeSuccess(action.payload));
  } catch (error) {
    yield put(deleteStatusInitiativeFailure(error));
  }
}

// ── Root Saga ─────────────────────────────────────────────────────────────────

export default function* governanceSaga(): Generator<any, any, any> {
  yield takeLatest(FETCH_GOVERNANCES, fetchGovernancesSaga);
  yield takeLatest(CREATE_GOVERNANCE, createGovernanceSaga);
  yield takeLatest(DELETE_GOVERNANCE, deleteGovernanceSaga);
  yield takeLatest(CREATE_COMMITEE, createCommiteeSaga);
  yield takeLatest(DELETE_COMMITEE, deleteCommiteeSaga);
  yield takeLatest(CREATE_STATUS_INITIATIVE, createStatusInitiativeSaga);
  yield takeLatest(DELETE_STATUS_INITIATIVE, deleteStatusInitiativeSaga);
}
