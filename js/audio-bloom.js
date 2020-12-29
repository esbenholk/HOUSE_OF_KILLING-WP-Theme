import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { EffectComposer } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/FilmPass.js';
import { GlitchPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/GlitchPass.js'

///html elemets
let canvas = document.getElementById("canvas");
var audio = document.getElementById("audio");

let container = document.getElementById("audio-container");
container.append(audio)
audio.style.display = "none";

let track_playing = false;


//loading manager
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


let start = document.getElementById("startbutton")
start.addEventListener('click', function(ev) {
    audio.load(); 

    play(); 
});

///scene variables
let clock = new THREE.Clock();
var scene = new THREE.Scene();
var group = new THREE.Group();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,100);
camera.lookAt(scene.position);
scene.add(camera);

var renderer = new THREE.WebGLRenderer({ });
renderer.setSize(window.innerWidth, window.innerHeight);

let light1, light2, light3, light4, light5, light6, light7, light8;
let theta = 0;
let radius = 17;

var noise = new SimplexNoise();


/// post processing variables
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const bloom_params = {
    exposure: 1,
    bloomStrength: 3,
    bloomThreshold: 0,
    bloomRadius: 2
};
const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = bloom_params.bloomThreshold;
bloomPass.strength = bloom_params.bloomStrength;
bloomPass.radius = bloom_params.bloomRadius;

let glitchPass = new GlitchPass(64);

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
finalComposer.addPass( glitchPass );

let context, src, analyser, bufferLength, dataArray; 

audio.addEventListener("play", function(){
    
    if(track_playing === false){
        glitchPass.enabled = false;
        audio.play();
        track_playing = true;
    } else if (track_playing === true){
        glitchPass.enabled = true;
        audio.pause();
        track_playing = false;
    }

  

});






const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};

let plane, plane2, ball;


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


function play() {

    


    context = new AudioContext();
    src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    //here comes the webgl


    scene.background = new THREE.Color(0x000f5b)
    scene.fog = new THREE.FogExp2( 0x000f5b, 0.0025 );




    const skytexture = loader.load( "/wp-content/themes/house_of_killing/images/sky.png" );
    const groundtexture = loader.load( "/wp-content/themes/house_of_killing/images/ground.png" );


    var planeGeometry = new THREE.PlaneGeometry(400, 400, 20, 20);
    
    var skyplaneMaterial = new THREE.MeshPhongMaterial({
            color:     0xFFFFFF, 
            specular:  0x050505,
            shininess: 100,
            map: skytexture,
            vertexColors: THREE.VertexColors, 
            side: THREE.DoubleSide
        }) 
    var groundplaneMaterial = new THREE.MeshPhongMaterial({
            color:     0xFFFFFF, 
            specular:  0x050505,
            shininess: 100,
            map: groundtexture,
            vertexColors: THREE.VertexColors, 
            side: THREE.DoubleSide
        })

    
    plane = new THREE.Mesh(planeGeometry, skyplaneMaterial);
    plane.rotation.x = -0.50 * Math.PI;
    plane.position.set(0, 30, 0);
    group.add(plane);
    
    plane2 = new THREE.Mesh(planeGeometry, groundplaneMaterial);
    plane2.rotation.x = -0.50 * Math.PI;
    plane2.position.set(0, -30, 0);
    group.add(plane2);

    var icosahedronGeometry = new THREE.IcosahedronGeometry(5, 40);
    var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: false
    });

    ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
    ball.layers.enable(BLOOM_SCENE)
    ball.position.set(0, 0, 0);
    group.add(ball);


    // const spheregeometry = new THREE.IcosahedronBufferGeometry( 3, 15 );
    // const spherematerial =  new THREE.MeshBasicMaterial( { color: 0xff0040 } )
    // let sphere = new THREE.Mesh( spheregeometry, spherematerial );
    // let sun = new THREE.PointLight( 0xff0040, 2, 0  );
    // sun.add( sphere );
    // scene.add( sun );

 

    var ambientLight = new THREE.AmbientLight(0xff89f9);
    scene.add(ambientLight);

    ///lights
    const sphere1geometry = new THREE.IcosahedronBufferGeometry( 3, 15 );
    const sphere1material =  new THREE.MeshBasicMaterial( { color: 0x04ff00 } )
    let sphere1 = new THREE.Mesh( sphere1geometry, sphere1material );
    let sphere2 = new THREE.Mesh( sphere1geometry, sphere1material );
    sphere1.layers.enable( BLOOM_SCENE );
    sphere2.layers.enable( BLOOM_SCENE );

    const sphere3geometry = new THREE.IcosahedronBufferGeometry( 1.5, 15 );
    const sphere3material =  new THREE.MeshBasicMaterial( { color: 0xfeabff } )
    let sphere3 = new THREE.Mesh( sphere3geometry, sphere3material );
    let sphere4 = new THREE.Mesh( sphere3geometry, sphere3material );
    sphere3.layers.enable( BLOOM_SCENE );
    sphere4.layers.enable( BLOOM_SCENE );

    const sphere5geometry = new THREE.IcosahedronBufferGeometry( 2, 15 );
    const sphere5material =  new THREE.MeshBasicMaterial( { color: 0xfffe01 } )
    let sphere5 = new THREE.Mesh( sphere5geometry, sphere5material );
    let sphere6 = new THREE.Mesh( sphere5geometry, sphere5material );
    sphere5.layers.enable( BLOOM_SCENE );
    sphere6.layers.enable( BLOOM_SCENE );


    const sphere7geometry = new THREE.IcosahedronBufferGeometry( 1, 15 );
    const sphere7material =  new THREE.MeshBasicMaterial( { color: 0x81c8f3 } )
    let sphere7 = new THREE.Mesh( sphere7geometry, sphere7material );
    let sphere8 = new THREE.Mesh( sphere7geometry, sphere7material );
    sphere7.layers.enable( BLOOM_SCENE );
    sphere8.layers.enable( BLOOM_SCENE );

    
    light1 = new THREE.PointLight( 0x04ff00, 2, 20  );
    light1.add( sphere1 );
    scene.add( light1 );

    light2 = new THREE.PointLight( 0x04ff00, 3, 20 );
    light2.add( sphere2 );
    scene.add( light2 );

    light3 = new THREE.PointLight( 0xfeabff, 2, 50 );
    light3.add( sphere3 );
    scene.add( light3 );

    light4 = new THREE.PointLight( 0xfeabff, 4, 50 );
    light4.add( sphere4 );
    scene.add( light4 );

    light5 = new THREE.PointLight( 0xfffe01, 2, 50 );
    light5.add( sphere5 );
    scene.add( light5);

    light6 = new THREE.PointLight( 0xfffe01, 3, 100 );
    light6.add( sphere6 );
    scene.add( light6 );

    light7 = new THREE.PointLight( 0x81c8f3, 2, 90 );
    light7.add( sphere7 );
    scene.add( light7 );

    light8 = new THREE.PointLight( 0x81c8f3, 4, 100 );
    light8.add( sphere8 );
    scene.add( light8 );




    scene.add(group);

    canvas.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();
  
    window.addEventListener( 'resize', onWindowResize, false );

    // audio.play();
    audio.style.display = 'block';
};

