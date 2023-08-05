import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { isObjectEmpty } from '../../../../src/utils';

const orderPreparationResponseMock = {
  order_preparation_suggestion_per_day: [
    {
      day: '2023-08-06',
      preparation_suggestions: [
        {
          total_preparation_time_minutes: 30,
          common_ingredients: [
            {
              id_ingredient: 1,
              name: "Azucar",
            }
          ],
          products: [
            {
              id_product: 2,
              title: "Sufle",
              description: "El mejor sufle",
              image: "",
              preparation_time_minutes: 30,
              quantity: 1
            }
          ]
        },
        {
          total_preparation_time_minutes: 50,
          common_ingredients: [
            {
              id_ingredient: 3,
              name: "Aceite",
            },
            {
              id_ingredient: 2,
              name: "Huevo",
            }
          ],
          products: [
            {
              id_product: 1,
              title: "Torta",
              description: "La mejor torta",
              image: "",
              preparation_time_minutes: 40,
              quantity: 1
            },
            {
              id_product: 8,
              title: "Tiramisu",
              description: "La mejor torta",
              image: "https://muerde-bucket-test-1.s3.amazonaws.com/1690748479204_croassant.jpg",
              preparation_time_minutes: 5,
              quantity: 2
            }
          ]
        }
      ]
    }
  ]

};


const OrderPreparation = () => {
  const [orderPreparationSuggestions, setOrderPreparationSuggestions] = useState(orderPreparationResponseMock.order_preparation_suggestion_per_day);
  const [preparationSuggestionDay, setPreparationSuggestionDay] = useState(orderPreparationResponseMock.order_preparation_suggestion_per_day[0]);
  const [suggestionDay, setSuggestionDay] = useState(orderPreparationResponseMock.order_preparation_suggestion_per_day[0]?.day);

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  const handleSetDate = (date) => {
    setSuggestionDay(date);
    const orderPreparationSuggestion = orderPreparationSuggestions?.find((suggestion) => suggestion?.day === date) || {}
    setPreparationSuggestionDay(orderPreparationSuggestion);
  }

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
                <span className='suggestion-title'>Agrupación de preparación {index + 1}  - {suggestion?.total_preparation_time_minutes}' minutos</span>
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
