const axios = require('axios');

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const basicAuth = btoa(`${clientId}:${clientSecret}`);
let accessToken = null;

// To access token
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

// Artist search
async function searchArtists(query) {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
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

const query = ''; // Replace this with your search query??
searchArtists(query)
  .then((searchResults) => {
    console.log('Search Results:', searchResults);
  })
  .catch((error) => {
    console.error('Error:', error);
  });