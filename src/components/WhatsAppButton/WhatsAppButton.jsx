import React from 'react';

const WhatsAppButton = ({message}) => {
  const phoneNumber = '+59899123455'; // TODO agregar el numbero de sofi bien, y tal vez una manera dinamica para que sea editable.
  const encodedMessage = encodeURIComponent(message);

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="wpp-container">
    <button className='wpp-button' onClick={handleClick}>
      <img src="/images/whatsapp-icon.png" alt="WhatsApp" className="wpp-icon"/>
      <span>Escribinos por Whatsapp</span>
    </button>
    </div>
  );
};

export default WhatsAppButton;
