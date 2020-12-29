<?php /* Template Name: tarot landscape */ ?>


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

<?php $src = get_stylesheet_directory_uri().'/js/tarot-landscape.js';?>

<?php
    $my_excerpt = get_the_excerpt();
     if($my_excerpt !='') {
        $my_excerpt = $my_excerpt;
     } else{
        $my_excerpt = "Jennifer Aniston Superfans™️ Digital Tarot Landscape™️";
     }
?>

<script type="module" src="<?php echo esc_url($src); ?>"></script>

<div id="threeDfrontpage" class="page col-md-12">
	<div  id='loading-screen' class="loading-container">
				<div id="loading-status" class="loading-circle">
					<div class="loader">
						<p>loading... <br>
						</p>
					</div>
				</div>
	</div>
	
	<div id="canvas" class="online-exhibition-canvas">

        <div class="instruction">	
					<div class="absolute left flex-row">
						<div class="dot"></div>
						<div class="dot"></div>
					</div>
					<a> <?php echo $my_excerpt ?> </a>
					<button id="start">start</button>
					
				
			</div>	


    </div>
			
	<?php while ( have_posts() ) : the_post(); ?>

		<div class="site-content">
           
           
		
            <p><?php the_content() ?></p>
          

		</div>

	<?php endwhile; // End of the loop. ?>

   

    
    
											
</div>


	

		


	
<?php get_footer(); ?>


	

		


