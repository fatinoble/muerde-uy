import axios from 'axios';
import { getApiUrl } from './utils';

export const getAllReviews = () => {
  return fetch(`${getApiUrl()}/review`)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const newReview = (review) => {
  return axios.post(`${getApiUrl()}/review`, { review: review })
    .then(response => {
      return response;
    })
    .catch(error => console.error('Error:', error.response.data));
}