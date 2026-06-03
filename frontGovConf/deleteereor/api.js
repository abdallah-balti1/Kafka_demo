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

export function createGovernanceApi(payload: any, token: string) {
  const requestURL = `${config.INITIATIVE_API_URL}/governances`;
  return request(requestURL, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: payload,
  });
}

export function updateGovernanceApi(payload: any, token: string) {
  const { id, ...data } = payload;
  const requestURL = `${config.INITIATIVE_API_URL}/governances/${id}`;
  return request(requestURL, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data,
  });
}

export function deleteGovernanceApi(id: number, token: string) {
  const requestURL = `${config.INITIATIVE_API_URL}/governances/${id}`;
  return request(requestURL, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
}

// ── Commitee ──────────────────────────────────────────────────────────────────

export function createCommiteeApi(payload: any, token: string) {
  const requestURL = `${config.INITIATIVE_API_URL}/governances/${payload.governance_id}/commitees`;
  return request(requestURL, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: { name: payload.name, order: payload.order },
  });
}

export function updateCommiteeApi(payload: any, token: string) {
  const { id, ...data } = payload;
  const requestURL = `${config.INITIATIVE_API_URL}/commitees/${id}`;
  return request(requestURL, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data,
  });
}

export function deleteCommiteeApi(id: number, token: string) {
  const requestURL = `${config.INITIATIVE_API_URL}/commitees/${id}`;
  return request(requestURL, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
}

// ── StatusInitiative ──────────────────────────────────────────────────────────

export function createStatusInitiativeApi(payload: any, token: string) {
  const requestURL = `${config.INITIATIVE_API_URL}/commitees/${payload.commitee_id}/statuses`;
  return request(requestURL, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: { name: payload.name, is_final_status: payload.is_final_status },
  });
}

export function updateStatusInitiativeApi(payload: any, token: string) {
  const { id, ...data } = payload;
  const requestURL = `${config.INITIATIVE_API_URL}/statuses/${id}`;
  return request(requestURL, {
    method: 'PUT',
    headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data,
  });
}

export function deleteStatusInitiativeApi(id: number, token: string) {
  const requestURL = `${config.INITIATIVE_API_URL}/statuses/${id}`;
  return request(requestURL, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
}
