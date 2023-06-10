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
    console.log("edited product ", editedProduct);
    return axios.put(`http://localhost:8000/product?id=${editedProduct.id_product}`, { product: editedProduct })
    .then(response => {
      console.log("response en edit product: ", response);
      return response.data; // Opcional: puedes devolver la respuesta si lo necesitas en otro lugar
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; // Lanza el error para que se pueda capturar en el código que llama a modifyProduct si es necesario
    });
}

export const deleteProduct = (product) => {
    console.log("producto a eliminar ", product.id_product);
    axios.delete(`http://localhost:8000/product?id=${product.id_product}`)
        .then(response => {
            console.log(response);
            setProducts(prevProducts => prevProducts.filter(p => p.id_product !== product.id_product));
            setDeleteModalOpen(false);
        })
        .catch(error => console.error('Error:', error));
}