import * as THREE from '/wp-content/themes/house_of_killing/three/build/three.module.js';
import { Water } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Water.js';
import { Sky } from '/wp-content/themes/house_of_killing/three/examples/jsm/objects/Sky.js';

import { GLTFLoader } from '/wp-content/themes/house_of_killing/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '/wp-content/themes/house_of_killing/three/examples/jsm/controls/OrbitControls.js';

console.log("start");


let camera, scene, raycaster, renderer, clock, controls;
let light1, light2, light3, light4;
let sun, water, sky;
let uniforms1, uniforms2;
let objects = [];

let rotate = true;

let INTERSECTED;
let theta = 0;

const mouse = new THREE.Vector2();
let radius = 17;

let canvas = document.getElementById("canvas");

let images = [
//     {src:["https://res.cloudinary.com/www-houseofkilling-com/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1605542926/body_occupation-tc-49_ahdzek.jpg","https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605540717/2_TraMyNguyen_i_d_blush_if_I_could_bzylzb.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525911/5_TraMyNguyen_i_d_blush_if_I_could_detail_e24tus.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1605542931/body_occupation-tc-19_zh9l4z.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1605542930/body_occupation-tc-21_j6zxzw.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1605542928/body_occupation-tc-20_yupzaq.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605616607/2_TraMyNguyen_i_d_blush_if_I_could_vnna25.jpg"
//     ],
//     name:"Tra My Nguyen",
//     title: "I'd Blush If I could",
//     material: "Video screens, metal, acrylic nails, digital prints ca. 210 x 147 cm, 2020",
//     description: "My sculptural video installation explores the tensions involved in the post-human feminised 'cyborg': what ‘labour’ produces post-human technologies, and what discrepancies arise from cyborgian future speculation. In particular my research focuses on the gendering machines, from an Asian diasporic perspective. In Donna Haraway’s 1985 'A Cyborg Manifesto' she states ‘The cyborg is a condensed image of both imagination and material reality, the two joined centers structuring any possibility of historical transformation’. Nearly 30 years after her publication, this assemblage of the post-human subject is still intertwined in today’s power disparity. Moreover, its ‘multi-global, inter-subjective, institutional components’ are intentionally hidden (Hilary Bergen, 2016). For example following the discovery of silicon semiconductors in the 1970s, the modern computer industry which carried cybernetics into homes around the world was founded. This field of production proliferated in the 1980s Silicon Valley, with migrant women being the predominant workers within this extremely toxic field. <br> The production of technology bears histories of women and migrant labour. This system of labour exploitation signifies the irony of today’s society: the exploited bodies producing the new 'cyborg' assemblage are the ones being rendered invisible in the final product, and ultimately these bodies are being automated away by machines.",
//     placement: "30,0,30",
//     rotation: "50,1,4",
//     scale: 1.3},

//     {src:[
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_crop,w_2000/v1605620858/body_occupation-tc-13_lzplkm.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_crop,w_2000/v1605620854/body_occupation-tc-14_sl96j0.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_crop,w_2000/v1605620854/body_occupation-tc-15_a2utnc.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605626373/89721d39-f2ac-4b1d-b7e1-508139bd0282_ko0fkl.jpg", 
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_crop,w_2000/v1605525905/7_EdurneHerra%CC%81n_Galaxy_Gram_2020_vjeuzd.jpg"
//     ],
//     name:"Edurne Herran",
//     title: "2222 Space is the Place",
//     material: "<strong>Galaxygram </strong><br> 11 pictures - 8,5 x 16,5 cm each <br> <strong>  I <3 MARS </strong> <br>Ceramic mug 9,6 x 12 cm <br> <strong> Constellation </strong><br> Fabrics and embroidery hoops Variable measures.", 
//     description: "",
//     placement: "-10,0,-30",
//     rotation: "300,5,0.1",
//     scale: 0.5,
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605626373/89721d39-f2ac-4b1d-b7e1-508139bd0282_ko0fkl.jpg"},

//     {src:[
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605621661/3_MariaThra%CC%88n_Annareutinger_We_Are_All_Gonna_Die_2020_detail_u65agq.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_fit,h_1728,w_1728/v1605621985/body_occupation-tc-24_yovb5n.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_fit,h_1459,w_1459/v1605621987/body_occupation-tc-23_dig0ni.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_fit,h_1399,w_1399/v1605621986/body_occupation-tc-22_hsoj5i.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605622551/1_room2_gvcodv.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_fit,h_1399,w_1399/v1605621987/body_occupation-tc-70_o4noci.jpg"
//     ],
//     name:"Maria Thrän & Anna Reutinger",
//     title: "We all gonna die, but it's time to sing a song",
//     material: "Soundtrack, website, vinyl, sweet potatoes, rope, felt", 
//     description: ' ""We all gonna die, but it’s time to sing a song"" is a research into how to collectively imagine and move toward a future living landscape with the taste of a different life still on the tongue after our recent (and ongoing) confinement. Through our dreamy website, we invited anyone and everyone to anonymously submit recordings of what they would like the future to sound like. We received many and varied submissions—one-sided conversations, field recordings of birds and kitchens, pillow talk, free jazz compositions, mantra recitations, singing and honking and crying and snoring. These samples were then composed into a 30 minute wander through the future which lives both online and temporarily in Dada Post, where it is played for a hanging garden of sweet potatoes. Although it may sound incredibly naïve and totally presumptuous, we would like to think that any small gesture to create something together while apart, to project ourselves forward rather than absorb the stress of the moment, could possibly help coping with the now in solidarity with one another. <a href="http://weallgonnadiebut.com">www.weallgonnadiebut.com</a>',
//     placement: "18,5,1",
//     rotation: "0,0,1",
//     scale: 1},

//     {src:[
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_fit,h_1241,w_1241/v1605525921/8.2_StephanGross_2020_qlh8yb.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605623758/Any_chance_collision_and_I_light_up_in_the_dark_fwwmxi.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_fit,h_842,w_842/v1605623758/Stephan-Gross-critical-mass_ms7rkz.jpg"
//     ],
//     name:"Stephan Groß",
//     title: "",
//     material: '<strong> CRITICAL MASS </strong><br>typographic installation<br>In this graphic I have depicted the term "critical mass" by means of two opposing perspectives, blurring in the middle of the picture. Realized in postcard printing, the work is distributed in the exhibition space as an installation.<br><br><strong>Any chance collision and I light up in the dark</strong><br>collage (85 x 140 cm) which deals with contrasting forms of body control, in a ballet dance as opposed to an industrial turkey farm<br><br><strong>A perfect fit</strong><br> found object artworks based on parts of shop window dummies and a hairdryer, a candle holder and a flower vase <br> ', 
//     description: '',
//     placement: "-10,5,10",
//     rotation: "0,0,1",
//     scale: 0.8,    
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_fit,h_842,w_842/v1605623758/Stephan-Gross-critical-mass_ms7rkz.jpg"
//     },

//     {src:[
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605625253/8.1_JoannieBaumga%CC%88rtner_sheep2020_kplx9o.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525920/8_JoannieBaumga%CC%88rtner_sheep2020_jxaft7.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525936/15.1_JoannieBaumga%CC%88rtner_performance2020_x7nvuk.jpg"
//     ],
//     name:"Joannie Baumgärtner",
//     title: "THE ELEVATOR OF SUCCESS:",
//     material: '<strong> 1) THE ELEVATOR OF SUCCESS: Sheep Yard Elevator For Two Head. </strong>2020 <br> Installation, Video <br> Measurements variable, Duration: 3:20 min. <br> Wood, Concrete, Fabric, Reflective Tape, Ram-Harness, Feeding Bottles, Shepherds Crook, PVC, Rubber <br><br><br><strong> 2) THE ELEVATOR OF SUCCESS: The Bulletproof Sheepskin </strong> 2020 <br>Lecture-Performance<br>Duration: ca. 30 min.<br><br><br> <strong> 3) THE ELEVATOR OF SUCCESS: Sheep yard for two head </strong><br> Installation & Videoloop, 2020, 3:20 min.<br> Measurements variable, Wood, Fabric, Concrete, Beamer, Speaker', 
//     description: '„The Elevator of Success“ is an ongoing work-series that taps into the rhetorics and aesthetics of motivational speakers. During their time at the residency, Baumgärtner has been researching motivational seminars for police officers, taking the law for a fundamental form of „Body Occupation“.Their work employs the prominent metaphor of the police officer as an always watchful sheepdog. Revealing the Evangelist ideology behind the idea of The Good Shepherd and his faithful (canine) servants, Baumgärtners work negates the feeling of duress created by the narration of the wolf at the gates. Asking if safety, guarded and enforced by violence, can actually be considered safety, they want to counter the metaphorical language common in discussions around public security: incredulous of black-sheep-officers, lone-wolf-perpetrators and false hopes for police reform, Baumgärtners work takes a stand for police abolition, highlighting the successful use of protective skills that are owned by the "sheep" themselves.',
//     placement: "21,-3.5,-21",
//     rotation: "0,0.2,1.4",
//     scale: 0.8,
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605625253/8.1_JoannieBaumga%CC%88rtner_sheep2020_kplx9o.jpg"
//     },

  

//     {src:[
//         "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605627672/Paisaje_2_pvimja.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605526049/patria_xmwfl3.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525937/12_MarinaMorshPa%CC%81ez_detail2_zij4ti.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525934/11_MarinaMorshPa%CC%81ez_detail_ehozug.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605627677/Wurst_power_2_xnnrgz.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605627675/paisaje3_lcctvj.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605627674/Justify_vrm4l0.jpg"
//     ],
//     name:"Marina Páez Morsh",
//     title: '<a href="/marinapaezmorsh">PLAY MIND LANDSCAPES HERE</a>',
//     material: '<strong>Oil painting series: Mind Landscapes</strong><br>Oil on canvas, (x2) 40 x50 cm, (x3) 50 x 50 cm, (x1) 50x70 cm<br><br><br> <strong>Acrylics series: Everyday Narrations</strong><br>Acrylic on canvas fabric block, 29,7 x 42 cm<br><strong>"The oven is for buns“</strong> Intervened kitchen utensils, variable measures', 
//     description: 'From the beginning of the still current pandemic, people experimented a chance of forced isolation where mind and body were invaded not only by incertitude and fear but also by information bombardment and manipulation, and at the same time an absolute suppression of individuals freedom in many senses, like a body occupation. <br> The absence of the physical body is what pushed me to start exploring a series of paintings that I address as "Mind Landscapes": non literal narrations of solitude, absurd, stereotypes and consumerism that  take over the scenario. Where or what are you in the picture?<br> Along with these oil paintings, I have also developed a series of acrylic paintings  under the premise "Everyday narrations":  an instant capture of ephemeral thoughts that need to be said in a synthetic, simple way.<br>To extend my work to the use of space, I have intervened a selection of kitchen utensils that I used as canvases, in a re-signification of daily use objects creating a small installation with them: "The oven is for buns".<br>As a global reading of my work exhibited here, there is also an accent put on how painting can be shown and done, an attempt to disassemble the rigid structure that painting carries to open new paths and start exploring different media. <br> ',
//     placement: "-10,3,-10",
//     rotation: "0,0.01,0",
//     scale: 1,
//     },


//     {src:["https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605629500/IMG_9578_tgco5s.jpg"
//      ],
//     name:"Abby Wright",
//     title: "",
//     material: '<strong>Fragmented Conversation With Yourself, Fragmented Conversation With Yourself, The World´s Conversation with Itself, Registering The Void</strong><br>Moving Image<br><br>This moving image is fluctuations between experiencing a series of events and registering the void. It is a jolty narrative/ steam of consciousness re-presented by videos strung together. The human experience is holding on to people and objects to not experience the void. Experience is a series of nonsensical events we hold on to tightly and remember the narrative in memory. This narrative helps you to explain to yourself, “who you are” in an attempt at identifying yourself to have a sense of security and way of relating ourselves to our surroundings. The events help you see everything and nothing in one moment, it is seeing the sun or the moon and contemplating them for my your own thought and writing a poem about them, it is not sad or happy, it is you and me, it is an event and nonsense at the same time. <br><br><video style="width: 100%; object-fit: contain;" controls muted src="https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1605629677/fragmentclip_cjcgg9.webm"> </video> <br><br>',
//     description: '<strong>Walk With Me</strong><br>3 Photographs at 146cm x 120cm<br><br>During the times of political unrest and coronavirus, Lara Orawski and I tied ourselves together and took a photograph in the photoautomat, and then walked across Berlin for 60 minutes, the allotted time we were allowed out of our homes during lockdown. After the 60 minutes of walking together, we documented the remaining rope prints after we untied ourselves in a different photoautomat. We had to balance off of each other, and fit through doors. The rope I used to tie us together was knotted very tightly, to show a intense and secure bond to re-present making something we were experiencing that’s non-physical, and bringing it into the physical plane.',
//     placement: "5, 5, 40",
//     rotation: "0,0.01,0",
//     scale: 0.9,
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605629500/IMG_9578_tgco5s.jpg"
//     },

//     {src:[],
//     name:"Shannon Turner",
//     title: "Standing Up (Ruderal Growth)",
//     material: 'Experimental Video, 10:00 min',
//     description: 'Based on an ongoing collaboration between visual anthropologist Shannon Turner and butoh dancer Stefano Taiuti investigating the relationship of the butoh body to urban landscape and architecture: how the body is transformed by these infrastructural impositions and can in turn transform the social and aesthetic conventions of public spaces. More broadly, the project inquires how bodies co-exist in urban spaces, which bodies are considered legitimate, and how individual disruption of the habitual might contaminate and proliferate on a collective scale. Traditionally performed on stage, in a public context butoh becomes an interventionist practice, a queer ecology spontaneously bursting forth through cracks in the urban concrete, reclaiming territory colonised by concrete and orderly park pathways. The ritual transmutation of the butoh body interrogates cultural norms of time, form, and movement in social space, suggesting the possibility different kinds of bodies and temporalities by attuning to sensations of the present.<br><br><br><br><video style="width: 100%; object-fit: contain;" controls muted src="https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1605629662/Standing_Up_-_cut_yxpxxk.mp4"> </video>',
//     placement: "-34, -3, 2",
//     rotation: "1,0.5,0",
//     scale: 0.7,
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605694207/Screenshot_2020-11-18_at_11.09.54_d07e4q.jpg"
//     },

//     {src:[
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525926/10_BranislavJancic_untitled2020_detail_jkpssw.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605695454/body_occupation-tc-9_wlxm2v.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525930/9_room1_ukpwev.jpg"],
//     name:"Branislav Jankic",
//     title: "Untitled",
//     material: 'Cast Copper, ceramics, wood, steal, styrefoam',
//     description: 'Artwork commissioned by Moritz Grub',
//     placement: "-30, -2, -10",
//     rotation: "0,0.5,-1",
//     scale: 0.5,
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605525926/10_BranislavJancic_untitled2020_detail_jkpssw.jpg"
//     },

//     {src:[
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605696409/body_occupation-tc-32_mn1czk.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605696407/body_occupation-tc-28_rqoywu.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605696410/body_occupation-tc-33_dhugtr.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605696408/body_occupation-tc-27_vtdeyv.jpg"],
//     name:"Francesco Petruccelli",
//     title: "Fishman (2020)",
//     material: 'Garbage bags, wire and fire',
//     description: '',
//     placement: "-18, -4, 40",
//     rotation: "1,0.5,0",
//     scale: 0.7,
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605696408/body_occupation-tc-27_vtdeyv.jpg"
//     },

//      {src:["https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605702103/body_occupation-tc-73_ltmscx.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605702103/body_occupation-tc-73_ltmscx.jpg",
//     "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605702105/body_occupation-tc-72_cuu9gs.jpg"],
//     name:"Katharina Bévand",
//     title: "untitled",
//     material: 'Moving Sound Sculpture',
//     description: '    <video style="width: 100%; object-fit: contain;" controls muted src="https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1605783920/WhatsApp_Video_2020-11-18_at_23.59.07_yqeffr.mp4"> </video> ',
//     placement: "-42, -8, 15",
//     rotation: "1,0.5,0",
//     scale: 0.3,
//     surface: "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1605702105/body_occupation-tc-72_cuu9gs.jpg"
// }


   

]
var instructions = document.getElementById( 'buttons' );

