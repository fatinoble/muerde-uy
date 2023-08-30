import { getApiUrl } from './utils';

export const getAllCatalogs = () => {
  return fetch(`${getApiUrl()}/catalog`)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};  