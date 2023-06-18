import { Scene, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import ControlPanel from './controlPanel'
import Sun from './sun';
import Home from './home';
import Renderer from './renderer';

import './style.css'

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;
camera.position.y = 20;

const sun = new Sun(new Vector3(0, 0, 0));

const renderer = new Renderer();

const controls = new OrbitControls(camera, renderer.domElement);

new Home(homeMesh => {
	document.getElementById('loader').remove();
	scene.add(homeMesh);
	sun.attachTo(scene);
	sun.update(gui.config.dateObject, gui.config.latitude, gui.config.longitude)
	document.body.appendChild(renderer.domElement);
});

const gui = new ControlPanel(sun,()=>{
	sun.update(gui.config.dateObject, gui.config.latitude, gui.config.longitude);
});

window.addEventListener('resize', onResize, false);

function onResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate()
{
	controls.update();
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	if (gui.config.animate)
	{
		sun.update(gui.config.dateObject, gui.config.latitude, gui.config.longitude);
	}
}

animate();