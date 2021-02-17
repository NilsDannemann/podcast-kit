<?php
	
	header("Content-Type: image/png");
	
	// Define Fonts
	$font = './pk-font.ttf';

	// Define Params
	$width 	  	 		= (string) isset($_GET['width']) ? $_GET['width'] : 300;
	$height 	 		= (string) isset($_GET['height']) ? $_GET['height'] : 300;
	$background  		= (string) isset($_GET['background']) ? explode(",",hex2rgb($_GET['background'])) : explode(",",hex2rgb('ffffff'));
	$background_image  	= (string) isset($_GET['background_image']) ? $_GET['background_image'] : 'pk-placeholder-transparent';
	$title 		 		= (string) isset($_GET['title']) ? $_GET['title'] : '';
	$title_color 		= (string) isset($_GET['title_color']) ? explode(",",hex2rgb($_GET['title_color'])) : explode(",",hex2rgb('ffffff'));
	$title_size  		= 40;
	$text 		 		= (string) isset($_GET['text']) ? $_GET['text'] : '';
	$text_color  		= (string) isset($_GET['text_color']) ? explode(",",hex2rgb($_GET['text_color'])) : explode(",",hex2rgb('ffffff'));
	$text_size   		= 20;

	// Draw Image
	$image = @imagecreate($width, $height)
	    or die("Cannot Initialize new GD image stream");

	// Convert Params
	$background_color = imagecolorallocate($image, $background[0], $background[1], $background[2]);
	$title_color = imagecolorallocate($image, $title_color[0], $title_color[1], $title_color[2]);
	$text_color = imagecolorallocate($image, $text_color[0], $text_color[1], $text_color[2]);


	// Add Background Image
	$background_image_object = imagecreatefrompng($background_image . '.png');
	imagecopyresized($image, $background_image_object, 0, 0, 0, 0, $width*2, $height*2, $width, $height);


	// Create Bounding Box: Title
	$title_box = imagettfbbox($title_size, 0, $font, $title);
	// Cordinates for X and Y
	$x = $title_box[0] + (imagesx($image) / 2) - ($title_box[4] / 2); // Preset: Horizontally centered
	$y = $title_box[1] + (imagesy($image) / 2) - ($title_box[5] / 2); // Preset: Vertically centered
	// Write to Image
	imagettftext($image, $title_size, 0, $x, $y, $title_color, $font, $title);
	
	// Create Bounding Box: Text
	$text_box = imagettfbbox($text_size, 0, $font, $text);
	// Cordinates for X and Y
	$x = $text_box[0] + (imagesx($image) / 2) - ($text_box[4] / 2); // Preset: Horizontally centered
	$y = $text_box[1] + (imagesy($image) / 2) - ($text_box[5] / 2); // Preset: Horizontally centered
	// Write to Image
	imagettftext($image, $text_size, 0, $x, $y, $text_color, $font, $text);


	// Generate Image
	imagepng($image);
	imagedestroy($image);


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