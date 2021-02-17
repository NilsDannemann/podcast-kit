import GroupedSelectControl from "components/grouped-select-control.js";
import JetEngineRepeater from "components/repeater-control.js";

import {
	clone
} from '../../utils/utility';

const { __ } = wp.i18n;
const {
	registerBlockType
} = wp.blocks;
const {
	InspectorControls,
	ColorPalette,
	RichText,
	Editable,
	MediaUpload,
	ServerSideRender
} = wp.editor;
const {
	PanelColor,
	IconButton,
	TextControl,
	TextareaControl,
	SelectControl,
	ToggleControl,
	PanelBody,
	RangeControl,
	CheckboxControl,
	ExternalLink,
	Disabled,
	G,
	Path,
	Circle,
	Rect,
	SVG
} = wp.components;

const GIcon = <SVG width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><Rect x="1" y="16" width="18" height="18" rx="3" fill="#6F8BFF" stroke="#162B40" strokeWidth="2"></Rect><Rect x="2" y="38" width="16" height="2" rx="1" fill="#162B40"></Rect><Rect x="2" y="42" width="16" height="2" rx="1" fill="#162B40"></Rect><path d="M2 47C2 46.4477 2.44772 46 3 46H9C9.55228 46 10 46.4477 10 47C10 47.5523 9.55228 48 9 48H3C2.44772 48 2 47.5523 2 47Z" fill="#162B40"></path><Rect x="24" y="38" width="16" height="2" rx="1" fill="#162B40"></Rect><Rect x="24" y="42" width="16" height="2" rx="1" fill="#162B40"></Rect><path d="M24 47C24 46.4477 24.4477 46 25 46H31C31.5523 46 32 46.4477 32 47C32 47.5523 31.5523 48 31 48H25C24.4477 48 24 47.5523 24 47Z" fill="#162B40"></path><Rect x="46" y="38" width="16" height="2" rx="1" fill="#162B40"></Rect><Rect x="46" y="42" width="16" height="2" rx="1" fill="#162B40"></Rect><path d="M46 47C46 46.4477 46.4477 46 47 46H53C53.5523 46 54 46.4477 54 47C54 47.5523 53.5523 48 53 48H47C46.4477 48 46 47.5523 46 47Z" fill="#162B40"></path><Rect x="23" y="16" width="18" height="18" rx="3" fill="white" stroke="#162B40" strokeWidth="2"></Rect><Rect x="45" y="16" width="18" height="18" rx="3" fill="white" stroke="#162B40" strokeWidth="2"></Rect></SVG>;

