<?php /* Template Name: world example */ ?>



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

?>

<style>
    canvas{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

</style>



<?php $src = get_stylesheet_directory_uri().'/js/lightbloom-controls.js';?>
<script type="module" src="<?php echo esc_url($src); ?>"></script>

<div id="threeDfrontpage" class="col-md-12">
    <div  id='loading-screen' class="loading-container">
            <div id="loading-status" class="loading-circle">
                <div class="loader">
                    <p>loading... <br>
                    </p>
                </div>
            </div>
    </div>

    <div id="canvas-container">
		<canvas id="HTMLcanvas"></canvas>
	</div>
	
	<div id="canvas" class="online-exhibition-canvas">
        <canvas id="c" style="width:100%;height:100%;"></canvas>
        <p id="canvas-title">avatar island</p>

        <div id="canvas-details">
            <div class="instruction neon-box">	
                        <div class="absolute left flex-row">
                            <div class="dot neon-box"></div>
                            <div class="dot neon-box"></div>
                        </div>
                        <p>
                            <p id="project-title">
                                <?php echo $my_excerpt ?>
                            </p>

                        </p>
                    
            </div>
        </div>	
        



    </div>
			


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

    
    
											
</div>


	

		


	
<?php get_footer(); ?>


	
