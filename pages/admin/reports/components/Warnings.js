/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Warnings = ({ productsData, ingredients }) => {

  return (
    <>
      <div className="featuredMoneyContainer">
      </div>


      {productsData.map((product) => {
        return (
          product.is_out_of_stock && <div className="redWarning">
            {<span>El producto <span style={{ fontWeight: 'bold' }}>{product.title}</span> se encuentra sin stock de ingredientes y <span style={{ fontWeight: 'bold' }}>no está disponible para la venta</span>.</span>}
          </div>
        )
      })}

      {ingredients.map((ingredient) => {
        return (
          ingredient.stock_percentage_status === 0 && <div className="redWarning">
            {<span >El ingrediente  <span style={{ fontWeight: 'bold' }}>{ingredient.name}</span>  se encuentra sin stock. No se podrá vender ningún producto cuya receta utilice este ingrediente.
              <span style={{ fontWeight: 'bold' }}>Se aconseja adquirir más stock de inmediato</span>.
            </span>}
          </div>
        )
      })}

      {ingredients.map((ingredient) => {
        return (
          ingredient.stock_percentage_status > 0 && ingredient.stock_percentage_status <= 29 && <div className="yellowWarning">
            {<span >El ingrediente <span style={{ fontWeight: 'bold' }}>{ingredient.name}</span> se encuentra con bajo stock. <span style={{ fontWeight: 'bold' }}> Se aconseja ingresar mayor cantidad pronto</span>.</span>}
          </div>
        )
      })}
    </>

  );
};

export default Warnings;
