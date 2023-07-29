const API_KEY = 'AIzaSyB32ZnHIaVNrNZOcV1kz6YioSe4kJUUnJg';


function searchVideos() {
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query + ' music clip'
    )}&type=video&maxResults=10&key=${API_KEY}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayResults(data.items);
        })
        .catch((error) => {
            console.error('Error fetching videos', error);
        });
}


function displayResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    items.forEach((item) => {
        const videoId = item.id.videoId;
        const videoTitle = item.snippet.title;
        const videoThumbnail = item.snippet.thumbnails.default.url;

        const videoDiv = document.createElement('div');
        videoDiv.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                <img src="${videoThumbnail}" alt="${videoTitle}">
                <p>${videoTitle}</p>
            </a>
        `;
        resultsContainer.appendChild(videoDiv);
    });
}
