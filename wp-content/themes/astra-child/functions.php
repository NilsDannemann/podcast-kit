<?php
/**
 * Astra Child Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Astra Child
 * @since 1.0.0
 */

/**
 * Define Constants
 */
define( 'CHILD_THEME_ASTRA_CHILD_VERSION', '1.0.0' );

/**
 * Enqueue styles
 */
function child_enqueue_styles() {

	wp_enqueue_style( 'astra-child-theme-css', get_stylesheet_directory_uri() . '/style.css', array('astra-theme-css'), CHILD_THEME_ASTRA_CHILD_VERSION, 'all' );

}

add_action( 'wp_enqueue_scripts', 'child_enqueue_styles', 15 );



/**
 *
 * Shortcode: Asset Generator
 *
 */
function pk_asset_generator_handler( $atts ) {
	extract(shortcode_atts(array(
		'type'   => '',
		'color'  => '',
		'style'  => '',
		'class'  => '',
	), $atts));

	// Set Defaults
	// PNG Sample from unspash: https://images.unsplash.com/photo-1593642634315-48f5414c3ad9
	// JPG Sample: https://budgetstockphoto.com/samples/pics/padlock.jpg
	// Placeholder Sample: https://podcast-kit.com/wp-content/uploads/placeholder-1440x960-1.jpeg
	$script = get_stylesheet_directory_uri().'/pk-asset-generator.php';
	$params = '
		?width=1080
		&height=1080
		&background=745EA6
		&background_image=https://budgetstockphoto.com/samples/pics/padlock.jpg
		&title_color=000000
		&text_color=4191F2
		&title=HEADLINE
		&text=Lorem ipsum dolor sit amet.
	';

	// Create Style Modifiers
	if ( $color ) { 
		$style .= ' --pk_ui_primary_color: ' . $color . '; ';
	}

	$output = '
		<div class="label '.$class.'" style="'.$style.'">' 
			. '<img src="'.$script.$params.'">' . 
		'</div>';
	
	return $output;
}
add_shortcode( 'pk_asset_generator', 'pk_asset_generator_handler' );