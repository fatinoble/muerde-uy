import Layout from '../../../src/components/AdminLayout';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@mui/material';

import DeleteDialog from './components/DeleteDialog';
import AddDialog from './components/AddDialog';
import PurchaseDialog from './components/PurchaseDialog';
import ModifyDialog from './components/ModifyDialog';
import { formatDate } from '../../../src/utils';

import { useEffect, useState } from 'react';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (!ingredients.length) {
      fetchIngredients();
    }
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

  const getRecipieUsingCountText = (count) => {
    if (count === 0) {
      return "No se encuentra vinculado a ninguna receta";
    } else if (count === 1) {
      return "Utilizado en 1 receta";
    } else {
      return `Utilizado en ${count} recetas`;
    }
  };

  const getTotalQuantityDisplayData = (totalQuantity, unit, stockPercentageStatus) => {
    if (totalQuantity === 0) {
      return { text: 'Sin stock', color: 'red' };
    } else if (stockPercentageStatus > 0 && stockPercentageStatus <= 29) {
      return { text: `Stock disponible: ${totalQuantity} ${unit}`, color: '#e0d500' };
    } else {
      return { text: `Stock disponible: ${totalQuantity} ${unit}`, color: '' };
    }
  }

  return (
    <Layout>
      <div>
        <h1>Ingredientes</h1>
        <AddDialog fetchIngredients={fetchIngredients} />
        <List>
          {ingredients.map((ingredient) => {
            const { text: totalQuantityText, color: totalQuantityColor } = getTotalQuantityDisplayData(ingredient.total_quantity, ingredient.unit, ingredient.stock_percentage_status);
            return (
              <ListItem key={ingredient?.id_ingredient}>
                <ListItemText
                  primary={ingredient.name}
                  secondary={
                    <>
                      {totalQuantityText && (
                        <span style={{ color: totalQuantityColor }}>{totalQuantityText}</span>
                      )}
                      {ingredient.last_purchase_date && (
                        <>
                          {' • Última compra: '}
                          {formatDate(ingredient.last_purchase_date)}
                        </>
                      )}
                      {ingredient.last_purchase_cost && (
                        <>
                          {` • Costo por unidad: $${ingredient.last_purchase_cost.toFixed(2)}`}
                        </>
                      )}
                      {' • '}
                      {getRecipieUsingCountText(ingredient.recipie_using_count)}
                    </>
                  }
                />
                <PurchaseDialog fetchIngredients={fetchIngredients} ingredient={ingredient} />
                <ModifyDialog fetchIngredients={fetchIngredients} ingredient={ingredient} />
                <DeleteDialog fetchIngredients={fetchIngredients} ingredientId={ingredient?.id_ingredient} disabled={ingredient.recipie_using_count > 0} />
              </ListItem>
            )
          }
          )}
        </List>
      </div>
    </Layout>
  );
};

export default Ingredients;
