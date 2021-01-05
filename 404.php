<?php
/**
 * The template for displaying 404 error
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


<div id="canvas" class="canvas-background"> 

</div>

<main id="primary" class="error-main">
	<div class="error">
		<a href="/"><img src="/wp-content/themes/house_of_killing/icons/ghosticon.png"/></a></p>

		
	</div>
</main><!-- #main -->

<?php
get_footer();

?>

