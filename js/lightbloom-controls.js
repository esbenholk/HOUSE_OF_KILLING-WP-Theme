import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';

import { GLTFLoader } from '/wp-content/themes/house_of_killing/three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/EffectComposer.js';
import { Water } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Water.js';
import { Sky } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Sky.js';
import { RenderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/ShaderPass.js';
import { OrbitControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/OrbitControls.js';

let islandDescriptors = ["avatar island", "content redistribution_content003", "decay_active002", "shy_boy1992", "island", "texture_composition_collage2.0", "all I am is more of you", "camping", "skeleton", "collage2020_finalVersion11"]

////scene titles
let title = document.getElementById("canvas-title")
let canvasDetails = document.getElementById("canvas-details")


/// scene variables
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

const scene = new THREE.Scene();

const sceneBG = new THREE.Scene();

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas:canvas, preserveDrawingBuffer: true });
renderer.setPixelRatio( window.devicePixelRatio );
let composer;


const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 50000 );
camera.position.set( 10, 100, 100 );
camera.lookAt( 0, 0, 0 );

let controls = new OrbitControls(camera, document.body);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;


let clock = new THREE.Clock();
let sun = new THREE.Vector3();
let custom_azimuth = 0.8;

let light1, light2, light3, light4;
let water, datatexture;


let theta = 0;
let radius = 17;
let objects =[];

///set rotate to false for still scene
let rotate = true;

let then = 0;


//manager
const manager = new THREE.LoadingManager();

manager.onLoad = function ( ) {
    document.getElementById('loading-screen').remove()

};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    ///should i do something on progress?
};

manager.onError = function ( url ) {
    document.getElementById('loading-status').innerHTML = "<div class='missing-content'><img src='/wp-content/themes/house_of_killing/icons/ghosticon.png'/><p>missing content</p></div>"
};

const loader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
textureLoader.crossOrigin = "Anonymous";



const lutTextures = [
   
    { name: 'inverse',         url: 'https://threejsfundamentals.org/threejs/resources/images/lut/inverse-s8.png', },
  
];

const makeIdentityLutTexture = function() {
    const identityLUT = new Uint8Array([
        0,   0,   0, 255,  // black
    255,   0,   0, 255,  // red
        0,   0, 255, 255,  // blue
    255,   0, 255, 255,  // magenta
        0, 255,   0, 255,  // green
    255, 255,   0, 255,  // yellow
        0, 255, 255, 255,  // cyan
    255, 255, 255, 255,  // white
    ]);

    return function(filter) {
    const texture = new THREE.DataTexture(identityLUT, 4, 2, THREE.RGBAFormat);
    texture.minFilter = filter;
    texture.magFilter = filter;
    texture.needsUpdate = true;
    texture.flipY = false;
    return texture;
    };
}();

const makeLUTTexture = function() {
    const imgLoader = new THREE.ImageLoader();
    const ctx = document.createElement('canvas').getContext('2d');

    return function(info) {
    const texture = makeIdentityLutTexture(
        info.filter ? THREE.LinearFilter : THREE.NearestFilter);

    if (info.url) {
        const lutSize = info.size;

        // set the size to 2 (the identity size). We'll restore it when the
        // image has loaded. This way the code using the lut doesn't have to
        // care if the image has loaded or not
        info.size = 2;

        imgLoader.load(info.url, function(image) {
        const width = lutSize * lutSize;
        const height = lutSize;
        info.size = lutSize;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);

        texture.image.data = new Uint8Array(imageData.data.buffer);
        texture.image.width = width;
        texture.image.height = height;
        texture.needsUpdate = true;
        });
    }

    return texture;
    };
}();

lutTextures.forEach((info) => {
    // if not size set get it from the filename
    if (!info.size) {
    // assumes filename ends in '-s<num>[n]'
    // where <num> is the size of the 3DLUT cube
    // and [n] means 'no filtering' or 'nearest'
    //
    // examples:
    //    'foo-s16.png' = size:16, filter: true
    //    'bar-s8n.png' = size:8, filter: false
    const m = /-s(\d+)(n*)\.[^.]+$/.exec(info.url);
    if (m) {
        info.size = parseInt(m[1]);
        info.filter = info.filter === undefined ? m[2] !== 'n' : info.filter;
    }
    }

    info.texture = makeLUTTexture(info);
});

