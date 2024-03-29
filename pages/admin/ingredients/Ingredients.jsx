import Layout from '../../../src/components/AdminLayout';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@mui/material';
import Head from 'next/head';
import Kitchen from "@mui/icons-material/Kitchen";
import DeleteDialog from './components/DeleteDialog';
import AddDialog from './components/AddDialog';
import PurchaseDialog from './components/PurchaseDialog';
import ModifyDialog from './components/ModifyDialog';
import DecreaseQuantityDialog from './components/DecreaseQuantityDialog';
import { formatDate } from '../../../src/utils';
import { getApiUrl } from '../../../services/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { verifyToken } from '../../../services/userService';
import CircularProgress from '@mui/material/CircularProgress';

const Ingredients = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token_admin');
        const response = await verifyToken(token);
        const user = response.data;
        if (!user.id_user || user.role !== 'ADMIN') {
          router.push('/admin/login');
        } else {
          if (!ingredients.length) {
            fetchIngredients();
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();

  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/ingredient`);
      const data = response.data;
      setIngredients(data.ingredients);
      return data.ingredients;
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
      return { text: `Stock disponible: ${totalQuantity} ${unit}`, color: 'rgba(0, 0, 0, 0.6)' };
    }
  }
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Layout>
      <Head style={{ marginBottom: '10px' }}>
        <title>Ingredientes</title>
      </Head>
      <div className="title-container">
        <h1><Kitchen className="icon-title" />Ingredientes</h1>
      </div>
      <div>
        <AddDialog fetchIngredients={fetchIngredients} />
        <List>
          {ingredients.map((ingredient) => {
            const { text: totalQuantityText, color: totalQuantityColor } = getTotalQuantityDisplayData(ingredient.total_quantity, ingredient.unit, ingredient.stock_percentage_status);
            return (
              <ListItem className="ingredient-card" key={ingredient?.id_ingredient}>
                <div>
                  <ListItemText
                    primary={<span className="ingredient-main-title">{ingredient.name}</span>}
                    secondary={
                      <>


                        {ingredient.last_purchase_date && (
                          <>
                            {'Última compra: '}
                            {formatDate(ingredient.last_purchase_date)}
                          </>
                        )}
                        {ingredient.last_purchase_cost && (
                          <>
                            {` • Costo por unidad: $${ingredient.last_purchase_cost.toFixed(2)}`}
                          </>
                        )}

                        <>
                          {` • ${getRecipieUsingCountText(ingredient.recipie_using_count)}`}
                        </>

                      </>
                    }

                  >

                  </ListItemText >
                  <span>
                    {totalQuantityText && (
                      <span style={{ color: totalQuantityColor, fontSize: '14px', fontWeight: '600' }}>{totalQuantityText}</span>
                    )}
                  </span>
                </div>
                <div>
                  <PurchaseDialog fetchIngredients={fetchIngredients} ingredient={ingredient} />
                  <DecreaseQuantityDialog fetchIngredients={fetchIngredients} ingredient={ingredient} />
                  <ModifyDialog fetchIngredients={fetchIngredients} ingredient={ingredient} />
                  <DeleteDialog fetchIngredients={fetchIngredients} ingredientId={ingredient?.id_ingredient} disabled={ingredient.recipie_using_count > 0} />
                </div>
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
