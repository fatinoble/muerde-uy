import { useState, useEffect } from 'react';
import { TextField, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { isObjectEmpty } from '../../../../src/utils';
import axios from 'axios';
import { getApiUrl } from '../../../../services/utils';

const OrderPreparation = () => {
  const [orderPreparationSuggestions, setOrderPreparationSuggestions] = useState([]);
  const [preparationSuggestionDay, setPreparationSuggestionDay] = useState({});
  const [totalOrderPreparationTimePerDay, setTotalOrderPreparationTimePerDay] = useState([]);
  const [maxPreparationTimePerDayMinutesEnabled, setMaxPreparationTimePerDayMinutesEnabled] = useState(10000);
  const [suggestionDay, setSuggestionDay] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  useEffect(() => {
    if (!orderPreparationSuggestions.length) {
      fetchOrderPreparationSuggestions();
    }
  }, []);

  const fetchOrderPreparationSuggestions = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/sale/order_preparation_suggestions`);
      const data = response.data;
      setOrderPreparationSuggestions(data.order_preparation_suggestion_per_day);
      setPreparationSuggestionDay(data.order_preparation_suggestion_per_day[0]);
      setSuggestionDay(data.order_preparation_suggestion_per_day[0]?.day);

      const totalOrderPreparationTimePerDaySet = calculateTotalPreparationTime(data);
      setTotalOrderPreparationTimePerDay(totalOrderPreparationTimePerDaySet);
      setMaxPreparationTimePerDayMinutesEnabled(data?.max_preparation_time_per_day_minutes_enabled);
      handleUpdateOrderMessage(totalOrderPreparationTimePerDaySet, data.order_preparation_suggestion_per_day[0]?.day, data?.max_preparation_time_per_day_minutes_enabled);
    } catch (error) {
      console.error('Error fetching order preparation suggestions:', error);
    }
  };

  const handleUpdateOrderMessage = (totalOrderPrepTime = [], day, maxPrepEnabledConfig) => {
    const timeSet = totalOrderPrepTime.find(totalOrder => totalOrder.day === day);
    if (timeSet && timeSet.total_preparation_time_minutes > maxPrepEnabledConfig) {
      setOrderMessage(`Este día ya superó el máximo de tiempo de preparación de pedidos de ${formatTime(maxPrepEnabledConfig)}, por lo que se encuentra deshabilitado en el calendario de pedidos para los clientes.`);
    } else {
      setOrderMessage("");
    }
  };

  const calculateTotalPreparationTime = (data = {}) => {
    const result = [];

    data.order_preparation_suggestion_per_day.forEach((day) => {
      const totalPreparationTime = day.preparation_suggestions.reduce(
        (sum, suggestion) => sum + suggestion.total_preparation_time_minutes,
        0
      );

      result.push({
        day: day.day,
        total_preparation_time_minutes: totalPreparationTime,
      });
    });

    return result;
  }



  const handleSetDate = (date) => {
    setSuggestionDay(date);
    const orderPreparationSuggestion = orderPreparationSuggestions?.find((suggestion) => suggestion?.day === date) || {}
    setPreparationSuggestionDay(orderPreparationSuggestion);
    handleUpdateOrderMessage(totalOrderPreparationTimePerDay, date, maxPreparationTimePerDayMinutesEnabled);
  }

  const formatTime = (minutes) => {
    if (minutes <= 59) {
      return `${minutes} minutos`;
    } else if (minutes === 60) {
      return `1 hora`;
    } else {
      const hours = Math.floor(minutes / 60);
      const restOfMinutes = minutes % 60;
      const hoursText = hours > 1 ? "horas" : "hora";
      const minutesText = restOfMinutes > 1 ? "minutos" : "minuto";

      if (hours > 0 && restOfMinutes > 0)
        return `${hours} ${hoursText} ${restOfMinutes} ${minutesText}`;

      if (hours > 0)
        return `${hours} ${hoursText}`;


      if (restOfMinutes > 0)
        return `${restOfMinutes} ${minutesText}`;

      return "";
    }
  };

  return (
    <div className="order-preparation-container">
      <div className="order-preparation-title-container">
        <span className="order-preparation-main-title">Sugerencia de preparación para el día: </span>
        <TextField
          className="day-order-selector-textfield"
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
        {orderMessage && (
          <div className="info-container">
            <span className="order-prep-message-info">Día bloqueado en calendario de pedidos             <Tooltip title={orderMessage}>
              <InfoIcon style={{ color: 'red' }} />
            </Tooltip></span>
          </div>
        )}
      </div>
      {(!preparationSuggestionDay ||
        isObjectEmpty(preparationSuggestionDay) ||
        preparationSuggestionDay?.preparation_suggestions?.length === 0) &&
        <span className="order-prep-message">Aún no hay pedidos para este día.</span>
      }

      <div className="order-preparation-suggestions-container">
        {preparationSuggestionDay?.preparation_suggestions?.map((suggestion, index) => {
          return (
            <div className="suggestion-container">
              <div className='suggestion-title-container'>
                <span className='suggestion-title'>Agrupación de preparación {index + 1}: </span>
                <span className='suggestion-title-data'>{formatTime(suggestion?.total_preparation_time_minutes)}</span>
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
