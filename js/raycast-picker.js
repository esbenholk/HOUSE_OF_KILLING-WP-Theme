import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { OrbitControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/OrbitControls.js';

let canvas = document.getElementById("canvas");

let context = document.getElementById('archive')
let teasers= context.getElementsByClassName('teaser')
let buttons = []

for (let index = 0; index < teasers.length; index++) {
    const element = teasers[index].getElementsByTagName("h2")[0];
    buttons.push(element)
}


const manager = new THREE.LoadingManager();

manager.onLoad = function ( ) {

    console.log( 'Loading complete!');
    document.getElementById('loading-screen').remove()

};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

};

manager.onError = function ( url ) {

    console.log( 'There was an error loading ' + url );
    // document.getElementById('loading-status').innerHTML = "<div class='missing-content'><img src='/wp-content/themes/house_of_killing/icons/ghosticon.png'/><p>missing content</p></div>"

};





const textureLoader = new THREE.TextureLoader(manager);
textureLoader.crossOrigin = "Anonymous";

let clock = new THREE.Clock();

let light, light1, light2, light3, light4, light5, light6, light7, light8;


let camera, scene, raycaster, renderer, controls, group;

let INTERSECTED;
let theta = 0;

const mouse = new THREE.Vector2();
const radius = 90;

let flashlight;

init();


function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

    scene = new THREE.Scene();

   

    // scene.fog = new THREE.Fog( 0x000000, 40, 800);

    const geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );

    for ( let i = 0; i < teasers.length; i ++ ) {

        let boxImage, boxMaterial;
        boxImage = textureLoader.load(teasers[i].getElementsByTagName("img")[0].src);
        boxMaterial = new THREE.MeshPhongMaterial({
            color:     0x996633, 
            specular:  0x050505,
            shininess: 100,
            map: boxImage,
            side:      THREE.DoubleSide
        });

     
        for (let index = 0; index < Math.floor(450/teasers.length); index++) {
                    let object = new THREE.Mesh( geometry, boxMaterial);
                    object.userData = {link: teasers[i].getElementsByTagName("a")[0].href, title: teasers[i].getElementsByTagName("h2")[0]}
            
					object.position.x = Math.random() * 400 - 200;
					object.position.y = Math.random() * 400 - 200;
					object.position.z = Math.random() * 400 - 200;

					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;

                    let scale = Math.random() + 0.5
                    object.scale.set(scale,scale,scale);
                    scene.add( object );
        }

    }

    const sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );

    light1 = new THREE.PointLight( 0xff0040, 2, 80 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    scene.add( light1 );
 
    light2 = new THREE.PointLight( 0x0040ff, 2, 80 );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
    scene.add( light2 );
 
    light3 = new THREE.PointLight( 0x2CFC0A, 2, 90 );
    light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A } ) ) );
    scene.add( light3 );
 
    light4 = new THREE.PointLight( 0xffaa00, 2, 100 );
    light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    scene.add( light4 );

    light5 = new THREE.PointLight( 0xff0040, 2, 100 );
    light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    scene.add( light5 );
 
    light6 = new THREE.PointLight( 0x2CFC0A, 2, 70 );
    light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A } ) ) );
    scene.add( light6 );
 
    light7 = new THREE.PointLight( 0x80ff80, 2, 50 );
    light7.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
    scene.add( light7 );
 
    light8 = new THREE.PointLight( 0x2CFC0A, 2, 90 );
    light8.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x2CFC0A} ) ) );
    scene.add( light8 );

    flashlight = new THREE.SpotLight( 0xffffff, 0.5 );
    flashlight.angle = Math.PI / 4;
    flashlight.penumbra = 0.1;
    flashlight.decay = 2;
    // flashlight.distance = 200;

    flashlight.castShadow = true;
    flashlight.shadow.mapSize.width = 200;
    flashlight.shadow.mapSize.height = 200;
    flashlight.shadow.camera.near = 10;
    flashlight.shadow.camera.far = 200;
    flashlight.shadow.focus = 1;
    scene.add( flashlight );
    camera.add( flashlight.target );
    flashlight.target.position.set( 0, 0, -1 );
    flashlight.position.copy( camera.position );


    canvas.addEventListener( 'mousemove', onMouseMove, false );


    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.toneMapping = THREE.ReinhardToneMapping;

    canvas.appendChild( renderer.domElement );

 
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer.domElement.addEventListener('click', onClick, false);

    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


//

function animate() {


    requestAnimationFrame( animate );

    render();

}

function render() {

    theta += 0.1;

    camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    camera.lookAt( scene.position );

    flashlight.position.copy( camera.position );
    camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera( mouse, camera );


    const time = Date.now() * 0.0005;
	const delta = clock.getDelta();

    light1.position.x = Math.sin( time * 0.7 ) * 30;
    light1.position.y = Math.cos( time * 0.5 ) * 40;
    light1.position.z = Math.cos( time * 0.3 ) * 30;

    light2.position.x = Math.cos( time * 0.3 ) * 30;
    light2.position.y = Math.sin( time * 0.5 ) * 40;
    light2.position.z = Math.sin( time * 0.7 ) * 30;

    light3.position.x = Math.sin( time * 0.7 ) * 30;
    light3.position.y = Math.cos( time * 0.3 ) * 40;
    light3.position.z = Math.sin( time * 0.5 ) * 30;

    light4.position.x = Math.sin( time * 0.3 ) * 30;
    light4.position.y = Math.cos( time * 0.7 ) * 40;
    light4.position.z = Math.sin( time * 0.5 ) * 30;

    light5.position.x = Math.sin( time * 0.3 ) * -20;
    light5.position.y = Math.cos( time * 0.7 ) * -80;
    light5.position.z = Math.sin( time * 0.5 ) * -10;

    light6.position.x = Math.sin( time * 0.3 ) * 10;
    light6.position.y = Math.cos( time * 0.7 ) * 10;
    light6.position.z = Math.sin( time * 0.5 ) * 10;

    light7.position.x = Math.sin( time * 0.3 ) * 40;
    light7.position.y = Math.cos( time * 0.7 ) * 40;
    light7.position.z = Math.sin( time * 0.5 ) * 40;

    light8.position.x = Math.sin( time * 0.3 ) * 70;
    light8.position.y = Math.cos( time * 0.7 ) * 10;
    light8.position.z = Math.sin( time * 0.5 ) * 30;


    renderer.render( scene, camera );

}

function onClick() {
    event.preventDefault();
  
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
  
    var intersects = raycaster.intersectObjects(scene.children, true);
  
    if (intersects.length > 0) {
  
      if(intersects[0].object){
        window.location = intersects[0].object.userData.link;
      }
    
  
     
  
    }
  
  }

  function onMouseMove( event ) {

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    // See if the ray from the camera into the world hits one of our meshes
    var intersects = raycaster.intersectObjects(scene.children, true);
    // Toggle rotation bool for meshes that we clicked
    if ( intersects.length > 0 ) {

        if(intersects[0].object){
            // current_project.innerHTML = intersects[0].object.userData.title;
            for (let index = 0; index < buttons.length; index++) {
                    if(intersects[0].object.userData.title.innerHTML === buttons[index].innerHTML){
                        buttons[index].style.background = "#2CFC0A";
                    } else {
                        buttons[index].style.background = "transparent";
                    }
                
                
            }
        }
        
    }

}