import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { Water } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Water.js';
import { Sky } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Sky.js';

import { GLTFLoader } from '/wp-content/themes/house_of_killing/three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/FilmPass.js';
import Stats from '/wp-content/themes/house_of_killing_2.0/three/examples/jsm/libs/stats.module.js';

/// canvas element
let canvas = document.getElementById("canvas");

let islandDescriptors = ["avatar island", "content redistribution_content003", "decay_active002", "shy_boy1992", "island", "texture_composition_collage2.0", "all I am is more of you", "camping", "skeleton", "collage2020_finalVersion11"]
///loading manager
const manager = new THREE.LoadingManager();

manager.onLoad = function ( ) {
    document.getElementById('loading-screen').remove()

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    ///should i do something on progress?
};

manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
    document.getElementById('loading-status').innerHTML = "<div class='missing-content'><img src='/wp-content/themes/house_of_killing/icons/ghosticon.png'/><p>missing content</p></div>"
};

const loader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
textureLoader.crossOrigin = "Anonymous";

///renderer
const renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.autoClear = false;


canvas.appendChild( renderer.domElement );


////scene titles
let title = document.getElementById("canvas-title")
let canvasDetails = document.getElementById("canvas-details")


/// scene variables
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

var stats = new Stats();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
camera.position.set( 10, 100, 100 );
camera.lookAt( 0, 0, 0 );

let clock = new THREE.Clock();
let sun = new THREE.Vector3();

let light1, light2, light3, light4;
let water;


let theta = 0;
let radius = 17;
let objects =[];


///set rotate to false for still scene
let rotate = true;

///wind simulation variables
var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = 0.2;
var restDistance = 25;

var GRAVITY = 981 * 1.4;
var gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );

var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;
var windForce = new THREE.Vector3( 0, 0, 0 );

var tmpForce = new THREE.Vector3();
var diff = new THREE.Vector3();

var pins = [];
var pinsFormation = [];

var cloths =[];
var clothGeometries = [];

