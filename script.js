const collectedFilter = document.getElementById('collected-filter');
const typeFilter = document.getElementById('type-filter');
const rarityFilter = document.getElementById('rarity-filter');
const collection = document.getElementById('collection');
let collectionData = [];

const collected = localStorage.getItem('collected') === null ? localStorage.setItem('collected', JSON.stringify({})) : null;

fetch('collection.json')
	.then(response => response.json())
	.then(data => {
		collectionData = data;
		// You can now use collectionData as needed
		Object.values(data).forEach(item => {
			const card = document.createElement('div');
			card.className = 'card';
			card.id = item.name;

			// Create a safe ID by encoding the name
			const safeId = 'collected_' + encodeURIComponent(item.name);

			card.innerHTML = `
				<img class="monster-img" src="${item.image}" alt="${item.name}">
				<h3>${item.name}</h3>
				<p>Rarity: ${item.rarity}</p>
				<p>Type: ${item.category}</p>
				<input type="checkbox" id="${safeId}" name="${safeId}" value="collected">
				<label for="${safeId}"> Collected</label><br>
			`;
			collection.appendChild(card);
			
			const checkbox = card.querySelector(`#${CSS.escape(safeId)}`);
			if (checkbox) {
				checkbox.checked = JSON.parse(localStorage.getItem('collected'))[item.name] || false;
				checkbox.addEventListener('change', function() {
					console.log(`${item.name} checkbox is now ${this.checked ? 'checked' : 'unchecked'}`);
					const collectedData = JSON.parse(localStorage.getItem('collected')) || {};
					if (this.checked) {
						collectedData[item.name] = true;
					} else {
						delete collectedData[item.name];
					}
					localStorage.setItem('collected', JSON.stringify(collectedData));
				});
			}
		});
	})
	.catch(error => {
		console.error('Error loading collection.json:', error);
	});



if (collectedFilter) {
	const states = ['All', 'Collected', 'Uncollected'];
	let currentState = 0;

	collectedFilter.textContent = 'Collected: ' + states[currentState];

	collectedFilter.addEventListener('click', function () {
		currentState = (currentState + 1) % states.length;
		this.textContent = 'Filter: ' + states[currentState];
	});
}
if (typeFilter) {
	const states = ['All', 'Ultra', 'Regular', 'Juice'];
	let currentState = 0;

	typeFilter.textContent = 'Type: ' + states[currentState];

	typeFilter.addEventListener('click', function () {
		currentState = (currentState + 1) % states.length;
		this.textContent = 'Type: ' + states[currentState];
	});
}
if (rarityFilter) {
	const states = ['All', 'Common', 'Rare', 'Special'];
	let currentState = 0;

	rarityFilter.textContent = 'Rarity: ' + states[currentState];

	rarityFilter.addEventListener('click', function () {
		currentState = (currentState + 1) % states.length;
		this.textContent = 'Rarity: ' + states[currentState];
	});
}