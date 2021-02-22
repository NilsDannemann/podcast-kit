<?php

/**
 *
 * Shortcode: Asset Generator
 *
 */
function pk_asset_generator_handler( $atts ) {
	extract(shortcode_atts(array(
		'style'  => '',
		'class'  => '',
	), $atts));

	// Define Paths
	$plugin_dir = get_stylesheet_directory_uri().'/pk-asset-generator';
	$image_generator = $plugin_dir . '/image-generator.php';

	// Add Styles
	wp_enqueue_style( 'asset-generator', $plugin_dir . '/style.min.css' );

	// Set Defaults
	// PNG Sample from unspash: https://images.unsplash.com/photo-1593642634315-48f5414c3ad9
	// PNG Sample from unspash: https://images.unsplash.com/photo-1531347334762-59780ece5c76
	// JPG Sample: https://budgetstockphoto.com/samples/pics/padlock.jpg
	// Long Sample: https://podcast-kit.com/wp-content/uploads/1500x1000.jpg
	// Hight Sample: https://podcast-kit.com/wp-content/uploads/1000x1500.jpg
	// Placeholder Sample: https://podcast-kit.com/wp-content/uploads/placeholder-1440x960-1.jpeg
	$params = '
		?width=1080
		&height=1080
		&background=745EA6
		&image=https://podcast-kit.com/wp-content/uploads/placeholder-1440x960-1.jpeg
		&waveform=true
		&waveform_detail=8
		&tagline=Tagline
		&tagline_size=50
		&tagline_color=F7745D
		&tagline_font=roboto-bold
		&title=HEADLINE
		&title_size=100
		&title_color=273742
		&title_font=roboto-bold
		&text=Lorem ipsum dolor sit amet.
		&text_size=20
		&text_color=4191F2
		&text_font=nunito-bold
		&quality=85
	';

	// Set Style Modifiers: Spinner
	$style .= ' background-image: url('.$plugin_dir.'/images/spinner-primary-lightest.svg); ';

	$output = '
		<div class="asset-generator">
			<div class="asset-generator__canvas '.$class.'" style="'.$style.'">' 
				. '<img src="'.$image_generator.$params.'">' . 
			'</div>
		</div>';
	
	return $output;
}
add_shortcode( 'pk_asset_generator', 'pk_asset_generator_handler' );