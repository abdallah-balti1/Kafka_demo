// @flow

import config from 'utils/config';
import { request } from 'utils/request';

// ── Governance ────────────────────────────────────────────────────────────────

export function fetchGovernancesApi(token: string) {
  const requestURL = `${config.INITIATIVE_API_URL}/governances`;
  return request(requestURL, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });
}

export function createGovernanceApi(token: string, payload: { name: string }) {
  const requestURL = `${config.INITIATIVE_API_URL}/governances`;
  return request(requestURL, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: payload,
  });
}

export function deleteGovernanceApi(token: string, id: number) {
  const requestURL = `${config.INITIATIVE_API_URL}/governances/${id}`;
  return request(requestURL, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
}

// ── Commitee ──────────────────────────────────────────────────────────────────

export function createCommiteeApi(token: string, payload: { governance_id: number, name: string, order?: number }) {
  const requestURL = `${config.INITIATIVE_API_URL}/governances/${payload.governance_id}/commitees`;
  return request(requestURL, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: { name: payload.name, order: payload.order },
  });
}

export function deleteCommiteeApi(token: string, id: number) {
  const requestURL = `${config.INITIATIVE_API_URL}/commitees/${id}`;
  return request(requestURL, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
}

// ── StatusInitiative ──────────────────────────────────────────────────────────

export function createStatusInitiativeApi(token: string, payload: { commitee_id: number, name: string, is_final_status: boolean }) {
  const requestURL = `${config.INITIATIVE_API_URL}/commitees/${payload.commitee_id}/statuses`;
  return request(requestURL, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: { name: payload.name, is_final_status: payload.is_final_status },
  });
}

export function deleteStatusInitiativeApi(token: string, id: number) {
  const requestURL = `${config.INITIATIVE_API_URL}/statuses/${id}`;
  return request(requestURL, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
}
