export const getAllIngredients = () => {
    return fetch('http://localhost:8000/ingredient')
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  };  