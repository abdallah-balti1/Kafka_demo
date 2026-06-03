// @flow

import {
  FETCH_GOVERNANCES,
  FETCH_GOVERNANCES_SUCCESS,
  FETCH_GOVERNANCES_FAILURE,
  CREATE_GOVERNANCE_SUCCESS,
  DELETE_GOVERNANCE_SUCCESS,
  DELETE_GOVERNANCE_LINKED_ERROR,
  CREATE_COMMITEE_SUCCESS,
  DELETE_COMMITEE_SUCCESS,
  CREATE_STATUS_INITIATIVE_SUCCESS,
  DELETE_STATUS_INITIATIVE_SUCCESS,
  CLEAR_GOVERNANCE_ERROR,
} from './constants';

type StateType = {
  governances: any[],
  loading: boolean,
  error: ?string,
  creating: boolean,
  creatingError: ?string,
  deleteLinkedError: ?{ message: string, initiative_count: number },
};

const initialState: StateType = {
  governances: [],
  loading: false,
  error: null,
  creating: false,
  creatingError: null,
  deleteLinkedError: null,
};

const governance = (state: StateType = initialState, action: any): StateType => {
  switch (action.type) {
    case FETCH_GOVERNANCES:
      return { ...state, loading: true, error: null };

    case FETCH_GOVERNANCES_SUCCESS:
      return { ...state, loading: false, governances: action.payload };

    case FETCH_GOVERNANCES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_GOVERNANCE_SUCCESS:
      return {
        ...state,
        creating: false,
        governances: [...state.governances, action.payload],
      };

    case DELETE_GOVERNANCE_SUCCESS:
      return {
        ...state,
        deleteLinkedError: null,
        governances: state.governances.filter(g => g.id !== action.payload),
      };

    // ── 409 — governance linked to initiatives ────────────────────────────
    case DELETE_GOVERNANCE_LINKED_ERROR:
      return {
        ...state,
        deleteLinkedError: action.payload,
      };

    case CLEAR_GOVERNANCE_ERROR:
      return {
        ...state,
        deleteLinkedError: null,
        error: null,
      };

    case CREATE_COMMITEE_SUCCESS:
      return {
        ...state,
        governances: state.governances.map(g => {
          if (g.id !== action.payload.governance_id) return g;
          return { ...g, commitees: [...(g.commitees || []), action.payload] };
        }),
      };

    case DELETE_COMMITEE_SUCCESS:
      return {
        ...state,
        governances: state.governances.map(g => ({
          ...g,
          commitees: (g.commitees || []).filter(c => c.id !== action.payload),
        })),
      };

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
