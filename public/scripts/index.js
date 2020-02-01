// jshint esversion:6


const navIcon = document.querySelector('nav .nav-item .icon');

navIcon.addEventListener('click', (event) => {
  console.log('clicked!');
  const navElement = event.srcElement.parentNode.parentNode.parentNode;
  // using children instead of childNodes its is easier cause it ignores text childNodes
  // console.log(navElement.children[1]);
  const nav = document.querySelector('#nav');
  nav.classList.toggle('shown');
  console.log(nav);
});

// console.log(navIcon);
