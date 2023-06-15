export const getAllCatalogs = () => {
    return fetch('http://localhost:8000/catalog')
      .then(response => {
        console.log("todos los catalgos: ", response);
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  };  