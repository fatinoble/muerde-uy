import axios from 'axios';
import { getApiUrl } from './utils';

export const setTransferNumber = (id_sale, transfer_number) => {
    return axios.put(`${getApiUrl()}/sale?id=${id_sale}`, { transfer_number }).
        then(response => {
            return response;
        })
        .catch(error => console.error('Error:', error.response.data));
}