export function calculateQuantity(unit, initialQuantity) {
    const unitToGrams = {
        k: 1000,
        g: 1,
        l: 1000,
        oz: 28.3495,
        ml: 1,
        cc: 1,
    };
    
    if(unitToGrams.hasOwnProperty(unit)){
        return initialQuantity * unitToGrams[unit];
    }
    
    return initialQuantity;
}