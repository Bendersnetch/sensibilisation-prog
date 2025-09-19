var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function updateMap(latitude, longitude) {
    map.setView([latitude, longitude]);

    var userPosition = L.marker([latitude, longitude]).addTo(map);
    // userPosition.bindPopup("You are Here").openPopup();

    var nice = L.marker([43.6981477,7.2648009]).addTo(map);
    // nice.bindPopup("Nice").openPopup();

    var bermude = L.polygon([
        [25.761681, -80.191788],
        [18.466333, -66.105721],
        [32.294, -64.783]
    ]).addTo(map);
    // bermude.bindPopup("Bermuda Triangle").openPopup();

}