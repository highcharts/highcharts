/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './SvgRenderer.js';
var attr = H.attr,
	createElement = H.createElement,
	css = H.css,
	defined = H.defined,
	each = H.each,
	extend = H.extend,
	isFirefox = H.isFirefox,
	isMS = H.isMS,
	isWebKit = H.isWebKit,
	pInt = H.pInt,
	SVGElement = H.SVGElement,
	SVGRenderer = H.SVGRenderer,
	win = H.win,
	wrap = H.wrap;

// Extend SvgElement for useHTML option
extend(SVGElement.prototype, /** @lends SVGElement.prototype */ {
	/**
	 * Apply CSS to HTML elements. This is used in text within SVG rendering and
	 * by the VML renderer
	 */
	htmlCss: function (styles) {
		var wrapper = this,
			element = wrapper.element,
			textWidth = styles && element.tagName === 'SPAN' && styles.width;

		if (textWidth) {
			delete styles.width;
			wrapper.textWidth = textWidth;
			wrapper.updateTransform();
		}
		if (styles && styles.textOverflow === 'ellipsis') {
			styles.whiteSpace = 'nowrap';
			styles.overflow = 'hidden';
		}
		wrapper.styles = extend(wrapper.styles, styles);
		css(wrapper.element, styles);

		return wrapper;
	},

	/**
	 * VML and useHTML method for calculating the bounding box based on offsets
	 * @param {Boolean} refresh Whether to force a fresh value from the DOM or to
	 * use the cached value
	 *
	 * @return {Object} A hash containing values for x, y, width and height
	 */

	htmlGetBBox: function () {
		var wrapper = this,
			element = wrapper.element;

		// faking getBBox in exported SVG in legacy IE
		// faking getBBox in exported SVG in legacy IE (is this a duplicate of the fix for #1079?)
		if (element.nodeName === 'text') {
			element.style.position = 'absolute';
		}

		return {
			x: element.offsetLeft,
			y: element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight
		};
	},

	/**
	 * VML override private method to update elements based on internal
	 * properties based on SVG transform
	 */
	htmlUpdateTransform: function () {
		// aligning non added elements is expensive
		if (!this.added) {
			this.alignOnAdd = true;
			return;
		}

		var wrapper = this,
			renderer = wrapper.renderer,
			elem = wrapper.element,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			x = wrapper.x || 0,
			y = wrapper.y || 0,
			align = wrapper.textAlign || 'left',
			alignCorrection = { left: 0, center: 0.5, right: 1 }[align],
			styles = wrapper.styles;

		// apply translate
		css(elem, {
			marginLeft: translateX,
			marginTop: translateY
		});

		/*= if (build.classic) { =*/
		if (wrapper.shadows) { // used in labels/tooltip
			each(wrapper.shadows, function (shadow) {
				css(shadow, {
					marginLeft: translateX + 1,
					marginTop: translateY + 1
				});
			});
		}
		/*= } =*/

		// apply inversion
		if (wrapper.inverted) { // wrapper is a group
			each(elem.childNodes, function (child) {
				renderer.invertChild(child, elem);
			});
		}

		if (elem.tagName === 'SPAN') {

			var rotation = wrapper.rotation,
				baseline,
				textWidth = pInt(wrapper.textWidth),
				whiteSpace = styles && styles.whiteSpace,
				currentTextTransform = [rotation, align, elem.innerHTML, wrapper.textWidth, wrapper.textAlign].join(',');

			if (currentTextTransform !== wrapper.cTT) { // do the calculations and DOM access only if properties changed


				baseline = renderer.fontMetrics(elem.style.fontSize).b;

				// Renderer specific handling of span rotation
				if (defined(rotation)) {
					wrapper.setSpanRotation(rotation, alignCorrection, baseline);
				}

				// Reset multiline/ellipsis in order to read width (#4928, #5417)
				css(elem, {
					width: '',
					whiteSpace: whiteSpace || 'nowrap'
				});

				// Update textWidth
				if (elem.offsetWidth > textWidth && /[ \-]/.test(elem.textContent || elem.innerText)) { // #983, #1254
					css(elem, {
						width: textWidth + 'px',
						display: 'block',
						whiteSpace: whiteSpace || 'normal' // #3331
					});
				}


				wrapper.getSpanCorrection(elem.offsetWidth, baseline, alignCorrection, rotation, align);
			}

			// apply position with correction
			css(elem, {
				left: (x + (wrapper.xCorr || 0)) + 'px',
				top: (y + (wrapper.yCorr || 0)) + 'px'
			});

			// force reflow in webkit to apply the left and top on useHTML element (#1249)
			if (isWebKit) {
				baseline = elem.offsetHeight; // assigned to baseline for lint purpose
			}

			// record current text transform
			wrapper.cTT = currentTextTransform;
		}
	},

	/**
	 * Set the rotation of an individual HTML span
	 */
	setSpanRotation: function (rotation, alignCorrection, baseline) {
		var rotationStyle = {},
			cssTransformKey = isMS ? '-ms-transform' : isWebKit ? '-webkit-transform' : isFirefox ? 'MozTransform' : win.opera ? '-o-transform' : '';

		rotationStyle[cssTransformKey] = rotationStyle.transform = 'rotate(' + rotation + 'deg)';
		rotationStyle[cssTransformKey + (isFirefox ? 'Origin' : '-origin')] = rotationStyle.transformOrigin = (alignCorrection * 100) + '% ' + baseline + 'px';
		css(this.element, rotationStyle);
	},

	/**
	 * Get the correction in X and Y positioning as the element is rotated.
	 */
	getSpanCorrection: function (width, baseline, alignCorrection) {
		this.xCorr = -width * alignCorrection;
		this.yCorr = -baseline;
	}
});