function Particle( x, y, z, mass ) {

    this.position = new THREE.Vector3();
    this.previous = new THREE.Vector3();
    this.original = new THREE.Vector3();
    this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
    this.mass = mass;
    this.invMass = 1 / mass;
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();

    // init

    clothFunction( x, y, this.position ); // position
    clothFunction( x, y, this.previous ); // previous
    clothFunction( x, y, this.original );

}
// Force -> Acceleration
Particle.prototype.addForce = function ( force ) {

    this.a.add(
        this.tmp2.copy( force ).multiplyScalar( this.invMass )
    );

};
// Performs Verlet integration
Particle.prototype.integrate = function ( timesq ) {

    var newPos = this.tmp.subVectors( this.position, this.previous );
    newPos.multiplyScalar( DRAG ).add( this.position );
    newPos.add( this.a.multiplyScalar( timesq ) );

    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;

    this.a.set( 0, 0, 0 );

};
function Cloth( w, h ) {

    w = w || 10;
    h = h || 10;
    this.w = w;
    this.h = h;

    var particles = [];
    var constraints = [];

    var u, v;

    // Create particles
    for ( v = 0; v <= h; v ++ ) {

        for ( u = 0; u <= w; u ++ ) {

            particles.push(
                new Particle( u / w, v / h, 0, MASS )
            );

        }

    }

    // Structural

    for ( v = 0; v < h; v ++ ) {

        for ( u = 0; u < w; u ++ ) {

            constraints.push( [
                particles[ index( u, v ) ],
                particles[ index( u, v + 1 ) ],
                restDistance
            ] );

            constraints.push( [
                particles[ index( u, v ) ],
                particles[ index( u + 1, v ) ],
                restDistance
            ] );

        }

    }

    for ( u = w, v = 0; v < h; v ++ ) {

        constraints.push( [
            particles[ index( u, v ) ],
            particles[ index( u, v + 1 ) ],
            restDistance

        ] );

    }

    for ( v = h, u = 0; u < w; u ++ ) {

        constraints.push( [
            particles[ index( u, v ) ],
            particles[ index( u + 1, v ) ],
            restDistance
        ] );

    }

    this.particles = particles;
    this.constraints = constraints;

    function index( u, v ) {

        return u + v * ( w + 1 );

    }

    this.index = index;

}
var clothFunction = plane( restDistance * 10, restDistance * 10 );
function satisfyConstraints( p1, p2, distance ) {

    diff.subVectors( p2.position, p1.position );
    var currentDist = diff.length();
    if ( currentDist === 0 ) return; // prevents division by 0
    var correction = diff.multiplyScalar( 1 - distance / currentDist );
    var correctionHalf = correction.multiplyScalar( 0.5 );
    p1.position.add( correctionHalf );
    p2.position.sub( correctionHalf );

}
function plane( width, height ) {

    return function ( u, v, target ) {

        var x = ( u - 0.5 ) * width;
        var y = ( v + 0.5 ) * height;
        var z = 0;

        target.set( x, y, z );

    };

}
function simulate( now, clothX, clothGeometry, xvalue,yvalue,zvalue ) {

    const windStrength = Math.cos( now / 7000 ) * 20 + 40;

    windForce.set( Math.sin( now / 2000 ), Math.cos( now / 3000 ), Math.sin( now / 1000 ) );
    windForce.normalize();
    windForce.multiplyScalar( windStrength );

    var i, j, il, particles, particle, constraints, constraint;

    // Aerodynamics forces



        var indx;
        var normal = new THREE.Vector3();
        var indices = clothGeometry.index;
        var normals = clothGeometry.attributes.normal;

        particles = clothX.particles;

        for ( i = 0, il = indices.count; i < il; i += 3 ) {

            for ( j = 0; j < 3; j ++ ) {

                indx = indices.getX( i + j );
                normal.fromBufferAttribute( normals, indx );
                tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
                particles[ indx ].addForce( tmpForce );

            }

        }

    

    for ( particles = clothX.particles, i = 0, il = particles.length; i < il; i ++ ) {

        particle = particles[ i ];
        particle.addForce( gravity );

        particle.integrate( TIMESTEP_SQ );

    }

    // Start Constraints

    constraints = clothX.constraints;
    il = constraints.length;

    for ( i = 0; i < il; i ++ ) {

        constraint = constraints[ i ];
        satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );

    }

   

    // Floor Constraints

    for ( particles = clothX.particles, i = 0, il = particles.length; i < il; i ++ ) {

        particle = particles[ i ];
        var pos = particle.position;
        if ( pos.y < - 250 ) {

            pos.y = - 250;

        }

    }

    // Pin Constraints

    for ( i = 0, il = pins.length; i < il; i ++ ) {

        var xy = pins[ i ];
        var p = particles[ xy ];
        p.position.copy( p.original );
        p.previous.copy( p.original );

    }


}
function createFlag(url, x, z, rotationY, xvalue, yvalue, zvalue){
    var clothGeometry, object, cloth, clothTexture;

    cloth = new Cloth(10, 10);
    cloth.xvalue = xvalue;
    cloth.yvalue = yvalue;
    cloth.zvalue = zvalue;
    

    pins = [ 0,1,2,3,4,5,6,7,8,9, 10 ];
    pinsFormation.push( pins );

   
  
    
    pins = pinsFormation[ ~ ~ ( Math.random() * pinsFormation.length ) ];
    
          

    clothTexture = textureLoader.load( url );
    clothTexture.anisotropy = 16;


    cloths.push(cloth)
    const group = new THREE.Group();

    var clothMaterial = new THREE.MeshLambertMaterial( {
        map: clothTexture,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    } );

    // cloth geometry

    clothGeometry = new THREE.ParametricBufferGeometry( clothFunction, cloth.w, cloth.h );

    clothGeometries.push(clothGeometry)
    // cloth mesh

    object = new THREE.Mesh( clothGeometry, clothMaterial );
    object.position.set( 0, 0, 0 );
    object.castShadow = true;
    group.add( object );

    object.customDepthMaterial = new THREE.MeshDepthMaterial( {
        depthPacking: THREE.RGBADepthPacking,
        map: clothTexture,
        alphaTest: 0.5
    } );

    object.userData = {title: ["empty flag", "tell me what to say", "declare (in)dependence"]}

    var poleGeo = new THREE.BoxBufferGeometry( 5, 375, 5 );
    var poleMat = new THREE.MeshLambertMaterial();

    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = - 125;
    mesh.position.y = - 62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add( mesh );

    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = 125;
    mesh.position.y = - 62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add( mesh );

    var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 255, 5, 5 ), poleMat );
    mesh.position.y = - 250 + ( 750 / 2 );
    mesh.position.x = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add( mesh );

    var gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add( mesh );

    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = - 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.add( mesh );


    group.position.x = x
    group.position.z = z
    group.position.y = -10
    group.rotation.x = 0.2
    group.rotation.y = rotationY
    group.receiveShadow = true;
    group.castShadow = true;

    group.scale.set(0.06,0.06,0.06)
    
    scene.add(group)
}



