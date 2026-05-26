// @flow

import { getApiUrl } from 'utils/api';

export const fetchGovernancesApi = (token: string) =>
  fetch(`${getApiUrl()}/governances`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());

export const createGovernanceApi = (token: string, payload: { name: string }) =>
  fetch(`${getApiUrl()}/governances`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(res => res.json());

export const deleteGovernanceApi = (token: string, id: number) =>
  fetch(`${getApiUrl()}/governances/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

export const createCommiteeApi = (token: string, payload: { governance_id: number, name: string, order?: number }) =>
  fetch(`${getApiUrl()}/governances/${payload.governance_id}/commitees`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: payload.name, order: payload.order }),
  }).then(res => res.json());

export const deleteCommiteeApi = (token: string, id: number) =>
  fetch(`${getApiUrl()}/commitees/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

export const createStatusInitiativeApi = (token: string, payload: { commitee_id: number, name: string, is_final_status: boolean }) =>
  fetch(`${getApiUrl()}/commitees/${payload.commitee_id}/statuses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: payload.name, is_final_status: payload.is_final_status }),
  }).then(res => res.json());

export const deleteStatusInitiativeApi = (token: string, id: number) =>
  fetch(`${getApiUrl()}/statuses/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
