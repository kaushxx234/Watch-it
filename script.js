// script.js - Watch It logic with OMDb & hearts

const form = document.getElementById("movie-form");
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const movieGrid = document.getElementById("movies");
const ratingStars = document.querySelectorAll(".star");

let selectedRating = 0;
let movies = JSON.parse(localStorage.getItem("movies")) || [];

const OMDB_API_KEY = "1efd3fd7"; // 🔑 Your actual API key

// Handle heart selection
ratingStars.forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    updateStars(selectedRating);
  });
});

function updateStars(rating) {
  ratingStars.forEach(star => {
    const val = parseInt(star.dataset.value);
    if (val <= rating) star.classList.add("selected");
    else star.classList.remove("selected");
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const genre = genreInput.value;

  if (!title || !genre || !selectedRating) return;

  const poster = await fetchPoster(title);

  const movie = {
    title,
    genre,
    rating: selectedRating,
    poster
  };

  movies.push(movie);
  localStorage.setItem("movies", JSON.stringify(movies));
  renderMovies(movies);
  form.reset();
  updateStars(0);
  selectedRating = 0;
});

async function fetchPoster(title) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();
    return data.Poster && data.Poster !== "N/A"
      ? data.Poster
      : "https://via.placeholder.com/200x300?text=No+Poster";
  } catch (err) {
    return "https://via.placeholder.com/200x300?text=Error";
  }
}

function renderMovies(movieList) {
  movieGrid.innerHTML = "";

  movieList.forEach((movie, index) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p><strong>Genre:</strong> ${movie.genre}</p>
      <p><strong>Rating:</strong> ${"❤️".repeat(movie.rating)}</p>
      <button onclick="deleteMovie(${index})">🗑 Delete</button>
    `;

    movieGrid.appendChild(card);
  });
}

window.deleteMovie = function (index) {
  movies.splice(index, 1);
  localStorage.setItem("movies", JSON.stringify(movies));
  renderMovies(movies);
};

renderMovies(movies);
