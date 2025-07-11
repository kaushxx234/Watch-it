const form = document.getElementById("movie-form");
const titleInput = document.getElementById("title");
const genreInput = document.getElementById("genre");
const notesInput = document.getElementById("notes");
const movieGrid = document.getElementById("movies");
const searchInput = document.getElementById("search");

let movies = JSON.parse(localStorage.getItem("movies")) || [];

const OMDB_API_KEY = "1efd3fd7"; // 🔑 Replace this with your OMDb key

// Add Movie
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const genre = genreInput.value.trim();
  const notes = notesInput.value.trim();

  if (!title || !genre) return;

  const poster = await fetchPoster(title);

  const movie = {
    title,
    genre,
    notes,
    poster
  };

  movies.push(movie);
  localStorage.setItem("movies", JSON.stringify(movies));
  renderMovies(movies);

  form.reset();
});

// Fetch Poster from OMDb
async function fetchPoster(title) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();
    return data.Poster && data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/200x300?text=No+Poster";
  } catch {
    return "https://via.placeholder.com/200x300?text=Error";
  }
}

// Render Movies
function renderMovies(movieList) {
  movieGrid.innerHTML = "";

  movieList.forEach((movie, index) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p><strong>Genre:</strong> ${movie.genre}</p>
      ${movie.notes ? `<p><em>${movie.notes}</em></p>` : ""}
      <button onclick="deleteMovie(${index})">🗑 Delete</button>
    `;

    movieGrid.appendChild(card);
  });
}

// Delete Movie
function deleteMovie(index) {
  movies.splice(index, 1);
  localStorage.setItem("movies", JSON.stringify(movies));
  renderMovies(movies);
}

// Live Search
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = movies.filter(movie => movie.title.toLowerCase().includes(query));
  renderMovies(filtered);
});

// Initial Render
renderMovies(movies);
