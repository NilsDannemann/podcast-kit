// Promise polyfill
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){"use strict";function e(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})}function n(e){return!(!e||"undefined"==typeof e.length)}function t(){}function o(e){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],c(e,this)}function r(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var o;try{o=t(e._value)}catch(r){return void f(n.promise,r)}i(n.promise,o)}else(1===e._state?i:f)(n.promise,e._value)})):e._deferreds.push(n)}function i(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if(n instanceof o)return e._state=3,e._value=n,void u(e);if("function"==typeof t)return void c(function(e,n){return function(){e.apply(n,arguments)}}(t,n),e)}e._state=1,e._value=n,u(e)}catch(r){f(e,r)}}function f(e,n){e._state=2,e._value=n,u(e)}function u(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;t>n;n++)r(e,e._deferreds[n]);e._deferreds=null}function c(e,n){var t=!1;try{e(function(e){t||(t=!0,i(n,e))},function(e){t||(t=!0,f(n,e))})}catch(o){if(t)return;t=!0,f(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,n){var o=new this.constructor(t);return r(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}(e,n,o)),o},o.prototype["finally"]=e,o.all=function(e){return new o(function(t,o){function r(e,n){try{if(n&&("object"==typeof n||"function"==typeof n)){var u=n.then;if("function"==typeof u)return void u.call(n,function(n){r(e,n)},o)}i[e]=n,0==--f&&t(i)}catch(c){o(c)}}if(!n(e))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(t,r){if(!n(e))return r(new TypeError("Promise.race accepts an array"));for(var i=0,f=e.length;f>i;i++)o.resolve(e[i]).then(t,r)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in l?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=e):l.Promise=o});

( function( $, elementor, settings ) {

	'use strict';

	var JetTabs = {

		addedScripts: {},

		addedStyles: {},

		addedAssetsPromises: [],

		init: function() {
			var widgets = {
				'jet-tabs.default': JetTabs.tabsInit,
				'jet-accordion.default': JetTabs.accordionInit,
				'jet-image-accordion.default': JetTabs.imageAccordionInit,
				'jet-switcher.default': JetTabs.switcherInit,
			};

			$.each( widgets, function( widget, callback ) {
				elementor.hooks.addAction( 'frontend/element_ready/' + widget, callback );
			});
		},

		tabsInit: function( $scope ) {
			var $target         = $( '.jet-tabs', $scope ).first(),
				$widgetId       = $target.data( 'id' ),
				$window         = $( window ),
				$controlWrapper = $( '.jet-tabs__control-wrapper', $target ).first(),
				$contentWrapper = $( '.jet-tabs__content-wrapper', $target ).first(),
				$controlList    = $( '> .jet-tabs__control', $controlWrapper ),
				$contentList    = $( '> .jet-tabs__content', $contentWrapper ),
				settings        = $target.data( 'settings' ) || {},
				anchorSelectors = [],
				toogleEvents    = 'mouseenter mouseleave',
				scrollOffset,
				autoSwitchInterval = null,
				curentHash      = window.location.hash || false,
				tabsArray       = curentHash ? curentHash.replace( '#', '' ).split( '&' ) : false;



			if ( 'click' === settings['event'] ) {
				addClickEvent();
			} else {
				addMouseEvent();
			}

			if ( settings['autoSwitch'] ) {

				var startIndex        = settings['activeIndex'],
					currentIndex      = startIndex,
					controlListLength = $controlList.length;

				autoSwitchInterval = setInterval( function() {

					if ( currentIndex < controlListLength - 1 ) {
						currentIndex++;
					} else {
						currentIndex = 0;
					}

					if ( settings['ajaxTemplate'] ) {
						ajaxLoadTemplate( currentIndex );
					}

					switchTab( currentIndex );

				}, +settings['autoSwitchDelay'] );
			}

			if ( settings['ajaxTemplate'] ) {
				ajaxLoadTemplate( settings['activeIndex'] );
			}

			$( window ).on( 'resize.jetTabs orientationchange.jetTabs', function() {
				$contentWrapper.css( { 'height': 'auto' } );
			} );

			/**
			 * [addClickEvent description]
			 */
			function addClickEvent() {
				$controlList.on( 'click.jetTabs', function() {
					var $this = $( this ),
						tabId = +$this.data( 'tab' ) - 1,
						templateId = $this.data( 'template-id' );

					clearInterval( autoSwitchInterval );

					if ( settings['ajaxTemplate'] && templateId ) {
						ajaxLoadTemplate( tabId );
					}

					switchTab( tabId );
				});
			}

			/**
			 * [addMouseEvent description]
			 */
			function addMouseEvent() {
				if ( 'ontouchend' in window || 'ontouchstart' in window ) {
					$controlList.on( 'touchstart', function( event ) {
						scrollOffset = $( window ).scrollTop();
					} );

					$controlList.on( 'touchend', function( event ) {
						var $this = $( this ),
							tabId = +$this.data( 'tab' ) - 1,
							templateId = $this.data( 'template-id' );

						if ( scrollOffset !== $( window ).scrollTop() ) {
							return false;
						}

						clearInterval( autoSwitchInterval );

						if ( settings['ajaxTemplate'] && templateId ) {
							ajaxLoadTemplate( tabId );
						}

						switchTab( tabId );
					} );

				} else {
					$controlList.on( 'mouseenter', function( event ) {
						var $this = $( this ),
							tabId = +$this.data( 'tab' ) - 1,
							templateId = $this.data( 'template-id' );

						clearInterval( autoSwitchInterval );

						if ( settings['ajaxTemplate'] && templateId ) {
							ajaxLoadTemplate( tabId );
						}

						switchTab( tabId );
					} );
				}
			}

			/**
			 * [switchTab description]
			 * @param  {[type]} curentIndex [description]
			 * @return {[type]}             [description]
			 */
			function switchTab( curentIndex ) {
				var $activeControl      = $controlList.eq( curentIndex ),
					$activeContent      = $contentList.eq( curentIndex ),
					activeContentHeight = 'auto',
					timer;

				$contentWrapper.css( { 'height': $contentWrapper.outerHeight( true ) } );

				$controlList.removeClass( 'active-tab' );
				$activeControl.addClass( 'active-tab' );

				$controlList.attr( 'aria-expanded', 'false' );
				$activeControl.attr( 'aria-expanded', 'true' );

				$contentList.removeClass( 'active-content' );
				activeContentHeight = $activeContent.outerHeight( true );
				activeContentHeight += parseInt( $contentWrapper.css( 'border-top-width' ) ) + parseInt( $contentWrapper.css( 'border-bottom-width' ) );
				$activeContent.addClass( 'active-content' );

				$contentList.attr( 'aria-hidden', 'true' );
				$activeContent.attr( 'aria-hidden', 'false' );

				$contentWrapper.css( { 'height': activeContentHeight } );

				$window.trigger( 'jet-tabs/tabs/show-tab-event/before', {
					target: $target,
					tabIndex: curentIndex,
				} );

				if ( timer ) {
					clearTimeout( timer );
				}

				timer = setTimeout( function() {
					$window.trigger( 'jet-tabs/tabs/show-tab-event/after', {
						target: $target,
						tabIndex: curentIndex,
					} );

					$contentWrapper.css( { 'height': 'auto' } );
				}, 500 );
			}

			/**
			 * [ajaxLoadTemplate description]
			 * @param  {[type]} $index [description]
			 * @return {[type]}        [description]
			 */
			function ajaxLoadTemplate( $index ) {
				var $contentHolder = $contentList.eq( $index ),
					templateLoaded = $contentHolder.data( 'template-loaded' ) || false,
					templateId     = $contentHolder.data( 'template-id' ),
					loader         = $( '.jet-tabs-loader', $contentHolder );

				if ( templateLoaded ) {
					return false;
				}

				$contentHolder.data( 'template-loaded', true );

				$.ajax( {
					type: 'GET',
					url: window.JetTabsSettings.templateApiUrl,
					dataType: 'json',
					data: {
						'id': templateId,
						'dev': window.JetTabsSettings.devMode
					},
					success: function( responce, textStatus, jqXHR ) {
						var templateContent     = responce['template_content'],
							templateScripts     = responce['template_scripts'],
							templateStyles      = responce['template_styles'];

						for ( var scriptHandler in templateScripts ) {
							JetTabs.addedAssetsPromises.push( JetTabs.loadScriptAsync( scriptHandler, templateScripts[ scriptHandler ] ) );
						}

						for ( var styleHandler in templateStyles ) {
							JetTabs.addedAssetsPromises.push( JetTabs.loadStyle( styleHandler, templateStyles[ styleHandler ] ) );
						}

						Promise.all( JetTabs.addedAssetsPromises ).then( function( value ) {
							loader.remove();
							$contentHolder.append( templateContent );
							JetTabs.elementorFrontendInit( $contentHolder );
						}, function( reason ) {
							console.log( 'Script Loaded Error' );
						});
					}
				} );//end

			}

			// Hash Watch Handler
			if ( tabsArray ) {

				$controlList.each( function( index ) {
					var $this      = $( this ),
						id         = $this.attr( 'id' ),
						templateId = $this.data( 'template-id' ),
						tabIndex   = index;

					tabsArray.forEach( function( itemHash, i ) {

						if ( itemHash === id ) {

							if ( settings['ajaxTemplate'] && templateId ) {
								ajaxLoadTemplate( tabIndex );
							}

							switchTab( tabIndex );
						}
					} );

				} );
			}

			$controlList.each( function() {
				anchorSelectors.push( 'a[href*="#' + $( this ).attr( 'id' ) + '"]' );
			} );

			$( document ).on( 'click.jetTabAnchor', anchorSelectors.join( ',' ), function( event ) {
				var $hash = $( this.hash );

				if ( ! $hash.closest( $scope )[0] ) {
					return;
				}

				var tabInx = $hash.data( 'tab' ) - 1;

				if ( settings['ajaxTemplate'] ) {
					ajaxLoadTemplate( tabInx );
				}

				switchTab( tabInx );
			} );

		},// tabsInit end

		switcherInit: function( $scope ) {
			var $target          = $( '.jet-switcher', $scope ).first(),
				$widgetId        = $target.data( 'id' ),
				$window          = $( window ),
				$controlWrapper  = $( '.jet-switcher__control-wrapper', $target ).first(),
				$contentWrapper  = $( '.jet-switcher__content-wrapper', $target ).first(),
				$controlInstance = $( '> .jet-switcher__control-instance', $controlWrapper ),
				$controlList     = $( '> .jet-switcher__control-instance > .jet-switcher__control, > .jet-switcher__control', $controlWrapper ),
				$contentList     = $( '> .jet-switcher__content', $contentWrapper ),
				$disableContent  = $( '> .jet-switcher__content--disable', $contentWrapper ),
				$enableContent   = $( '> .jet-switcher__content--enable', $contentWrapper ),
				state            = $target.hasClass( 'jet-switcher--disable' ),
				settings         = $target.data( 'settings' ) || {},
				toogleEvents     = 'mouseenter mouseleave',
				scrollOffset;

			if ( 'ontouchend' in window || 'ontouchstart' in window ) {
				addTouchEvent();
			} else {
				addClickEvent();
			}

			$( window ).on( 'resize.jetSwitcher orientationchange.jetSwitcher', function() {
				$contentWrapper.css( { 'height': 'auto' } );
			} );

			function addClickEvent() {
				$controlInstance.on( 'click.jetSwitcher', function() {
					switchTab();
				});
			}

			function addTouchEvent() {

				$controlInstance.on( 'touchstart', function( event ) {
					scrollOffset = $( window ).scrollTop();
				} );

				$controlInstance.on( 'touchend', function( event ) {
					if ( scrollOffset !== $( window ).scrollTop() ) {
						return false;
					}

					switchTab();

				} );
			}

			function switchTab( curentIndex ) {
				var $activeControl, $activeContent,
					activeContentHeight = 'auto',
					timer;

				$contentWrapper.css( { 'height': $contentWrapper.outerHeight( true ) } );

				$target.toggleClass( 'jet-switcher--disable jet-switcher--enable' );

				if ( $target.hasClass( 'jet-switcher--disable' ) ) {
					state = false;
				} else {
					state = true;
				}

				$activeControl = ! state ? $controlList.eq(0) : $controlList.eq(1);
				$activeContent = ! state ? $contentList.eq(0) : $contentList.eq(1);

				$contentList.removeClass( 'active-content' );
				activeContentHeight = $activeContent.outerHeight( true );
				activeContentHeight += parseInt( $contentWrapper.css( 'border-top-width' ) ) + parseInt( $contentWrapper.css( 'border-bottom-width' ) );
				$activeContent.addClass( 'active-content' );

				$controlList.attr( 'aria-expanded', 'false' );
				$activeControl.attr( 'aria-expanded', 'true' );

				$contentList.attr( 'aria-hidden', 'true' );
				$activeContent.attr( 'aria-hidden', 'false' );

				$contentWrapper.css( { 'height': activeContentHeight } );

				$window.trigger( 'jet-tabs/switcher/show-case-event/before', {
					target: $target,
					caseIndex: curentIndex,
				} );

				if ( timer ) {
					clearTimeout( timer );
				}

				timer = setTimeout( function() {
					$window.trigger( 'jet-tabs/switcher/show-case-event/after', {
						target: $target,
						caseIndex: curentIndex,
					} );

					$contentWrapper.css( { 'height': 'auto' } );
				}, 500 );
			}
		},

		accordionInit: function( $scope ) {
			var $target         = $( '.jet-accordion', $scope ).first(),
				$widgetId       = $target.data( 'id' ),
				$window         = $( window ),
				$controlsList   = $( '> .jet-accordion__inner > .jet-toggle > .jet-toggle__control', $target ),
				settings        = $target.data( 'settings' ),
				$toggleList     = $( '> .jet-accordion__inner > .jet-toggle', $target ),
				anchorSelectors = [],
				timer, timer2,
				curentHash      = window.location.hash || false,
				togglesArray    = curentHash ? curentHash.replace( '#', '' ).split( '&' ) : false;

			$( window ).on( 'resize.jetAccordion orientationchange.jetAccordion', function() {
				var activeToggle        = $( '> .jet-accordion__inner > .active-toggle', $target ),
					activeToggleContent = $( '> .jet-toggle__content', activeToggle );

				activeToggleContent.css( { 'height': 'auto' } );
			} );

			$controlsList.on( 'click.jetAccordion', function() {
				var $this       = $( this ),
					$toggle     = $this.closest( '.jet-toggle' ),
					toggleIndex = +$this.data( 'toggle' ) - 1;

				if ( settings['collapsible'] ) {

					if ( ! $toggle.hasClass( 'active-toggle' ) ) {

						$toggleList.each( function( index ) {
							var $this                = $( this ),
								$toggleControl       = $( '> .jet-toggle__control', $this ),
								$toggleContent       = $( '> .jet-toggle__content', $this ),
								$toggleContentHeight = $( '> .jet-toggle__content > .jet-toggle__content-inner', $this ).outerHeight();

							$toggleContentHeight += parseInt( $toggleContent.css( 'border-top-width' ) ) + parseInt( $toggleContent.css( 'border-bottom-width' ) );

							if ( index === toggleIndex ) {
								$this.addClass( 'active-toggle' );
								$toggleContent.css( { 'height': $toggleContentHeight } );

								$toggleControl.attr( 'aria-expanded', 'true' );
								$toggleContent.attr( 'aria-hidden', 'false' );

								if ( settings['ajaxTemplate'] ) {
									ajaxLoadTemplate( toggleIndex );
								}

								$window.trigger( 'jet-tabs/accordion/show-toggle-event/before', {
									target: $target,
									toggleIndex: toggleIndex,
								} );

								if ( timer ) {
									clearTimeout( timer );
								}

								timer = setTimeout( function() {
									$window.trigger( 'jet-tabs/accordion/show-toggle-event/after', {
										target: $target,
										toggleIndex: toggleIndex,
									} );

									$toggleContent.css( { 'height': 'auto' } );
								}, 300 );

							} else {
								if ( $this.hasClass( 'active-toggle' ) ) {
									$toggleContent.css( { 'height': $toggleContent.outerHeight() } );
									$this.removeClass( 'active-toggle' );

									$toggleControl.attr( 'aria-expanded', 'false' );
									$toggleContent.attr( 'aria-hidden', 'true' );

									if ( timer2 ) {
										clearTimeout( timer2 );
									}

									timer2 = setTimeout( function() {
										$toggleContent.css( { 'height': 0 } );
									}, 5 );
								}
							}
						} );
					}
				} else {
					var $toggleContent = $( '> .jet-toggle__content', $toggle ),
						$toggleContentHeight = $( '> .jet-toggle__content > .jet-toggle__content-inner', $toggle ).outerHeight();

					$toggleContentHeight += parseInt( $toggleContent.css( 'border-top-width' ) ) + parseInt( $toggleContent.css( 'border-bottom-width' ) );

					$toggle.toggleClass( 'active-toggle' );

					if ( $toggle.hasClass( 'active-toggle') ) {
						$toggleContent.css( { 'height': $toggleContentHeight } );

						$this.attr( 'aria-expanded', 'true' );
						$toggleContent.attr( 'aria-hidden', 'false' );

						if ( settings['ajaxTemplate'] ) {
							ajaxLoadTemplate( toggleIndex );
						}

						$window.trigger( 'jet-tabs/accordion/show-toggle-event/before', {
							target: $target,
							toggleIndex: toggleIndex,
						} );

						if ( timer ) {
							clearTimeout( timer );
						}

						timer = setTimeout( function() {
							$window.trigger( 'jet-tabs/accordion/show-toggle-event/after', {
								target: $target,
								toggleIndex: toggleIndex,
							} );

							$toggleContent.css( { 'height': 'auto' } );
						}, 300 );

					} else {
						$toggleContent.css( { 'height': $toggleContent.outerHeight() } );

						$this.attr( 'aria-expanded', 'false' );
						$toggleContent.attr( 'aria-hidden', 'true' );

						if ( timer2 ) {
							clearTimeout( timer2 );
						}

						timer2 = setTimeout( function() {
							$toggleContent.css( { 'height': 0 } );
						}, 5 );
					}
				}

			});

			/**
			 * [ajaxLoadTemplate description]
			 * @param  {[type]} $index [description]
			 * @return {[type]}        [description]
			 */
			function ajaxLoadTemplate( $index ) {
				var $toggle        = $toggleList.eq( $index ),
					$contentHolder = $( '> .jet-toggle__content', $toggle ),
					$contentHolderInner = $( '> .jet-toggle__content > .jet-toggle__content-inner', $toggle ),
					templateLoaded = $contentHolder.data( 'template-loaded' ) || false,
					templateId     = $contentHolder.data( 'template-id' ),
					loader         = $( '.jet-tabs-loader', $contentHolderInner );

				if ( templateLoaded ) {
					return false;
				}

				$contentHolder.data( 'template-loaded', true );

				$.ajax( {
					type: 'GET',
					url: window.JetTabsSettings.templateApiUrl,
					dataType: 'json',
					data: {
						'id': templateId,
						'dev': window.JetTabsSettings.devMode
					},
					success: function( responce, textStatus, jqXHR ) {
						var templateContent     = responce['template_content'],
							templateScripts     = responce['template_scripts'],
							templateStyles      = responce['template_styles'];

						for ( var scriptHandler in templateScripts ) {
							JetTabs.addedAssetsPromises.push( JetTabs.loadScriptAsync( scriptHandler, templateScripts[ scriptHandler ] ) );
						}

						for ( var styleHandler in templateStyles ) {
							JetTabs.addedAssetsPromises.push( JetTabs.loadStyle( styleHandler, templateStyles[ styleHandler ] ) );
						}

						Promise.all( JetTabs.addedAssetsPromises ).then( function( value ) {
							loader.remove();
							$contentHolderInner.append( templateContent );
							JetTabs.elementorFrontendInit( $contentHolderInner );
						}, function( reason ) {
							console.log( 'Script Loaded Error' );
						});
					}
				} );//end
			}

			// Hash Watch Handler
			if ( togglesArray ) {

				$controlsList.each( function( index ) {
					var $this    = $( this ),
						id       = $this.attr( 'id' ),
						toggleIndex = index;

					togglesArray.forEach( function( itemHash, i ) {
						if ( itemHash === id ) {
							$this.trigger('click.jetAccordion');
						}
					} );

				} );
			}

			$controlsList.each( function() {
				anchorSelectors.push( 'a[href*="#' + $( this ).attr( 'id' ) + '"]' );
			} );

			$( document ).on( 'click.jetAccordionAnchor', anchorSelectors.join( ',' ), function( event ) {
				var $hash = $( this.hash );

				if ( ! $hash.closest( $scope )[0] ) {
					return;
				}

				$hash.trigger( 'click.jetAccordion' );
			} );

		},// accordionInit end

		imageAccordionInit: function( $scope) {
			var $target  = $( '.jet-image-accordion', $scope ),
				instance = null,
				settings = {};

			if ( ! $target.length ) {
				return;
			}

			settings = $target.data( 'settings' );

			instance = new jetImageAccordion( $target, settings );
			instance.init();
		},// imageAccordionInit end

		loadScriptAsync: function( script, uri ) {

			if ( JetTabs.addedScripts.hasOwnProperty( script ) ) {
				return script;
			}

			if ( !uri ) {
				return;
			}

			JetTabs.addedScripts[ script ] = uri;

			return new Promise( function( resolve, reject ) {
				var tag = document.createElement( 'script' );

				tag.src    = uri;
				tag.async  = true;
				tag.onload = function() {
					resolve( script );
				};

				document.head.appendChild( tag );
			});
		},

		loadStyle: function( style, uri ) {

			if ( JetTabs.addedStyles.hasOwnProperty( style ) && JetTabs.addedStyles[ style ] ===  uri) {
				return style;
			}

			if ( !uri ) {
				return;
			}

			JetTabs.addedStyles[ style ] = uri;

			return new Promise( function( resolve, reject ) {
				var tag = document.createElement( 'link' );

				tag.id      = style;
				tag.rel     = 'stylesheet';
				tag.href    = uri;
				tag.type    = 'text/css';
				tag.media   = 'all';
				tag.onload  = function() {
					resolve( style );
				};

				document.head.appendChild( tag );
			});
		},

		elementorFrontendInit: function( $container ) {

			$container.find( '[data-element_type]' ).each( function() {
				var $this       = $( this ),
					elementType = $this.data( 'element_type' );

				if ( ! elementType ) {
					return;
				}

				try {
					if ( 'widget' === elementType ) {
						elementType = $this.data( 'widget_type' );
						window.elementorFrontend.hooks.doAction( 'frontend/element_ready/widget', $this, $ );
					}

					window.elementorFrontend.hooks.doAction( 'frontend/element_ready/global', $this, $ );
					window.elementorFrontend.hooks.doAction( 'frontend/element_ready/' + elementType, $this, $ );

				} catch ( err ) {
					console.log(err);

					$this.remove();

					return false;
				}
			} );

		}

	};

	/**
	 * jetImageAccordion Class
	 *
	 * @return {void}
	 */
	window.jetImageAccordion = function( $selector, settings ) {
		var self            = this,
			$instance       = $selector,
			$itemsList      = $( '.jet-image-accordion__item', $instance ),
			itemslength     = $itemsList.length,
			defaultSettings = {
				orientation: 'vertical',
				activeSize:  {
					size: 50,
					unit: '%'
				},
				duration: 500,
				activeItem: -1
			},
			settings        = settings || {},
			activeItem      = -1;

		/**
		 * Checking options, settings and options merging
		 */
		settings = $.extend( defaultSettings, settings );

		activeItem = settings['activeItem'];

		/**
		 * Layout Build
		 */
		this.layoutBuild = function( ) {

			$itemsList.css( {
				'transition-duration': settings.duration + 'ms'
			} );

			$itemsList.each( function( index ) {
				if ( index === activeItem ) {
					$( this ).addClass( 'active-accordion' );
					self.layoutRender();
				}
			} );

			$( '.jet-image-accordion__image-instance', $itemsList ).imagesLoaded().progress( function( instance, image ) {
				var $image      = $( image.img ),
					$parentItem = $image.closest( '.jet-image-accordion__item' ),
					$loader     = $( '.jet-image-accordion__item-loader', $parentItem );

				$image.addClass( 'loaded' );

				$loader.fadeTo( 250, 0, function() {
					$( this ).remove();
				} );
			});

			self.layoutRender();
			self.addEvents();
		}

		/**
		 * Layout Render
		 */
		this.layoutRender = function( $accordionItem ) {
			var $accordionItem = $accordionItem || false,
				activeSize     = settings.activeSize.size,
				basis          = ( 100 / itemslength ).toFixed(2),
				grow           = activeSize / ( ( 100 - activeSize  ) / ( itemslength - 1 ) );

			$( '.jet-image-accordion__item:not(.active-accordion)', $instance ).css( {
				'flex-grow': 1
			} );

			$( '.active-accordion', $instance ).css( {
				'flex-grow': grow
			} );
		}

		this.addEvents = function() {
			var toogleEvents = 'mouseenter',
				scrollOffset = $( window ).scrollTop();

			if ( 'ontouchend' in window || 'ontouchstart' in window ) {
				$itemsList.on( 'touchstart.jetImageAccordion', function( event ) {
					scrollOffset = $( window ).scrollTop();
				} );

				$itemsList.on( 'touchend.jetImageAccordion', function( event ) {
					event.stopPropagation();

					var $this = $( this );

					if ( scrollOffset !== $( window ).scrollTop() ) {
						return false;
					}

					if ( ! $this.hasClass( 'active-accordion' ) ) {
						$itemsList.removeClass( 'active-accordion' );
						$this.addClass( 'active-accordion' );
					} else {
						$itemsList.removeClass( 'active-accordion' );
					}

					self.layoutRender();
				} );
			} else {
				$itemsList.on( 'mouseenter', function( event ) {
					var $this = $( this );

					if ( ! $this.hasClass( 'active-accordion' ) ) {
						$itemsList.removeClass( 'active-accordion' );
						$this.addClass( 'active-accordion' );
					}

					self.layoutRender();
				} );
			}

			$instance.on( 'mouseleave.jetImageAccordion', function( event ) {
				$itemsList.removeClass( 'active-accordion' );

				if ( -1 !== activeItem ) {
					$itemsList.eq( activeItem ).addClass( 'active-accordion' );
				}

				self.layoutRender();
			} );

			/*$( document ).on( 'touchend.jetImageAccordion', function( event ) {
				$itemsList.removeClass( 'active-accordion' );
				self.layoutRender();
			} );*/
		}

		/**
		 * Init
		 */
		this.init = function() {
			self.layoutBuild();
		}
	}

	$( window ).on( 'elementor/frontend/init', JetTabs.init );

	window.JetTabs = JetTabs;

}( jQuery, window.elementorFrontend, window.JetTabsSettings ) );
