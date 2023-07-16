import axios from 'axios';

export const getAllReviews = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review`)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  };  

  export const newReview = (review) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/review`, { review: review })
      .then(response => {
        return response;
      })
      .catch(error => console.error('Error:', error.response.data));
  }