const blockAttributes = {
	lisitng_id: {
		type: 'string',
		default: '',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	columns_tablet: {
		type: 'number',
		default: 3,
	},
	columns_mobile: {
		type: 'number',
		default: 1,
	},
	is_archive_template: {
		type: 'boolean',
		default: false,
	},
	post_status: {
		type: 'array',
		default: ['publish'],
	},
	posts_num: {
		type: 'number',
		default: 6,
	},
	not_found_message: {
		type: 'string',
		default: __( 'No data was found' ),
	},
	custom_posts_query: {
		type: 'string',
		default: '',
	},
	hide_widget_if: {
		type: 'string',
		default: '',
	},
	lazy_load: {
		type: 'boolean',
		default: false,
	},
	lazy_load_offset: {
		type: 'number',
		default: 0,
	},
	use_load_more: {
		type: 'boolean',
		default: false,
	},
	load_more_type: {
		type: 'string',
		default: '',
	},
	load_more_id: {
		type: 'string',
		default: '',
	},
	posts_query: {
		type: 'array',
		default: [],
	}
};

registerBlockType( 'jet-engine/listing-grid', {
	title: __( 'Listing Grid' ),
	icon: GIcon,
	category: 'layout',
	attributes: blockAttributes,
	className: 'jet-listing-grid',
	edit: class extends wp.element.Component {
		render() {

			const props          = this.props;
			const attributes     = props.attributes;
			const listingOptions = window.JetEngineListingData.listingOptions;
			const hideOptions    = window.JetEngineListingData.hideOptions;
			const conditions     = {};

			const metaTypes = [
				{
					value: 'CHAR',
					label: 'CHAR'
				},
				{
					value: 'NUMERIC',
					label: 'NUMERIC'
				},
				{
					value: 'BINARY',
					label: 'BINARY'
				},
				{
					value: 'DATE',
					label: 'DATE'
				},
				{
					value: 'DATETIME',
					label: 'DATETIME'
				},
				{
					value: 'DECIMAL',
					label: 'DECIMAL'
				},
				{
					value: 'SIGNED',
					label: 'SIGNED'
				},
				{
					value: 'UNSIGNED',
					label: 'UNSIGNED'
				}
			]

			const updateItem = function( item, key, value ) {

				const query = clone( props.attributes.posts_query );
				const index = getItemIndex( item );
				const currentItem = query[ getItemIndex( item ) ];

				if ( ! currentItem ) {
					return;
				}

				currentItem[ key ] = value;
				query[ index ] = currentItem;

				props.setAttributes( { posts_query: query } );

			};

			const getItemIndex = function( item ) {
				return props.attributes.posts_query.findIndex( queryItem => {
					return queryItem == item;
				} );
			};

			return [
				props.isSelected && (
					<InspectorControls
						key={ 'inspector' }
					>
						<PanelBody title={ __( 'General' ) }>
							<SelectControl
								label={ __( 'Listing' ) }
								value={ attributes.lisitng_id }
								options={ listingOptions }
								onChange={ newValue => {
									props.setAttributes( { lisitng_id: newValue } );
								}}
							/>
							<TextControl
								type="number"
								label={ __( 'Columns Number' ) }
								value={ attributes.columns }
								min={ `0` }
								max={ `6` }
								onChange={ newValue => {
									props.setAttributes( { columns: Number(newValue) } );
								} }
							/>
							<TextControl
								type="number"
								label={ __( 'Columns Number(Tablet)' ) }
								value={ attributes.columns_tablet }
								min={ `0` }
								max={ `6` }
								onChange={ newValue => {
									props.setAttributes( { columns_tablet: Number(newValue) } );
								} }
							/>
							<TextControl
								type="number"
								label={ __( 'Columns Number(Mobile)' ) }
								value={ attributes.columns_mobile }
								min={ `0` }
								max={ `6` }
								onChange={ newValue => {
									props.setAttributes( { columns_mobile: Number(newValue) } );
								} }
							/>
							<ToggleControl
								label={ __( 'Use as Archive Template' ) }
								checked={ attributes.is_archive_template }
								onChange={ () => {
									props.setAttributes({ is_archive_template: ! attributes.is_archive_template });
								} }
							/>
							<SelectControl
								multiple={true}
								label={ __( 'Status' ) }
								value={ attributes.post_status }
								options={ [
									{
										value: 'publish',
										label: __( 'Publish' ),
									},
									{
										value: 'future',
										label: __( 'Future' ),
									},
									{
										value: 'draft',
										label: __( 'Draft' ),
									},
									{
										value: 'pending',
										label: __( 'Pending Review' ),
									},
									{
										value: 'private',
										label: __( 'Private' ),
									},
								] }
								onChange={ newValue => {
									props.setAttributes( { post_status: newValue } );
								}}
							/>
							<TextControl
								type="number"
								label={ __( 'Posts number' ) }
								value={ attributes.posts_num }
								min={ `1` }
								max={ `1000` }
								onChange={ newValue => {
									props.setAttributes( { posts_num: Number(newValue) } );
								} }
							/>
							<ToggleControl
								label={ __( 'Lazy load' ) }
								checked={ attributes.lazy_load }
								help={ __( 'Lazy load the listing for boosts rendering performance.' ) }
								onChange={ () => {
									props.setAttributes({ lazy_load: ! attributes.lazy_load });
								} }
							/>
							{ attributes.lazy_load &&
								<TextControl
									type="number"
									label={ __( 'Lazy load offset' ) }
									value={ attributes.lazy_load_offset }
									onChange={ newValue => {
										props.setAttributes( { lazy_load_offset: newValue } );
									} }
								/>
							}
							<ToggleControl
								label={ __( 'Load more' ) }
								checked={ attributes.use_load_more }
								onChange={ () => {
									props.setAttributes({ use_load_more: ! attributes.use_load_more });
								} }
							/>
							{ attributes.use_load_more &&
								<SelectControl
									label={ __( 'Status' ) }
									value={ attributes.load_more_type }
									options={ [
										{
											value: 'click',
											label: __( 'By Click' ),
										},
										{
											value: 'scroll',
											label: __( 'Infinite Scroll' ),
										},
									] }
									onChange={ newValue => {
										props.setAttributes( { load_more_type: newValue } );
									}}
								/>
							}
							{ attributes.use_load_more && ( ! attributes.load_more_type || 'click' === attributes.load_more_type ) &&
								<TextControl
									type="text"
									label={ __( 'Load more element ID' ) }
									value={ attributes.load_more_id }
									onChange={ newValue => {
										props.setAttributes( { load_more_id: newValue } );
									} }
								/>
							}
							<TextControl
								type="text"
								label={ __( 'Not found message' ) }
								value={ attributes.not_found_message }
								onChange={ newValue => {
									props.setAttributes( { not_found_message: newValue } );
								} }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Query Settings' ) }
							initialOpen={ false }
						>
							<JetEngineRepeater
								data={ attributes.posts_query }
								default={{
									type: '',
								}}
								onChange={ newData => {
									console.log( newData );
									props.setAttributes({ posts_query: newData });
								} }
							>
								{
									( item ) =>
										<div>
											<SelectControl
												label={ __( 'Type' ) }
												value={ item.type }
												options={ [
													{
														value: '',
														label: __( 'Select...' ),
													},
													{
														value: 'posts_params',
														label: __( 'Posts & Author Parameters' ),
													},
													{
														value: 'order_offset',
														label: __( 'Order & Offset' ),
													},
													{
														value: 'tax_query',
														label: __( 'Tax Query' ),
													},
													{
														value: 'meta_query',
														label: __( 'Meta Query' ),
													},
													{
														value: 'date_query',
														label: __( 'Date Query' ),
													},
												] }
												onChange={newValue => {
													updateItem( item, 'type', newValue )
												}}
											/>
											{ 'date_query' === item.type &&
												<div>
													<SelectControl
														label={ __( 'Column' ) }
														value={ item.date_query_column }
														options={ [
															{
																value: 'post_date',
																label: __( 'Post date' ),
															},
															{
																value: 'post_date_gmt',
																label: __( 'Post date GMT' ),
															},
															{
																value: 'post_modified',
																label: __( 'Post modified' ),
															},
															{
																value: 'post_modified_gmt',
																label: __( 'Post modified GMT' ),
															},
														] }
														onChange={newValue => {
															updateItem( item, 'date_query_column', newValue )
														}}
													/>
													<TextControl
														type="text"
														label={ __( 'After' ) }
														help={ __( 'Date to retrieve posts after. Accepts strtotime()-compatible string' ) }
														value={ item.date_query_after }
														onChange={newValue => {
															updateItem( item, 'date_query_after', newValue )
														}}
													/>
													<TextControl
														type="text"
														label={ __( 'Before' ) }
														help={ __( 'Date to retrieve posts before. Accepts strtotime()-compatible string' ) }
														value={ item.date_query_before }
														onChange={newValue => {
															updateItem( item, 'date_query_before', newValue )
														}}
													/>
												</div>
											}
											{ 'posts_params' === item.type &&
												<div>
													<TextControl
														type="text"
														label={ __( 'Include posts by IDs' ) }
														help={ __( 'Eg. 12, 24, 33' ) }
														value={ item.posts_in }
														onChange={newValue => {
															updateItem( item, 'posts_in', newValue )
														}}
													/>
													<TextControl
														type="text"
														label={ __( 'Exclude posts by IDs' ) }
														help={ __( 'Eg. 12, 24, 33. If this is used in the same query as Include posts by IDs, it will be ignored' ) }
														value={ item.posts_not_in }
														onChange={newValue => {
															updateItem( item, 'posts_not_in', newValue )
														}}
													/>
													<TextControl
														type="text"
														label={ __( 'Get child of' ) }
														help={ __( 'Eg. 12, 24, 33' ) }
														value={ item.posts_parent }
														onChange={newValue => {
															updateItem( item, 'posts_parent', newValue )
														}}
													/>
													<SelectControl
														label={ __( 'Post status' ) }
														value={ item.posts_status }
														options={ [
															{
																value: 'publish',
																label: __( 'Publish' ),
															},
															{
																value: 'pending',
																label: __( 'Pending' ),
															},
															{
																value: 'draft',
																label: __( 'Draft' ),
															},
															{
																value: 'auto-draft',
																label: __( 'Auto draft' ),
															},
															{
																value: 'future',
																label: __( 'Future' ),
															},
															{
																value: 'private',
																label: __( 'Private' ),
															},
															{
																value: 'trash',
																label: __( 'Trash' ),
															},
															{
																value: 'any',
																label: __( 'Any' ),
															},
														] }
														onChange={newValue => {
															updateItem( item, 'posts_status', newValue )
														}}
													/>
													<SelectControl
														label={ __( 'Posts by author' ) }
														value={ item.posts_author }
														options={ [
															{
																value: 'any',
																label: __( 'Any author' ),
															},
															{
																value: 'current',
																label: __( 'Current User' ),
															},
															{
																value: 'id',
																label: __( 'Specific Author ID' ),
															},
															{
																value: 'queried',
																label: __( 'Queried User' ),
															},
														] }
														onChange={newValue => {
															updateItem( item, 'posts_author', newValue )
														}}
													/>
													{
														'id' === item.posts_author &&
														<TextControl
															type="text"
															label={ __( 'Author ID' ) }
															value={ item.posts_author_id }
															onChange={newValue => {
																updateItem( item, 'posts_author_id', newValue )
															}}
														/>
													}
													<TextControl
														type="text"
														label={ __( 'Search Query' ) }
														value={ item.search_query }
														onChange={newValue => {
															updateItem( item, 'search_query', newValue )
														}}
													/>
												</div>
											}
											{ 'order_offset' === item.type &&
												<div>
													<TextControl
														type="number"
														label={ __( 'Posts offset' ) }
														value={ item.offset }
														min="0"
														max="100"
														step="1"
														onChange={newValue => {
															updateItem( item, 'offset', newValue )
														}}
													/>
													<SelectControl
														label={ __( 'Order' ) }
														value={ item.order }
														options={ [
															{
																value: 'ASC',
																label: __( 'ASC' ),
															},
															{
																value: 'DESC',
																label: __( 'DESC' ),
															},
														] }
														onChange={newValue => {
															updateItem( item, 'order', newValue )
														}}
													/>
													<SelectControl
														label={ __( 'Order' ) }
														value={ item.order_by }
														options={ [
															{
																value: 'none',
																label: __( 'None' ),
															},
															{
																value: 'ID',
																label: __( 'ID' ),
															},
															{
																value: 'author',
																label: __( 'Author' ),
															},
															{
																value: 'title',
																label: __( 'Title' ),
															},
															{
																value: 'name',
																label: __( 'Name' ),
															},
															{
																value: 'type',
																label: __( 'Type' ),
															},
															{
																value: 'date',
																label: __( 'Date' ),
															},
															{
																value: 'modified',
																label: __( 'Modified' ),
															},
															{
																value: 'parent',
																label: __( 'Parent' ),
															},
															{
																value: 'rand',
																label: __( 'Random' ),
															},
															{
																value: 'comment_count',
																label: __( 'Comment Count' ),
															},
															{
																value: 'relevance',
																label: __( 'Relevance' ),
															},
															{
																value: 'menu_order',
																label: __( 'Menu Order' ),
															},
															{
																value: 'meta_value',
																label: __( 'Meta Value' ),
															},
															{
																value: 'meta_clause',
																label: __( 'Meta Clause' ),
															},
															{
																value: 'post__in',
																label: __( 'Preserve post ID order given in the "Include posts by IDs" option' ),
															},
														] }
														onChange={newValue => {
															updateItem( item, 'order_by', newValue )
														}}
													/>
													{ 'meta_value' === item.order_by &&
														<div>
															<TextControl
																type="text"
																label={ __( 'Meta key to order' ) }
																help={ __( 'Set meta field name to order by' ) }
																value={ item.meta_key }
																onChange={newValue => {
																	updateItem( item, 'meta_key', newValue )
																}}
															/>
															<SelectControl
																label={ __( 'Meta type' ) }
																value={ item.meta_type }
																options={ [
																	{
																		value: 'CHAR',
																		label: 'CHAR',
																	},
																	{
																		value: 'NUMERIC',
																		label: 'NUMERIC',
																	},
																	{
																		value: 'DATE',
																		label: 'DATE',
																	},
																	{
																		value: 'DATETIME',
																		label: 'DATETIME',
																	},
																	{
																		value: 'DECIMAL',
																		label: 'DECIMAL',
																	},
																] }
																onChange={newValue => {
																	updateItem( item, 'meta_type', newValue )
																}}
															/>
														</div>
													}
													{ 'meta_clause' === item.order_by &&
														<TextControl
															type="text"
															label={ __( 'Meta clause to order' ) }
															help={ __( 'Meta clause name to order by. Clause with this name should be created in Meta Query parameters' ) }
															value={ item.meta_clause_key }
															onChange={newValue => {
																updateItem( item, 'meta_clause_key', newValue )
															}}
														/>
													}
												</div>
											}
											{ 'tax_query' === item.type &&
												<div>
													<SelectControl
														label={ __( 'Taxonomy' ) }
														value={ item.tax_query_taxonomy }
														options={ window.JetEngineListingData.taxonomies }
														onChange={newValue => {
															updateItem( item, 'tax_query_taxonomy', newValue )
														}}
													/>
													<SelectControl
														label={ __( 'Operator' ) }
														value={ item.tax_query_compare }
														options={ [
															{
																value: 'IN',
																label: 'IN',
															},
															{
																value: 'NOT IN',
																label: 'NOT IN',
															},
															{
																value: 'AND',
																label: 'AND',
															},
															{
																value: 'EXISTS',
																label: 'EXISTS',
															},
															{
																value: 'NOT EXISTS',
																label: 'NOT EXISTS',
															},
														] }
														onChange={newValue => {
															updateItem( item, 'tax_query_compare', newValue )
														}}
													/>
													<SelectControl
														label={ __( 'Field' ) }
														value={ item.tax_query_field }
														options={ [
															{
																value: 'term_id',
																label: __( 'Term ID' ),
															},
															{
																value: 'slug',
																label: __( 'Slug' ),
															},
															{
																value: 'name',
																label: __( 'Name' ),
															},
														] }
														onChange={newValue => {
															updateItem( item, 'tax_query_field', newValue )
														}}
													/>
													<TextControl
														type="text"
														label={ __( 'Terms' ) }
														value={ item.tax_query_terms }
														onChange={newValue => {
															updateItem( item, 'tax_query_terms', newValue )
														}}
													/>
													<TextControl
														type="text"
														label={ __( 'Terms from meta field' ) }
														help={ __( 'Get terms IDs from current page meta field' ) }
														value={ item.tax_query_terms_meta }
														onChange={newValue => {
															updateItem( item, 'tax_query_terms_meta', newValue )
														}}
													/>
												</div>
											}
											{ 'meta_query' === item.type &&
												<div>
													<TextControl
														label={ __( 'Key (name/ID)' ) }
														value={ item.meta_query_key }
														onChange={newValue => {
															updateItem( item, 'meta_query_key', newValue )
														}}
													/>
													<SelectControl
														label={ __( 'Operator' ) }
														value={ item.meta_query_compare }
														options={ [
															{
																value: '=',
																label: 'Equal',
															},
															{
																value: '!=',
																label: 'Not equal',
															},
															{
																value: '>',
																label: 'Greater than',
															},
															{
																value: '>=',
																label: 'Greater or equal',
															},
															{
																value: '<',
																label: 'Less than',
															},
															{
																value: '<=',
																label: 'Equal or less',
															},
															{
																value: 'LIKE',
																label: 'LIKE',
															},
															{
																value: 'NOT LIKE',
																label: 'NOT LIKE',
															},
															{
																value: 'IN',
																label: 'IN',
															},
															{
																value: 'NOT IN',
																label: 'NOT IN',
															},
															{
																value: 'BETWEEN',
																label: 'BETWEEN',
															},
															{
																value: 'NOT BETWEEN',
																label: 'NOT BETWEEN',
															},
															{
																value: 'EXISTS',
																label: 'EXISTS',
															},
															{
																value: 'NOT EXISTS',
																label: 'NOT EXISTS',
															},
														] }
														onChange={newValue => {
															updateItem( item, 'meta_query_compare', newValue )
														}}
													/>
													{ ! ['EXISTS', 'NOT EXISTS'].includes( item.meta_query_compare ) &&
														<div>
															<TextControl
																type="text"
																label={ __( 'Value' ) }
																help={ __( 'For "In", "Not in", "Between" and "Not between" compare separate multiple values with comma' ) }
																value={ item.meta_query_val }
																onChange={newValue => {
																	updateItem( item, 'meta_query_val', newValue )
																}}
															/>
															<TextControl
																type="text"
																label={ __( 'Or get value from query variable' ) }
																help={ __( 'Set query variable name (from URL or WordPress query var) to get value from' ) }
																value={ item.meta_query_request_val }
																onChange={newValue => {
																	updateItem( item, 'meta_query_request_val', newValue )
																}}
															/>
														</div>
													}
													<SelectControl
														label={ __( 'Type' ) }
														value={ item.meta_query_type }
														options={ metaTypes }
														onChange={newValue => {
															updateItem( item, 'meta_query_type', newValue )
														}}
													/>
													<TextControl
														type="text"
														label={ __( 'Meta Query Clause' ) }
														help={ __( 'Set unique name for current query clause to use it to order posts by this clause' ) }
														value={ item.meta_query_clause }
														onChange={newValue => {
															updateItem( item, 'meta_query_clause', newValue )
														}}
													/>
												</div>
											}
										</div>
								}
							</JetEngineRepeater>
							<TextareaControl
								type="text"
								label={ __( 'Set Posts Query' ) }
								value={ attributes.custom_posts_query }
								onChange={ newValue => {
									props.setAttributes( { custom_posts_query: newValue } );
								} }
							/>
							<p>
								<ExternalLink href="https://crocoblock.com/wp-query-generator/">{ __( 'Generate Posts Query' ) }</ExternalLink>
							</p>
							<p>
								<ExternalLink href="https://crocoblock.com/knowledge-base/articles/jetengine-macros-guide/">{ __( 'Macros Guide' ) }</ExternalLink>
							</p>
						</PanelBody>
						<PanelBody
							title={ __( 'Block Visibility' ) }
							initialOpen={ false }
						>
							<SelectControl
								label={ __( 'Hide block if' ) }
								value={ attributes.hide_widget_if }
								options={ hideOptions }
								onChange={ newValue => {
									props.setAttributes( { hide_widget_if: newValue } );
								}}
							/>
						</PanelBody>
					</InspectorControls>
				),
				<Disabled>
					<ServerSideRender
						block="jet-engine/listing-grid"
						attributes={ attributes }
					/>
				</Disabled>
			];
		}
	},
	save: props => {
		return null;
	}
} );