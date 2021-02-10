<?php
/**
 * The template for displaying all single posts (pdf booklets)
 * and other stuff
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package HOUSE_of_KILLLING
 * 
 * 
 * 

 */
get_header();
?>
	<main id="primary" class="site-main centering">

		
			<div id="single-post" class="site-content">
			

		


				<div id="crystal" class="neon-box">	
					<div class="flex-row right absolute ">
						<div class="dot neon-box"></div>
					</div>

					<img  src="https://stayvirtual.s3.amazonaws.com/crystals/greencrystal">

				</div>

			

					<?php
						while ( have_posts() ) :
							the_post();

							get_template_part( 'template-parts/booklet', get_post_type() );
						

						endwhile; // End of the loop.
					?>


					
				
			</div>	

	</main><!-- #main -->




