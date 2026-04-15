// @flow
import { call, put, takeEvery } from 'redux-saga/effects';
import { authenticatedCall } from 'redux/utils/authenticatedCall';
import { handleAPIExceptions } from 'utils/api';

import {
  fetchGlobalRatingsSuccess,
  fetchGlobalRatingsError,
} from './actions';
import { fetchGlobalRatingsApi } from './api';
import { FETCH_GLOBAL_RATINGS } from './constants';
import { modelizeGlobalRatings } from './modelize';

export function* fetchGlobalRatingsSaga(action: Object): Generator<*, *, *> {
  try {
    const { initiativeId } = action.payload;

    const response = yield call(
      authenticatedCall,
      fetchGlobalRatingsApi,
      { initiativeId }
    );

    const ratings = modelizeGlobalRatings(response.data.global_ratings);

    yield put(fetchGlobalRatingsSuccess(ratings));
  } catch (error) {
    yield handleAPIExceptions(error);
    yield put(fetchGlobalRatingsError(error));
  }
}

export default function* globalRatingSagas(): Generator<*, *, *> {
  yield takeEvery(FETCH_GLOBAL_RATINGS, fetchGlobalRatingsSaga);
}
