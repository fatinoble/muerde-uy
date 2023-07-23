const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const UNIT_MEASURES = [{ key: 'G', text: 'Gramo' }, { key: 'UN', text: 'Unidad' }];

const getOrderStateName = (state) => {
  if (state === 'TODO') {
    return "Pendiente..."
  }
  else if (state === 'WIP') {
    return "En preparación"
  }
  else if (state === 'DONE_PICK_UP') {
    return "Listo para retiro"
  }
  else if (state === 'DONE_DELIVERY') {
    return "Listo para envío"
  } else if (state === 'FINISHED') {
    return "Finalizado"
  }
}

const isObjectEmpty = (objectName) => {
  for (let prop in objectName) {
    if (objectName.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
};

export { formatDate, UNIT_MEASURES, getOrderStateName, isObjectEmpty };