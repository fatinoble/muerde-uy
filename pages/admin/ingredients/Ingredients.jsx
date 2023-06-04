import Layout from '../../../src/components/AdminLayout';
import axios from 'axios';

import { useEffect, useState } from 'react';

const Ingredients = () => {
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
    <Layout>
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
     </Layout>
  );
};

export default Ingredients;
