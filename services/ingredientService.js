export const getAllIngredients = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ingredient`)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  };  