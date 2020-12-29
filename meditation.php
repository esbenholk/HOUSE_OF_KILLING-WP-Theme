<?php /* Template Name: meditation visualisation */ ?>


<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 *@package HOUSE_OF_KILLING
 */

get_header(); ?>

<?php
    $my_excerpt = get_the_excerpt();
     if($my_excerpt !='') {
        $my_excerpt = $my_excerpt;
     } else{
        $my_excerpt = "";
     }
?>

<?php $src = get_stylesheet_directory_uri().'/js/audio-bloom.js';?>

<script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js
"></script>

<script type="module" src="<?php echo esc_url($src); ?>"></script>


<div id="threeDfrontpage" class="page col-md-12">
    
    <div id='loading-screen' class="loading-container-pink">
            <div id="loading-status" class="loading-circle green">
                <div class="loader green" id="startbutton"> 
                </div>
                <div class="start-info" >
                        <p>meditation</p>
                        <p>click to start</p>
                </div>
            </div>
    </div>
	
	<div id="canvas" class="online-exhibition-canvas">
       
        <div class="instruction" id="audio-container">	
					<div class="absolute left flex-row">
						<div class="dot"></div>
						<div class="dot"></div>
					</div>
					<p>
						<p id="project-title">
							<?php echo $my_excerpt ?>

						</p>

					</p>
				
			</div>	


    </div>
			
	<?php while ( have_posts() ) : the_post(); ?>

		<div class="site-content">
           
           
		
            <p><?php the_content() ?></p>
          

		</div>

	<?php endwhile; // End of the loop. ?>


    
    
											
</div>


	

		


	
<?php get_footer(); ?>

<script type="x-shader/x-vertex" id="vertexshader">

varying vec2 vUv;

void main() {

	vUv = uv;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}

</script>

<script type="x-shader/x-fragment" id="fragmentshader">

uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;

varying vec2 vUv;

void main() {

	gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

}

</script>

	

		


