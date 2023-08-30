import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../../services/utils';
const WhatsAppButton = ({message}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const encodedMessage = encodeURIComponent(message);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/setting`);
      const { settings } = response.data;
      const wpp_phone = settings.find(setting => setting.key === 'phone');
      setPhoneNumber(wpp_phone?.value || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };


  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="wpp-container">
      {
        phoneNumber && (
          <button className='wpp-button' onClick={handleClick}>
          <img src="/images/whatsapp-icon.png" alt="WhatsApp" className="wpp-icon"/>
          <span>Escribinos por Whatsapp</span>
        </button>
        )
      }
    </div>
  );
};

export default WhatsAppButton;