const lutNameIndexMap = {};
lutTextures.forEach((info, ndx) => {
    lutNameIndexMap[info.name] = ndx;
});

const lutSettings = {
    lut: lutNameIndexMap.custom,
};

const lutShader = {
    uniforms: {
    tDiffuse: { value: null },
    lutMap:  { value: null },
    lutMapSize: { value: 1, },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
    fragmentShader: `
    #include <common>

    #define FILTER_LUT true

    uniform sampler2D tDiffuse;
    uniform sampler2D lutMap;
    uniform float lutMapSize;

    varying vec2 vUv;

    vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
        float sliceSize = 1.0 / size;                  // space of 1 slice
        float slicePixelSize = sliceSize / size;       // space of 1 pixel
        float width = size - 1.0;
        float sliceInnerSize = slicePixelSize * width; // space of size pixels
        float zSlice0 = floor( texCoord.z * width);
        float zSlice1 = min( zSlice0 + 1.0, width);
        float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
        float yRange = (texCoord.y * width + 0.5) / size;
        float s0 = xOffset + (zSlice0 * sliceSize);

        #ifdef FILTER_LUT

        float s1 = xOffset + (zSlice1 * sliceSize);
        vec4 slice0Color = texture2D(tex, vec2(s0, yRange));
        vec4 slice1Color = texture2D(tex, vec2(s1, yRange));
        float zOffset = mod(texCoord.z * width, 1.0);
        return mix(slice0Color, slice1Color, zOffset);

        #else

        return texture2D(tex, vec2( s0, yRange));

        #endif
    }

    void main() {
        vec4 originalColor = texture2D(tDiffuse, vUv);
        gl_FragColor = sampleAs3DTexture(lutMap, originalColor.xyz, lutMapSize);
    }
    `,
};

const lutNearestShader = {
    uniforms: {...lutShader.uniforms},
    vertexShader: lutShader.vertexShader,
    fragmentShader: lutShader.fragmentShader.replace('#define FILTER_LUT', '//'),
};

const effectLUT = new ShaderPass(lutShader);
effectLUT.renderToScreen = true;
const effectLUTNearest = new ShaderPass(lutNearestShader);
effectLUTNearest.renderToScreen = true;

const renderModel = new RenderPass(scene, camera);
renderModel.clear = false;  // so we don't clear out the background
const renderBG = new RenderPass(sceneBG, camera);

const rtParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
};

///canvas with data stream
let c, ctx;

