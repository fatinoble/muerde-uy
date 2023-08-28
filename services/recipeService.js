import axios from 'axios';

const fetchRecipeDetails = (recipe) => {
  const ingredientsPromise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe/ingredients?id=${recipe.id_recipe}`)
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

  const productsPromise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/recipe?id=${recipe.id_recipe}`)
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
      product: products[0] || null
    }));
};

export const getAllRecipes = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe`)
    .then(response => response.json())
    .then(data => {
      const originalRecipes = data.recipes;
      const recipePromises = originalRecipes.map(fetchRecipeDetails);
      return Promise.all(recipePromises);
    })
    .catch(error => {
      console.error("Error en getAllRecipes: ", error);
      throw error;
    });
};

export const getSingleRecipe = (id) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe?id=${id}`)
    .then(response => response.json())
    .then(fetchRecipeDetails)
    .catch(error => {
      console.error(`Error en getSingleRecipe con ID ${id}: `, error);
      throw error;
    });
};

export const modifyRecipe = (editedRecipe) => {
  const { name, instructions, preparationTimeMinutes, ingredients } = editedRecipe;
  const filteredIngredients = ingredients.map(({ ingredient_id, quantity }) => ({
    ingredient_id,
    quantity: Number(quantity)
  }));

  const recipe = { name, instructions, preparationTimeMinutes: Number(preparationTimeMinutes), ingredients: filteredIngredients };

  return axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe?id=${editedRecipe.id_recipe}`, { recipe })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

export const deleteRecipe = (recipe) => {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe?id=${recipe.id_recipe}`)
    .then(response => {
      return response.data;
    })
    .catch(error => console.error('Error:', error));
}

export const createRecipe = (newRecipe) => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe`, { recipe: newRecipe })
    .then(response => {
      return response.data;
    })
    .catch(error => console.error('Error:', error));
}

export const getAllRecipesWithProducts = () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/recipe/withoutProducts`)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};  