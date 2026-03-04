document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  fetch("/api/albums")
    .then(res => res.json())
    .then(data => {
      window.allAlbums = data;

      if (document.querySelector(".albums-list")) {
        renderAlbums(allAlbums);
        setupSorting();
      }

      if (document.querySelector(".album-page")) {
        loadAlbumPage(allAlbums);
      }
    })
    .catch(err => console.error("Failed to load albums:", err));
});

function renderAlbums(albums) {
  const container = document.querySelector(".albums-list");
  if (!container) return;

  container.innerHTML = "";

  albums.forEach(album => {
    const albumDiv = document.createElement("div");
    albumDiv.className = "album-container";

    albumDiv.innerHTML = `
      <a href="album.html?id=${album.id}" class="album-button">
        <img src="${album.cover}" class="albums-cover" alt="${album.title}">
        <div class="album-overlay">
          <h2 class="albums-titles">${album.title}</h2>
        </div>
      </a>
    `;

    container.appendChild(albumDiv);
  });
}

function setupSorting() {
  const sortSelect = document.getElementById("sortAlbums");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", () => {
    let sorted = [...allAlbums];

    switch (sortSelect.value) {
      case "year-asc":
        sorted.sort((a, b) => a.year - b.year);
        break;

      case "year-desc":
        sorted.sort((a, b) => b.year - a.year);
        break;

      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    renderAlbums(sorted);
  });
}

function loadAlbumPage(albums) {
  const params = new URLSearchParams(window.location.search);
  const albumId = Number(params.get("id"));

  const album = albums.find(a => a.id === albumId);
  if (!album) return;

  document.querySelector(".album-cover").src = album.cover;
  document.querySelector(".album-title").textContent = album.title;

  const iframe = document.querySelector(".album-player iframe");
  if (iframe && album.spotify) {
    iframe.src = album.spotify;
  }
}



