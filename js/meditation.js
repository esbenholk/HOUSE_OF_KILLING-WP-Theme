import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { SimplexNoise } from "/wp-content/themes/house_of_killing/three/jsm/examples/math/SimplexNoise.js";

let canvas = document.getElementById("canvas");

var mouseX = 0, mouseY = 0;
let camera, scene, renderer;

var numTorus = 80;
var tabTorus = [];
let speed = 0.8;
let rotation = 1; 

let light1, light2, light3, light4, light5, light6, flashlight;


const manager = new THREE.LoadingManager();

manager.onLoad = function ( ) {

    console.log( 'Loading complete!');
    document.getElementById('loading-screen').remove()

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

};

manager.onError = function ( url ) {

    console.log( 'There was an error loading ' + url );
    document.getElementById('loading-status').innerHTML = "<div class='missing-content'><img src='/wp-content/themes/house_of_killing/icons/ghosticon.png'/><p>missing content</p></div>"

};

var loader = new THREE.TextureLoader(manager);








function init(){
  renderer = new THREE.WebGLRenderer({antialias: true});
  camera = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,0.1,10000);



  scene = new THREE.Scene();
  scene.add(camera);

  renderer.setSize(window.innerWidth, window.innerHeight);
  
  canvas.append(renderer.domElement);
  
  window.addEventListener( 'resize', onWindowResize, false ); 
  
  
  let light = new THREE.HemisphereLight( 0xfe6fff, 0xfe6fff, 5 );
  light.position.set( 0, 0, 0 );
  scene.add( light );
  
const sphere = new THREE.SphereBufferGeometry( 0.1, 16, 8 );

light1 = new THREE.PointLight( 0xffffff, 1, 300 );
light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
scene.add( light1 );

light2 = new THREE.PointLight( 0x0040ff, 3, 200 );
light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
scene.add( light2 );

light3 = new THREE.PointLight( 0x2CFC0A, 20, 300 );
light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A } ) ) );
scene.add( light3 );

light4 = new THREE.PointLight( 0xffaa00, 10, 500 );
light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
scene.add( light4 );

light5 = new THREE.PointLight( 0xff0040, 5, 100 );
light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
scene.add( light5 );

light6 = new THREE.PointLight( 0x2CFC0A, 2, 700 );
light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A } ) ) );
scene.add( light6 );



  const texture = loader.load( "/wp-content/themes/house_of_killing/images/waternormals.jpg" );

  texture.repeat.set( 20, 10 );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.encoding = THREE.sRGBEncoding;
  
  // Console
  
    var Controls = function() {
        this.speed = 2;
        this.rotation = 0;
    };

 
    // Normalmaterial
    var normalMaterial = new THREE.MeshPhongMaterial({
        color:     0x996633, 
        specular:  0x050505,
        shininess: 10,
        map: texture,
        vertexColors: THREE.VertexColors, 
        side: THREE.DoubleSide
    })
    // Torus
    function Torus(f){
        this.b = new THREE.Mesh(new THREE.TorusGeometry( 160, 75, 2, 13), normalMaterial);
        this.b.position.x = 57*Math.cos(f);
        this.b.position.y = 57*Math.sin(f);
        this.b.position.z = f*1.25;
        this.b.rotation.z = f*0.03;
    }
            

    for(var i=0; i<numTorus; i++){
        tabTorus.push(new Torus(-i*13));
        scene.add(tabTorus[i].b);
    }	


    render();
}


// Update
function update(){
  for(var i=0; i<numTorus; i++){
    tabTorus[i].b.position.z+=speed;
    tabTorus[i].b.rotation.z+=i*rotation/10000;
    if(tabTorus[i].b.position.z>0)
    {
      tabTorus[i].b.position.z=-1000;
    }
  }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}




// Render
function render() {
  requestAnimationFrame( render);

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;

  renderer.render(scene, camera);
  update();



  const time = Date.now() * 0.00025;
  const d = 0.5;

//   light1.position.set(0,0,-1);
//   light2.position.set(0,0,-1);

  light1.position.x = Math.sin( time * 0.7 ) * 15;
  light1.position.y = Math.cos( time * 0.5 ) * 22;
  light1.position.z = Math.cos( time * 0.3 ) * 20;

  light2.position.x = Math.cos( time * 0.3 ) * 30;
  light2.position.y = Math.sin( time * 0.5 ) * 40;
  light2.position.z = Math.sin( time * 0.7 ) * 30;

//   light3.position.x = Math.sin( time * 0.7 ) * 30;
//   light3.position.y = Math.cos( time * 0.3 ) * 40;
//   light3.position.z = Math.sin( time * 0.5 ) * 30;

//   light4.position.x = Math.sin( time * 0.3 ) * 30;
//   light4.position.y = Math.cos( time * 0.7 ) * 40;
//   light4.position.z = Math.sin( time * 0.5 ) * 30;
  
//   light5.position.x = Math.sin( time * 0.3 ) * 20;
//   light5.position.y = Math.cos( time * 0.7 ) * 20;
//   light5.position.z = Math.sin( time * 0.5 ) * 20;
  
//   light6.position.x = Math.sin( time * 0.3 ) * 30;
//   light6.position.y = Math.cos( time * 0.7 ) * 40;
//   light6.position.z = Math.sin( time * 0.5 ) * 30;
}

init();

