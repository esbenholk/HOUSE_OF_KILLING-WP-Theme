import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { PointerLockControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/PointerLockControls.js';


let imagearray = ["https://tarotcars.s3.amazonaws.com/anistonappletree.png",
"https://tarotcars.s3.amazonaws.com/anistonbodybuilder.png",
"https://tarotcars.s3.amazonaws.com/anistonchariot.jpg",
"https://tarotcars.s3.amazonaws.com/anistondeath.jpg",
"https://tarotcars.s3.amazonaws.com/anistondevil.jpg",
"https://tarotcars.s3.amazonaws.com/anistondoor.jpg",
"https://tarotcars.s3.amazonaws.com/anistondreamer.jpg",
"https://tarotcars.s3.amazonaws.com/anistonemperor.jpg",
"https://tarotcars.s3.amazonaws.com/anistonempress.jpg",
"https://tarotcars.s3.amazonaws.com/anistonfool.jpg",
"https://tarotcars.s3.amazonaws.com/anistonhand.jpg",
"https://tarotcars.s3.amazonaws.com/anistonhangedman.jpg",
"https://tarotcars.s3.amazonaws.com/anistonhermit.jpg",
"https://tarotcars.s3.amazonaws.com/anistonhierophant.jpg",
"https://tarotcars.s3.amazonaws.com/anistonhighpriestess.jpg",
"https://tarotcars.s3.amazonaws.com/anistonjudgement.jpg",
"https://tarotcars.s3.amazonaws.com/anistonjustice.jpg",
"https://tarotcars.s3.amazonaws.com/anistonlovers.jpg",
"https://tarotcars.s3.amazonaws.com/anistonmagician.jpg",
"https://tarotcars.s3.amazonaws.com/anistonmandela.jpg",
"https://tarotcars.s3.amazonaws.com/anistonmermaid.jpg",
"https://tarotcars.s3.amazonaws.com/anistonmoon.jpg",
"https://tarotcars.s3.amazonaws.com/anistonnatureinme.jpg",
"https://tarotcars.s3.amazonaws.com/anistononline.jpg",
"https://tarotcars.s3.amazonaws.com/anistonopenheart.jpg",
"https://tarotcars.s3.amazonaws.com/anistonopenheart.jpg",
"https://tarotcars.s3.amazonaws.com/anistonrazor.jpg",
"https://tarotcars.s3.amazonaws.com/anistonrobot.jpg",
"https://tarotcars.s3.amazonaws.com/anistonstar.jpg",
"https://tarotcars.s3.amazonaws.com/anistonstrength.jpg",
"https://tarotcars.s3.amazonaws.com/anistonsun.jpg",
"https://tarotcars.s3.amazonaws.com/anistontower.jpg",
"https://tarotcars.s3.amazonaws.com/anistonwheeloffortune.jpg",
"https://tarotcars.s3.amazonaws.com/anistonworld.jpg"];

let images=[];

    images.push(imagearray[Math.floor(Math.random() * imagearray.length)]);
    images.push(imagearray[Math.floor(Math.random() * imagearray.length)]);
    images.push(imagearray[Math.floor(Math.random() * imagearray.length)]);


var camera, scene, renderer, controls, group;
let light1, light2, light3, light4, light5, light6, flashlight;

const mouse = new THREE.Vector2();


var objects = [];
let movingtext = [];

var raycaster;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var vertex = new THREE.Vector3();
var color = new THREE.Color();

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

    var windStrength = Math.cos( now / 7000 ) * 20 + 40;
   

    windForce.set( Math.sin( now / xvalue), Math.cos( now / yvalue ), Math.sin( now / zvalue ) );
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
    
          

    clothTexture = loader.load( url );
 

    clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
    clothTexture.anisotropy = 16;
    clothTexture.flipY = false;
    clothTexture.repeat = new THREE.Vector2(1, 1);


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
    object.userData = {card:url}
    group.add( object );

    object.customDepthMaterial = new THREE.MeshDepthMaterial( {
        depthPacking: THREE.RGBADepthPacking,
        map: clothTexture,
        alphaTest: 0.5
    } );

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
    group.position.y = 60;
    group.rotation.y = rotationY
    group.receiveShadow = true;
    group.castShadow = true;
    group.scale.set(0.5,0.5,0.5);
    scene.add(group)
   

    
   
   


}


