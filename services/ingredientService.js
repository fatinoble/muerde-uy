import { getApiUrl } from './utils';

export const getAllIngredients = () => {
  return fetch(`${getApiUrl()}/ingredient`)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};  