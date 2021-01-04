<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 *@package HOUSE_OF_KILLING
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="stylesheet" href="http://d2v52k3cl9vedd.cloudfront.net/vhs/0.1.0/vhs.min.css">


<!-- WP_Head -->
<?php wp_head(); 
    $image = wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'large');?>
    <!-- End WP_Head -->
    <meta property="og:image" content="<?php echo $image; ?>" />
    <meta name="twitter:image" content="<?php echo $image; ?>" />
</head>

<body>
<div class="inku-preloader">
</div>


<?php
    $my_excerpt = get_the_excerpt();
     if($my_excerpt !='') {
        $my_excerpt = $my_excerpt;
     } else{
        $my_excerpt = "Esben Holk @ HOUSE OF KILLING";
     }
?>
<header id="header" class="site-header ">
            <div class="flex-row">
                        <button class="nav-btn"" id="nav-btn" type="button" class="menu-toggle" data-toggle="collapse" aria-controls="primary-menu" aria-expanded="false">
                            <div class="eyes">   
                                <div class="eye">
                                            <div class="ball"></div>
                                            <div class="lid"></div>
                                </div>

                                        <div class="eye">
                                            <div class="ball"></div>
                                            <div class="lid"></div>
                                    </div>   
                            </div>
                        </button>  
   
                        <div id="ticker1" class="vhs-flicker">
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

                                

                              

                            </div>
                        
                        </div>
            <div>


			<div class="column" >
			<div id="licking" class="flex-row">
				<div class="flex-row right absolute">
					<div class="dot"></div>
					<div class="dot"></div>
				</div>
				
				<img id="sexy-object"  src="/wp-content/themes/house_of_killing/icons/missing-file-icon.png">
				<img id="lick"  src="https://stayvirtual.s3.amazonaws.com/licking-transparant-crop">
			</div>
		
			<div class="flex-row right icons">
		
				<!-- <img src="/wp-content/themes/house_of_killing/icons/hokmin.png"/>
				<img src="/wp-content/themes/house_of_killing/icons/hokmin.png"/> -->
			
			</div>
			

                
</header>

<div class="main-menu">                                          
     <nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Main Menu', 'house_of_killing' ); ?>">
             
            <?php wp_nav_menu( array(
                        'theme_location' => 'primary',
						'menu_id'        => 'primary-menu',
						'depth' => '1'
             ) ); ?>



                       
    </nav><!-- #site-navigation -->
                    
</div>



         


<main id="main" class="site-main">

    <div id="container" class="container">

         <div class="row">