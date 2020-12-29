
import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { PointerLockControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/OrbitControls.js';


var camera, scene, renderer, controls, group;

var objects = [];
let movingtext = [];
var raycaster = new THREE.Raycaster();

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();


let context = document.getElementById('threeDfrontpage')
let images= context.getElementsByTagName('img')[0]

var params = {
    enableWind: true,
    showBall: false,
    togglePins: togglePins
};

var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = 0.1;
var restDistance = 25;

var xSegs = 10;
var ySegs = 10;

var clothFunction = plane( restDistance * xSegs, restDistance * ySegs );

var cloth = new Cloth( xSegs, ySegs );

var GRAVITY = 981 * 1.4;
var gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );


var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;

var pins = [];

var windForce = new THREE.Vector3( 0, 0, 0 );


var tmpForce = new THREE.Vector3();


function plane( width, height ) {

    return function ( u, v, target ) {

        var x = ( u - 0.5 ) * width;
        var y = ( v + 0.5 ) * height;
        var z = 0;

        target.set( x, y, z );

    };

}

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


var diff = new THREE.Vector3();

function satisfyConstraints( p1, p2, distance ) {

    diff.subVectors( p2.position, p1.position );
    var currentDist = diff.length();
    if ( currentDist === 0 ) return; // prevents division by 0
    var correction = diff.multiplyScalar( 1 - distance / currentDist );
    var correctionHalf = correction.multiplyScalar( 0.5 );
    p1.position.add( correctionHalf );
    p2.position.sub( correctionHalf );

}


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

function simulate( now ) {

    var windStrength = Math.cos( now / 7000 ) * 20 + 40;

    windForce.set( Math.sin( now / 2000 ), Math.cos( now / 3000 ), Math.sin( now / 1000 ) );
    windForce.normalize();
    windForce.multiplyScalar( windStrength );

    var i, j, il, particles, particle, constraints, constraint;

    // Aerodynamics forces

    if ( params.enableWind ) {

        var indx;
        var normal = new THREE.Vector3();
        var indices = clothGeometry.index;
        var normals = clothGeometry.attributes.normal;

        particles = cloth.particles;

        for ( i = 0, il = indices.count; i < il; i += 3 ) {

            for ( j = 0; j < 3; j ++ ) {

                indx = indices.getX( i + j );
                normal.fromBufferAttribute( normals, indx );
                tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
                particles[ indx ].addForce( tmpForce );

            }

        }

    }

    for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

        particle = particles[ i ];
        particle.addForce( gravity );

        particle.integrate( TIMESTEP_SQ );

    }

    // Start Constraints

    constraints = cloth.constraints;
    il = constraints.length;

    for ( i = 0; i < il; i ++ ) {

        constraint = constraints[ i ];
        satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );

    }

   

    // Floor Constraints

    for ( particles = cloth.particles, i = 0, il = particles.length; i < il; i ++ ) {

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

/* testing cloth simulation */

var pinsFormation = [];
var pins = [ 6 ];

pinsFormation.push( pins );

pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
pinsFormation.push( pins );

pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );

pins = [ 0, cloth.w ]; // classic 2 pins
pinsFormation.push( pins );

pins = pinsFormation[ 1 ];

function togglePins() {

    pins = pinsFormation[ ~ ~ ( Math.random() * pinsFormation.length ) ];

}




var clothGeometry;

var object;



init();
animate(0);

function init() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "Anonymous";

   
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcce0ff );
    scene.fog = new THREE.Fog( 0xcce0ff, 290, 500);

    // camera

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(10, 0, 400);
 

    // lights

    scene.add( new THREE.AmbientLight( 0x666666 ) );

    var light = new THREE.DirectionalLight( 0xdfebff, 1 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    var d = 300;

    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;

    light.shadow.camera.far = 1000;

    scene.add( light );


    ///controls
    controls = new PointerLockControls( camera, document.body );

    var instructions = document.getElementById( 'buttons' );

    instructions.addEventListener( 'click', function () {
        controls.lock();
    }, false );

    controls.addEventListener( 'lock', function () {
        instructions.style.display = 'none';
    } );

    controls.addEventListener( 'unlock', function () {
        instructions.style.display = '';
    } );

    scene.add( controls.getObject() );
    

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    var onKeyUp = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

        }

    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    // cloth material

    var loader = new THREE.TextureLoader();
    var clothTexture = loader.load( '/wp-content/themes/house_of_killing/inkubatorflag.jpg' );
    clothTexture.anisotropy = 16;

    var clothMaterial = new THREE.MeshLambertMaterial( {
        map: clothTexture,
        side: THREE.DoubleSide,
        alphaTest: 0.5
    } );

    // cloth geometry

    clothGeometry = new THREE.ParametricBufferGeometry( clothFunction, cloth.w, cloth.h );

    // cloth mesh

    object = new THREE.Mesh( clothGeometry, clothMaterial );
    object.position.set( 0, 0, 0 );
    object.castShadow = true;
    scene.add( object );

    object.customDepthMaterial = new THREE.MeshDepthMaterial( {
        depthPacking: THREE.RGBADepthPacking,
        map: clothTexture,
        alphaTest: 0.5
    } );



    // ground

    var groundTexture = loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/grasslight-big.jpg' );
 
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    // poles

    var poleGeo = new THREE.BoxBufferGeometry( 5, 375, 5 );
    var poleMat = new THREE.MeshLambertMaterial();

    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = - 125;
    mesh.position.y = - 62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.x = 125;
    mesh.position.y = - 62;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 255, 5, 5 ), poleMat );
    mesh.position.y = - 250 + ( 750 / 2 );
    mesh.position.x = 0;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = - 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );




    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      let canvas = document.getElementById("canvas");
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.shadowMap.enabled = true;
      renderer.setPixelRatio( window.devicePixelRatio );
  
      canvas.appendChild( renderer.domElement );
  
      //
  
      window.addEventListener( 'resize', onWindowResize, false );
      group = new THREE.Group();
      scene.add( group );
}



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight);

}

function animate(now) {
    requestAnimationFrame( animate );
    simulate( now );
    render();

    if ( controls.isLocked === true ) {

        raycaster.ray.origin.copy( controls.getObject().position );
        raycaster.ray.origin.y -= 10;

        var intersections = raycaster.intersectObjects( objects );

        var onObject = intersections.length > 0;

        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        if ( onObject === true ) {

            velocity.y = Math.max( 0, velocity.y );
            canJump = true;

        }

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }

        prevTime = time;

    }



    
}
function render() {

    var p = cloth.particles;

    for ( var i = 0, il = p.length; i < il; i ++ ) {

        var v = p[ i ].position;

        clothGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );

    }

    clothGeometry.attributes.position.needsUpdate = true;

    clothGeometry.computeVertexNormals();


    renderer.render( scene, camera );

}




