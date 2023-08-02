const axios = require('axios');

const clientId = '051652fb6a40447e8315d50d70c4f497';
const clientSecret = 'YOUR_Cdd07ad3d75df486e967c9dc12f4b1c52LIENT_SECRET';
const basicAuth = btoa(`${clientId}:${clientSecret}`);
let accessToken = null;


async function getAccessToken() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
}


async function searchArtists(query) {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.get(' "https://api.spotify.com/v1/me/shows?offset=0&limit=20"', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: 'artist',
      },
    });

    return response.data.artists.items;
  } catch (error) {
    console.error('Error searching artists:', error);
  }
}


const query = ''; 
searchArtists(query)
  .then((searchResults) => {
    console.log('Search Results:', searchResults);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
