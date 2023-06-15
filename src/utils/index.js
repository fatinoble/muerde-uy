const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const UNIT_MEASURES = [{key: 'G', text: 'Gramo'}, {key: 'UN', text: 'Unidad'}];

export { formatDate, UNIT_MEASURES };