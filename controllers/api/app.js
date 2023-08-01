const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const searchEndpoint = 'https://api.spotify.com/v1/search';

const accessToken = 'YOUR_ACCESS_TOKEN';

async function searchSpotify() {
  const query = document.getElementById('searchInput').value;
  const url = `${searchEndpoint}?q=${encodeURIComponent(query)}&type=track`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const tracks = data.tracks.items;

    displayResults(tracks);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

function displayResults(tracks) {
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = '';

  if (tracks.length === 0) {
    searchResultsDiv.innerHTML = 'No tracks found.';
    return;
  }

  tracks.forEach(track => {
    const trackName = track.name;
    const artistNames = track.artists.map(artist => artist.name).join(', ');
    const resultDiv = document.createElement('div');
    resultDiv.textContent = `${trackName} - ${artistNames}`;
    searchResultsDiv.appendChild(resultDiv);
  });
}
