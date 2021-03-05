<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              nilsdannemann.com
 * @since             1.0.0
 * @package           Pk_Asset_Generator
 *
 * @wordpress-plugin
 * Plugin Name:       PK Asset Generator
 * Plugin URI:        nilsdannemann.com/plugins
 * Description:       Easily generate Image Assets for all major Social Media Plattforms.
 * Version:           1.0.0
 * Author:            Nils Dannemann
 * Author URI:        nilsdannemann.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       pk-asset-generator
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'PK_ASSET_GENERATOR_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-pk-asset-generator-activator.php
 */
function activate_pk_asset_generator() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-pk-asset-generator-activator.php';
	Pk_Asset_Generator_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-pk-asset-generator-deactivator.php
 */
function deactivate_pk_asset_generator() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-pk-asset-generator-deactivator.php';
	Pk_Asset_Generator_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_pk_asset_generator' );
register_deactivation_hook( __FILE__, 'deactivate_pk_asset_generator' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-pk-asset-generator.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_pk_asset_generator() {

	$plugin = new Pk_Asset_Generator();
	$plugin->run();

}
run_pk_asset_generator();






/**
 * FREEMIUS: Integration
 */
if ( ! function_exists( 'pk_ag_fs' ) ) {
    // Create a helper function for easy SDK access.
    function pk_ag_fs() {
        global $pk_ag_fs;

        if ( ! isset( $pk_ag_fs ) ) {
            // Include Freemius SDK.
            require_once dirname(__FILE__) . '/freemius/start.php';

            $pk_ag_fs = fs_dynamic_init( array(
                'id'                  => '7921',
                'slug'                => 'pk-asset-generator',
                'type'                => 'plugin',
                'public_key'          => 'pk_6ff7c9aa1a20d10c3cc8054203d27',
                'is_premium'          => true,
                'premium_suffix'      => 'Pro',
                // If your plugin is a serviceware, set this option to false.
                'has_premium_version' => true,
                'has_addons'          => false,
                'has_paid_plans'      => true,
                'menu'                => array(
                    'slug'           => 'pk-asset-generator',
                    'support'        => false,
                    'parent'         => array(
                        'slug' => 'options-general.php',
                    ),
                ),
                // Set the SDK to work in a sandbox mode (for development & testing).
                // IMPORTANT: MAKE SURE TO REMOVE SECRET KEY BEFORE DEPLOYMENT.
                'secret_key'          => 'sk_S*N$Axyr7zY$O5mO8Rp;^L?sTg%&m',
            ) );
        }

        return $pk_ag_fs;
    }

    // Init Freemius.
    pk_ag_fs();
    // Signal that SDK was initiated.
    do_action( 'pk_ag_fs_loaded' );
}

/**
 * FREEMIUS: Customize Opt-In Message
 */
function pk_ag_fs_custom_connect_message_on_update(
        $message,
        $user_first_name,
        $plugin_title,
        $user_login,
        $site_link,
        $freemius_link
    ) {
        return sprintf(
            __( 'Hey %1$s' ) . ',<br>' .
            __( 'Please help us improve %2$s! If you opt-in, some data about your usage of %2$s will be sent to %5$s. If you skip this, that\'s okay! %2$s will still work just fine.', 'pk-asset-generator' ),
            $user_first_name,
            '<b>' . $plugin_title . '</b>',
            '<b>' . $user_login . '</b>',
            $site_link,
            $freemius_link
        );
    }

    pk_ag_fs()->add_filter('connect_message_on_update', 'pk_ag_fs_custom_connect_message_on_update', 10, 6);

/**
 * FREEMIUS: Uninstall
 */
// Not like register_uninstall_hook(), you do NOT have to use a static function.
pk_ag_fs()->add_action('after_uninstall', 'pk_ag_fs_uninstall_cleanup');





