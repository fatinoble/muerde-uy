export const getAllCatalogs = () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/catalog`)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  };  