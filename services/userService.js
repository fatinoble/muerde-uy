import axios from 'axios';

export const getUsers = () => {
    return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`)
      .then(response => {
        return response;
      })
      .catch(error => console.error('Error:', error.response.data));
}

export const createUser = (newUser) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, { user: newUser })
      .then(response => {
        return response;
      })
      .catch(error => console.error('Error:', error.response.data));
}

export const findUserByMail = (data) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, data)
      .then(response => {
          return response;
      })
      .catch(error => console.error('Error:', error.response.data));
}