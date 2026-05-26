// @flow

import {
  FETCH_GOVERNANCES,
  FETCH_GOVERNANCES_SUCCESS,
  FETCH_GOVERNANCES_FAILURE,
  CREATE_GOVERNANCE_SUCCESS,
  DELETE_GOVERNANCE_SUCCESS,
  CREATE_COMMITEE_SUCCESS,
  DELETE_COMMITEE_SUCCESS,
  CREATE_STATUS_INITIATIVE_SUCCESS,
  DELETE_STATUS_INITIATIVE_SUCCESS,
} from './constants';

type StateType = {
  governances: any[],
  loading: boolean,
  error: ?string,
  creating: boolean,
  creatingError: ?string,
};

const initialState: StateType = {
  governances: [],
  loading: false,
  error: null,
  creating: false,
  creatingError: null,
};

const governance = (state: StateType = initialState, action: any): StateType => {
  switch (action.type) {
    // ── Fetch ───────────────────────────────────────────────────────────────
    case FETCH_GOVERNANCES:
      return { ...state, loading: true, error: null };

    case FETCH_GOVERNANCES_SUCCESS:
      return { ...state, loading: false, governances: action.payload };

    case FETCH_GOVERNANCES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── Create Governance ───────────────────────────────────────────────────
    case CREATE_GOVERNANCE_SUCCESS:
      return {
        ...state,
        creating: false,
        governances: [...state.governances, action.payload],
      };

    // ── Delete Governance ───────────────────────────────────────────────────
    case DELETE_GOVERNANCE_SUCCESS:
      return {
        ...state,
        governances: state.governances.filter(g => g.id !== action.payload),
      };

    // ── Create Commitee ─────────────────────────────────────────────────────
    case CREATE_COMMITEE_SUCCESS:
      return {
        ...state,
        governances: state.governances.map(g => {
          if (g.id !== action.payload.governance_id) return g;
          return {
            ...g,
            commitees: [...(g.commitees || []), action.payload],
          };
        }),
      };

    // ── Delete Commitee ─────────────────────────────────────────────────────
    case DELETE_COMMITEE_SUCCESS:
      return {
        ...state,
        governances: state.governances.map(g => ({
          ...g,
          commitees: (g.commitees || []).filter(c => c.id !== action.payload),
        })),
      };

    // ── Create StatusInitiative ─────────────────────────────────────────────
    case CREATE_STATUS_INITIATIVE_SUCCESS:
      return {
        ...state,
        governances: state.governances.map(g => ({
          ...g,
          commitees: (g.commitees || []).map(c => {
            if (c.id !== action.payload.commitee_id) return c;
            return {
              ...c,
              status_initiatives: [...(c.status_initiatives || []), action.payload],
            };
          }),
        })),
      };

    // ── Delete StatusInitiative ─────────────────────────────────────────────
    case DELETE_STATUS_INITIATIVE_SUCCESS:
      return {
        ...state,
        governances: state.governances.map(g => ({
          ...g,
          commitees: (g.commitees || []).map(c => ({
            ...c,
            status_initiatives: (c.status_initiatives || []).filter(
              s => s.id !== action.payload
            ),
          })),
        })),
      };

    default:
      return state;
  }
};

export default governance;
