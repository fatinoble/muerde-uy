import React from 'react';
import './WhatsAppServiceButton.css';

const WhatsAppServiceButton = ({message}) => {
  const phoneNumber = '+59899123455'; // TODO agregar el numbero de sofi bien, y tal vez una manera dinamica para que sea editable.
  const encodedMessage = encodeURIComponent(message);

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="wpp-container">
    <button className='wpp-button' onClick={handleClick}>
      <img src="/images/whatsapp-icon.png" alt="WhatsApp" className="wpp-icon"/>
      <span>Consulta por este servicio</span>
    </button>
    </div>
  );
};

export default WhatsAppServiceButton;
