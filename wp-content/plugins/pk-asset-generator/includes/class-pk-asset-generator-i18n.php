<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       nilsdannemann.com
 * @since      1.0.0
 *
 * @package    Pk_Asset_Generator
 * @subpackage Pk_Asset_Generator/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Pk_Asset_Generator
 * @subpackage Pk_Asset_Generator/includes
 * @author     Nils Dannemann <me@nilsdannemann.com>
 */
class Pk_Asset_Generator_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'pk-asset-generator',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