// Extend SvgRenderer for useHTML option.
extend(SVGRenderer.prototype, /** @lends SVGRenderer.prototype */ {
	/**
	 * Create HTML text node. This is used by the VML renderer as well as the SVG
	 * renderer through the useHTML option.
	 *
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	html: function (str, x, y) {
		var wrapper = this.createElement('span'),
			element = wrapper.element,
			renderer = wrapper.renderer,
			isSVG = renderer.isSVG,
			addSetters = function (element, style) {
				// These properties are set as attributes on the SVG group, and as
				// identical CSS properties on the div. (#3542)
				each(['opacity', 'visibility'], function (prop) {
					wrap(element, prop + 'Setter', function (proceed, value, key, elem) {
						proceed.call(this, value, key, elem);
						style[key] = value;
					});
				});				
			};

		// Text setter
		wrapper.textSetter = function (value) {
			if (value !== element.innerHTML) {
				delete this.bBox;
			}
			element.innerHTML = this.textStr = value;
			wrapper.htmlUpdateTransform();
		};

		// Add setters for the element itself (#4938)
		if (isSVG) { // #4938, only for HTML within SVG
			addSetters(wrapper, wrapper.element.style);
		}

		// Various setters which rely on update transform
		wrapper.xSetter = wrapper.ySetter = wrapper.alignSetter = wrapper.rotationSetter = function (value, key) {
			if (key === 'align') {
				key = 'textAlign'; // Do not overwrite the SVGElement.align method. Same as VML.
			}
			wrapper[key] = value;
			wrapper.htmlUpdateTransform();
		};

		// Set the default attributes
		wrapper
			.attr({
				text: str,
				x: Math.round(x),
				y: Math.round(y)
			})
			.css({
				/*= if (build.classic) { =*/
				fontFamily: this.style.fontFamily,
				fontSize: this.style.fontSize,
				/*= } =*/
				position: 'absolute'
			});

		// Keep the whiteSpace style outside the wrapper.styles collection
		element.style.whiteSpace = 'nowrap';

		// Use the HTML specific .css method
		wrapper.css = wrapper.htmlCss;

		// This is specific for HTML within SVG
		if (isSVG) {
			wrapper.add = function (svgGroupWrapper) {

				var htmlGroup,
					container = renderer.box.parentNode,
					parentGroup,
					parents = [];

				this.parentGroup = svgGroupWrapper;

				// Create a mock group to hold the HTML elements
				if (svgGroupWrapper) {
					htmlGroup = svgGroupWrapper.div;
					if (!htmlGroup) {

						// Read the parent chain into an array and read from top down
						parentGroup = svgGroupWrapper;
						while (parentGroup) {

							parents.push(parentGroup);

							// Move up to the next parent group
							parentGroup = parentGroup.parentGroup;
						}

						// Ensure dynamically updating position when any parent is translated
						each(parents.reverse(), function (parentGroup) {
							var htmlGroupStyle,
								cls = attr(parentGroup.element, 'class');

							if (cls) {
								cls = { className: cls };
							} // else null

							// Create a HTML div and append it to the parent div to emulate
							// the SVG group structure
							htmlGroup = parentGroup.div = parentGroup.div || createElement('div', cls, {
								position: 'absolute',
								left: (parentGroup.translateX || 0) + 'px',
								top: (parentGroup.translateY || 0) + 'px',
								display: parentGroup.display,
								opacity: parentGroup.opacity, // #5075
								pointerEvents: parentGroup.styles && parentGroup.styles.pointerEvents // #5595
							}, htmlGroup || container); // the top group is appended to container

							// Shortcut
							htmlGroupStyle = htmlGroup.style;

							// Set listeners to update the HTML div's position whenever the SVG group
							// position is changed
							extend(parentGroup, {
								on: function () {
									wrapper.on.apply({ element: parents[0].div }, arguments);
									return parentGroup;
								},
								translateXSetter: function (value, key) {
									htmlGroupStyle.left = value + 'px';
									parentGroup[key] = value;
									parentGroup.doTransform = true;
								},
								translateYSetter: function (value, key) {
									htmlGroupStyle.top = value + 'px';
									parentGroup[key] = value;
									parentGroup.doTransform = true;
								}
							});
							addSetters(parentGroup, htmlGroupStyle);
						});

					}
				} else {
					htmlGroup = container;
				}

				htmlGroup.appendChild(element);

				// Shared with VML:
				wrapper.added = true;
				if (wrapper.alignOnAdd) {
					wrapper.htmlUpdateTransform();
				}

				return wrapper;
			};
		}
		return wrapper;
	}
});
