let movies = JSON.parse(localStorage.getItem("movies")) || [];

function saveMovies() {
  localStorage.setItem("movies", JSON.stringify(movies));
}

function addMovie() {
  const name = document.getElementById("movieName").value;
  const status = document.getElementById("movieStatus").value;
  if (name === "") return;

  movies.push({ name, status });
  saveMovies();
  displayMovies(movies);
  document.getElementById("movieName").value = "";
}

function displayMovies(list) {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = "";

  list.forEach((movie, index) => {
    const li = document.createElement("li");
    li.textContent = `${movie.name} - ${movie.status === "watched" ? "✅ Watched" : "🎯 To Watch"}`;
    movieList.appendChild(li);
  });
}

function filterMovies(status) {
  if (status === "all") {
    displayMovies(movies);
  } else {
    const filtered = movies.filter(movie => movie.status === status);
    displayMovies(filtered);
  }
}

displayMovies(movies);