var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = 0.2;
var restDistance = 25;

var GRAVITY = 981 * 1.4;
var gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );

var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;
var windForce = new THREE.Vector3( 0, 0, 0 );

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


const loader = new GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);


textureLoader.crossOrigin = "Anonymous";

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

init();
animate(0);

function init() {

    scene = new THREE.Scene();
    clock = new THREE.Clock();
    sun = new THREE.Vector3();

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 10, 100, 100 );

   
    // controls = new OrbitControls(camera, document.body);
    // controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    //         controls.dampingFactor = 0.05;

    //         controls.screenSpacePanning = false;

    //         controls.minDistance = 100;
    //         controls.maxDistance = 500;
   
    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
   
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    canvas.appendChild( renderer.domElement );

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
            sunColor: 0x2CFC0A,
            waterColor: 0x2CFC0A,
            distortionScale: 3.5       }
    );

    water.rotation.x = - Math.PI / 2;
    water.position.y = -20;
    scene.add( water );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        inclination: 0.49,
        azimuth: 0.01
    };

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

    const geometry = new THREE.BoxBufferGeometry( 5, 5, 5 );
    for ( let i = 0; i < images.length; i ++ ) {
        let boxMaterial;
        if(images[i].src.length>5){
            boxMaterial = [
                new THREE.MeshBasicMaterial({map: textureLoader.load(images[i].src[0])}),
                new THREE.MeshBasicMaterial({map: textureLoader.load(images[i].src[1])}),
                new THREE.MeshBasicMaterial({map: textureLoader.load(images[i].src[2])}),
                new THREE.MeshBasicMaterial({map: textureLoader.load(images[i].src[3])}),
                new THREE.MeshBasicMaterial({map: textureLoader.load(images[i].src[4])}),
                new THREE.MeshBasicMaterial({map: textureLoader.load(images[i].src[5])}),
            ];

        } else if(images[i].surface){
            let texture = textureLoader.load(images[i].surface);
            boxMaterial = new THREE.MeshBasicMaterial({ map: texture });
        } 
       
        const object = new THREE.Mesh( geometry, boxMaterial);

        placeObject(object, images[i].placement, images[i].rotation, images[i].scale);

        object.userData = {name: images[i].name, title: images[i].title, material: images[i].material, description: images[i].description, images: images[i].src}

        scene.add( object );

    }
   
    createFlag('/wp-content/themes/house_of_killing/images/waternormals.jpg', 15, 15, 1.5, 100, 200, 100);

    addObjects( '/wp-content/themes/house_of_killing/images/tent/scene.gltf', -1, -20, -2, 10, true);

    addObjects( '/wp-content/themes/house_of_killing/images/remains/scene.gltf', -50, -28, 0, 19, false);
    addObjects( '/wp-content/themes/house_of_killing/images/sims/scene.gltf', 39, 0, -45, 0.01, false, true);

     
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    window.addEventListener( 'resize', onWindowResize, false );

    renderer.domElement.addEventListener('click', onClick, false);


    document.getElementById("closingbutton").addEventListener("click", closeInfoBox, false)
  

}

