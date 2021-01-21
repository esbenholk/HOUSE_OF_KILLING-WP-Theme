<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package inku
 */

?>

<?php if ( has_post_thumbnail() ) : ?>
		<div class="teaser">
            <a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark">  
               <div class="thumbnail">
                  <?php the_post_thumbnail(); ?>
                  <?php the_title( sprintf( '<h2 id="post-title" class="grow">', esc_url( get_permalink() ) ), '</h2>' ); ?>
               </div>
            </a>

              
        </div><!-- /post-image -->
<?php endif; ?>



