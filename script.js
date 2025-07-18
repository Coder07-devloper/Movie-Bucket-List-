const movieForm = document.getElementById('movie-form');
const titleInput = document.getElementById('movie-title');
const urlInput = document.getElementById('movie-url');
const movieList = document.getElementById('movie-list');
const filterButtons = document.querySelectorAll('.filters button');

let movies = JSON.parse(localStorage.getItem('movies')) || [];

function renderMovies(filter = 'all') {
  movieList.innerHTML = '';

  let filteredMovies = movies;
  if (filter === 'watched') filteredMovies = movies.filter(m => m.watched);
  if (filter === 'unwatched') filteredMovies = movies.filter(m => !m.watched);

  filteredMovies.forEach((movie, index) => {
    const card = document.createElement('div');
    card.className = `movie-card ${movie.watched ? 'watched' : ''}`;

    card.innerHTML = `
      <img src="${movie.url || 'https://via.placeholder.com/180x270?text=No+Image'}" alt="${movie.title}" />
      <div class="info">
        <strong>${movie.title}</strong>
        <span class="status" onclick="toggleWatched(${index})">
          ${movie.watched ? '✓ Watched' : '➕ Mark as Watched'}
        </span>
      </div>
    `;

    movieList.appendChild(card);
  });
}

function toggleWatched(index) {
  movies[index].watched = !movies[index].watched;
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('movies', JSON.stringify(movies));
  renderMovies(currentFilter);
}

movieForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const url = urlInput.value.trim();
  if (!title) return;

  movies.push({ title, url, watched: false });
  titleInput.value = '';
  urlInput.value = '';
  saveAndRender();
});

let currentFilter = 'all';
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.id.replace('filter-', '');
    renderMovies(currentFilter);
  });
});

renderMovies();