setupScene();

function setupScene() {
	// scene.children.length = 0;


    //lights
    // scene.add( new THREE.AmbientLight( 0x404040,  0.25 ) );

    const sphere1geometry = new THREE.IcosahedronBufferGeometry( 3, 15 );
    const sphere1material =  new THREE.MeshBasicMaterial( { color: 0xff0040 } )
    let sphere1 = new THREE.Mesh( sphere1geometry, sphere1material );
    // sphere1.layers.enable( BLOOM_SCENE );

    const sphere2geometry = new THREE.IcosahedronBufferGeometry( 2, 15 );
    const sphere2material =  new THREE.MeshBasicMaterial( { color: 0x2aff00 } )
    let sphere2 = new THREE.Mesh( sphere2geometry, sphere2material );
    // sphere2.layers.enable( BLOOM_SCENE );

    const sphere3geometry = new THREE.IcosahedronBufferGeometry( 1.5, 15 );
    const sphere3material =  new THREE.MeshBasicMaterial( { color: 0xff0040 } )
    let sphere3 = new THREE.Mesh( sphere3geometry, sphere3material );
    // sphere3.layers.enable( BLOOM_SCENE );

    const sphere4geometry = new THREE.IcosahedronBufferGeometry( 1, 15 );
    const sphere4material =  new THREE.MeshBasicMaterial( { color: 0x002aff } )
    let sphere4 = new THREE.Mesh( sphere4geometry, sphere4material );
    // sphere4.layers.enable( BLOOM_SCENE );

    
    
  

    light1 = new THREE.PointLight( 0xff0040, 2, 0 );
    light1.add( sphere1 );
    scene.add( light1 );

    light2 = new THREE.PointLight( 0x2aff00, 3, 0 );
    light2.add( sphere2 );
    scene.add( light2 );

    light3 = new THREE.PointLight( 0xff0040, 2, 0 );
    light3.add( sphere3 );
    scene.add( light3 );

    light4 = new THREE.PointLight( 0x002aff, 4, 0 );
    light4.add( sphere4 );
    scene.add( light4 );
   
    //water
    
    const waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );

    water = new Water(
       waterGeometry,
       {
           textureWidth: 512,
           textureHeight: 512,
           waterNormals: textureLoader.load( '/wp-content/themes/house_of_killing/images/waternormals.jpg', function ( texture ) {

               texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

           } ),
           alpha: 1.0,
           sunDirection: new THREE.Vector3(),
           sunColor: 0xf7fc0a,
           waterColor: 0xe2a1f2,
           distortionScale: 3.5       }
    );

    water.rotation.x = - Math.PI / 2;
    water.position.y = -20;
    water.userData = {title: ["ocean"]}

    scene.add( water );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    sky.userData = {title: ["sky"]}

    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 20;
    skyUniforms[ 'rayleigh' ].value = 20;
    skyUniforms[ 'mieCoefficient' ].value = 0.05;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
       inclination: 0.49,
       azimuth: 0.1
    };


    ///sun
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    function updateSun() {

       const theta = Math.PI * ( parameters.inclination - 0.5 );
       const phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
   
       sun.x = Math.cos( phi );
       sun.y = Math.sin( phi ) * Math.sin( theta );
       sun.z = Math.sin( phi ) * Math.cos( theta );
   
       sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
       water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
   
       scene.environment = pmremGenerator.fromScene( sky ).texture;
   
    }

    updateSun();



    ///add objects
    createFlag('/wp-content/themes/house_of_killing/images/waternormals.jpg', 15, 15, 1.5, 100, 200, 100);

    addObjects( '/wp-content/themes/house_of_killing/images/tent/scene.gltf', -1, -20, -2, 10, true, "tent");

    addObjects( '/wp-content/themes/house_of_killing/images/remains/scene.gltf', -50, -28, 0, 19, false, "skeleton");
    addObjects( '/wp-content/themes/house_of_killing/images/sims/scene.gltf', 39, 0, -45, 0.01, false, true);


    window.addEventListener( 'resize', onWindowResize, false );
    canvas.addEventListener( 'mousemove', onMouseMove, false );

   
    stats.showPanel( 1 );
    canvasDetails.appendChild( stats.domElement );

    animate(0);

}


