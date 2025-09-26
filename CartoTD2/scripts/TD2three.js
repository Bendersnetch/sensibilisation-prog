import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 10);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

scene.fog = new THREE.Fog( 0xcccccc, 10, 15 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const gltfLoader = new GLTFLoader();

gltfLoader.load(
	// resource URL
	'gltf/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {

        scene.add( gltf.scene );
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.x = 5;

        window.addEventListener("deviceorientation", (event) => {

            gltf.scene.rotation.set(event.beta, event.gamma, event.alpha)
            
            console.log(`${event.alpha} : ${event.beta} : ${event.gamma}`);
        });

		// gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scene; // THREE.Group
		// gltf.scenes; // Array<THREE.Group>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load( 'textures/flower-1.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshStandardMaterial( { map: texture } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


function animate() {
    renderer.render( scene, camera );
    controls.update();
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

renderer.setAnimationLoop( animate );