function drawCanvas(){
      // geting canvas by Boujjou Achraf
      c = document.getElementById("HTMLcanvas");
      c.style.display = "none"
      ctx = c.getContext("2d");
  
      //making the canvas full screen
      c.height = 700;
      c.width = 200;
  
      var wipeBlock1 = "██"; //Block to clear
      var wipeBlock2 = "▉"; //Block to clear
      //chinese characters - taken from the unicode charset
      var matrix =
        "help, lost, hej, <3, :), :(, :0, xx, 404 "; //子月刀馬日
      //converting the string into an array of single characters
      matrix = matrix.split(",");
  
      var font_size = 20;
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
        ctx.fillStyle = "rgba(250, 255, 0, 0.03)";
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
            ctx.fillStyle = "#a300ff"; //black text
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

    // generate texture
    datatexture = new THREE.CanvasTexture(ctx.canvas);
    datatexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    datatexture.needsUpdate = true;
    datatexture.flipY = false;




    cloths.push(cloth)
    const group = new THREE.Group();

    var clothMaterial = new THREE.MeshLambertMaterial( {
        map: datatexture,
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

    object.userData = {title: ["empty flag", "tell me what to say", "link to Data City"], url: "/data-city"}

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


function main() {

    composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, rtParameters));

    composer.addPass(renderBG);
    composer.addPass(renderModel);
    composer.addPass(effectLUT);
    composer.addPass(effectLUTNearest);

    const material = new THREE.MeshPhongMaterial({
        color: 0xff0040,
        opacity: 0,
        transparent: true,
      });

    const sphere1geometry = new THREE.IcosahedronBufferGeometry( 3, 15 );
    let sphere1 = new THREE.Mesh( sphere1geometry, material );

    let sphere2 = new THREE.Mesh( sphere1geometry, material );

    let sphere3 = new THREE.Mesh( sphere1geometry, material );

    let sphere4 = new THREE.Mesh( sphere1geometry, material );


    light1 = new THREE.PointLight( 0x00ff63, 3, 0 );
    light1.add( sphere1 );
    scene.add( light1 );

    light2 = new THREE.PointLight( 0xae00ff, 4, 0 );
    light2.add( sphere2 );
    scene.add( light2 );

    light3 = new THREE.PointLight( 0x00ff6f, 2, 0 );
    light3.add( sphere3 );
    scene.add( light3 );

    light4 = new THREE.PointLight( 0x00ff4d, 1, 0 );
    light4.add( sphere4 );
    scene.add( light4 );

    scene.add( new THREE.AmbientLight( 0xFFFFFF,  1 ) );

    
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
            sunColor: 0x0afc7e,
            waterColor: 0x2CFC0A,
            distortionScale: 3.5       }
    );

    water.rotation.x = - Math.PI / 2;
    water.position.y = -20;
    water.userData = {title: ["ocean"]}

    scene.add( water );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 1000 );
    sky.userData = {title: ["sky"]}

    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 0;
    skyUniforms[ 'mieCoefficient' ].value = 0.05;
    skyUniforms[ 'mieDirectionalG' ].value = 0.9;
  

    const parameters = {
        inclination: 0.49,
        azimuth: custom_azimuth,
        mieDirectionalG: 0.9,
        rayleigh: 0,
        exposure: 0
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
    // canvas.addEventListener( 'mousemove', onMouseMove, false );
    renderer.domElement.addEventListener('click', onClick, false);


    



    requestAnimationFrame(render);
    animate(0);
}

main();


function render(now) {

    datatexture.needsUpdate = true;

    now *= 0.001;  // convert to seconds
    const delta = now - then;
    then = now;

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );


    composer.setSize(width, height);   

    const lutInfo = lutTextures[ 0];

    const effect = lutInfo.filter ? effectLUT : effectLUTNearest;
    effectLUT.enabled = lutInfo.filter;
    effectLUTNearest.enabled = !lutInfo.filter;

    const lutTexture = lutInfo.texture;
    effect.uniforms.lutMap.value = lutTexture;
    effect.uniforms.lutMapSize.value = lutInfo.size;

    composer.render(delta);


    requestAnimationFrame(render);

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
        // model.layers.enable( BLOOM_SCENE );
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


        if(intersects[0].object.userData.title){
          
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




function animate(now) {

    controls.update();


    for (let index = 0; index < cloths.length; index++) {
        const element = cloths[index];
        simulate( now, element, clothGeometries[index],  element.xvalue, element.yvalue, element.zvalue);
    }

    // if(rotate===true){
    //     theta += 0.1;
    //     if(radius<100){
    //         radius += 0.05;
    //     }
    
    //     camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    //     camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    //     camera.position.y = 3*Math.cos( THREE.MathUtils.degToRad( theta ) );
    //     camera.lookAt( scene.position );

    //     camera.updateMatrixWorld();

    // }

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
    custom_azimuth ++;
    if(custom_azimuth>=1){
        custom_azimuth = 0;
    }

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

    requestAnimationFrame( animate );




}



function onClick() {
    event.preventDefault();
  
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
  
    var intersects = raycaster.intersectObjects(scene.children, true);
  
    if (intersects.length > 0) {
  
      if(intersects[0].object){
          console.log(intersects[0].object);
          if(intersects[0].object.userData.url){
            window.location = intersects[0].object.userData.url;
          }
        
      }
    
  
     
  
    }
  
}
let screenshot_count = 0;

document.addEventListener("keypress", function(event) {
    
    if(event.charCode === 115){
        let filename = "three-screenshot"+screenshot_count
        createImage(filename, 791, 791)
        screenshot_count ++;
    }

});

function createImage(saveAsFileName,width,height) {

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(  width, height );
  
    renderer.render( scene, camera, null, false );

    var url = canvas.toDataURL("image/jpeg", 1.0);

    var link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', saveAsFileName);

    link.click();
}


