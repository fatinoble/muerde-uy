import axios from 'axios';

export const getAllRecipes = () => {
  console.log("entra a get recipes");
  return fetch('http://localhost:8000/recipe')
    .then(response => response.json())
    .then(data => {
      const originalRecipes = data.recipes;
      console.log("recipes originales: ", originalRecipes);

      const recipePromises = originalRecipes.map(recipe => {
        console.log("receta: ", recipe);
        const ingredientsPromise = fetch(`http://localhost:8000/recipe/ingredients?id=${recipe.id_recipe}`)
          .then(response => response.json())
          .then(recipeIngredients => {
            const ingredients = recipeIngredients.recipeIngredients.map(ingredient => ({
              ingredient_id: ingredient.ingredient_id,
              name: ingredient.ingredient.name,
              unit: ingredient.ingredient.unit,
              last_purchase_cost: ingredient.ingredient.last_purchase_cost,
              quantity: ingredient.quantity
            }));
            return ingredients;
          });

        const productsPromise = fetch(`http://localhost:8000/product/recipe?id=${recipe.id_recipe}`)
          .then(response => response.json())
          .then(data => {
            const products = data.Products;
            if (Array.isArray(products)) {
              const formattedProducts = products.map(product => ({
                id_product: product.id_product,
                title: product.title,
                price: product.price,
                image: product.image,
                description: product.description,
                tags: product.tags,
                catalog: {
                  catalog_id: product.catalog_id,
                  type: product.catalog.type
                }
              }));
              return formattedProducts;
            } else {
              return [];
            }
          });

        return Promise.all([ingredientsPromise, productsPromise])
          .then(([ingredients, products]) => ({
            id_recipe: recipe.id_recipe,
            name: recipe.name,
            instructions: recipe.instructions,
            preparationTimeMinutes: recipe.preparation_time_minutes,
            ingredients: ingredients,
            product: products[0] || null // Tomar el primer producto o null si no hay productos
          }));
      });

      console.log("receta final ", recipePromises);
      return Promise.all(recipePromises);
    })
    .catch(error => {
      console.error("Error en getAllRecipes: ", error);
      throw error;
    });
};
  
  export const modifyRecipe = (editedRecipe) => {
    const { name, instructions, preparationTimeMinutes, ingredients } = editedRecipe;
    const recipe = { name, instructions, preparationTimeMinutes, ingredients };

    console.log("receta a mandar para editar: ", recipe);

    return axios.put(`http://localhost:8000/recipe?id=${editedRecipe.id_recipe}`, { recipe })
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export const deleteRecipe = (recipe) => {
  console.log("receta a eliminar ", recipe);
    return axios.delete(`http://localhost:8000/recipe?id=${recipe.id_recipe}`)
    .then(response => {
      return response.data;
    })
    .catch(error => console.error('Error:', error));
}

export const createRecipe = (newRecipe) => {
  console.log("receta recibida en recipeService create recipe: ", newRecipe);

  return axios.post(`http://localhost:8000/recipe`, { recipe: newRecipe })
    .then(response => {
      console.log("response data: ", response.data);
      return response.data;
    })
    .catch(error => console.error('Error:', error));
}

export const getAllRecipesWithProducts = () => {
  return fetch('http://localhost:8000/recipe/withoutProducts')
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};  