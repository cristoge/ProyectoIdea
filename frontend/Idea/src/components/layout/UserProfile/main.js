const fetchGitHubData = async (accessToken) => {
  try {
    // Hacemos la solicitud GET a la API de GitHub para obtener los datos del usuario
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Pasamos el access token en el encabezado de la solicitud
        'Accept': 'application/vnd.github.v3+json', // Especificamos el tipo de contenido esperado (opcional)
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error('Error al obtener datos de GitHub');
      
    }

    // Parseamos los datos recibidos
    const data = await response.json();
    console.log('Datos de GitHub:', data);
    // Aquí puedes manejar los datos de GitHub como desees

  } catch (error) {
    console.error('Error al hacer la llamada a la API de GitHub:', error);
  }
};

// Llamada a la función pasando el accessToken proporcionado
fetchGitHubData('AIzaSyA1EBkUFJQBQ9bCGh0zHAkfxlAf1TxeIFM');
