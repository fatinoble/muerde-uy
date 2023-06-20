import axios from 'axios';

export const getAllProducts = () => {
    console.log("entra a get products");
    return fetch('http://localhost:8000/product')
      .then(response => response.json())
      .then(data => {
        const originalProducts = data.Products;
        console.log("productos originales: ", originalProducts);
  
        const productPromises = originalProducts.map(product => {
          return Promise.all([
            fetch(`http://localhost:8000/recipe?id=${product.recipe_id}`).then(response => response.json()),
            fetch(`http://localhost:8000/catalog?id=${product.catalog_id}`).then(response => response.json()),
          ])
          .then(([recipe, catalog]) => {
            return {
              id_product: product.id_product,
              title: product.title,
              price: product.price,
              image: product.image,
              description: product.description,
              tags: product.tags,
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
  
        console.log("productos finales ", productPromises);
        return Promise.all(productPromises);
      })
      .catch(error => {
        console.error("Error en getAllProducts: ", error);
        throw error;
      });
  };
  
  export const modifyProduct = (editedProduct) => {
    const { title, price, image, description, tags, status, catalog } = editedProduct;
    const { catalog_id } = catalog;
    const product = { title, price, image, description, tags, catalog_id, status };

    console.log("producto a mandar para editar: ", product);

    return axios.put(`http://localhost:8000/product?id=${editedProduct.id_product}`, { product })
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export const deleteProduct = (product) => {
    return axios.delete(`http://localhost:8000/product?id=${product.id_product}`)
    .then(response => {
      return response.data;
    })
    .catch(error => console.error('Error:', error));
}

export const createProduct = (newProduct) => {
  console.log("producto recibido: ", newProduct);

  return axios.post(`http://localhost:8000/product`, { product: newProduct })
    .then(response => {
      console.log("response data: ", response.data);
      return response.data;
    })
    .catch(error => console.error('Error:', error.response.data));
}