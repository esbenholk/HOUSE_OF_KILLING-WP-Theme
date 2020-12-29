<?php /* Template Name: glitch city */ ?>


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

<?php $src = get_stylesheet_directory_uri().'/js/city.js';?>

<script src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/p5.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/addons/p5.dom.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js'></script>

<script type="module" src="<?php echo esc_url($src); ?>"></script>

<div id="threeDfrontpage" class="page col-md-12">
    <!-- <div  id='loading-screen' class="loading-container">
            <div id="loading-status" class="loading-circle">
                <div class="loader">
                    <p>loading... <br>
                    </p>
                </div>
            </div>
	</div> -->
	<div id="canvas-container">
		<canvas id="HTMLcanvas"></canvas>
	</div>
	
	<div id="canvas" class="online-exhibition-canvas">
       
        <div class="instruction">	
					<div class="absolute left flex-row">
						<div class="dot"></div>
						<div class="dot"></div>
					</div>
					<p>
						<p id="project-title">
							
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


	

		


