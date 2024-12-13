// Seleciona os elementos
const menuIcon = document.getElementById('menuIcon');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');

// Abre o sidebar
menuIcon.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

// Fecha o sidebar
closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});

// Fecha ao clicar no overlay
overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
});
