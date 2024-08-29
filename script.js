// script.js
const API_KEY = 'ee5b0187a8c256dc424d18bf82478b3a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const movieList = document.getElementById('movie-list');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const pageTitle = document.getElementById('page-title');
const movieDetails = document.getElementById('movie-details');
const movieDetailsContent = document.getElementById('movie-details-content');
const closeButton = document.querySelector('.close');

async function fetchPopularMovies() {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    return data.results;
}

async function searchMovies(query) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`);
    const data = await response.json();
    return data.results;
}

async function fetchMovieDetails(id) {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits`);
    const data = await response.json();
    return data;
}

function displayMovies(movies) {
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="movie-card-content">
                <h3>${movie.title}</h3>
                <p>${movie.overview}</p>
            </div>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieList.appendChild(movieCard);
    });
}

async function showMovieDetails(id) {
    const movie = await fetchMovieDetails(id);
    movieDetailsContent.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="${IMAGE_BASE_URL}${movie.backdrop_path}" alt="${movie.title}">
        <div class="movie-info">
            <p><strong>Sinopse:</strong> ${movie.overview}</p>
            <p><strong>Data de Lançamento:</strong> ${movie.release_date}</p>
            <p><strong>Avaliação:</strong> ${movie.vote_average} (${movie.vote_count} votos)</p>
            <p><strong>Gêneros:</strong> ${movie.genres.map(genre => genre.name).join(', ')}</p>
        </div>
        <h3>Elenco Principal</h3>
        <div class="cast-grid">
            ${movie.credits.cast.slice(0, 8).map(actor => `
                <div class="cast-member">
                    <img src="${IMAGE_BASE_URL}${actor.profile_path}" alt="${actor.name}">
                    <p>${actor.name}</p>
                    <p>${actor.character}</p>
                </div>
            `).join('')}
        </div>
    `;
    movieDetails.style.display = 'block';
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        const movies = await searchMovies(query);
        displayMovies(movies);
        pageTitle.textContent = `Resultados para "${query}"`;
    }
});

closeButton.addEventListener('click', () => {
    movieDetails.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === movieDetails) {
        movieDetails.style.display = 'none';
    }
});

// Inicialização
(async () => {
    const popularMovies = await fetchPopularMovies();
    displayMovies(popularMovies);
})();