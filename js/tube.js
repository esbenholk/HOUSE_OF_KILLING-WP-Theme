import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { GlitchPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/GlitchPass.js'
import { EffectComposer } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/RenderPass.js';

let canvas = document.getElementById("canvas")

var width = window.innerWidth;
var height = window.innerHeight;



var renderer = new THREE.WebGLRenderer({ antialias: true });



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);

renderer.setClearColor(new THREE.Color('rgb(0,0,255)'), 1);

renderer.setSize(width, height);
canvas.appendChild(renderer.domElement);

scene.add(camera);

camera.position.z = - 100;
camera.lookAt(new THREE.Vector3());

let composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

let glitchPass = new GlitchPass(9);
glitchPass.enabled = false;
composer.addPass( glitchPass );

var l = 100;
var phi = Math.floor(Math.random() * 5) + 1;
var radius = 300;
var vertices = [];

for (var i = 0; i < l; i++) {

  var pct = i / (l - 1);
  var theta = Math.PI * 2 * pct * phi;

  var taper = Math.sin(pct) * radius / 4;

  var x = taper * Math.cos(theta);
  var y = radius * EasingQuadraticIn(seat(pct)) * 2 - radius;
  var z = taper * Math.sin(theta);

  vertices.push(new THREE.Vector3(x, y, z));

}

var light = new THREE.PointLight(0xfeabff, 2, 200);

var geometry = new THREE.TubeGeometry(new THREE.SplineCurve3(vertices), 300, 100, 32, false);
var material = new THREE.MeshPhongMaterial({
  color: new THREE.Color(0xfeabff),
  side: THREE.DoubleSide,
  shininess: 25000,
  emissive: new THREE.Color('rgb(0,0,255)'),
  metal: true
});

var mesh = new THREE.Mesh(geometry, material);
mesh.scale.multiplyScalar(2);

scene.add(mesh);
scene.add(camera);
camera.add(light);

window.addEventListener('resize', resize, false);

loop();

function loop() {
  requestAnimationFrame(loop);
  mesh.rotation.y -= 1 / 300;
//   renderer.render(scene, camera);
  composer.render();
}

function resize() {

  width = window.innerWidth;
  height = window.innerHeight;

  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

}

function EasingQuadraticIn(k) {
  return k * k;
}

function seat(t) {
  return (Math.pow(2 * t - 1, 3) + 1) / 2;
}


window.addEventListener("mousemove", function(){
   
})

var timeout;

window.addEventListener("mousemove", function() {
    glitchPass.enabled = true;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(mouseStop, 10);
});

function mouseStop() {
    glitchPass.enabled = false;

}