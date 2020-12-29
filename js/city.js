import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { Water } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Water.js';
import { Sky } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Sky.js';

import { GLTFLoader } from '/wp-content/themes/house_of_killing/three/examples/jsm/loaders/GLTFLoader.js';
import { FirstPersonControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/FirstPersonControls.js';

console.log("start");

let canvas = document.getElementById("canvas");

canvas.addEventListener('mousedown', function(){
  canvas.classList.add("hide-cursor")
})
canvas.addEventListener('mouseup', function(){
  canvas.classList.remove("hide-cursor")
})

let c, ctx, texture;

function drawCanvas(){
      // geting canvas by Boujjou Achraf
      c = document.getElementById("HTMLcanvas");
      c.style.display = "none"
      ctx = c.getContext("2d");
  
      //making the canvas full screen
      c.height = 700;
      c.width = 300;
  
      var wipeBlock1 = "██"; //Block to clear
      var wipeBlock2 = "▉"; //Block to clear
      //chinese characters - taken from the unicode charset
      var matrix =
        "WWWXXXXXXWWWCCCC///////((())))====111"; //子月刀馬日
      //converting the string into an array of single characters
      matrix = matrix.split("");
  
      var font_size = 50;
      ctx.font = font_size + "px monospace";
  
      var columns = c.width / font_size; //number of columns for the rain
      //one per column
      var drops = []; //Array of drops
      var speed = []; //Frames till next move
      var sMem = []; //Drop speed
  
      //x below is the x coordinate
      //1 = y co-ordinate of the drop(same for every drop initially)
      for (var x = 0; x < columns; x++) {
        drops[x] = 1;
        sMem[x] = 1;
        speed[x] = 0;
      }
  
      //drawing the characters
      function draw() {
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.shadowColor = "#002aff";
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0, 42, 255, 0.03)";
        ctx.fillRect(0, 0, c.width, c.height);
  
        //looping over drops
        for (var i = 0; i < drops.length; i++) {
          //sending the drop back to the top randomly after it has crossed the screen
          //adding a randomness to the reset to make the drops scattered on the Y axis
          if (drops[i] * font_size > c.height && Math.random() > 0.985) {
            drops[i] = 0;
            sMem[i] = 1 + Math.floor(Math.random() * 3);
            speed[i] = 0;
          }
  
          //incrementing Y coordinate
          if (speed[i] >= sMem[i]) {
            ctx.fillStyle = "#002aff"; //black text
            ctx.shadowBlur = 0;
  
            ctx.fillText(wipeBlock1, i * font_size, drops[i] * font_size); //x = i*font_size, y = value of drops[i]*font_size
            ctx.shadowBlur = 0;
            ctx.fillText(wipeBlock2, i * font_size, drops[i] * font_size); //x = i*font_size, y = value of drops[i]*font_size
            ctx.shadowBlur = 0;
            var text = matrix[Math.floor(Math.random() * matrix.length)]; //a random chinese character to print
            ctx.shadowColor = "#0f0";
            ctx.shadowBlur = 2;
            ctx.fillStyle = "#0f0"; //green text
            ctx.fillText(text, i * font_size, drops[i] * font_size); //x = i*font_size, y = value of drops[i]*font_size
            ctx.shadowColor = "#fff";
            ctx.shadowBlur = 2;
            ctx.fillStyle = "#fff"; //white text
            ctx.fillText(text, i * font_size, (drops[i] + 1) * font_size); //x = i*font_size, y = value of drops[i]*font_size
            drops[i]++;
            speed[i] = 0;
          } else {
            speed[i]++;
          }
        }
        // material.map.needsUpdate = true;

      }
      setInterval(draw, 30);
}
drawCanvas();


var scene, camera, renderer, light, shadow, building, city, controls, lastTime, clock;
let light1, light2, light3, light4, light5, light6, light7, light8;
let sun, water, sky;


init();
animate();

