import axios from 'axios';

export const createUser = (newUser) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, { user: newUser })
      .then(response => {
        return response;
      })
      .catch(error => console.error('Error:', error.response.data));
  }