<?php
/**
 * HOUSE_of_KILLLING functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package HOUSE_of_KILLLING
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

if ( ! function_exists( 'house_of_killing_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function house_of_killing_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on HOUSE_of_KILLLING, use a find and replace
		 * to change 'house_of_killing' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'house_of_killing', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'primary' => esc_html__( 'primary', 'house_of_killing' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Set up the WordPress core custom background feature.
		add_theme_support(
			'custom-background',
			apply_filters(
				'house_of_killing_custom_background_args',
				array(
					'default-color' => 'ffffff',
					'default-image' => '',
				)
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'house_of_killing_setup' );

function create_posttype() {

	register_post_type( 'Collab',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Collabs' ),
                'singular_name' => __( 'Collab' )
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'feat'),
			'show_in_rest' => true,
			'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt')

 
        )
	);

	register_post_type( 'Project',
    // CPT Options
        array(
            'labels' => array(
                'name' => __( 'Projects' ),
                'singular_name' => __( 'Project' )
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'projects'),
			'show_in_rest' => true,
			'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt' )

 
        )
	);

}
add_action( 'init', 'create_posttype' );

add_post_type_support( 'page', 'excerpt' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function house_of_killing_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'house_of_killing_content_width', 640 );
}
add_action( 'after_setup_theme', 'house_of_killing_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function house_of_killing_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'house_of_killing' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'house_of_killing' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);


	register_sidebar(array(
		'name' => 'Sidebar 2',
		'id' => 'sidebar-2',
		'description'   => esc_html__( 'Add widgets here.', 'house_of_killing' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	));

}
add_action( 'widgets_init', 'house_of_killing_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function house_of_killing_scripts() {
	wp_enqueue_style( 'house_of_killing-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'house_of_killing-style', 'rtl', 'replace' );

	wp_enqueue_script( 'house_of_killing-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );

	wp_enqueue_script( 'tickers', get_template_directory_uri() . '/js/tickers.js', array('jquery'), true );
	wp_enqueue_script( 'eyes', get_template_directory_uri() . '/js/eyes.js', array('jquery'), true );
	wp_enqueue_script( 'script', get_template_directory_uri() . '/js/script.js', array('jquery'), true );
}
add_action( 'wp_enqueue_scripts', 'house_of_killing_scripts' );



/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

