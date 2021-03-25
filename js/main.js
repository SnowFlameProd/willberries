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
const buttonAccessories = document.querySelector('.button-accessories');
const buttonClothing = document.querySelector('.button-clothing');
const sectionTitle = document.getElementById('sectionTitle');

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

// render cards

const more = document.querySelector('.more');
const longGoodsList = document.querySelector('.long-goods-list');
const navigationLinks = document.querySelectorAll('a.navigation-link')

const getGoods = async function() {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибка, статус: ' + result.status;
	}
	return result.json();
}

const createCard = function(objCard) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
		<div class="goods-card">
			${objCard.label ? `<span class="label">${objCard.label}</span>` : ''}
			<img src="db/${objCard.img}" alt="image: ${objCard.name}" class="goods-image">
			<h3 class="goods-title">${objCard.name}</h3>
			<p class="goods-description">${objCard.description}</p>
			<button class="button goods-card-btn add-to-cart" data-id="${objCard.id}">
				<span class="button-price">$${objCard.price}</span>
			</button>
		</div>
	`

	return card;
}

const renderCards = function(data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
}

more.addEventListener('click', function(event) {
	event.preventDefault();
	sectionTitle.textContent = 'All';
	document.body.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
	getGoods().then(renderCards);
})

const filterCards = function(field, value) {
	document.body.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
	getGoods()
		.then(function (data) {
			const filterGoods = data.filter(function (good) {
				return good[field] === value;
			})
			return filterGoods;
		})
		.then(renderCards);
}

navigationLinks.forEach(function (link) {
	link.addEventListener('click', function (event) {
		event.preventDefault();
		const field = link.dataset.field;
		sectionTitle.textContent = link.textContent;
		const value = link.textContent;
		if (field) {
			filterCards(field, value);
		} else {
			getGoods().then(renderCards);
		}
	})
})

buttonAccessories.addEventListener('click', function(event) {
	event.preventDefault();
	sectionTitle.textContent = 'Accessories';
	filterCards('category', 'Accessories')
})

buttonClothing.addEventListener('click', function (event) {
	event.preventDefault();
	sectionTitle.textContent = 'Clothing';
	filterCards('category', 'Clothing')
})