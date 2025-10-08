import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

let map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 1.5;

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load( 'textures/earth.png' );
texture.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshBasicMaterial( { map: texture } ); 
const sphere = new THREE.Mesh( geometry, material );
sphere.rotation.y = 0;
sphere.rotation.x = 0;

scene.add( sphere );

function animate() {
    renderer.render( scene, camera );
    controls.update();
    countries.forEach((country) => {
      country.rotation.x += 0.01;
      country.rotation.y += 0.01;
    });
}

function geodetic2ecef(lat, lon) {
    // Convert degrees to radians
    const latRad = lat * Math.PI / 180;
    const lonRad = -lon * Math.PI / 180;

    const x = Math.cos(latRad) * Math.cos(lonRad);
    const y = Math.sin(latRad);
    const z = Math.cos(latRad) * Math.sin(lonRad);
    
    return { x, y, z };
}

const countries = []
function getFlags() {
  const url = 'https://restcountries.com/v3.1/all?fields=name,latlng,flags'

  fetch(url, {
    method: 'GET',
    headers: {
      "Content-type": "application/json",
    }
  }).then((response) => response.json()).then((json) => {
    for(const country of json) {
      const geometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);

      const flag = textureLoader.load( country.flags.png );
      const material = new THREE.MeshStandardMaterial( { map: flag } );

      const cube = new THREE.Mesh( geometry, material );

      const countryCoords = geodetic2ecef(country.latlng[0], country.latlng[1]);

      cube.position.x = countryCoords.x;
      cube.position.y = countryCoords.y;
      cube.position.z = countryCoords.z;

      countries.push(cube)
      scene.add( cube );

    }
  });

}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    geox.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  updateMap(lat, lon);

  const ecef = geodetic2ecef(lat, lon);

  const sphereCoords = {
      x: ecef.x,
      y: ecef.y,
      z: ecef.z
  };

  const markerGeometry = new THREE.SphereGeometry(0.02);
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(sphereCoords.x, sphereCoords.y, sphereCoords.z);
  scene.add(marker);
  
}

function error() {
  alert("Sorry, no position available.");
}



function updateMap(latitude, longitude) {
    map.setView([latitude, longitude]);

    var userPosition = L.marker([latitude, longitude]).addTo(map);
    // userPosition.bindPopup("You are Here").openPopup();

    // var nice = L.marker([43.6981477,7.2648009]).addTo(map);
    // nice.bindPopup("Nice").openPopup();

    // var bermude = L.polygon([
    //     [25.761681, -80.191788],
    //     [18.466333, -66.105721],
    //     [32.294, -64.783]
    // ]).addTo(map);
    // bermude.bindPopup("Bermuda Triangle").openPopup();

}

getFlags()
getLocation()
renderer.setAnimationLoop( animate );