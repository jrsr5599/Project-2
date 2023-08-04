

const clientId = '051652fb6a40447e8315d50d70c4f497';
const clientSecret = 'dd07ad3d75df486e967c9dc12f4b1c52';
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

async function searchArtistsAndAlbums(query) {
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

    const artists = response.data.artists.items;
    const albums = await Promise.all(
      artists.slice(0, 1).map(async (artist) => {
        const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          params: {
            include_groups: 'album',
          },
        });
        return {
          artist: artist,
          albums: albumsResponse.data.items,
        };
      })
    );

    return albums;
  } catch (error) {
    console.error('Error searching artists and albums:', error);
  }
}

const query = ''; 
searchArtistsAndAlbums(query)
  .then((searchResults) => {
    console.log('Search Results:', searchResults);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  function performSearch() {
    const query = document.getElementById('form1').value;
    searchArtistsAndAlbums(query)
      .then((searchResults) => {
        displaySearchResults(searchResults);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  async function savetofavorites(album) {
    console.log(album);
    const postdata = {
      artist: album.artists[0].name,
      album: album.name
    }
    const response = await fetch("/api/favsongs",{
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify(postdata)
    });
    const data = await response.json();
    

  }
  function displaySearchResults(results) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';
  
    if (results && results.length > 0) {
      results.forEach((result) => {
        const artistName = result.artist.name;
        const albums = result.albums;
  
        const artistDiv = document.createElement('div');
        artistDiv.innerHTML = `<h3>${artistName}</h3>`;
        searchResultsDiv.appendChild(artistDiv);
  
        if (albums.length > 0) {
          const albumList = document.createElement('ul');
          albums.forEach((album) => {
            const li = document.createElement('li');
            const albumLink = document.createElement('a');
            albumLink.textContent = album.name;
            albumLink.href = '#'; // Link to a hash (will be used to identify the selected album)
            albumLink.addEventListener('click', () => {
              // displayAlbumTrackList(album);
              savetofavorites(album);
            });


            li.appendChild(albumLink);
            albumList.appendChild(li);
          });
          artistDiv.appendChild(albumList);
        } else {
          const noAlbumsMessage = document.createElement('p');
          noAlbumsMessage.textContent = 'No albums found for this artist.';
          artistDiv.appendChild(noAlbumsMessage);
        }
      });
    } else {
      searchResultsDiv.textContent = 'No results found.';
    }
  }

  