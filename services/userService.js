import axios from 'axios';

export const getUsers = () => {
    return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`)
      .then(response => {
        return response;
      })
      .catch(error => console.error('Error:', error.response.data));
}

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, { user: newUser });
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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, data);
    return { data: response.data };
  } catch (error) {
    return { data: error.response.data };
  }
}

export const modifyUser = (user) => {
  const id = user.id_user;
  return axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user?id=${id}`, { user: user })
      .then(response => {
          return response;
      })
      .catch(error => console.error('Error:', error.response.data));
}