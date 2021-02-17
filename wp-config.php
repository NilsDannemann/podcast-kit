<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', 'root' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '295TBNQF4Eia5R0Qi0Ekqa+oXa8eFB7MPUOo+pk/nD/4QXn0Dv8P5v5pOf7SS8rqm0+9R4uSxXIuZBj3TYfoMQ==');
define('SECURE_AUTH_KEY',  'ucxuLZjjYDoWaJ+1/Qd+j5o2aDKEjBdmYpv0H88qrGOS6GhpO+pSKaUHfpr3cfr5KO8mEH5S43XEFTeZI59DWQ==');
define('LOGGED_IN_KEY',    '4KBLqFsgNj52Xg3MED5LnBUgqhHPWXidcgYc/7k5keQHyyc5OEbZMhAhrrK+l0ZltKRO2Pn4W9wsZBdw+IIEuQ==');
define('NONCE_KEY',        'gtg32k5JF2ywJx41bI0AxfZjA77yFxiExqiVgqkaxGe+dtJY2s/dMJ9cRjRXSsVkRANrSIguU/kL+e7nG51ZLg==');
define('AUTH_SALT',        'fvzMVGExkg+xxzUMLadJZ0iNnnhFfyaPJ98ykaWPZZyNO62bQ0UjLPWugU+kXhu2lgOHHYmJ98ziD0NuB9MJDw==');
define('SECURE_AUTH_SALT', '60RFa5Wl05zkwdaEYEgaoWiYyDQjOIgGgyA4O8qxhsTCUD9HmU2yPvWcLfYWScSIBA0cCYIqx8RIPlt/smxL9w==');
define('LOGGED_IN_SALT',   'ghHIFh3W5bmQHliiK2/gMECvIanU0hP4/QWr+fha+KZDtcwz6Kka1ohWjJbS50d1gifyt1/wLx896HjDgpg2HA==');
define('NONCE_SALT',       'RMdUFs9jESW4KYQ7KXAEU0WcXH+6NLECd2WgmdoJ3oE7VvqSSIanpGOafhl9rBRkEEwEFA5ydUHPowmwWuslyw==');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';




/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
