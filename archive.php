<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package inkubator
 */

get_header();
?>


<main id="primary" class="site-main" id="archive-page">
		<?php $src = get_stylesheet_directory_uri().'/js/raycast-picker-bloom.js';?>

		<script type="module" src="<?php echo esc_url($src); ?>"></script>

		<div class="relative">

			<div  id='loading-screen' class="loading-container">
						<div  class="loading-circle">
							<div class="loader">
								<p>loading... <br>
								</p>
							</div>
						</div>
			</div>
			<div id="loading-status"></id>

			<div id="canvas" class="online-exhibition-canvas"></div>
			<p id="canvas-title"></p>

		
			<div class="fixed media-relative">
				<div id="archive">
					<?php if ( have_posts() ) : ?>
						<?php
						/* Start the Loop */
						while ( have_posts() ) :
							the_post();

							// /*
							// * Include the Post-Type-specific template for the content.
							// * If you want to override this in a child theme, then include a file
							// * called content-___.php (where ___ is the Post Type name) and that will be used instead.
							// */
							get_template_part( 'template-parts/archive-item', get_post_type() );

							?>
								

						<?php

						endwhile;
						

					else :

						get_template_part( 'template-parts/content', 'none' );

					endif;
					?>
				</div>
			</div>
		
		
		</div>	




		
</main><!-- #main -->





<div id="crystal" >	
	<div class="flex-row right absolute">
		<div class="dot"></div>
		<div class="dot"></div>
		<div class="dot"></div>
	</div>

	<img  src="https://stayvirtual.s3.amazonaws.com/crystals/greencrystal">

</div>




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
