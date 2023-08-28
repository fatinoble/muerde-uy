import axios from 'axios';

export const getAllServices = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service`)
    .then(response => response.json())
    .then(data => {
      const originalServices = data.Services;
      const servicesPromises = originalServices.map(service => {
        return Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog?id=${service.catalog_id}`).then(response => response.json()),
        ])
          .then((catalog) => {
            return {
              id_service: service.id_service,
              title: service.title,
              price: service.price,
              image: service.image,
              description: service.description,
              tags: service.tags,
              status: service.status,
              catalog: {
                catalog_id: service.catalog_id,
                type: catalog[0].type,
              },
            };
          });
      });

      return Promise.all(servicesPromises);
    })
    .catch(error => {
      console.error("Error en getAllServices: ", error);
      throw error;
    });
};

export const modifyService = (editedService = {}) => {
  const { title, price, image, description, tags, status, catalog = {}} = editedService;
  const { catalog_id } = catalog;

  const formData = new FormData();
  if (image) {
    formData.append('image', image);
  }
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('tags', tags);
  formData.append('catalog_id', catalog_id);
  formData.append('status', status);

  console.log('service: ', editedService.id_service)
  return axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service?id=${editedService.id_service}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export const deleteService = (service) => {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service?id=${service.id_service}`)
    .then(response => {
      return response.data;
    })
    .catch(error => console.error('Error:', error));
}

export const createService = (newService = {}) => {
    const formData = new FormData();
    formData.append('image', newService.image);
    formData.append('title', newService.title);
    formData.append('description', newService.description);
    formData.append('price', newService.price);
    formData.append('tags', newService.tags);
    formData.append('catalog_id', newService.catalog_id);
  
    return axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error('Error:', error.response.data));
  };