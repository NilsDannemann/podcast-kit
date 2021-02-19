<?php
	
	header("Content-Type: image/jpeg");
	
	// Define Paths
	$plugin_dir = dirname(__FILE__);

	// Define adjustable Settings
	$quality 	  	= 75;
	$canvas_width 	= (string) isset($_GET['width']) ? $_GET['width'] : 300;
	$canvas_height 	= (string) isset($_GET['height']) ? $_GET['height'] : 300;
	$background   	= (string) isset($_GET['background']) ? explode(",",hex2rgb($_GET['background'])) : explode(",",hex2rgb('ffffff'));
	$image  	 	= (string) isset($_GET['image']) ? $_GET['image'] : $plugin_dir.'/images/pk-placeholder-transparent.png';
	$tagline 		= (string) isset($_GET['tagline']) ? $_GET['tagline'] : '';
	$tagline_color 	= (string) isset($_GET['tagline_color']) ? explode(",",hex2rgb($_GET['tagline_color'])) : explode(",",hex2rgb('ffffff'));
	$tagline_size  	= (string) isset($_GET['tagline_size']) ? $_GET['tagline_size'] : 50;
	$tagline_font  	= (string) isset($_GET['tagline_font']) ? './fonts/'.$_GET['tagline_font'].'.ttf' : './fonts/roboto-regular.ttf';
	$title 		  	= (string) isset($_GET['title']) ? $_GET['title'] : '';
	$title_color  	= (string) isset($_GET['title_color']) ? explode(",",hex2rgb($_GET['title_color'])) : explode(",",hex2rgb('ffffff'));
	$title_size   	= (string) isset($_GET['title_size']) ? $_GET['title_size'] : 100;
	$title_font  	= (string) isset($_GET['title_font']) ? './fonts/'.$_GET['title_font'].'.ttf' : './fonts/roboto-regular.ttf';
	$text 		  	= (string) isset($_GET['text']) ? $_GET['text'] : '';
	$text_color   	= (string) isset($_GET['text_color']) ? explode(",",hex2rgb($_GET['text_color'])) : explode(",",hex2rgb('ffffff'));
	$text_size   	= (string) isset($_GET['text_size']) ? $_GET['text_size'] : 25;
	$text_font 	 	= (string) isset($_GET['text_font']) ? './fonts/'.$_GET['text_font'].'.ttf' : './fonts/roboto-regular.ttf';


	// Draw Canvas
	$canvas = @imagecreatetruecolor($canvas_width, $canvas_height) or die("Cannot Initialize new GD image stream");

	// Prepare Settings for Canvas
	$background_color = imagecolorallocate($canvas, $background[0], $background[1], $background[2]);

	// Image to Canvas
	$image_object 		 = imagecreatefromstring(file_get_contents($image));
	$image_object_width  = imagesx($image_object);
	$image_object_height = imagesy($image_object);
	$image_object_width_fit  = $canvas_width;
	$image_object_height_fit  = $canvas_height;

	if ($image_object_width > $image_object_height) {
		// Case: Horizontal Image detected
		$image_object_height_fit  = $canvas_height; // Set max HEIGHT to canvas max
		$aspect_ratio = $image_object_width / $image_object_height; // Get WIDTH by aspect ratio
		$image_object_width_fit  = $image_object_height_fit * $aspect_ratio;
	} else {
		// Case: Vertical Image detected
		$image_object_width_fit  = $canvas_width; // Set max WIDTH to canvas max
		$aspect_ratio = $image_object_height / $image_object_width; // Get HEIGHT by aspect ratio
		$image_object_height_fit  = $image_object_width_fit * $aspect_ratio;
	}
	// Add to Canvas
	imagecopyresized(
		$canvas, //dst
		$image_object, //src
		($canvas_width/2)-($image_object_width_fit/2), // dst_x
		($canvas_height/2)-($image_object_height_fit/2), // dst_y
		0, // src_x
		0, // src_y
		$image_object_width_fit, // dst_w (new width)
		$image_object_height_fit, // dst_h (new height)
		$image_object_width, // src_w
		$image_object_height // src_h
	);

	// Tagline to Canvas
	$tagline_color = imagecolorallocate($canvas, $tagline_color[0], $tagline_color[1], $tagline_color[2]);
	$tagline_box = imagettfbbox($tagline_size, 0, $tagline_font, $tagline);
	$x = $tagline_box[0] + ($canvas_width / 2) - ($tagline_box[4] / 2); // Preset: Horizontally centered
	$y = $tagline_box[1] + ($canvas_height / 2) - ($tagline_box[5] / 2); // Preset: Vertically centered
	// Add to Canvas
	imagettftext($canvas, $tagline_size, 0, $x, $y, $tagline_color, $tagline_font, $tagline);

	// Title to Canvas
	$title_color = imagecolorallocate($canvas, $title_color[0], $title_color[1], $title_color[2]);
	$title_box = imagettfbbox($title_size, 0, $title_font, $title);
	$x = $title_box[0] + ($canvas_width / 2) - ($title_box[4] / 2); // Preset: Horizontally centered
	$y = $title_box[1] + ($canvas_height / 2) - ($title_box[5] / 2); // Preset: Vertically centered
	// Write to Canvas
	imagettftext($canvas, $title_size, 0, $x, $y, $title_color, $title_font, $title);
	
	// Text to Canvas
	$text_box = imagettfbbox($text_size, 0, $text_font, $text);
	$text_color = imagecolorallocate($canvas, $text_color[0], $text_color[1], $text_color[2]);
	$x = $text_box[0] + ($canvas_width / 2) - ($text_box[4] / 2); // Preset: Horizontally centered
	$y = $text_box[1] + ($canvas_height / 2) - ($text_box[5] / 2); // Preset: Horizontally centered
	// Add to Canvas
	imagettftext($canvas, $text_size, 0, $x, $y, $text_color, $text_font, $text);

	// Generate Output
	imagejpeg($canvas, NULL, $quality);
	imagedestroy($canvas);


	// Helper Functions
	function hex2rgb($hex) {
	   $hex = str_replace("#", "", $hex);

	   switch (strlen($hex)) {
	       case 1:
	           $hex = $hex.$hex;
	       case 2:
	          $r = hexdec($hex);
	          $g = hexdec($hex);
	          $b = hexdec($hex);
	           break;
	       case 3:
	          $r = hexdec(substr($hex,0,1).substr($hex,0,1));
	          $g = hexdec(substr($hex,1,1).substr($hex,1,1));
	          $b = hexdec(substr($hex,2,1).substr($hex,2,1));
	           break;
	       default:
	          $r = hexdec(substr($hex,0,2));
	          $g = hexdec(substr($hex,2,2));
	          $b = hexdec(substr($hex,4,2));
	           break;
	   }
	   $rgb = array($r, $g, $b);
	   return implode(",", $rgb);
	}

?>