function init() {
  clock = new THREE.Clock();
  sun = new THREE.Vector3();

	// init renderer
	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
	renderer.setClearColor( 0xd8e7ff );
	renderer.setSize( window.innerWidth, window.innerHeight );
  canvas.appendChild( renderer.domElement );
  
  // setup scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x0026ff)
	// setup camera
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.position.y = 100;
  camera.lookAt( scene.position );

	// setup controls
	controls = new FirstPersonControls( camera, document.body );
	controls.movementSpeed = 20;
	controls.lookSpeed = 0.05;
  controls.verticalMax = -7;
  controls.verticalMin = 0.9;
  controls.heightMin = 10;
  controls.heightSpeed = true;



	// scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );
	// setup lighting
	light = new THREE.HemisphereLight( 0xfffff0, 0x101020, 1.25 );
	light.position.set( 0.75, 1, 0.25 );
	scene.add( light );
	// setup plane
	var plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshBasicMaterial( { color: 0x101018 } ) );
	plane.rotation.x = - 90 * Math.PI / 180;
	scene.add( plane );
	// build geometry
	var geometry = new THREE.CubeGeometry( 1, 1, 1 );
	geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

	// build city
	building = new THREE.Mesh( geometry );
	city = new THREE.Geometry();
	// lighting colors
	light = new THREE.Color( 0xffffff );
	shadow = new THREE.Color( 0x303050 );
	// generate city mesh
	for( var i = 0; i < 20000; i++ ){

		var value = 1 - Math.random() * Math.random();
		var color = new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );

		var top = color.clone().multiply( light );
		var bottom = color.clone().multiply( shadow );

		building.position.x = Math.floor( Math.random() * 200 - 100 ) * 10;
		building.position.z = Math.floor( Math.random() * 200 - 100 ) * 10;
		building.rotation.y = Math.random();// * Math.PI * 2;
		building.scale.x = Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
		building.scale.y = (Math.random() * Math.random() * Math.random() * building.scale.x) * 8 + 8;
		building.scale.z = building.scale.x;


		var geometry2 = building.geometry;
		for ( var j = 0, jl = geometry2.faces.length; j < jl; j++ ) {

			if ( j === 2 ) {

				geometry2.faces[ j ].vertexColors = [ color, color, color, color ];

			} else {

				geometry2.faces[ j ].vertexColors = [ top, bottom, bottom, top ];
			}
		}

    building.updateMatrix();
    city.merge(building.geometry, building.matrix)
		// THREE.GeometryUtils.merge( city, building );
	}

	// generate texture
  texture = new THREE.CanvasTexture(ctx.canvas);
	texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
	texture.needsUpdate = true;

  // build mesh

	var mesh = new THREE.Mesh( city, new THREE.MeshPhongMaterial({
      color:     0x996633, 
      specular:  0x050505,
      shininess: 100,
      map: texture,
      vertexColors: THREE.VertexColors, 
      side: THREE.DoubleSide
  }));
	//return mesh;
  scene.add( mesh );


  const sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );

  light1 = new THREE.PointLight( 0xe500ff, 2, 1000 );
  light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  scene.add( light1 );

  light2 = new THREE.PointLight( 0x0040ff, 2, 200 );
  light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
  scene.add( light2 );

  light3 = new THREE.PointLight( 0x2CFC0A, 2, 300 );
  light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A } ) ) );
  scene.add( light3 );

  light4 = new THREE.PointLight( 0xffaa00, 2, 500 );
  light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
  scene.add( light4 );

  light5 = new THREE.PointLight( 0xff0040, 2, 100 );
  light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  scene.add( light5 );

  light6 = new THREE.PointLight( 0x2CFC0A, 2, 700 );
  light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A } ) ) );
  scene.add( light6 );

  light7 = new THREE.PointLight( 0x80ff80, 2, 200 );
  light7.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
  scene.add( light7 );

  light8 = new THREE.PointLight( 0x2CFC0A, 2, 200 );
  light8.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A} ) ) );
  scene.add( light8 );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        inclination: 0.49,
        azimuth: 0.01
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    function updateSun() {

        const theta = Math.PI * ( parameters.inclination - 0.5 );
        const phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
    
        sun.x = Math.cos( phi );
        sun.y = Math.sin( phi ) * Math.sin( theta );
        sun.z = Math.sin( phi ) * Math.cos( theta );
    
        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    
        scene.environment = pmremGenerator.fromScene( sky ).texture;
    
    }
    

    updateSun();



  
  window.addEventListener( 'resize', onWindowResize, false );

	lastTime = performance.now();
}

function animate() {

	requestAnimationFrame( animate );
	
	var time = performance.now() / 1000;
  controls.update( time - lastTime );
  console.log(camera.position);
  if(camera.position.y <= 10){
    camera.position.y = 10;
  }
  if(camera.position.y >= 130){
    camera.position.y = 130;
  }

  lastTime = time;
  render()
}
function render(){
  texture.needsUpdate = true;
  renderer.render( scene, camera );

  const time = Date.now() * 0.025;
  const d = 10;
  
          light1.position.x = Math.sin( time * 20 ) * d;
          light1.position.z = Math.cos( time * 30 ) * d;
  
          light2.position.x = Math.cos( time *10) * d;
          light2.position.z = Math.sin( time * 0 ) * d;
  
          light3.position.x = Math.sin( time * 0.1 ) * d;
          light3.position.z = Math.sin( time * 0.1 ) * d;
  
          light4.position.x = Math.sin( time * 0.003 ) * d;
          light4.position.z = Math.sin( time * 0.005 ) * d;
  
          light5.position.x = Math.cos( time * 0.003 ) * d;
          light5.position.z = Math.sin( time * 0.05 ) * d;
  
          light6.position.x = Math.cos( time * 0.1 ) * d;
          light6.position.z = Math.cos( time * 0.5 ) * d;
          
          light7.position.x = Math.cos( time * 0.7 ) * d;
          light7.position.z = Math.cos( time * 0.5 ) * d;

          light8.position.x = camera.position.x;
          light8.position.z = camera.position.z;
          light8.position.y = camera.position.y;

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
