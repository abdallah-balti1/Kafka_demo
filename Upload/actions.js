// @flow
import {
  FETCH_GLOBAL_RATINGS,
  FETCH_GLOBAL_RATINGS_SUCCESS,
  FETCH_GLOBAL_RATINGS_ERROR,
} from './constants';

import type { GlobalRatingType } from './modelize';

export const fetchGlobalRatings = (initiativeId: string) => ({
  type:    FETCH_GLOBAL_RATINGS,
  payload: { initiativeId },
});

export const fetchGlobalRatingsSuccess = (
  ratings: GlobalRatingType[]
) => ({
  type:    FETCH_GLOBAL_RATINGS_SUCCESS,
  payload: ratings,
});

export const fetchGlobalRatingsError = (error: Object) => ({
  type:    FETCH_GLOBAL_RATINGS_ERROR,
  payload: error,
});