function render() {

    analyser.getByteFrequencyData(dataArray);

    var lowerHalfArray = dataArray.slice(0, (dataArray.length/2) - 1);
    var upperHalfArray = dataArray.slice((dataArray.length/2) - 1, dataArray.length - 1);

    var overallAvg = avg(dataArray);
    var lowerMax = max(lowerHalfArray);
    var lowerAvg = avg(lowerHalfArray);
    var upperMax = max(upperHalfArray);
    var upperAvg = avg(upperHalfArray);

    var lowerMaxFr = lowerMax / lowerHalfArray.length;
    var lowerAvgFr = lowerAvg / lowerHalfArray.length;
    var upperMaxFr = upperMax / upperHalfArray.length;
    var upperAvgFr = upperAvg / upperHalfArray.length;

    makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
    makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
    
    makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

    group.rotation.y += 0.005;
    requestAnimationFrame(render);

    const time = Date.now() * 0.00005;
    const delta = clock.getDelta();

    light1.position.x = Math.sin( time * 0.7 ) * -30;
    light1.position.y = Math.cos( time * 0.5 ) * 40;
    light1.position.z = Math.cos( time * 0.3 ) * 30;

    light2.position.x = Math.cos( time * 0.3 ) * 30;
    light2.position.y = Math.sin( time * 0.5 ) * -40;
    light2.position.z = Math.sin( time * 0.7 ) * 30;

    light3.position.x = Math.sin( time * 0.7 ) * 30;
    light3.position.y = Math.cos( time * 0.3 ) * 40;
    light3.position.z = Math.sin( time * 0.5 ) * -30;

    light4.position.x = Math.sin( time * 0.3 ) * 50;
    light4.position.y = Math.cos( time * 0.7 ) * 40;
    light4.position.z = Math.sin( time * 0.5 ) * 10;

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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function makeRoughBall(mesh, bassFr, treFr) {
    mesh.geometry.vertices.forEach(function (vertex, i) {
        var offset = mesh.geometry.parameters.radius;
        var amp = 1.5;
        var time = window.performance.now();
        vertex.normalize();
        var rf = 0.4;
        var distance = (offset + bassFr ) + noise.noise3D(vertex.x + time *rf*7, vertex.y +  time*rf*8, vertex.z + time*rf*9) * amp * treFr;
        vertex.multiplyScalar(distance);
    });
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeFaceNormals();
}

function makeRoughGround(mesh, distortionFr) {
    mesh.geometry.vertices.forEach(function (vertex, i) {
        var amp = 3;
        var time = Date.now()/2;
        var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
        vertex.z = distance;
    });
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeFaceNormals();
}







//some helper functions here
function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr){
    var total = arr.reduce(function(sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr){
    return arr.reduce(function(a, b){ return Math.max(a, b); })
}
