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
         
               <div style="display:none">
                  <?php the_post_thumbnail(); ?>
               </div>


               <a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark">

                  <?php the_title( sprintf( '<h2 id="post-title" class="grow">', esc_url( get_permalink() ) ), '</h2>' ); ?>

                </a>
        </div><!-- /post-image -->
<?php endif; ?>



