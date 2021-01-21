<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 *@package HOUSE_OF_KILLING
 */

?>
            

            </div><!-- .row -->

    </div><!-- .container -->

</main><!-- #main -->





<div id="crystal" class="neon-box">	
	<div class="flex-row right absolute">
		<div class="dot neon-box"></div>
		<div class="dot neon-box"></div>
		<div class="dot neon-box"></div>
	</div>

	<img  src="https://stayvirtual.s3.amazonaws.com/crystals/greencrystal">

</div>

<?php
    $my_excerpt = get_the_excerpt();
     if($my_excerpt !='') {
        $my_excerpt = $my_excerpt;
     } else{
        $my_excerpt = "HOUSE OF KILLING feat Esben Holk";
     }
?>

<footer id="footer">
		<div style="width: 100%">

			<div id="imagecontainer">
					<img id="image1" class="square vhs-flicker" src="">
					<div id="buttoncontainer">
						<img id="image2"class="rect vhs-flicker" src="">
						<div class="flex-row right absolute">
							<div class="dot neon-box"></div>
							<div class="dot neon-box"></div>
						</div>
						<p id="remix" class="grow neon-box">remix</p>
					</div>
			</div>

			<?php get_sidebar();?>
		</div>
		
	
	<div id="ticker2" class="vhs-flicker neon-box">
        <div class="headlines">
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
			<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>
        	<a href="/" class="ticker-object"> <?php echo $my_excerpt ?> </a>


                                

        </div>
                        
    </div>
</footer>
        



</body>


</html>
