const moveButton = document.getElementById('moveButton');
const mySection = document.getElementById('mySection');

moveButton.addEventListener('click', () => {
  mySection.classList.toggle('right-position');
});

const mainButton = document.getElementById('mainButton');
const closeButton = document.getElementById('closeButton');
const popup = document.getElementById('popup');

mainButton.addEventListener('click', () => {
  popup.style.right = '0px';
  popup.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
  mainButton.style.display = 'block';
  popup.style.right = '-350px';
});
