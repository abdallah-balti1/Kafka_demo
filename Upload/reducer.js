// @flow
import {
  FETCH_GLOBAL_RATINGS,
  FETCH_GLOBAL_RATINGS_SUCCESS,
  FETCH_GLOBAL_RATINGS_ERROR,
} from './constants';

import type { GlobalRatingType } from './modelize';

type StateType = {
  ratings:  GlobalRatingType[],
  loading:  boolean,
  error:    ?Object,
};

const initialState: StateType = {
  ratings:  [],
  loading:  false,
  error:    null,
};

const globalRatingReducer = (
  state: StateType = initialState,
  action: Object
): StateType => {
  switch (action.type) {
    case FETCH_GLOBAL_RATINGS:
      return { ...state, loading: true, error: null };

    case FETCH_GLOBAL_RATINGS_SUCCESS:
      return { ...state, loading: false, ratings: action.payload };

    case FETCH_GLOBAL_RATINGS_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default globalRatingReducer;
