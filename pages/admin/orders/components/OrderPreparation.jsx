import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { isObjectEmpty } from '../../../../src/utils';
import axios from 'axios';

const OrderPreparation = () => {
  const [orderPreparationSuggestions, setOrderPreparationSuggestions] = useState([]);
  const [preparationSuggestionDay, setPreparationSuggestionDay] = useState({});
  const [suggestionDay, setSuggestionDay] = useState("");

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  useEffect(() => {
    if (!orderPreparationSuggestions.length) {
      fetchOrderPreparationSuggestions();
    }
  }, []);

  const fetchOrderPreparationSuggestions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sale/order_preparation_suggestions`);
      const data = response.data;
      setOrderPreparationSuggestions(data.order_preparation_suggestion_per_day);
      setPreparationSuggestionDay(data.order_preparation_suggestion_per_day[0]);
      setSuggestionDay(data.order_preparation_suggestion_per_day[0]?.day);
    } catch (error) {
      console.error('Error fetching order preparation suggestions:', error);
    }
  };



  const handleSetDate = (date) => {
    setSuggestionDay(date);
    const orderPreparationSuggestion = orderPreparationSuggestions?.find((suggestion) => suggestion?.day === date) || {}
    setPreparationSuggestionDay(orderPreparationSuggestion);
  }

  const formatTime = (minutes) => {
    if (minutes <= 59) {
      return `${minutes} minutos`;
    } else if (minutes === 60) {
      return `1 hora`;
    } else {
      const hours = Math.floor(minutes / 60);
      const restOfMinutes = minutes % 60;
      return `${hours} horas ${restOfMinutes} minutos`;
    }
  };


  return (
    <div className="order-preparation-container">
      <div className="order-preparation-title-container">
        <span className="order-preparation-main-title">Sugerencia de preparación para el día: </span>
        <TextField
          label="Seleccione día"
          type="date"
          value={suggestionDay}
          onChange={(e) => handleSetDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: formattedToday,
          }}
        />
      </div>
      {(!preparationSuggestionDay ||
        isObjectEmpty(preparationSuggestionDay) ||
        preparationSuggestionDay?.preparation_suggestions?.length === 0) &&
        <span>Aún no hay pedidos para este día.</span>
      }
      <div className="order-preparation-suggestions-container">
        {preparationSuggestionDay?.preparation_suggestions?.map((suggestion, index) => {
          return (
            <div className="suggestion-container">
              <div className='suggestion-title-container'>
                <span className='suggestion-title'>Agrupación de preparación {index + 1}  - {formatTime(suggestion?.total_preparation_time_minutes)}</span>
              </div>

              <div className="common-ingredients-container">
                <span>Ingredientes en común: </span>
                {suggestion?.common_ingredients?.map((commonIngredient, index) => {
                  const separator = ",";
                  const final = ".";
                  return (
                    <>
                      <span>{commonIngredient?.name}{suggestion?.common_ingredients?.length - 1 !== index ? separator : final} </span>
                    </>
                  )
                })}
              </div>

              <div className="products-suggestions-container">
                <span>Productos a preparar:</span>
                <div className="product-list-suggestion">
                  {suggestion?.products?.map((product) => {
                    return (
                      <div className="product-card-suggestion-container">
                        <div>
                          <img src={product?.image || '/images/unavailable.png'} alt={product?.title} className="product-suggestion-image" />
                        </div>
                        <div>
                          <span className="product-suggestion-title">{product?.title} x{product?.quantity}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )
        }
        )}
      </div>
    </div>
  );
};

export default OrderPreparation;