function animate(now) {
    stats.begin();

 

    for (let index = 0; index < cloths.length; index++) {
        const element = cloths[index];
        simulate( now, element, clothGeometries[index],  element.xvalue, element.yvalue, element.zvalue);
   
        
    }
    requestAnimationFrame( animate );

    render();

    stats.end();

}

function render() {

    


    if(rotate===true){
        theta += 0.1;
        if(radius<100){
            radius += 0.05;
        }
    
        camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
        camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
        camera.position.y = 3*Math.cos( THREE.MathUtils.degToRad( theta ) );
        camera.lookAt( scene.position );

        camera.updateMatrixWorld();

    }


    for (let u = 0; u < clothGeometries.length; u++) {
        let clothGeometry= clothGeometries[u];

        for (let index = 0; index < cloths.length; index++) {
            const element = cloths[index];
          
            var p = element.particles;
    
            for ( var i = 0, il = p.length; i < il; i ++ ) {
    
                var v = p[ i ].position;
    
                clothGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );
    
            }
    
            clothGeometry.attributes.position.needsUpdate = true;
    
            clothGeometry.computeVertexNormals();
    
            
        }
        
    }

    for (let index = 0; index < objects.length; index++) {
        const element = objects[index];
        element.rotation.z += 0.01;
        
    }
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    const time = Date.now() * 0.0003;
	const delta = clock.getDelta();

    light1.position.x = Math.sin( time * 0.7 ) * 50;
    light1.position.y = Math.cos( time * 0.5 ) * 50;
    light1.position.z = Math.cos( time * 0.3 ) * 50;

    light2.position.x = Math.sin( time * 0.7 ) * 50;
    light2.position.y = Math.cos( time * 0.3 ) * 50;
    light2.position.z = Math.cos( time * 0.5 ) * 50;

    light3.position.x = Math.sin( time * 0.2 ) * 50;
    light3.position.y = Math.cos( time * 0.7 ) * 50;
    light3.position.z = Math.cos( time * 0.5 ) * 50;

    light4.position.x = Math.sin( time * 0.6 ) * 50;
    light4.position.y = Math.cos( time * 0.3 ) * 50;
    light4.position.z = Math.cos( time * 0.5 ) * 50;



    // render scene with bloom
    // scene.traverse( darkenNonBloomed );
    // bloomComposer.render();
    // scene.traverse( restoreMaterial );



    // render the entire scene, then render bloom scene on top
    // finalComposer.render();
    renderer.render( scene, camera );


}




function addObjects(url,x,y,z, scale, rotate, item){
    const onProgress = () => {};
    const onError = ( errorMessage ) => { console.log( errorMessage ); };

    loader.load(url, ( gltf) => {
    const model = gltf.scene.children[ 0 ];

    model.scale.multiplyScalar(scale);
    model.castShadow = true;
    model.receiveShadow = true;
    model.position.x = x;
    model.position.y = y;
    model.position.z = z;

    if(rotate===true){
        rotateObject(model, -2,-2,4);
    }
    if(item===true){
        objects.push(model)

    }

    scene.add( model );

    }, onProgress, onError );

}


function rotateObject(object, degreeX, degreeY, degreeZ) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
}


function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );

    bloomComposer.setSize( width, height );
    finalComposer.setSize( width, height );

    render();
}


function onMouseMove( event ) {

    

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );


    // See if the ray from the camera into the world hits one of our meshes
    var intersects = raycaster.intersectObjects(scene.children, true);
    
    // Toggle rotation bool for meshes that we clicked
    if ( intersects.length > 0 ) {

        console.log(intersects[0].object);

        if(intersects[0].object.userData.title){
          console.log(intersects[0].object.userData.title);
          
          title.innerHTML = intersects[0].object.userData.title[Math.floor(Math.random() * intersects[0].object.userData.title.length)];

        } else if(intersects[0].object.userData.name){
            title.innerHTML = intersects[0].object.userData.name;

        } else {
            title.innerHTML = islandDescriptors[Math.floor(Math.random() * islandDescriptors.length)]
        }
        
    }

}


window.onload = function(){
    var x, y;
// On mousemove use event.clientX and event.clientY to set the location of the div to the location of the cursor:
    window.addEventListener('mousemove', function(event){
        x = event.clientX;
        y = event.clientY;                    
        if ( typeof x !== 'undefined' ){
            title.style.left = x + "px";
            title.style.top = y + "px";
        }
    }, false);
}

canvas.addEventListener("mouseover", function(){
    title.style.display = "block"
})
canvas.addEventListener("mouseleave", function(){
    title.style.display = "none"
})


