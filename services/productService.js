import axios from 'axios';

export const getAllProducts = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`)
    .then(response => response.json())
    .then(data => {
      const originalProducts = data.Products;
      const productPromises = originalProducts.map(product => {
        return Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe?id=${product.recipe_id}`).then(response => response.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog?id=${product.catalog_id}`).then(response => response.json()),
        ])
          .then(([recipe, catalog]) => {
            return {
              id_product: product.id_product,
              title: product.title,
              price: product.price,
              image: product.image,
              description: product.description,
              tags: product.tags,
              status: product.status,
              is_out_of_stock: product.is_out_of_stock,
              catalog: {
                catalog_id: product.catalog_id,
                type: catalog.type,
              },
              recipe: {
                id_recipe: recipe.id_recipe,
                name: recipe.name,
                instructions: recipe.instructions,
                preparation_time_minutes: recipe.preparation_time_minutes,
              },
            };
          });
      });

      return Promise.all(productPromises);
    })
    .catch(error => {
      console.error("Error en getAllProducts: ", error);
      throw error;
    });
};

export const modifyProduct = (editedProduct = {}) => {
  const { title, price, image, description, tags, status, catalog = {} } = editedProduct;
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

  return axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product?id=${editedProduct.id_product}`, formData, {
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

export const deleteProduct = (product) => {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product?id=${product.id_product}`)
    .then(response => {
      return response.data;
    })
    .catch(error => console.error('Error:', error));
}

export const createProduct = (newProduct = {}) => {
  const formData = new FormData();
  formData.append('image', newProduct.image);
  formData.append('title', newProduct.title);
  formData.append('description', newProduct.description);
  formData.append('price', newProduct.price);
  formData.append('tags', newProduct.tags);
  formData.append('recipe_id', newProduct.recipe_id);
  formData.append('catalog_id', newProduct.catalog_id);

  return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log("response data: ", response.data);
      return response.data;
    })
    .catch(error => console.error('Error:', error.response.data));
}