init();
animate(0);

function init() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "Anonymous";

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x0005af);
    scene.fog = new THREE.Fog( 0x0005af, 10, 300 );

    controls = new PointerLockControls( camera, document.body );

    var instructions = document.getElementById( 'start' );


    instructions.addEventListener( 'click', function () {
        controls.lock();
    }, false );

    controls.addEventListener( 'lock', function () {
        instructions.innerHTML = 'press ESC to exit';

    } );

    controls.addEventListener( 'unlock', function () {
        instructions.innerHTML = "start"

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
 
    const texture = textureLoader.load( "/wp-content/themes/house_of_killing/images/waternormals.jpg" );

    texture.repeat.set( 20, 10 );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.encoding = THREE.sRGBEncoding;

    // MATERIALS

    const groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );
    const objectMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0.5, metalness: 1.0 } );

    // GROUND

    const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000, 2, 2 ), groundMaterial );
    mesh.position.y = - 15;
    mesh.rotation.x = - Math.PI / 2;
    scene.add( mesh );

    // LIGHTS

    const intensity = 10;
    const distance = 100;
    const decay = 2.0;

    const c1 = 0xff0040, c2 = 0x0040ff, c3 = 0x80ff80, c4 = 0xffaa00, c5 = 0x00ffaa, c6 = 0xff1100;

    const sphere = new THREE.SphereBufferGeometry( 0.25, 16, 8 );

    light1 = new THREE.PointLight( c1, intensity, distance, decay );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c1 } ) ) );
    scene.add( light1 );

    light2 = new THREE.PointLight( c2, intensity, distance, decay );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c2 } ) ) );
    scene.add( light2 );

    light3 = new THREE.PointLight( c3, intensity, distance, decay );
    light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c3 } ) ) );
    scene.add( light3 );

    light4 = new THREE.PointLight( c4, intensity, distance, decay );
    light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c4 } ) ) );
    scene.add( light4 );

    light5 = new THREE.PointLight( c5, intensity, distance, decay );
    light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c5 } ) ) );
    scene.add( light5 );

    light6 = new THREE.PointLight( c6, intensity, distance, decay );
    light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: c6 } ) ) );
    scene.add( light6 );

    const dlight = new THREE.DirectionalLight( 0xffffff, 0.05 );
    dlight.position.set( 0.5, 1, 0 ).normalize();
    scene.add( dlight );

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



    createFlag(images[0], (Math.floor(Math.random() * (-500 - 500)) + 500), (Math.floor(Math.random() * (-500 - 500)) + 500), 180, 0, 5000, 1000);

    createFlag(images[1], (Math.floor(Math.random() * (-500 - 500)) + 500), (Math.floor(Math.random() * (-500 - 500)) + 500), -75, 1000, 8000, 2000);

    createFlag(images[2], (Math.floor(Math.random() * (-500 - 500)) + 500), (Math.floor(Math.random() * (-500 - 500)) + 500), 17, 1500, 3000, 1000);



    createCrystals(10, 20 );
    createCrystals(2, 100);


    function createCrystals(size, amount){
        var crystalGeometry = new THREE.OctahedronBufferGeometry( size, 1 );
        for (var i = 0; i < amount; i++) {
            let crystalImage, crystalMaterial;
            crystalImage = textureLoader.load("https://media.istockphoto.com/photos/hight-resolution-emerald-texture-picture-id157992082?k=6&m=157992082&s=170667a&w=0&h=3_xqJMTAt-DBTaeBXZVZfzdMJbtTWrz4AGc7WMYjDlM=");
            crystalMaterial = new THREE.MeshBasicMaterial({
              map: crystalImage, opacity: 0.1
            });

            var crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            crystal.position.x = Math.floor(Math.random() * 20 - 10) * 50;
            // box.position.y = Math.floor(Math.random() * 20) * 2;
            crystal.position.y = -15;
            crystal.position.z = Math.floor(Math.random() * 20 - 10)*50;
            objects.push(crystal);
            scene.add(crystal);
        }
    }






    var loader = new THREE.FontLoader();
    loader.load( '/wp-content/themes/house_of_killing/three/examples/jsm/fonts/helvetiker_regular.typeface.json', function ( font ) {

            var xMid, text;

            var color = [0xffffff, 0x00fffd, 0x00ff21, 0xeeff00, 0xfa00ff]

            let guidelines = ["navigation strategies and synesthetic reflection","loop your thought", "look around", "look forward","close your eyes", "move", "absorb signs", "absorb analogy", "u r doing great sweetie", "all my life people have been telling me, you're a shoe, you're a shoe, you're a shoe", "what if I am a hat?", "its a metaphor Daddy", "deduce meaning", "deduce self", "deduce identity", "loop your thought", "loop yourself", "quicksave as png", "duplicate layer", "i could so easily freak out right now", "i am doing good baby, how u doin?", "keep going", "turn back", "disregard the interface", "metaphorically speaking", "isn't that just kick you in the crotch fantastic?", "😍", "😍", "😍", "😍", "😍", "😍", "😍", "😍", "what would Jennifer Aniston do?", "is this a Brad situation?", "your dogs name is Clyde", "let the tower fall", "new beginnings past violent ends", "cosmic child of love for Aniston", "sometimes Jennifer", "emotional polysemy", "performative polysemy", "hollistic synergy", "spiritual ecology as mainstream standard", "conflictual polysemy", "performative polysemy", "hollistic synergy", "spiritual ecology as mainstream standard", "click on more", "human software", "spacial navigation theory", "posthuman cybernetics", "all watch over by Jennifer Aniston of loving grace", "infinite loop", "break the loop", "loop down", "look behind u", "open wide", "refuse the premise", "breath", "hold your breath", "take a deep breath","were we on a break?" ,"become the controls", "press escape to quit", "quit", "stop", "get out", "jump in", "reload page", "share"];
            for (var i = 0; i < guidelines.length; i++) {
                createText(guidelines[i]);
            }
            function createText(inputtext){
                var matDark = new THREE.LineBasicMaterial( {
                    color: color[Math.floor(Math.random()*color.length)],
                    side: THREE.DoubleSide
                } );

                var matLite = new THREE.MeshBasicMaterial( {
                    color: color[Math.floor(Math.random()*color.length)],
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide
                } );
            var shapes = font.generateShapes( inputtext, Math.floor(Math.random() * 5));
            var geometry = new THREE.ShapeBufferGeometry( shapes );
            geometry.computeBoundingBox();
            xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
            geometry.translate( xMid, 0, 0 );
            // make shape ( N.B. edge view not visible )
            text = new THREE.Mesh( geometry, matLite );
            text.position.z = Math.floor(Math.random() * 20 - 10)*50;
            text.position.x = Math.floor(Math.random() * 20 - 10)*50;
            text.position.y = Math.floor(Math.random() * 0-15);
            text.rotation.y = Math.floor(Math.random() * 10+5)*20;
            scene.add( text );
            movingtext.push(text);
            // make line shape ( N.B. edge view remains visible )
            var holeShapes = [];
            for ( var i = 0; i < shapes.length; i ++ ) {
                var shape = shapes[ i ];
                if ( shape.holes && shape.holes.length > 0 ) {
                    for ( var j = 0; j < shape.holes.length; j ++ ) {
                        var hole = shape.holes[ j ];
                        holeShapes.push( hole );
                    }
                }
            }
            shapes.push.apply( shapes, holeShapes );
            var lineText = new THREE.Object3D();
            for ( var i = 0; i < shapes.length; i ++ ) {
                var shape = shapes[ i ];
                var points = shape.getPoints();
                var geometry = new THREE.BufferGeometry().setFromPoints( points );
                geometry.translate( xMid, 0, 0 );
                var lineMesh = new THREE.Line( geometry, matDark );
                lineText.add( lineMesh );
                lineText.position.z = Math.floor(Math.random() * 20 - 10)*50;
                lineText.position.x = Math.floor(Math.random() * 20 - 10)*50;
                lineText.position.y = Math.floor(Math.random()) * 10+5;
                text.rotation.y = Math.floor(Math.random() * 10+5)*20;
            }
            scene.add( lineText );
            movingtext.push(lineText);
            }
        } );


    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    let canvas = document.getElementById("canvas");
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setPixelRatio( window.devicePixelRatio );

    canvas.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );
    // window.addEventListener( "mousemove", onDocumentMouseMove, false );
    canvas.addEventListener( 'mousemove', onMouseMove, false );

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

  

    for (var i = 0; i < objects.length; i++) {
      // boxes[i].rotation.y += 0.005;
      objects[i].rotation.y += 0.003;
      objects[i].position.y += 0.000003;
      objects[i].scale.y += 0.00001;
      objects[i].scale.x += 0.00001;
        objects[i].scale.z += 0.00001;
    }

    for (var i = 0; i < movingtext.length; i++) {
        movingtext[i].rotation.y += 0.003;
    }

    for (let index = 0; index < cloths.length; index++) {
        const element = cloths[index];
        simulate( now, element, clothGeometries[index],  element.xvalue, element.yvalue, element.zvalue); 
    }
    render();
}

