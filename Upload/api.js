// @flow
import config from 'utils/config';
import { request } from 'utils/request';

export const fetchGlobalRatingsApi = ({
  initiativeId,
  token,
}: {
  initiativeId: string,
  token: string,
}): Promise<{ data: Object }> => {
  const requestURL = `${config.INITIATIVE_API_URL}/initiatives/${initiativeId}/global-rating`;

  return request(requestURL, {
    method: 'GET',
    headers: { authorization: `Bearer ${token}` },
  });
};
