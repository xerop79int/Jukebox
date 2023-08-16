const moveButton = document.getElementById('moveButton');
const mySection = document.getElementById('mySection');
const lock = document.getElementById('brandleaderLock');
const unlock = document.getElementById('brandleaderUnlock');
const check = document.getElementById('brandleaderCheck');
const cross = document.getElementById('brandleaderCross');
const mainButton = document.getElementById('bMainButton');
const closeButton = document.getElementById('bCloseButton');
const popup = document.getElementById('bPopup');


moveButton.addEventListener('click', () => {
  mySection.classList.toggle('bandleader-right-position');
});

lock.addEventListener('click', () => {
  lock.style.display = 'none';
  unlock.style.display = 'block';
});

unlock.addEventListener('click', () => {
  unlock.style.display = 'none';
  lock.style.display = 'block';
});

check.addEventListener('click', () => {
  check.style.display = 'none';
  cross.style.display = 'block';
});

cross.addEventListener('click', () => {
  cross.style.display = 'none';
  check.style.display = 'block';
});



const adminDropDown = document.getElementById('bandleader-btn')
const adminDropDownContent = document.getElementById('bandleader-show')
const hideDropDown = document.getElementById('bandleader-hide-btn')

adminDropDown.addEventListener('click', () => {
  adminDropDownContent.style.display = 'block';
})
hideDropDown.addEventListener('click', (event) => {
  event.stopPropagation();
  adminDropDownContent.style.display = 'none';
});

const addButtons = document.querySelectorAll('.bandleader-add-btn');

addButtons.forEach(button => {
  button.addEventListener('click', function() {
    showPopup(this);
  });
});

function showPopup(element) {
  const popup = document.querySelector('.bandleader-popup');
  popup.classList.add('bandleader-show');

  setTimeout(function() {
    popup.classList.remove('bandleader-show');
  }, 1000);
}

mainButton.addEventListener('click', () => {
  popup.style.right = '25px';
  popup.style.display = 'flex';
  mainButton.style.display = 'none';
});

closeButton.addEventListener('click', () => {
  mainButton.style.display = 'block';
  popup.style.right = '-550px';
});