function render(){
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

    flashlight.position.copy( camera.position );
    camera.updateMatrixWorld();


    const time = Date.now() * 0.00025;
	const d = 150;

				light1.position.x = Math.sin( time * 0.7 ) * d;
				light1.position.z = Math.cos( time * 0.3 ) * d;

				light2.position.x = Math.cos( time * 0.3 ) * d;
				light2.position.z = Math.sin( time * 0.7 ) * d;

				light3.position.x = Math.sin( time * 0.7 ) * d;
				light3.position.z = Math.sin( time * 0.5 ) * d;

				light4.position.x = Math.sin( time * 0.3 ) * d;
				light4.position.z = Math.sin( time * 0.5 ) * d;

				light5.position.x = Math.cos( time * 0.3 ) * d;
				light5.position.z = Math.sin( time * 0.5 ) * d;

				light6.position.x = Math.cos( time * 0.7 ) * d;
				light6.position.z = Math.cos( time * 0.5 ) * d;
    
    
    renderer.render( scene, camera );
}





// var selectedObject = null;
// function onDocumentMouseMove( event ) {
//     event.preventDefault();
//     if ( selectedObject ) {
//         // selectedObject.material.color.set( '#69f' );
//         selectedObject = null;
//     }

//     var intersects = getIntersects( event.layerX, event.layerY );
//     if ( intersects.length > 0 ) {
//         var res = intersects.filter( function ( res ) {
//             return res && res.object;
//         } )[ 0 ];

//         if ( res && res.object ) {
//             selectedObject = res.object;
//             // selectedObject.material.color.set( '#f00' );
//         }

//     }

// }
var raycaster = new THREE.Raycaster();
// var mouseVector = new THREE.Vector3();
// // raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

// function getIntersects( x, y ) {

//     x = ( x / window.innerWidth ) * 2 - 1;
//     y = - ( y / window.innerHeight ) * 2 + 1;

//     mouseVector.set( x, y, 0.5 );
//     raycaster.setFromCamera( mouseVector, camera );

//     return raycaster.intersectObject( group, true );

// }


function onMouseMove( event ) {

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    // See if the ray from the camera into the world hits one of our meshes
    var intersects = raycaster.intersectObjects(scene.children, true);
    // Toggle rotation bool for meshes that we clicked
    if ( intersects.length > 0 ) {

        if(intersects[0].object){
            console.log("userdata", intersects[0].object, intersects[0].object.userdata);

            if(intersects[0].object.userdata){
                console.log(intersects[0].object.userdata);
            }
            // current_project.innerHTML = intersects[0].object.userData.title;
        //    console.log("object", intersects[0].object);
        }
        
    }

}