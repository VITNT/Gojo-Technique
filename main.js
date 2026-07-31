import './styles.css';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.z = 20;

// Blue Icosahedron
const blueGeometry = new THREE.IcosahedronGeometry(4, 0);
const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x006eff, transparent: true });
const blueSphere = new THREE.Mesh(blueGeometry, blueMaterial);

blueSphere.position.set(-10, 0, 0);
scene.add(blueSphere);

// Red Torus
const redGeometry = new THREE.TorusKnotGeometry(3, 1, 16, 100);
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true });
const redTorus = new THREE.Mesh(redGeometry, redMaterial);


redTorus.position.set(10, 0, 0);
scene.add(redTorus);

// Hollow Purple
const purpleGeometry = new THREE.SphereGeometry(8, 32, 16);
const purpleMaterial = new THREE.MeshBasicMaterial({
  color: 0x800080,
  wireframe: true,
  transparent: true,
});
const purpleSphere = new THREE.Mesh(purpleGeometry, purpleMaterial);

purpleSphere.position.set(0, 0, 0);
scene.add(purpleSphere);

// Gojo Cube
const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
const texture = new THREE.TextureLoader().load('gojo.png');
const boxMaterial = new THREE.MeshBasicMaterial({ map: texture });
const box = new THREE.Mesh(boxGeometry, boxMaterial);

box.position.set(0, 5, 0);
scene.add(box);

// Scroll Movement
const converge_start = 400;
const converge_range = 1000

const reveal_purple_start = 1100;
const reveal_purple_range = 800;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  const scroll_position = -t;
  camera.position.y = t * 0.008;

  const converge_progress = Math.min(Math.max(scroll_position - converge_start, 0) / converge_range, 1);

  blueSphere.position.x = -10 + converge_progress * 8;
  redTorus.position.x = 10 - converge_progress * 8;

  blueSphere.position.y = camera.position.y;
  redTorus.position.y = camera.position.y;
  purpleSphere.position.y = camera.position.y;

  const reveal_progress = Math.min(Math.max(scroll_position - reveal_purple_start, 0) / reveal_purple_range, 1);

  purpleSphere.visible = reveal_progress > 0;
  purpleMaterial.opacity = reveal_progress;

  const scale = 0.2 + reveal_progress * 0.8;
  purpleSphere.scale.set(scale, scale, scale);

  const fade = 1 - reveal_progress;
  blueMaterial.opacity = fade;
  redMaterial.opacity = fade;
  blueSphere.visible = fade > 0.01;
  redTorus.visible = fade > 0.01;
}

document.body.onscroll = moveCamera;
moveCamera();


// Stars bg

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Animate

function animate() {
  requestAnimationFrame(animate);

  blueSphere.rotation.x += 0.005;
  blueSphere.rotation.y += 0.01;

  redTorus.rotation.x += 0.01;
  redTorus.rotation.y += 0.01;

  purpleSphere.rotation.x += 0.005;
  purpleSphere.rotation.y += 0.01;

  box.rotation.x += 0.01;
  box.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();