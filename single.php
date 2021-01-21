<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package HOUSE_of_KILLLING
 * 
 * 
 * 

 */
get_header();
?>
	<main id="primary" class="site-main">


		<div class="relative">

		
			<div id="single-project" class="site-content">
			

				<div class="post-menu">
					<div id="post-archive">
						<?php if ( !function_exists('dynamic_sidebar') || !dynamic_sidebar('sidebar-2') ) ?>
					</div>
				</div>


				<div id="crystal" class="neon-box">	
					<div class="flex-row right absolute ">
						<div class="dot neon-box"></div>
					</div>

					<img  src="https://stayvirtual.s3.amazonaws.com/crystals/greencrystal">

				</div>

			
				<div class="post-container">

					<?php
						while ( have_posts() ) :
							the_post();

							get_template_part( 'template-parts/content', get_post_type() );
						

						endwhile; // End of the loop.
					?>

					<div class="height"></div>

					
				</div>	
			</div>	


		</div>	

	</main><!-- #main -->




