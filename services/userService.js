import axios from 'axios';
import { getApiUrl } from './utils';

export const getUsers = () => {
  return axios.get(`${getApiUrl()}/user`)
    .then(response => {
      return response;
    })
    .catch(error => console.error('Error:', error.response.data));
}

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(`${getApiUrl()}/user`, { user: newUser });
    return { data: response.data };
  } catch (error) {
    if (error.response) {
      return { data: error.response.data };
    } else if (error.request) {
      return { data: "No se recibió ninguna respuesta del servidor." };
    } else {
      return { data: error.message };
    }
  }
}

export const findUserByMail = async (data) => {
  try {
    const response = await axios.post(`${getApiUrl()}/user/login`, data);
    return { data: response.data };
  } catch (error) {
    return { data: error.response.data };
  }
}

export const modifyUser = (user) => {
  const id = user.id_user;
  return axios.put(`${getApiUrl()}/user?id=${id}`, { user: user })
    .then(response => {
      return response;
    })
    .catch(error => console.error('Error:', error.response.data));
}