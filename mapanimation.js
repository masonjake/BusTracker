//Insert API key here
mapboxgl.accessToken = 'YOUR_API_KEY';

let map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-71.104081, 42.365554],
	zoom: 10,
});
const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');
let markers = [];

async function makeMarkers() {
	let buses = await getBusLocations();
	for (let bus of buses) {
		let marker = new mapboxgl.Marker()
			.setLngLat([bus.attributes.longitude, bus.attributes.latitude])
			.addTo(map);
		markers.push(marker);
	}
	move(markers);
}

async function updateLocation(markers) {
	let buses = await getBusLocations();

	while (markers.length > buses.length) {
		let rmMarker = markers.pop();
		rmMarker.remove();
	}
	buses.forEach((bus, index) => {
		if (index < markers.length) {
			markers[index].setLngLat([
				bus.attributes.longitude,
				bus.attributes.latitude,
			]);
		} else {
			let marker = new mapboxgl.Marker()
				.setLngLat([bus.attributes.longitude, bus.attributes.latitude])
				.addTo(map);
			markers.push(marker);
		}
	});
}

function move(markers) {
	updateLocation(markers).then(() => {
		setTimeout(() => {
			move(markers);
		}, 10000);
	});
}

// Request bus data from MBTA
async function getBusLocations() {
	let buses = [];
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json = await response.json();
	json.data.forEach((element) => {
		buses.push(element);
	});
	return buses;
}

// function bounce() {
// 	let reverse = false;
// 	let pos = 0;
// 	let max = window.innerWidth;

// 	let img = document.getElementById('bus');
// 	let imgWidth = img.width;

// 	if (pos + imgWidth >= max) {
// 		!reverse;
// 	}

// 	if (!reverse) {
// 		// reverse is true moves right to left
// 		pos -= 20;
// 		img.style.left = pos + 'px';
// 	} else {
// 		pos += 20;
// 		img.style.left = pos + 'px';
// 	}
// 	setTimeout(bounce, 200);
// }
// bounce();
// let borderBreak = document.getElementById('border-break');
// let border = document.getElementById('border');

// border.addEventListener('mousemove', (event) => {
// 	let borderRect = border.getBoundingClientRect();

// 	let mouseX = event.clientX - borderRect.left;
// 	let mouseY = event.clientX - borderRect.top;

// 	let borderBreakWidth = borderBreak.clientWidth;
// 	let borderBreakHeight = borderBreak.clientHeight;

// 	let left = Math.max(
// 		0,
// 		Math.min(
// 			mouseX - borderBreakWidth / 2,
// 			border.clientWidth - borderBreakWidth
// 		)
// 	);
// 	let top = Math.max(
// 		0,
// 		Math.min(
// 			mouseY - borderBreakHeight / 2,
// 			border.clientHeight - borderBreakHeight
// 		)
// 	);
// 	borderBreak.style.left = `${left}px`;
// 	borderBreak.style.top = `${top}px`;
// });
