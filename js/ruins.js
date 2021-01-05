import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { Reflector } from '/wp-content/themes/house_of_killing//three/examples/jsm/objects/Reflector.js';
import { GlitchPass } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/postprocessing/GlitchPass.js'
import { EffectComposer } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/wp-content/themes/house_of_killing/three/examples/jsm/postprocessing/RenderPass.js';




let canvas = document.getElementById("canvas")
let context = document.getElementById('threeDfrontpage')
let images= context.getElementsByTagName('img')
var arr = [ ];
for (let index = 0; index < images.length; index++) {
    const element = images[index];
	element.style.display = "none"
	arr.push(element.src)
    
}

var currentImage = 0;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;


window.addEventListener("DOMContentLoaded",app);

function app() {
	var scene,
		camera,
		renderer,
		controls,
		composer,
		glitchPass,

		textureLoader = new THREE.TextureLoader(),
		asphaltTexture,
		bldgTexture,
		textures = [],
		bldgs = [],
		debris = [],
		collidableMeshList = [],
		debrisIdealSet = [],
		ambientLight,
		hemiLight,
		light1,

		// user adjustable
		brightness = 1,
		fogDistance = 720,
		speed = 0.5,

		// should stay as is
		bldgColor = 0xd1d1d1,
		lightColor = 0xff89f9,
		skyColor = 0x00fdbd,
		chunkSize = 128,
		chunksAtATime = 6,
		debrisPerChunk = 32,
		debrisMaxChunkAscend = 2,
		smBldgSize = 10,
		lgBldgSize = 12;

	class Building {
		constructor(bldgTexture,x,y,z,width,height,depth,rotX = 0,rotY = 0,rotZ = 0) {
			this.geo = new THREE.CubeGeometry(width,height,depth);
			this.mat = new THREE.MeshPhongMaterial({
				color: bldgColor,
				map: bldgTexture,
				shininess: 70,
				reflectivity: 1
			});

		
			
			this.mat.map.wrapS = THREE.RepeatWrapping;
			this.mat.map.wrapT = THREE.RepeatWrapping;
			this.mat.map.repeat.set(1,height/width > 2 ? 3 : 2);
			
			let halfHeight = height/2,
				isRotated = rotX != 0 || rotY != 0 || rotZ != 0;

			this.mesh = new THREE.Mesh(this.geo, this.mat);
			this.mesh.position.set(x,isRotated ? y : y + halfHeight,z);

			if (isRotated) {
				this.geo.translate(0,halfHeight,0);
				this.mesh.rotation.x = rotX * Math.PI/180;
				this.mesh.rotation.y = rotY * Math.PI/180;
				this.mesh.rotation.z = rotZ * Math.PI/180;
			}
			this.mesh.castShadow = true;
			scene.add(this.mesh);
			collidableMeshList.push(this.mesh);
		}
	}
	class Debris {
		constructor(x,y,z,width,height,depth,rotX = 0,rotY = 0,rotZ = 0) {
			this.geo = new THREE.CubeGeometry(width,height,depth);
			this.mat = new THREE.MeshLambertMaterial({
				color: bldgColor
			});
			this.mesh = new THREE.Mesh(this.geo, this.mat);
			this.mesh.position.set(x,y,z);
			this.mesh.rotation.set(
				rotX * Math.PI/180,
				rotY * Math.PI/180,
				rotZ * Math.PI/180
			);
			scene.add(this.mesh);
		}
	}
	const randomInt = (min,max) => {
			return Math.floor(Math.random() * (max - min)) + min;
		},
		randomAngle = () => {
			return Math.floor(Math.random() * 360);
		}

	var init = () => {
			// load textures
			for (let index = 0; index < arr.length; index++) {
				const element = arr[index];
				let texture = textureLoader.load(element);
				textures.push(texture)
				
			}
			asphaltTexture = textureLoader.load(images[0].src);
			asphaltTexture.needsUpdate = true;

			// setup scene
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor(new THREE.Color(skyColor));
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.shadowMap.enabled = true;
			composer = new EffectComposer( renderer );
			composer.addPass( new RenderPass( scene, camera ) );

			glitchPass = new GlitchPass(9);
			glitchPass.enabled = false;
			composer.addPass( glitchPass );

			// use randomized and fixed configuration of debris particles that can be repeated
			for (var d = 0; d < debrisPerChunk; ++d) {
				let halfChunk = chunkSize/2,
					debrisParams = {
						x: randomInt(-halfChunk,halfChunk),
						y: randomInt(0,chunkSize * debrisMaxChunkAscend),
						z: randomInt(-halfChunk,halfChunk)
					};
					debrisParams.size = Math.abs(debrisParams.x / halfChunk) * 6;
					debrisParams.height = debrisParams.size * randomInt(2,3);

				debrisIdealSet.push({
					x: debrisParams.x,
					y: debrisParams.y,
					z: debrisParams.z,

					width: debrisParams.size,
					height: debrisParams.height,
					depth: debrisParams.size,

					rotX: randomAngle(),
					rotY: randomAngle(),
					rotZ: randomAngle()
				});
			}

			// generate city
			for (var cz = 1; cz > -chunksAtATime; --cz) {
					var zMove = chunkSize * cz;

					// surface
					var groundGeo = new THREE.PlaneGeometry(chunkSize,chunkSize),
						groundMat = new THREE.MeshLambertMaterial({
							color: 0x969696,
							map: asphaltTexture
						});

					var mirrorFloor = new Reflector( groundGeo, {
						clipBias: 0.3,
						textureWidth: WIDTH * window.devicePixelRatio,
						textureHeight: HEIGHT * window.devicePixelRatio,
						color: 0x0037ff,
						opacity: 0
					} );

			        var ground = new THREE.Mesh(groundGeo, groundMat);
					ground.rotation.x = -0.5 * Math.PI;
					ground.position.set(0,0,zMove);
					ground.receiveShadow = true;


					mirrorFloor.rotation.x = -0.5 * Math.PI;
					mirrorFloor.position.set(0,0,zMove);
					mirrorFloor.receiveShadow = true;

					// scene.add(mirrorFloor)
					scene.add(ground);

					// buildings
					bldgs.push(
						// northwest
						new Building(textures[0],-44, 4, -44 + zMove, lgBldgSize,40,lgBldgSize, 0,35,-85),
						new Building(textures[1],-56, -2, -32 + zMove, smBldgSize,52,smBldgSize, 15,0,-12),
						new Building(textures[2],-36, 0, -16 + zMove, lgBldgSize,52,lgBldgSize, 0,0,-10),
						new Building(textures[4],-24, 0, -36 + zMove, smBldgSize,52,smBldgSize, 0,0,-10),
						new Building(textures[5],-16, 0, -20 + zMove, smBldgSize,52,smBldgSize, 30,0,0),

						// northeast
						new Building(textures[6],24, -2, -44 + zMove, lgBldgSize,44,lgBldgSize, -15,0,15),
						new Building(textures[5],40, 0, -36 + zMove, smBldgSize,48,smBldgSize, 0,0,15),
						new Building(textures[4],48, 0, -36 + zMove, smBldgSize,38,smBldgSize, 0,0,12),
						new Building(textures[3],20, 0, -24 + zMove, smBldgSize,40,smBldgSize, 0,0,15),
						new Building(textures[2],32, 0, -24 + zMove, smBldgSize,48,smBldgSize, 0,0,15),
						new Building(textures[1],42, 0, -24 + zMove, smBldgSize,38,smBldgSize, 0,0,15),
						new Building(textures[0],48, 2, 1 + zMove, lgBldgSize,32,lgBldgSize, 0,-25,80),

						// southwest
						new Building(textures[0],-48, 0, 16 + zMove, smBldgSize,44,smBldgSize, 0,0,-10),
						new Building(textures[0],-32, 0, 16 + zMove, smBldgSize,48,smBldgSize, 0,0,-15),
						new Building(textures[1],-16, -2, 16 + zMove, smBldgSize,40,smBldgSize, -10,0,-12),
						new Building(textures[2],-32, 0, 32 + zMove, lgBldgSize,48,lgBldgSize, 0,0,15),
						new Building(textures[3],-48, 0, 48 + zMove, smBldgSize,20,smBldgSize),
						new Building(textures[4],-16, 0, 48 + zMove, smBldgSize,36,smBldgSize, 0,0,15),
						new Building(textures[5],-48, 19, 48 + zMove, smBldgSize,20,smBldgSize, 0,0,-15),

						// southeast
						new Building(textures[0],30, 0, 52 + zMove, lgBldgSize,48,lgBldgSize, 0,0,20),
						new Building(textures[2],24, 0, 20 + zMove, smBldgSize,40,smBldgSize, 0,0,5),
						new Building(textures[1],40, 0, 24 + zMove, smBldgSize,40,smBldgSize),
						new Building(textures[3],24, 0, 32 + zMove, smBldgSize,36,smBldgSize),
						new Building(textures[4],52, 0, 12 + zMove, smBldgSize,20,smBldgSize),
						new Building(textures[5],36, 0, 32 + zMove, lgBldgSize,48,lgBldgSize, 0,0,-25)
					);

					// debris particles
					for (var fs of debrisIdealSet)
						debris.push(new Debris(
							fs.x,
							fs.y,
							fs.z + zMove,
							fs.width,
							fs.height,
							fs.depth,
							fs.rotX,
							fs.rotY,
							fs.rotZ
						));
			}

			// lighting
			// ambientLight = new THREE.AmbientLight(lightColor);
			// scene.add(ambientLight);

			hemiLight = new THREE.HemisphereLight(lightColor, 0xffffff, brightness);
			hemiLight.position.set(0,8,0);
			scene.add(hemiLight);

			const sphere1geometry = new THREE.IcosahedronBufferGeometry( 3, 15 );
			const sphere1material =  new THREE.MeshBasicMaterial( { color: 0x04ff00 } )
			let sphere1 = new THREE.Mesh( sphere1geometry, sphere1material );
		

			light1 = new THREE.PointLight( 0x04ff00, 2, 50  );
			light1.add( sphere1 );
			scene.add( light1 );
			
			// camera
			camera.position.set(0,8,0);

			// fog
			scene.fog = new THREE.Fog(skyColor, 0.01, fogDistance);

			// controls
			controls = {
				brightness: brightness,
				fogDistance: fogDistance,
				speed: speed
			};
	
			
			// render
			canvas.appendChild(renderer.domElement);
		},
		renderScene = () => {
			// shift camera
			camera.position.z -= camera.position.z < -chunkSize ? -chunkSize : speed;

			light1.position.z = camera.position.z;

			// rotate debris
			for (var d of debris) {
				if (d.mesh.position.y >= chunkSize * debrisMaxChunkAscend)
					d.mesh.position.y += -chunkSize * debrisMaxChunkAscend;
				else
					d.mesh.position.y += speed;

				let angleToAdd = speed/chunkSize * (Math.PI * 2);
				d.mesh.rotation.x += d.mesh.rotation.x >= Math.PI * 2 ? -Math.PI * 2 : angleToAdd;
				d.mesh.rotation.y += d.mesh.rotation.y >= Math.PI * 2 ? -Math.PI * 2 : angleToAdd;
				d.mesh.rotation.z += d.mesh.rotation.z >= Math.PI * 2 ? -Math.PI * 2 : angleToAdd;
			}

			// renderer.render(scene,camera);
			composer.render();

			requestAnimationFrame(renderScene);
		},

		onResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth,window.innerHeight)
		};

	init();
	renderScene();

	window.addEventListener("resize",onResize);

	function changeTexture(){

		currentImage ++
	
		for (let index = 0; index < bldgs.length; index++) {
				const element = bldgs[index];


				if(element.mesh.position.z < -200){
					if(Math.floor(Math.random()*(10-0+1)+0)>9){
						element.mat.map = textures[currentImage];
						element.mat.map.wrapS = THREE.RepeatWrapping;
						element.mat.map.wrapT = THREE.RepeatWrapping;
						element.mat.map.repeat.set(1,element.height/element.width > 2 ? 3 : 2);
						
	
					}

				}
			

			}

		if(currentImage>=arr.length-1){
			currentImage = 0;
		}
		setTimeout(function(){
			changeTexture();
	   }, 3000);
	}

	
	   
	var timeout;
	var start = true

	window.addEventListener("mousemove", function() {
		   glitchPass.enabled = true;
		   glitchPass.goWild = true
		   if (timeout) clearTimeout(timeout);
		   timeout = setTimeout(mouseStop, 10);
		   if(start === true){
				changeTexture();
				start = false;
		   }
		   
	   });
	   
	function mouseStop() {
		   glitchPass.enabled = false;
	   
	   }




}



   
