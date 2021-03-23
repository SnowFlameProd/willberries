const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalWindow = document.querySelector('.modal');
const buttonClose = document.querySelector('.modal-close');
const overlay = document.querySelector('.overlay');
const scrollLinks = document.querySelectorAll('a.scroll-link');

const openModal = function() {
	modalCart.classList.add('show')
};

const closeModal = function() {
	modalCart.classList.remove('show')
};

buttonCart.addEventListener('click', openModal);
buttonClose.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
modalWindow.addEventListener('click', function(event) {
	event.stopPropagation();
})

// smooth scroll

for (let i = 0; i < scrollLinks.length; i++) {
	scrollLinks[i].addEventListener('click', function(event) {
		event.preventDefault();
		const id = scrollLinks[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	})
}