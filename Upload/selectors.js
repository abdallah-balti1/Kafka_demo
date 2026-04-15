// @flow
import type { GlobalRatingType } from './modelize';

export const selectGlobalRatings = (state: Object): GlobalRatingType[] =>
  state.globalRating?.ratings ?? [];

export const selectGlobalRatingsLoading = (state: Object): boolean =>
  state.globalRating?.loading ?? false;

export const selectGlobalRatingsError = (state: Object): ?Object =>
  state.globalRating?.error ?? null;
