const gallery = document.getElementById('masonry');
const statusMessage = document.getElementById('gallery-status');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal-container');
const modalImage = modal.querySelector('img');
const modalClose = modal.querySelector('.modal-close');

let artworks = [];

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function createArtwork(artwork) {
  const item = document.createElement('figure');
  item.className = 'masonry-item';

  const image = document.createElement('img');
  image.src = artwork.image;
  image.alt = artwork.title;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.dataset.category = artwork.category;
  image.addEventListener('click', () => openModal(artwork));

  item.appendChild(image);
  return item;
}

function showCategory(category) {
  const selected = category === 'all'
    ? shuffle(artworks)
    : artworks.filter((artwork) => artwork.category === category);

  const fragment = document.createDocumentFragment();
  selected.forEach((artwork) => fragment.appendChild(createArtwork(artwork)));
  gallery.replaceChildren(fragment);
  statusMessage.textContent = `${selected.length}作品`;
}

function openModal(artwork) {
  modalImage.src = artwork.image;
  modalImage.alt = artwork.title;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  modalImage.src = '';
  document.body.classList.remove('modal-open');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    showCategory(button.dataset.category);
  });
});

modal.addEventListener('click', (event) => {
  if (event.target === modal || event.target === modalClose || event.target === modal.querySelector('.modal-center')) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
});

let previousScroll = 0;
const topBar = document.querySelector('.top');
window.addEventListener('scroll', () => {
  if (window.innerWidth > 600) return;
  const currentScroll = window.scrollY;
  topBar.classList.toggle('hidden', currentScroll > previousScroll && currentScroll > 50);
  previousScroll = currentScroll;
}, { passive: true });

fetch('data/artworks.json')
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    artworks = data;
    showCategory('all');
  })
  .catch((error) => {
    console.error(error);
    statusMessage.textContent = '作品を読み込めませんでした。GitHub PagesなどのWebサーバー上で確認してください。';
  });
