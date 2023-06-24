export const UNIT_MEASURES_CONVERTER = [{key: 'k', text: 'Kilos', conversion_factor: 1000}, {key: 'g', text: 'Gramos', conversion_factor: 1}, {key: 'l', text: 'Litros', conversion_factor: 1000}, {key: 'oz', text: 'Onzas', conversion_factor: 28.3495}, {key: 'ml', text: 'Mililitros', conversion_factor: 1}, {key: 'cc', text: 'Centímetros cúbicos', conversion_factor: 1}];

export function calculateQuantity(unit, initialQuantity) {
    const unitToGrams = UNIT_MEASURES_CONVERTER.reduce((obj, item) => {
      obj[item.key] = item.conversion_factor;
      return obj;
    }, {});

    if(unitToGrams.hasOwnProperty(unit)){
        return initialQuantity * unitToGrams[unit];
    }

    return initialQuantity;
}