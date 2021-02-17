<?php
/**
 * Main dashboard template
 */
?>
<div class="wrap">
	<h1 class="cs-vui-title"><?php _e( 'JetEngine dashboard', 'jet-engine' ); ?></h1>
	<div id="jet_engine_dashboard">
		<div class="cx-vui-panel">
			<cx-vui-tabs
				:in-panel="false"
				value="modules"
				layout="vertical"
			>
				<cx-vui-tabs-panel
					name="modules"
					label="<?php _e( 'Modules', 'jet-engine' ); ?>"
					key="modules"
				>
					<cx-vui-component-wrapper
						label="<?php _e( 'Available Modules', 'jet-engine' ); ?>"
						description="<?php _e( 'Enable/disable additional JetEngine features', 'jet-engine' ); ?>"
						:wrapper-css="[ 'vertical-fullwidth' ]"
					>
						<div class="cx-vui-inner-panel">
							<div tabindex="0" class="cx-vui-repeater">
								<div class="cx-vui-repeater__items">
									<div :class="{ 'cx-vui-repeater-item': true, 'cx-vui-panel': true, 'cx-vui-repeater-item--is-collpased': false }" v-for="module in availableModules">
										<div :class="{ 'cx-vui-repeater-item__heading': true, 'cx-vui-repeater-item__heading--is-collpased': moduleDetails !== module.value }">
											<div class="cx-vui-repeater-item__heading-start">
												<cx-vui-switcher
													:prevent-wrap="true"
													:value="isActive( module.value )"
													@input="switchActive( $event, module )"
												></cx-vui-switcher>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
												<div class="cx-vui-repeater-item__title" @click="switchActive( $event, module )">{{ module.label }}</div>
											</div>
											<div class="cx-vui-repeater-item__heading-end">
												<div class="jet-engine-module-info" @click="moduleDetails = module.value" v-if="moduleDetails !== module.value">
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm1 4c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm0 9V9H9v6h2z"/></g></svg>
													<div class="cx-vui-tooltip">
														<?php _e( 'Click here to get more info', 'jet-engine' ); ?>
													</div>
												</div>
												<div class="jet-enine-module-info-close" @click="moduleDetails = null" v-else>
													<svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3.00671L8.00671 7L12 10.9933L10.9933 12L7 8.00671L3.00671 12L2 10.9933L5.99329 7L2 3.00671L3.00671 2L7 5.99329L10.9933 2L12 3.00671Z"></path></svg>
												</div>
											</div>
										</div>
										<div :class="{ 'cx-vui-repeater-item__content': true, 'cx-vui-repeater-item__content--is-collpased': moduleDetails !== module.value }">
											<div class="jet-engine-module">
												<keep-alive>
													<jet-video-embed v-if="module.embed && moduleDetails === module.value" :embed="module.embed">
												</keep-alive>
												<div class="jet-engine-module-content">
													<div class="jet-engine-details" v-if="module.details" v-html="module.details"></div>
														<div class="jet-engine-links" v-if="module.links.length">
															<div class="jet-engine-links__title">
																<?php _e( 'Useful links:', 'jet-engine' ); ?>
															</div>
															<div class="jet-engine-links__item" v-for="link in module.links">
																<a :href="link.url" target="_blank" class="jet-engine-links__link">
																	<svg v-if="link.is_video" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M19 15V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2zM8 14V6l6 4z"/></g></svg>
																	<svg v-else width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="0" fill="none" width="20" height="20"/><g><path d="M10 10L2.54 7.02 3 18H1l.48-11.41L0 6l10-4 10 4zm0-5c-.55 0-1 .22-1 .5s.45.5 1 .5 1-.22 1-.5-.45-.5-1-.5zm0 6l5.57-2.23c.71.94 1.2 2.07 1.36 3.3-.3-.04-.61-.07-.93-.07-2.55 0-4.78 1.37-6 3.41C8.78 13.37 6.55 12 4 12c-.32 0-.63.03-.93.07.16-1.23.65-2.36 1.36-3.3z"/></g></svg>
																	{{ link.label }}
																</a>
															</div>
														</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</cx-vui-component-wrapper>

					<cx-vui-component-wrapper
						:wrapper-css="[ 'vertical-fullwidth', 'jet-is-stackable' ]"
					>
						<cx-vui-button
							button-style="accent"
							:loading="saving"
							@click="saveModules"
						>
							<span
								slot="label"
								v-html="'<?php _e( 'Save', 'jet-engine' ); ?>'"
							></span>
						</cx-vui-button>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<span
							class="cx-vui-inline-notice cx-vui-inline-notice--success"
							v-if="'success' === result"
							v-html="successMessage"
						></span>
						<span
							class="cx-vui-inline-notice cx-vui-inline-notice--error"
							v-if="'error' === result"
							v-html="errorMessage"
						></span>
					</cx-vui-component-wrapper>
				</cx-vui-tabs-panel>
				<cx-vui-tabs-panel
					name="skins"
					label="<?php _e( 'Skins Manager', 'jet-engine' ); ?>"
					key="skins"
				>
					<br>
					<div
						class="cx-vui-subtitle"
						v-html="'<?php _e( 'Skins manager', 'jet-engine' ); ?>'"
					></div>
					<div class="jet-engine-skins-wrap">
						<jet-engine-skin-import></jet-engine-skin-import>
						<jet-engine-skin-export></jet-engine-skin-export>
						<jet-engine-skins-presets></jet-engine-skins-presets>
					</div>
				</cx-vui-tabs-panel>
				<cx-vui-tabs-panel
					name="shortcode_generator"
					label="<?php _e( 'Shortcode Generator', 'jet-engine' ); ?>"
					key="shortcode_generator"
				>
					<div
						class="cx-vui-subtitle"
						v-html="'<?php _e( 'Generate shortcode', 'jet-engine' ); ?>'"
					></div>
					<div class="jet-shortocde-generator">
						<p><?php
							_e( 'Generate shortcode to output JetEngine-related data anywhere in content', 'jet-engine' );
						?></p>
						<cx-vui-select
							label="<?php _e( 'Component', 'jet-engine' ); ?>"
							description="<?php _e( 'Select plugin component to get value from', 'jet-engine' ); ?>"
							:options-list="componentsList"
							:wrapper-css="[ 'equalwidth' ]"
							size="fullwidth"
							v-model="shortcode.component"
						></cx-vui-select>
						<cx-vui-input
							label="<?php _e( 'Meta Fields Name', 'jet-engine' ); ?>"
							description="<?php _e( 'Set meta field name to get value from', 'jet-engine' ); ?>"
							:wrapper-css="[ 'equalwidth' ]"
							size="fullwidth"
							v-model="shortcode.meta_field"
							:conditions="[
								{
									input: this.shortcode.component,
									compare: 'equal',
									value: 'meta_field',
								}
							]"
						></cx-vui-input>
						<cx-vui-input
							label="<?php _e( 'Page Slug', 'jet-engine' ); ?>"
							description="<?php _e( 'Set created option page slug to get option from', 'jet-engine' ); ?>"
							:wrapper-css="[ 'equalwidth' ]"
							size="fullwidth"
							v-model="shortcode.page"
							:conditions="[
								{
									input: this.shortcode.component,
									compare: 'equal',
									value: 'option',
								}
							]"
						></cx-vui-input>
						<cx-vui-input
							label="<?php _e( 'Field Name', 'jet-engine' ); ?>"
							description="<?php _e( 'Set option field name to get value from', 'jet-engine' ); ?>"
							:wrapper-css="[ 'equalwidth' ]"
							size="fullwidth"
							v-model="shortcode.field"
							:conditions="[
								{
									input: this.shortcode.component,
									compare: 'equal',
									value: 'option',
								}
							]"
						></cx-vui-input>
						<cx-vui-input
							label="<?php _e( 'Post ID', 'jet-engine' ); ?>"
							description="<?php _e( 'Be default shortcodetries automatically detect post ID, use this option to set specific post ID', 'jet-engine' ); ?>"
							:wrapper-css="[ 'equalwidth' ]"
							size="fullwidth"
							v-model="shortcode.post_id"
							:conditions="[
								{
									input: this.shortcode.component,
									compare: 'equal',
									value: 'meta_field',
								}
							]"
						></cx-vui-input>
						<div class="jet-shortocde-generator__result">
							{{ generatedShortcode }}
							<div
								class="jet-shortocde-generator__result-copy"
								role="button"
								v-if="showCopyShortcode"
								@click="copyShortcodeToClipboard"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
								<div
									class="cx-vui-tooltip"
									v-if="shortcode.copied"
								>
									<?php _e( 'Copied!', 'jet-engine' ); ?>
								</div>
							</div>
						</div>
					</div>
				</cx-vui-tabs-panel>
				<?php do_action( 'jet-engine/dashboard/tabs' ); ?>
			</cx-vui-tabs>
		</div>
	</div>
</div>