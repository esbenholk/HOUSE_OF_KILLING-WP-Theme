import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { Water } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Water.js';
import { Sky } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Sky.js';

import { GLTFLoader } from '/wp-content/themes/house_of_killing/three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/FilmPass.js';
import Stats from '/wp-content/themes/house_of_killing_2.0/three/examples/jsm/libs/stats.module.js';



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



function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

    //lights
    // scene.add( new THREE.AmbientLight( 0x404040,  0.25 ) );

    const sphere1geometry = new THREE.IcosahedronBufferGeometry( 3, 15 );
    const sphere1material =  new THREE.MeshBasicMaterial( { color: 0xff0040 } )
    let sphere1 = new THREE.Mesh( sphere1geometry, sphere1material );

    const sphere2geometry = new THREE.IcosahedronBufferGeometry( 2, 15 );
    const sphere2material =  new THREE.MeshBasicMaterial( { color: 0x2aff00 } )
    let sphere2 = new THREE.Mesh( sphere2geometry, sphere2material );

    const sphere3geometry = new THREE.IcosahedronBufferGeometry( 1.5, 15 );
    const sphere3material =  new THREE.MeshBasicMaterial( { color: 0xff0040 } )
    let sphere3 = new THREE.Mesh( sphere3geometry, sphere3material );

    const sphere4geometry = new THREE.IcosahedronBufferGeometry( 1, 15 );
    const sphere4material =  new THREE.MeshBasicMaterial( { color: 0x002aff } )
    let sphere4 = new THREE.Mesh( sphere4geometry, sphere4material );

    
    
  

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


  const lutTextures = [
    { name: 'identity',           size: 2, filter: true , },
    { name: 'identity no filter', size: 2, filter: false, },
    { name: 'custom',          url: 'https://threejsfundamentals.org/threejs/resources/images/lut/3dlut-red-only-s16.png' },
    { name: 'monochrome',      url: 'https://threejsfundamentals.org/threejs/resources/images/lut/monochrome-s8.png' },
    { name: 'sepia',           url: 'https://threejsfundamentals.org/threejs/resources/images/lut/sepia-s8.png' },
    { name: 'saturated',       url: 'https://threejsfundamentals.org/threejs/resources/images/lut/saturated-s8.png', },
    { name: 'posterize',       url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-s8n.png', },
    { name: 'posterize-3-rgb', url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-3-rgb-s8n.png', },
    { name: 'posterize-3-lab', url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-3-lab-s8n.png', },
    { name: 'posterize-4-lab', url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-4-lab-s8n.png', },
    { name: 'posterize-more',  url: 'https://threejsfundamentals.org/threejs/resources/images/lut/posterize-more-s8n.png', },
    { name: 'inverse',         url: 'https://threejsfundamentals.org/threejs/resources/images/lut/inverse-s8.png', },
    { name: 'color negative',  url: 'https://threejsfundamentals.org/threejs/resources/images/lut/color-negative-s8.png', },
    { name: 'high contrast',   url: 'https://threejsfundamentals.org/threejs/resources/images/lut/high-contrast-bw-s8.png', },
    { name: 'funky contrast',  url: 'https://threejsfundamentals.org/threejs/resources/images/lut/funky-contrast-s8.png', },
    { name: 'nightvision',     url: 'https://threejsfundamentals.org/threejs/resources/images/lut/nightvision-s8.png', },
    { name: 'thermal',         url: 'https://threejsfundamentals.org/threejs/resources/images/lut/thermal-s8.png', },
    { name: 'b/w',             url: 'https://threejsfundamentals.org/threejs/resources/images/lut/black-white-s8n.png', },
    { name: 'hue +60',         url: 'https://threejsfundamentals.org/threejs/resources/images/lut/hue-plus-60-s8.png', },
    { name: 'hue +180',        url: 'https://threejsfundamentals.org/threejs/resources/images/lut/hue-plus-180-s8.png', },
    { name: 'hue -60',         url: 'https://threejsfundamentals.org/threejs/resources/images/lut/hue-minus-60-s8.png', },
    { name: 'red to cyan',     url: 'https://threejsfundamentals.org/threejs/resources/images/lut/red-to-cyan-s8.png' },
    { name: 'blues',           url: 'https://threejsfundamentals.org/threejs/resources/images/lut/blues-s8.png' },
    { name: 'infrared',        url: 'https://threejsfundamentals.org/threejs/resources/images/lut/infrared-s8.png' },
    { name: 'radioactive',     url: 'https://threejsfundamentals.org/threejs/resources/images/lut/radioactive-s8.png' },
    { name: 'goolgey',         url: 'https://threejsfundamentals.org/threejs/resources/images/lut/googley-s8.png' },
    { name: 'bgy',             url: 'https://threejsfundamentals.org/threejs/resources/images/lut/bgy-s8.png' },
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


  const sceneBG = new THREE.Scene();
  const cameraBG = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  let bgMesh;
  let bgTexture;
  {
    const loader = new THREE.TextureLoader();
    bgTexture = loader.load('https://threejsfundamentals.org/threejs/resources/images/beach.jpg');
    const planeGeo = new THREE.PlaneBufferGeometry(2, 2);
    const planeMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      depthTest: false,
    });
    bgMesh = new THREE.Mesh(planeGeo, planeMat);
    sceneBG.add(bgMesh);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

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
  const renderBG = new RenderPass(sceneBG, cameraBG);

  const rtParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
  };
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, rtParameters));

  composer.addPass(renderBG);
  composer.addPass(renderModel);
  composer.addPass(effectLUT);
  composer.addPass(effectLUTNearest);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth * window.devicePixelRatio | 0;
    const height = canvas.clientHeight * window.devicePixelRatio | 0;

    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let then = 0;
  function render(now) {
    now *= 0.001;  // convert to seconds
    const delta = now - then;
    then = now;
    const canvas = renderer.domElement;
    

    composer.setSize(canvas.width, canvas.height);
    const canvasAspect = canvas.clientWidth / canvas.clientHeight;
    camera.aspect = canvasAspect;
    camera.updateProjectionMatrix();

    

    const lutInfo = lutTextures[ 11];

    const effect = lutInfo.filter ? effectLUT : effectLUTNearest;
    effectLUT.enabled = lutInfo.filter;
    effectLUTNearest.enabled = !lutInfo.filter;

    const lutTexture = lutInfo.texture;
    effect.uniforms.lutMap.value = lutTexture;
    effect.uniforms.lutMapSize.value = lutInfo.size;

    composer.render(delta);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();



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
        model.layers.enable( BLOOM_SCENE );
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


