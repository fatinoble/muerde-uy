import axios from 'axios';

import { useEffect, useState } from 'react';

const Ingredient = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient`);
        const data = response.data;
        setIngredients(data.ingredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
  };

  return (
    <div>
      <h1>Ingredientes</h1>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id_ingredient}>
            {ingredient.name} - {ingredient.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingredient;
