<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package HOUSE_of_KILLLING
 */

get_header();
?>

<?php $src = get_stylesheet_directory_uri().'/js/tube.js';?>

<script type="module" src="<?php echo esc_url($src); ?>"></script>



<div id="canvas" class="canvas-background"> </div>

<main id="primary" class="site-main page-main">
		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content', 'page' );

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php
get_footer();

?>
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
