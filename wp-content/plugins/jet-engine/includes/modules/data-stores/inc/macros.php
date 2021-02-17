<?php
namespace Jet_Engine\Modules\Data_Stores;

class Macros {

	public function __construct() {
		add_filter( 'jet-engine/listings/macros-list', array( $this, 'register_data_store_macros' ) );
	}

	public function register_data_store_macros( $macros_list ) {

		$macros_list['get_store'] = array( $this, 'get_store' );
		$macros_list['get_users_for_store_item'] = array( $this, 'get_users_for_store_item' );

		return $macros_list;

	}

	public function get_store( $field_value = null, $store = null ) {

		if ( ! $store ) {
			return;
		}

		$store_instance = Module::instance()->stores->get_store( $store );

		if ( ! $store_instance ) {
			return;
		}

		return implode( ',', $store_instance->get_store() );

	}

	public function get_users_for_store_item( $field_value = null, $args = null ) {

		if ( ! $args ) {
			return 'not found';
		}

		$args    = explode( '|', $args );
		$store   = $args[0];
		$context = isset( $args[1] ) ? $args[1] : 'post';
		$item_id = false;

		$store_instance = Module::instance()->stores->get_store( $store );

		if ( ! $store_instance ) {
			return 'not found';
		}

		switch ( $context ) {

			case 'current_user':
			case 'user':

				$user = jet_engine()->listings->data->get_current_user_object();

				if ( $user ) {
					$item_id = $user->ID;
				}

				break;

			case 'queried_user':

				$user = jet_engine()->listings->data->get_queried_user_object();

				if ( $user ) {
					$item_id = $user->ID;
				}

				break;

			case 'current_post_author':
			case 'post_author':
			case 'author':

				$user = jet_engine()->listings->data->get_current_author_object();

				if ( $user ) {
					$item_id = $user->ID;
				}

				break;

			default:

				$item_id = apply_filters(
					'jet-engine/data-stores/get-users-macros/context/' . $context,
					get_the_ID()
				);

				break;

		}

		global $wpdb;

		$slug    = $store_instance->get_slug();
		$item_id = '"' . $item_id . '"';
		$query   = "SELECT `user_id` FROM $wpdb->usermeta WHERE `meta_key` = 'je_data_store_$slug' AND `meta_value` LIKE '%:$item_id;%'";

		$result = $wpdb->get_results( $query );

		if ( empty( $result ) ) {
			return 'not found';
		}

		$glue = '';
		$ids  = '';

		foreach ( $result as $row ) {
			$ids .= $glue . $row->user_id;
			$glue = ',';
		}

		return $ids;

	}

}
