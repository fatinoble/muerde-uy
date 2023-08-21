import axios from 'axios';

export const setTransferNumber = (id_sale, transfer_number) => {
    return axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale?id=${id_sale}`, {transfer_number}).
    then(response => {
        return response;
    })
    .catch(error => console.error('Error:', error.response.data));
  }