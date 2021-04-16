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
const more = document.querySelector('.more');
const longGoodsList = document.querySelector('.long-goods-list');
const navigationLinks = document.querySelectorAll('a.navigation-link');
const cardTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');

const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok) {
		throw 'Ошибка, статус: ' + result.status;
	}
	return result.json();
}

const cart = {
	cartGoods: [],

	renderCart(){
		cardTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGoods = document.createElement('tr');
			trGoods.className = 'cart-item';
			trGoods.dataset.id = id;

			trGoods.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td
			`
			cardTableGoods.append(trGoods);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0);

		cardTableTotal.textContent = totalPrice + '$';
	},

	addGood(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({id, name, price}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		}
	},

	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},

	minusGood(id){
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				};
				break;
			}
		};
		this.renderCart();
	},

	plusGood(id){
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		};
		this.renderCart();
	}
};

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');
	
	if (addToCart) {
		cart.addGood(addToCart.dataset.id)
	}
})

cardTableGoods.addEventListener('click', event => {
	const target = event.target; 

	if (target.tagName === 'BUTTON') {
		const id = target.closest('.cart-item').dataset.id;

		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		};
	
		if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		};
	
		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		};
	};
})

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show')
};

const closeModal = () => {
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
	scrollLinks[i].addEventListener('click', event => {
		event.preventDefault();
		const id = scrollLinks[i].getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
	})
}

// render cards

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

const renderCards = data => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);
	document.body.classList.add('show-goods');
}

more.addEventListener('click', event => {
	event.preventDefault();
	sectionTitle.textContent = 'All';
	document.body.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
	getGoods().then(renderCards);
})

const filterCards = (field, value) => {
	document.body.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
	getGoods()
		.then(data => data.filter(good => good[field] === value))
		.then(renderCards);
}

navigationLinks.forEach(link => {
	link.addEventListener('click', event => {
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

buttonAccessories.addEventListener('click', event => {
	event.preventDefault();
	sectionTitle.textContent = 'Accessories';
	filterCards('category', 'Accessories')
})

buttonClothing.addEventListener('click', event => {
	event.preventDefault();
	sectionTitle.textContent = 'Clothing';
	filterCards('category', 'Clothing')
})

// Работа с сервером

const modalForm = document.querySelector('.modal-form');

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser
});

modalForm.addEventListener('submit', event => {
	event.preventDefault();

	const formData = new FormData(modalForm);
	formData.append('goodsCustomer', JSON.stringify(cart.cartGoods))

	postData(formData)
		.then(response => {
			if (!response.ok) {
				throw new Error(response.status);
			}
			alert('Ваш заказ успешно отправлен, с Вами свяжутся в ближайшее время!');
		})
		.catch(error => {
			alert('К сожалению произошла ошибка, повторите попытку позже!');
		})
		.finally(() => {
			closeModal();
			modalForm.reset();
			cart.cartGoods.length = 0;
		})
});