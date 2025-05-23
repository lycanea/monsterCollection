const collectedFilter = document.getElementById('collected-filter');
const typeFilter = document.getElementById('type-filter');
const rarityFilter = document.getElementById('rarity-filter');
const collection = document.getElementById('collection');
const collectedCounter = document.getElementById('collected');
const totalCounter = document.getElementById('total');
let collectionData = [];

const collected = localStorage.getItem('collected') === null ? localStorage.setItem('collected', JSON.stringify({})) : null;

// Filter states
const collectedStates = ['All', 'Collected', 'Uncollected'];
const typeStates = ['All', 'Ultra', 'Regular', 'Reserve', 'Java', 'Triple Shot', 'Juice', 'Rehab'];
const rarityStates = ['All', 'Common', 'Rare', 'Special'];
let collectedState = 0;
let typeState = 0;
let rarityState = 0;

// Render function
function renderCollection() {
	collection.innerHTML = '';
	const collectedData = JSON.parse(localStorage.getItem('collected')) || {};
	let countCollected = 0
	totalCounter.innerHTML = Object.values(collectionData).length;
	Object.values(collectionData).forEach(item => {
		// Filtering logic
		const isCollected = !!collectedData[item.name];
		if (
			(collectedStates[collectedState] === 'Collected' && !isCollected) ||
			(collectedStates[collectedState] === 'Uncollected' && isCollected)
		) return;
		if (isCollected) countCollected += 1;
		if (
			typeStates[typeState] !== 'All' &&
			item.category !== typeStates[typeState]
		) return;
		if (
			rarityStates[rarityState] !== 'All' &&
			item.rarity !== rarityStates[rarityState]
		) return;

		const card = document.createElement('div');
		card.className = 'card';
		card.id = item.name;
		const safeId = 'collected_' + encodeURIComponent(item.name);
		card.innerHTML = `
			<img class="monster-img" src="/monsterCollection/${item.image}" alt="${item.name}">
			<h3>${item.name}</h3>
			<p>Rarity: ${item.rarity}</p>
			<p>Type: ${item.category}</p>
			<input type="checkbox" id="${safeId}" name="${safeId}" value="collected">
			<label for="${safeId}"> Collected</label><br>
		`;
		collection.appendChild(card);

		const checkbox = card.querySelector(`#${CSS.escape(safeId)}`);
		if (checkbox) {
			checkbox.checked = isCollected;
			checkbox.addEventListener('change', function() {
				const collectedData = JSON.parse(localStorage.getItem('collected')) || {};
				if (this.checked) {
					collectedData[item.name] = true;
				} else {
					delete collectedData[item.name];
				}
				localStorage.setItem('collected', JSON.stringify(collectedData));
				renderCollection(); // re-render on change
			});
		}
	});
	collectedCounter.innerHTML = countCollected;
}

fetch('collection.json')
	.then(response => response.json())
	.then(data => {
		collectionData = data;
		renderCollection();
	})
	.catch(error => {
		console.error('Error loading collection.json:', error);
	});

if (collectedFilter) {
	collectedFilter.textContent = 'Collected: ' + collectedStates[collectedState];
	collectedFilter.addEventListener('click', function () {
		collectedState = (collectedState + 1) % collectedStates.length;
		this.textContent = 'Collected: ' + collectedStates[collectedState];
		renderCollection();
	});
}
if (typeFilter) {
	typeFilter.textContent = 'Type: ' + typeStates[typeState];
	typeFilter.addEventListener('click', function () {
		typeState = (typeState + 1) % typeStates.length;
		this.textContent = 'Type: ' + typeStates[typeState];
		renderCollection();
	});
}
if (rarityFilter) {
	rarityFilter.textContent = 'Rarity: ' + rarityStates[rarityState];
	rarityFilter.addEventListener('click', function () {
		rarityState = (rarityState + 1) % rarityStates.length;
		this.textContent = 'Rarity: ' + rarityStates[rarityState];
		renderCollection();
	});
}