function addObjects(url,x,y,z, scale, rotate, rotation){
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
        // rayCaster.intersectObjects( model.children, true )
    }
    if(rotation===true){
        objects.push(model)
        // rayCaster.intersectObjects( model.children, true )
    }
   
    scene.add( model );

    }, onProgress, onError );

}


function rotateObject(object, degreeX, degreeY, degreeZ) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
}

function placeObject(object, placement, rotation, scale){
    let coordinates = placement.split(",");

    object.position.x = coordinates[0];
    object.position.y = -20;
    object.position.z = coordinates[2];

    let spin = rotation.split(",");

    object.rotation.x = spin[0];
    object.rotation.y = spin[1];
    object.rotation.z = spin[2];
   
    object.castShadow = true;
    object.receiveShadow = true;

    object.scale.x = scale;
    object.scale.y = scale;
    object.scale.z = scale;
}

function onClick() {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {

    if(intersects[0].object.userData.name){
        // window.open(intersects[0].object.userData.URL);

        let infobox = document.getElementById("infobox");
        document.getElementById("artist-name").innerHTML = intersects[0].object.userData.name
        document.getElementById("material").innerHTML = intersects[0].object.userData.material
        document.getElementById("description").innerHTML = intersects[0].object.userData.description
        document.getElementById("artwork").innerHTML = intersects[0].object.userData.title
        document.getElementById("images").innerHTML = "";
        
        for (let index = 0; index <  intersects[0].object.userData.images.length; index++) {
            document.getElementById("images").innerHTML += "<img src=" + intersects[0].object.userData.images[index].replace("jpg", "jpg") + " alt='this content is missing for u'/>";
        }
        infobox.style.display = "block";  

  
    } else {
        closeInfoBox();
    
    }
  

   

  }

}


function closeInfoBox(){
    let infobox = document.getElementById("infobox");
    infobox.style.display = "none";
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

function animate(now) {
    // controls.update();
    for (let index = 0; index < cloths.length; index++) {
        const element = cloths[index];
        simulate( now, element, clothGeometries[index],  element.xvalue, element.yvalue, element.zvalue);
   
        
    }
    requestAnimationFrame( animate );

    render();
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