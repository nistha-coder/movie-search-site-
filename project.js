
const API_KEY = "357a35c8"; 
const BASE_URL = "http://www.omdbapi.com/";


const movieTitleInput = document.getElementById("movie-title");
const searchButton = document.getElementById("search-movie-btn");
const moviesContainer = document.getElementById("movies-container");
const favoritesContainer = document.getElementById("favorites-container");


const fetchMovies = async (title) => {
    try {
        const response = await fetch(`${BASE_URL}?s=${title}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            moviesContainer.innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        moviesContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
};


const fetchMovieDetails = async (imdbID) => {
    try {
        const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
};


const displayMovies = (movies) => {
    moviesContainer.innerHTML = ""; 
    movies.forEach(async (movie) => {
        const details = await fetchMovieDetails(movie.imdbID); 
        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";
        movieCard.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
            <p class="rating">Rating: ${details?.imdbRating || "N/A"}</p>
            <button class="favorite-btn">Add to Favorites</button>
        `;

        movieCard.querySelector(".favorite-btn").addEventListener("click", () => {
            saveToFavorites(movie);
        });

        moviesContainer.appendChild(movieCard);
    });
};


const saveToFavorites = (movie) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${movie.Title} has been added to your favorites.`);
        displayFavorites(); 
    } else {
        alert(`${movie.Title} is already in your favorites.`);
    }
};

const displayFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesContainer.innerHTML = ""; 
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    favorites.forEach(async (movie) => {
        const details = await fetchMovieDetails(movie.imdbID); 
        const favoriteCard = document.createElement("div");
        favoriteCard.className = "movie-card";
        favoriteCard.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
            <p class="rating">Rating: ${details?.imdbRating || "N/A"}</p>
            <button class="remove-favorite-btn">Remove</button>
        `;

        
        favoriteCard.querySelector(".remove-favorite-btn").addEventListener("click", () => {
            removeFromFavorites(movie.imdbID);
        });

        favoritesContainer.appendChild(favoriteCard);
    });
};


const removeFromFavorites = (imdbID) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((movie) => movie.imdbID !== imdbID);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Movie removed from favorites.");
    displayFavorites(); 
};


searchButton.addEventListener("click", () => {
    const title = movieTitleInput.value.trim();
    if (title) {
        fetchMovies(title);
    } else {
        alert("Please enter a movie title.");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    displayFavorites();
});
