// credentials for api
const clientId = "051652fb6a40447e8315d50d70c4f497";
const clientSecret = "dd07ad3d75df486e967c9dc12f4b1c52";
const basicAuth = btoa(`${clientId}:${clientSecret}`);
// placeholder for eventual token
let accessToken = null;

// function just to get the token
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
}

// function to search for artists
async function searchArtistsAndAlbums(query) {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: "artist",
      },
    });

    const artists = response.data.artists.items;
    const albums = await Promise.all(
      artists.slice(0, 1).map(async (artist) => {
        const albumsResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${artist.id}/albums`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              include_groups: "album",
            },
          }
        );
        return {
          artist: artist,
          albums: albumsResponse.data.items,
        };
      })
    );

    return albums;
  } catch (error) {
    console.error("Error searching artists and albums:", error);
  }
}

// allows ability to pass the search terms into the search functions
const query = "";
searchArtistsAndAlbums(query)
  .then((searchResults) => {
    console.log("Search Results:", searchResults);
    displaySearchResults(searchResults);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// actual search button function to fire off the search
function performSearch() {
  const query = document.getElementById("form1").value;
  searchArtistsAndAlbums(query)
    .then((searchResults) => {
      console.log("Search Results:", searchResults);
      displaySearchResults(searchResults);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to view all albums by the artist with album images
async function viewAlbumsByArtist(artistId) {
  if (!accessToken) {
    await getAccessToken();
  }

  try {
    const albumsResponse = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/albums`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          include_groups: "album",
        },
      }
    );

    const albums = albumsResponse.data.items;
    const albumsDiv = document.getElementById("albumsDiv");
    albumsDiv.innerHTML = "";

    albums.forEach((album) => {
      const albumDiv = document.createElement("div");
      albumDiv.classList.add("album-container");

      // Album Name
      const albumName = document.createElement("h4");
      albumName.textContent = album.name;

      // Album Image
      if (album.images.length > 0) {
        const albumImage = document.createElement("div");
        albumImage.style.backgroundImage = `url(${album.images[0].url})`; // Use the first image URL from the array
        albumImage.classList.add("album-image");

        albumDiv.appendChild(albumName);
        albumDiv.appendChild(albumImage);
      }

      albumsDiv.appendChild(albumDiv);
    });
  } catch (error) {
    console.error("Error fetching albums:", error);
  }
}

// function allows to save the albums to the database
async function savetofavorites(album) {
  const postdata = {
    artist: album.artists[0].name,
    album: album.name,
  };

  try {
    const response = await fetch("/api/favsongs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postdata),
    });

    if (response.ok) {
      //alert("Album saved to favorites!");
      window.location.reload();
    } else {
      alert("Error saving album to favorites.");
    }
  } catch (error) {
    console.error("Error saving album to favorites:", error);
  }
}

// function to display the search results // dom manipulation using javascript
function displaySearchResults(results) {
  const searchResultsDiv = document.getElementById("searchResults");
  searchResultsDiv.innerHTML = "";

  if (results && results.length > 0) {
    results.forEach((result) => {
      const artistName = result.artist.name;
      const albums = result.albums;
      const artistDiv = document.createElement("div");
      artistDiv.innerHTML = `<h3>${artistName}</h3>`;
      searchResultsDiv.appendChild(artistDiv);

      if (albums.length > 0) {
        const albumList = document.createElement("ul");
        albums.forEach((album) => {
          const albumName = album.name;
          const albumImages = album.images;
          const albumLink = document.createElement("a");
          albumLink.href = "#";
          albumLink.addEventListener("click", () => {
            savetofavorites(album);
          });

          if (albumImages.length > 0) {
            const albumImage = document.createElement("div");
            albumImage.style.backgroundImage = `url(${albumImages[0].url})`;
            albumImage.classList.add("album-image");

            albumLink.appendChild(albumImage);
            albumList.appendChild(albumLink);
          }

          const albumNameListItem = document.createElement("li");
          albumNameListItem.textContent = albumName;
          albumList.appendChild(albumNameListItem);
        });

        artistDiv.appendChild(albumList);
      } else {
        const noAlbumsMessage = document.createElement("p");
        noAlbumsMessage.textContent = "No albums found for this artist.";
        artistDiv.appendChild(noAlbumsMessage);
      }
    });
  } else {
    searchResultsDiv.textContent = "No results found.";
  }
}

document.querySelector(".deletesongs").addEventListener("click", function(event){
  if(event.target.nodeName !== "BUTTON"){
    return;
  }
  const id = event.target.dataset.id;
  fetch("/api/favsongs/" + id,{method:"DELETE"})
  .then(res=>res.json())
  .then(data=>{
    window.location.reload()
  })
})
