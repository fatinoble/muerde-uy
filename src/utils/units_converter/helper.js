export function calculateQuantity(unit, initialQuantity) {
    const unitToGrams = {
        k: 1000,
        g: 1,
        l: 1000,
        oz: 28.3495,
        ml: 1,
        cc: 1,
    };
    return initialQuantity * unitToGrams[unit];
}