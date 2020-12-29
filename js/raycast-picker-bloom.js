import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { EffectComposer } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/FilmPass.js';


/// HTML elements
let canvas = document.getElementById("canvas");

let context = document.getElementById('archive')
let teasers= context.getElementsByClassName('teaser')
let buttons = []

for (let index = 0; index < teasers.length; index++) {
    const element = teasers[index].getElementsByTagName("h2")[0];
    if(element != undefined){
        buttons.push(element);
    }
}

///load manger
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

const textureLoader = new THREE.TextureLoader(manager);
textureLoader.crossOrigin = "Anonymous";





/// scene variables
let camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
let scene = new THREE.Scene();
let clock = new THREE.Clock();
let raycaster = new THREE.Raycaster();
let renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;

let composer = new EffectComposer(renderer);
let mouse = new THREE.Vector2();

let light1, light2, light3, light4, light5, light6, light7, light8, flashlight;

let theta = 0;

const radius = 90;


/// post processing variables
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const bloom_params = {
    exposure: 1,
    bloomStrength: 5,
    bloomThreshold: 0,
    bloomRadius: 0,
    scene: "Scene with Glow"
};
const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = bloom_params.bloomThreshold;
bloomPass.strength = bloom_params.bloomStrength;
bloomPass.radius = bloom_params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
    new THREE.ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
    } ), "baseTexture"
);

finalPass.needsSwap = true;

const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );

const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};


function disposeMaterial( obj ) {

    if ( obj.material ) {

        obj.material.dispose();

    }

}

function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

    }

}

function restoreMaterial( obj ) {

    if ( materials[ obj.uuid ] ) {

        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];

    }

}






init();


function init() {

    ///project cubes
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


    ///lights
    const sphere1geometry = new THREE.IcosahedronBufferGeometry( 3, 15 );
    const sphere1material =  new THREE.MeshBasicMaterial( { color: 0xff0040 } )
    let sphere1 = new THREE.Mesh( sphere1geometry, sphere1material );
    let sphere2 = new THREE.Mesh( sphere1geometry, sphere1material );
    sphere1.layers.enable( BLOOM_SCENE );
    sphere2.layers.enable( BLOOM_SCENE );

    const sphere3geometry = new THREE.IcosahedronBufferGeometry( 1.5, 15 );
    const sphere3material =  new THREE.MeshBasicMaterial( { color: 0xff0040 } )
    let sphere3 = new THREE.Mesh( sphere3geometry, sphere3material );
    let sphere4 = new THREE.Mesh( sphere3geometry, sphere3material );
    sphere3.layers.enable( BLOOM_SCENE );
    sphere4.layers.enable( BLOOM_SCENE );

    const sphere5geometry = new THREE.IcosahedronBufferGeometry( 2, 15 );
    const sphere5material =  new THREE.MeshBasicMaterial( { color: 0x2aff00 } )
    let sphere5 = new THREE.Mesh( sphere5geometry, sphere5material );
    let sphere6 = new THREE.Mesh( sphere5geometry, sphere5material );
    sphere5.layers.enable( BLOOM_SCENE );
    sphere6.layers.enable( BLOOM_SCENE );


    const sphere7geometry = new THREE.IcosahedronBufferGeometry( 1, 15 );
    const sphere7material =  new THREE.MeshBasicMaterial( { color: 0x002aff } )
    let sphere7 = new THREE.Mesh( sphere7geometry, sphere7material );
    let sphere8 = new THREE.Mesh( sphere7geometry, sphere7material );
    sphere7.layers.enable( BLOOM_SCENE );
    sphere8.layers.enable( BLOOM_SCENE );

    
    light1 = new THREE.PointLight( 0xff0040, 2, 80  );
    light1.add( sphere1 );
    scene.add( light1 );

    light2 = new THREE.PointLight( 0xff0040, 3, 50 );
    light2.add( sphere2 );
    scene.add( light2 );

    light3 = new THREE.PointLight( 0xff0040, 2, 50 );
    light3.add( sphere3 );
    scene.add( light3 );

    light4 = new THREE.PointLight( 0xff0040, 4, 50 );
    light4.add( sphere4 );
    scene.add( light4 );

    light5 = new THREE.PointLight( 0x2aff00, 2, 50 );
    light5.add( sphere5 );
    scene.add( light5);

    light6 = new THREE.PointLight( 0x2aff00, 3, 100 );
    light6.add( sphere6 );
    scene.add( light6 );

    light7 = new THREE.PointLight( 0x002aff, 2, 90 );
    light7.add( sphere7 );
    scene.add( light7 );

    light8 = new THREE.PointLight( 0x002aff, 4, 100 );
    light8.add( sphere8 );
    scene.add( light8 );

    flashlight = new THREE.SpotLight( 0xffffff, 0.5 );
    flashlight.angle = Math.PI / 4;
    flashlight.penumbra = 0.1;
    flashlight.decay = 2;

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





    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    canvas.addEventListener( 'mousemove', onMouseMove, false );

    renderer.domElement.addEventListener('click', onClick, false);

    window.addEventListener( 'resize', onWindowResize, false );
    canvas.appendChild( renderer.domElement );

    animate();
}



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


    // render scene with bloom
    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );
    
    // render the entire scene, then render bloom scene on top
    finalComposer.render();
    

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

        if(intersects[0].object.userData.link){
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
