// @flow

export type ApiGlobalRatingType = {
  category: string,
  rating: string | null,
};

export type GlobalRatingType = {
  category: string,
  rating: string | null,
};

export const modelizeGlobalRating = (
  apiRating: ApiGlobalRatingType
): GlobalRatingType => ({
  category: apiRating.category,
  rating:   apiRating.rating,
});

export const modelizeGlobalRatings = (
  apiRatings: ApiGlobalRatingType[]
): GlobalRatingType[] => apiRatings.map(modelizeGlobalRating);
