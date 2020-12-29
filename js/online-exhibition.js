import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { OrbitControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/OrbitControls.js';

let canvas = document.getElementById("canvas");

let context = document.getElementById('archive')
let teasers= context.getElementsByClassName('teaser')

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "Anonymous";

let clock = new THREE.Clock();

let light, light1, light2, light3, light4;


let camera, scene, raycaster, renderer, controls, group;

let INTERSECTED;
let theta = 0;

const mouse = new THREE.Vector2();
const radius = 90;


init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    // camera.position.set(0,2.5,2.5); 
    scene = new THREE.Scene();

    // scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.Fog( 0xccffc4, 400, 8000);
    light = new THREE.DirectionalLight( 0xccffc4, 2.5 );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    controls = new OrbitControls(camera, document.body);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            controls.dampingFactor = 0.05;

            controls.screenSpacePanning = false;

            controls.minDistance = 100;
            controls.maxDistance = 500;


    //lights
    const sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );

    light1 = new THREE.PointLight( 0xff0040, 2, 50 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    scene.add( light1 );
 
    light2 = new THREE.PointLight( 0x0040ff, 2, 50 );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
    scene.add( light2 );
 
    light3 = new THREE.PointLight( 0x80ff80, 2, 50 );
    light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
    scene.add( light3 );
 
    light4 = new THREE.PointLight( 0xffaa00, 2, 50 );
    light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    scene.add( light4 );

    group = new THREE.Group();
    
    const geometry = new THREE.BoxBufferGeometry( 15, 15, 15 );
    geometry.computeVertexNormals() //<-- this

    for ( let i = 0; i < teasers.length; i ++ ) {
        let boxImage, boxMaterial;

        
        boxImage = textureLoader.load(teasers[i].getElementsByTagName("img")[0].src);
        boxMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff, map: boxImage
        });


        const object = new THREE.Mesh( geometry, boxMaterial);

        object.position.x = Math.random() * teasers.length*20;
        object.position.y = Math.random() * teasers.length*20;
        object.position.z = Math.random() * teasers.length*20;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

  

        let scale = Math.random() + 0.5
        object.scale.set(scale,scale,scale);

        object.userData = {link: teasers[i].getElementsByTagName("a")[0].href}

        group.add( object );

    }
    scene.add( group );

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    canvas.appendChild( renderer.domElement );


    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    renderer.domElement.addEventListener('click', onClick, false);


    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    // event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate() {
    controls.update();

    requestAnimationFrame( animate );

    render();

}

function render() {

    theta += 0.1;

    camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    camera.lookAt( scene.position );

    camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // INTERSECTED.material.emissive.setHex( 0xff0000 );

        }

    } else {

        // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        // INTERSECTED = null;

    }

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