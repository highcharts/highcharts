
/**
 * A wrapper object for SVG elements
 */
function SVGElement() {}

SVGElement.prototype = {
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this;
		wrapper.element = nodeName === 'span' ?
			createElement(nodeName) :
			doc.createElementNS(SVG_NS, nodeName);
		wrapper.renderer = renderer;
		/**
		 * A collection of attribute setters. These methods, if defined, are called right before a certain
		 * attribute is set on an element wrapper. Returning false prevents the default attribute
		 * setter to run. Returning a value causes the default setter to set that value. Used in
		 * Renderer.label.
		 */
		wrapper.attrSetters = {};
	},
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} options The same options as in jQuery animation
	 * @param {Function} complete Function to perform at the end of animation
	 */
	animate: function (params, options, complete) {
		var animOptions = pick(options, globalAnimation, true);
		stop(this); // stop regardless of animation actually running, or reverting to .attr (#607)
		if (animOptions) {
			animOptions = merge(animOptions);
			if (complete) { // allows using a callback with the global animation without overwriting it
				animOptions.complete = complete;
			}
			animate(this, params, animOptions);
		} else {
			this.attr(params);
			if (complete) {
				complete();
			}
		}
	},
	/**
	 * Set or get a given attribute
	 * @param {Object|String} hash
	 * @param {Mixed|Undefined} val
	 */
	attr: function (hash, val) {
		var wrapper = this,
			key,
			value,
			result,
			i,
			child,
			element = wrapper.element,
			nodeName = element.nodeName,
			renderer = wrapper.renderer,
			skipAttr,
			titleNode,
			attrSetters = wrapper.attrSetters,
			shadows = wrapper.shadows,
			hasSetSymbolSize,
			doTransform,
			ret = wrapper;

		// single key-value pair
		if (isString(hash) && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter: first argument is a string, second is undefined
		if (isString(hash)) {
			key = hash;
			if (nodeName === 'circle') {
				key = { x: 'cx', y: 'cy' }[key] || key;
			} else if (key === 'strokeWidth') {
				key = 'stroke-width';
			}
			ret = attr(element, key) || wrapper[key] || 0;

			if (key !== 'd' && key !== 'visibility') { // 'd' is string in animation step
				ret = parseFloat(ret);
			}

		// setter
		} else {

			for (key in hash) {
				skipAttr = false; // reset
				value = hash[key];

				// check for a specific attribute setter
				result = attrSetters[key] && attrSetters[key](value, key);

				if (result !== false) {
					if (result !== UNDEFINED) {
						value = result; // the attribute setter has returned a new value to set
					}

					// paths
					if (key === 'd') {
						if (value && value.join) { // join path
							value = value.join(' ');
						}
						if (/(NaN| {2}|^$)/.test(value)) {
							value = 'M 0 0';
						}
						//wrapper.d = value; // shortcut for animations

					// update child tspans x values
					} else if (key === 'x' && nodeName === 'text') {
						for (i = 0; i < element.childNodes.length; i++) {
							child = element.childNodes[i];
							// if the x values are equal, the tspan represents a linebreak
							if (attr(child, 'x') === attr(element, 'x')) {
								//child.setAttribute('x', value);
								attr(child, 'x', value);
							}
						}

						if (wrapper.rotation) {
							attr(element, 'transform', 'rotate(' + wrapper.rotation + ' ' + value + ' ' +
								pInt(hash.y || attr(element, 'y')) + ')');
						}

					// apply gradients
					} else if (key === 'fill') {
						value = renderer.color(value, element, key);

					// circle x and y
					} else if (nodeName === 'circle' && (key === 'x' || key === 'y')) {
						key = { x: 'cx', y: 'cy' }[key] || key;

					// rectangle border radius
					} else if (nodeName === 'rect' && key === 'r') {
						attr(element, {
							rx: value,
							ry: value
						});
						skipAttr = true;

					// translation and text rotation
					} else if (key === 'translateX' || key === 'translateY' || key === 'rotation' || key === 'verticalAlign') {
						doTransform = true;
						skipAttr = true;

					// apply opacity as subnode (required by legacy WebKit and Batik)
					} else if (key === 'stroke') {
						value = renderer.color(value, element, key);

					// emulate VML's dashstyle implementation
					} else if (key === 'dashstyle') {
						key = 'stroke-dasharray';
						value = value && value.toLowerCase();
						if (value === 'solid') {
							value = NONE;
						} else if (value) {
							value = value
								.replace('shortdashdotdot', '3,1,1,1,1,1,')
								.replace('shortdashdot', '3,1,1,1')
								.replace('shortdot', '1,1,')
								.replace('shortdash', '3,1,')
								.replace('longdash', '8,3,')
								.replace(/dot/g, '1,3,')
								.replace('dash', '4,3,')
								.replace(/,$/, '')
								.split(','); // ending comma

							i = value.length;
							while (i--) {
								value[i] = pInt(value[i]) * hash['stroke-width'];
							}
							value = value.join(',');
						}

					// special
					} else if (key === 'isTracker') {
						wrapper[key] = value;

					// IE9/MooTools combo: MooTools returns objects instead of numbers and IE9 Beta 2
					// is unable to cast them. Test again with final IE9.
					} else if (key === 'width') {
						value = pInt(value);

					// Text alignment
					} else if (key === 'align') {
						key = 'text-anchor';
						value = { left: 'start', center: 'middle', right: 'end' }[value];

					// Title requires a subnode, #431
					} else if (key === 'title') {
						titleNode = element.getElementsByTagName('title')[0];
						if (!titleNode) {
							titleNode = doc.createElementNS(SVG_NS, 'title');
							element.appendChild(titleNode);
						}
						titleNode.textContent = value;
					}

					// jQuery animate changes case
					if (key === 'strokeWidth') {
						key = 'stroke-width';
					}

					// Chrome/Win < 6 bug (http://code.google.com/p/chromium/issues/detail?id=15461)
					if (isWebKit && key === 'stroke-width' && value === 0) {
						value = 0.000001;
					}

					// symbols
					if (wrapper.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(key)) {


						if (!hasSetSymbolSize) {
							wrapper.symbolAttr(hash);
							hasSetSymbolSize = true;
						}
						skipAttr = true;
					}

					// let the shadow follow the main element
					if (shadows && /^(width|height|visibility|x|y|d|transform)$/.test(key)) {
						i = shadows.length;
						while (i--) {
							attr(shadows[i], key, mathMax(value - ((key === 'height' && shadows[i].cutHeight) || 0), 0));
						}
					}

					// validate heights
					if ((key === 'width' || key === 'height') && nodeName === 'rect' && value < 0) {
						value = 0;
					}

					// Record for animation and quick access without polling the DOM
					wrapper[key] = value;
					
					// Update transform
					if (doTransform) {
						wrapper.updateTransform();
					}


					if (key === 'text') {
						// only one node allowed
						wrapper.textStr = value;
						if (wrapper.added) {
							renderer.buildText(wrapper);
						}
					} else if (!skipAttr) {
						attr(element, key, value);
					}

				}

			}

		}
		
		// Workaround for our #732, WebKit's issue https://bugs.webkit.org/show_bug.cgi?id=78385
		// TODO: If the WebKit team fix this bug before the final release of Chrome 18, remove the workaround.
		if (isWebKit && /Chrome\/(18|19)/.test(userAgent)) {
			if (nodeName === 'text' && (hash.x !== UNDEFINED || hash.y !== UNDEFINED)) {
				var parent = element.parentNode,
					next = element.nextSibling;
			
				if (parent) {
					parent.removeChild(element);
					if (next) {
						parent.insertBefore(element, next);
					} else {
						parent.appendChild(element);
					}
				}
			}
		}
		// End of workaround for #732
		
		return ret;
	},

	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 * @param {Object} hash
	 */
	symbolAttr: function (hash) {
		var wrapper = this;

		each(['x', 'y', 'r', 'start', 'end', 'width', 'height', 'innerR', 'anchorX', 'anchorY'], function (key) {
			wrapper[key] = pick(hash[key], wrapper[key]);
		});

		wrapper.attr({
			d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.width, wrapper.height, wrapper)
		});
	},

	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function (clipRect) {
		return this.attr('clip-path', 'url(' + this.renderer.url + '#' + clipRect.id + ')');
	},

	/**
	 * Calculate the coordinates needed for drawing a rectangle crisply and return the
	 * calculated attributes
	 * @param {Number} strokeWidth
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	crisp: function (strokeWidth, x, y, width, height) {

		var wrapper = this,
			key,
			attribs = {},
			values = {},
			normalizer;

		strokeWidth = strokeWidth || wrapper.strokeWidth || (wrapper.attr && wrapper.attr('stroke-width')) || 0;
		normalizer = mathRound(strokeWidth) % 2 / 2; // mathRound because strokeWidth can sometimes have roundoff errors

		// normalize for crisp edges
		values.x = mathFloor(x || wrapper.x || 0) + normalizer;
		values.y = mathFloor(y || wrapper.y || 0) + normalizer;
		values.width = mathFloor((width || wrapper.width || 0) - 2 * normalizer);
		values.height = mathFloor((height || wrapper.height || 0) - 2 * normalizer);
		values.strokeWidth = strokeWidth;

		for (key in values) {
			if (wrapper[key] !== values[key]) { // only set attribute if changed
				wrapper[key] = attribs[key] = values[key];
			}
		}

		return attribs;
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function (styles) {
		/*jslint unparam: true*//* allow unused param a in the regexp function below */
		var elemWrapper = this,
			elem = elemWrapper.element,
			textWidth = styles && styles.width && elem.nodeName === 'text',
			n,
			serializedCss = '',
			hyphenate = function (a, b) { return '-' + b.toLowerCase(); };
		/*jslint unparam: false*/

		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}

		// Merge the new styles with the old ones
		styles = extend(
			elemWrapper.styles,
			styles
		);

		// store object
		elemWrapper.styles = styles;

		// serialize and set style attribute
		if (isIE && !hasSVG) { // legacy IE doesn't support setting style attribute
			if (textWidth) {
				delete styles.width;
			}
			css(elemWrapper.element, styles);
		} else {
			for (n in styles) {
				serializedCss += n.replace(/([A-Z])/g, hyphenate) + ':' + styles[n] + ';';
			}
			elemWrapper.attr({
				style: serializedCss
			});
		}


		// re-build text
		if (textWidth && elemWrapper.added) {
			elemWrapper.renderer.buildText(elemWrapper);
		}

		return elemWrapper;
	},

	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		var fn = handler;
		// touch
		if (hasTouch && eventType === 'click') {
			eventType = 'touchstart';
			fn = function (e) {
				e.preventDefault();
				handler();
			};
		}
		// simplest possible event model for internal use
		this.element['on' + eventType] = fn;
		return this;
	},
	
	/**
	 * Set the coordinates needed to draw a consistent radial gradient across
	 * pie slices regardless of positioning inside the chart. The format is
	 * [centerX, centerY, diameter] in pixels.
	 */
	setRadialReference: function (coordinates) {
		this.element.radialReference = coordinates;
		return this;
	},

	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function (x, y) {
		return this.attr({
			translateX: x,
			translateY: y
		});
	},

	/**
	 * Invert a group, rotate and flip
	 */
	invert: function () {
		var wrapper = this;
		wrapper.inverted = true;
		wrapper.updateTransform();
		return wrapper;
	},

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

	htmlGetBBox: function (refresh) {
		var wrapper = this,
			element = wrapper.element,
			bBox = wrapper.bBox;

		// faking getBBox in exported SVG in legacy IE
		if (!bBox || refresh) {
			// faking getBBox in exported SVG in legacy IE
			if (element.nodeName === 'text') {
				element.style.position = ABSOLUTE;
			}

			bBox = wrapper.bBox = {
				x: element.offsetLeft,
				y: element.offsetTop,
				width: element.offsetWidth,
				height: element.offsetHeight
			};
		}

		return bBox;
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
			nonLeft = align && align !== 'left',
			shadows = wrapper.shadows;

		// apply translate
		if (translateX || translateY) {
			css(elem, {
				marginLeft: translateX,
				marginTop: translateY
			});
			if (shadows) { // used in labels/tooltip
				each(shadows, function (shadow) {
					css(shadow, {
						marginLeft: translateX + 1,
						marginTop: translateY + 1
					});
				});
			}
		}

		// apply inversion
		if (wrapper.inverted) { // wrapper is a group
			each(elem.childNodes, function (child) {
				renderer.invertChild(child, elem);
			});
		}

		if (elem.tagName === 'SPAN') {

			var width, height,
				rotation = wrapper.rotation,
				baseline,
				radians = 0,
				costheta = 1,
				sintheta = 0,
				quad,
				textWidth = pInt(wrapper.textWidth),
				xCorr = wrapper.xCorr || 0,
				yCorr = wrapper.yCorr || 0,
				currentTextTransform = [rotation, align, elem.innerHTML, wrapper.textWidth].join(',');

			if (currentTextTransform !== wrapper.cTT) { // do the calculations and DOM access only if properties changed

				if (defined(rotation)) {
					radians = rotation * deg2rad; // deg to rad
					costheta = mathCos(radians);
					sintheta = mathSin(radians);

					// Adjust for alignment and rotation. Rotation of useHTML content is not yet implemented
					// but it can probably be implemented for Firefox 3.5+ on user request. FF3.5+
					// has support for CSS3 transform. The getBBox method also needs to be updated
					// to compensate for the rotation, like it currently does for SVG.
					// Test case: http://highcharts.com/tests/?file=text-rotation
					css(elem, {
						filter: rotation ? ['progid:DXImageTransform.Microsoft.Matrix(M11=', costheta,
							', M12=', -sintheta, ', M21=', sintheta, ', M22=', costheta,
							', sizingMethod=\'auto expand\')'].join('') : NONE
					});
				}

				width = pick(wrapper.elemWidth, elem.offsetWidth);
				height = pick(wrapper.elemHeight, elem.offsetHeight);

				// update textWidth
				if (width > textWidth) {
					css(elem, {
						width: textWidth + PX,
						display: 'block',
						whiteSpace: 'normal'
					});
					width = textWidth;
				}

				// correct x and y
				baseline = renderer.fontMetrics(elem.style.fontSize).b;
				xCorr = costheta < 0 && -width;
				yCorr = sintheta < 0 && -height;

				// correct for baseline and corners spilling out after rotation
				quad = costheta * sintheta < 0;
				xCorr += sintheta * baseline * (quad ? 1 - alignCorrection : alignCorrection);
				yCorr -= costheta * baseline * (rotation ? (quad ? alignCorrection : 1 - alignCorrection) : 1);

				// correct for the length/height of the text
				if (nonLeft) {
					xCorr -= width * alignCorrection * (costheta < 0 ? -1 : 1);
					if (rotation) {
						yCorr -= height * alignCorrection * (sintheta < 0 ? -1 : 1);
					}
					css(elem, {
						textAlign: align
					});
				}

				// record correction
				wrapper.xCorr = xCorr;
				wrapper.yCorr = yCorr;
			}

			// apply position with correction
			css(elem, {
				left: (x + xCorr) + PX,
				top: (y + yCorr) + PX
			});

			// record current text transform
			wrapper.cTT = currentTextTransform;
		}
	},

	/**
	 * Private method to update the transform attribute based on internal
	 * properties
	 */
	updateTransform: function () {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			inverted = wrapper.inverted,
			rotation = wrapper.rotation,
			transform = [];

		// flipping affects translate as adjustment for flipping around the group's axis
		if (inverted) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}

		// apply translate
		if (translateX || translateY) {
			transform.push('translate(' + translateX + ',' + translateY + ')');
		}

		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		} else if (rotation) { // text rotation
			transform.push('rotate(' + rotation + ' ' + (wrapper.x || 0) + ' ' + (wrapper.y || 0) + ')');
		}

		if (transform.length) {
			attr(wrapper.element, 'transform', transform.join(' '));
		}
	},
	/**
	 * Bring the element to the front
	 */
	toFront: function () {
		var element = this.element;
		element.parentNode.appendChild(element);
		return this;
	},


	/**
	 * Break down alignment options like align, verticalAlign, x and y
	 * to x and y relative to the chart.
	 *
	 * @param {Object} alignOptions
	 * @param {Boolean} alignByTranslate
	 * @param {Object} box The box to align to, needs a width and height
	 *
	 */
	align: function (alignOptions, alignByTranslate, box) {
		var elemWrapper = this;

		if (!alignOptions) { // called on resize
			alignOptions = elemWrapper.alignOptions;
			alignByTranslate = elemWrapper.alignByTranslate;
		} else { // first call on instanciate
			elemWrapper.alignOptions = alignOptions;
			elemWrapper.alignByTranslate = alignByTranslate;
			if (!box) { // boxes other than renderer handle this internally
				elemWrapper.renderer.alignedObjects.push(elemWrapper);
			}
		}

		box = pick(box, elemWrapper.renderer);

		var align = alignOptions.align,
			vAlign = alignOptions.verticalAlign,
			x = (box.x || 0) + (alignOptions.x || 0), // default: left align
			y = (box.y || 0) + (alignOptions.y || 0), // default: top align
			attribs = {};


		// align
		if (/^(right|center)$/.test(align)) {
			x += (box.width - (alignOptions.width || 0)) /
					{ right: 1, center: 2 }[align];
		}
		attribs[alignByTranslate ? 'translateX' : 'x'] = mathRound(x);


		// vertical align
		if (/^(bottom|middle)$/.test(vAlign)) {
			y += (box.height - (alignOptions.height || 0)) /
					({ bottom: 1, middle: 2 }[vAlign] || 1);

		}
		attribs[alignByTranslate ? 'translateY' : 'y'] = mathRound(y);

		// animate only if already placed
		elemWrapper[elemWrapper.placed ? 'animate' : 'attr'](attribs);
		elemWrapper.placed = true;
		elemWrapper.alignAttr = attribs;

		return elemWrapper;
	},

	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function (refresh) {
		var wrapper = this,
			bBox,
			width,
			height,
			rotation = wrapper.rotation,
			element = wrapper.element,
			rad = rotation * deg2rad;

		// SVG elements
		if (element.namespaceURI === SVG_NS) {
			try { // Fails in Firefox if the container has display: none.
				
				bBox = element.getBBox ?
					// SVG: use extend because IE9 is not allowed to change width and height in case
					// of rotation (below)
					extend({}, element.getBBox()) :
					// Canvas renderer: // TODO: can this be removed now that we're checking for the SVG NS?
					{
						width: element.offsetWidth,
						height: element.offsetHeight
					};
			} catch (e) {}
			
			// If the bBox is not set, the try-catch block above failed. The other condition
			// is for Opera that returns a width of -Infinity on hidden elements.
			if (!bBox || bBox.width < 0) {
				bBox = { width: 0, height: 0 };
			}
			
			width = bBox.width;
			height = bBox.height;

			// adjust for rotated text
			if (rotation) {
				bBox.width = mathAbs(height * mathSin(rad)) + mathAbs(width * mathCos(rad));
				bBox.height = mathAbs(height * mathCos(rad)) + mathAbs(width * mathSin(rad));
			}

		// VML Renderer or useHTML within SVG
		} else {
			bBox = wrapper.htmlGetBBox(refresh);
		}

		return bBox;
	},

	/**
	 * Show the element
	 */
	show: function () {
		return this.attr({ visibility: VISIBLE });
	},

	/**
	 * Hide the element
	 */
	hide: function () {
		return this.attr({ visibility: HIDDEN });
	},

	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *    to append the element to the renderer.box.
	 */
	add: function (parent) {

		var renderer = this.renderer,
			parentWrapper = parent || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes = parentNode.childNodes,
			element = this.element,
			zIndex = attr(element, 'zIndex'),
			otherElement,
			otherZIndex,
			i,
			inserted;

		// mark as inverted
		this.parentInverted = parent && parent.inverted;

		// build formatted text
		if (this.textStr !== undefined) {
			renderer.buildText(this);
		}

		// mark the container as having z indexed children
		if (zIndex) {
			parentWrapper.handleZ = true;
			zIndex = pInt(zIndex);
		}

		// insert according to this and other elements' zIndex
		if (parentWrapper.handleZ) { // this element or any of its siblings has a z index
			for (i = 0; i < childNodes.length; i++) {
				otherElement = childNodes[i];
				otherZIndex = attr(otherElement, 'zIndex');
				if (otherElement !== element && (
						// insert before the first element with a higher zIndex
						pInt(otherZIndex) > zIndex ||
						// if no zIndex given, insert before the first element with a zIndex
						(!defined(zIndex) && defined(otherZIndex))

						)) {
					parentNode.insertBefore(element, otherElement);
					inserted = true;
					break;
				}
			}
		}

		// default: append at the end
		if (!inserted) {
			parentNode.appendChild(element);
		}

		// mark as added
		this.added = true;

		// fire an event for internal hooks
		fireEvent(this, 'add');

		return this;
	},

	/**
	 * Removes a child either by removeChild or move to garbageBin.
	 * Issue 490; in VML removeChild results in Orphaned nodes according to sIEve, discardElement does not.
	 */
	safeRemoveChild: function (element) {
		var parentNode = element.parentNode;
		if (parentNode) {
			parentNode.removeChild(element);
		}
	},

	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function () {
		var wrapper = this,
			element = wrapper.element || {},
			shadows = wrapper.shadows,
			box = wrapper.box,
			key,
			i;

		// remove events
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = null;
		stop(wrapper); // stop running animations

		if (wrapper.clipPath) {
			wrapper.clipPath = wrapper.clipPath.destroy();
		}

		// Destroy stops in case this is a gradient object
		if (wrapper.stops) {
			for (i = 0; i < wrapper.stops.length; i++) {
				wrapper.stops[i] = wrapper.stops[i].destroy();
			}
			wrapper.stops = null;
		}

		// remove element
		wrapper.safeRemoveChild(element);

		// destroy shadows
		if (shadows) {
			each(shadows, function (shadow) {
				wrapper.safeRemoveChild(shadow);
			});
		}

		// destroy label box
		if (box) {
			box.destroy();
		}

		// remove from alignObjects
		erase(wrapper.renderer.alignedObjects, wrapper);

		for (key in wrapper) {
			delete wrapper[key];
		}

		return null;
	},

	/**
	 * Empty a group element
	 */
	empty: function () {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length;

		while (i--) {
			element.removeChild(childNodes[i]);
		}
	},

	/**
	 * Add a shadow to the element. Must be done after the element is added to the DOM
	 * @param {Boolean} apply
	 */
	shadow: function (apply, group, cutOff) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			strokeWidth,

			// compensate for inverted plot area
			transform = this.parentInverted ? '(-1,-1)' : '(1,1)';


		if (apply) {
			for (i = 1; i <= 3; i++) {
				shadow = element.cloneNode(0);
				strokeWidth = 7 - 2 * i;
				attr(shadow, {
					'isShadow': 'true',
					'stroke': 'rgb(0, 0, 0)',
					'stroke-opacity': 0.05 * i,
					'stroke-width': strokeWidth,
					'transform': 'translate' + transform,
					'fill': NONE
				});
				if (cutOff) {
					attr(shadow, 'height', attr(shadow, 'height') - strokeWidth);
					shadow.cutHeight = strokeWidth;
				}

				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				shadows.push(shadow);
			}

			this.shadows = shadows;
		}
		return this;

	}
};


/**
 * The default SVG renderer
 */
var SVGRenderer = function () {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	Element: SVGElement,

	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Boolean} forExport
	 */
	init: function (container, width, height, forExport) {
		var renderer = this,
			loc = location,
			boxWrapper;

		boxWrapper = renderer.createElement('svg')
			.attr({
				xmlns: SVG_NS,
				version: '1.1'
			});
		container.appendChild(boxWrapper.element);

		// object properties
		renderer.isSVG = true;
		renderer.box = boxWrapper.element;
		renderer.boxWrapper = boxWrapper;
		renderer.alignedObjects = [];
		renderer.url = isIE ? '' : loc.href.replace(/#.*?$/, '')
			.replace(/([\('\)])/g, '\\$1'); // Page url used for internal references. #24, #672.
		renderer.defs = this.createElement('defs').add();
		renderer.forExport = forExport;
		renderer.gradients = {}; // Object where gradient SvgElements are stored

		renderer.setSize(width, height, false);



		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position may land
		// between pixels. The container itself doesn't display this, but an SVG element
		// inside this container will be drawn at subpixel precision. In order to draw
		// sharp lines, this must be compensated for. This doesn't seem to work inside
		// iframes though (like in jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			renderer.subPixelFix = subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				css(container, {
					left: (mathCeil(rect.left) - rect.left) + PX,
					top: (mathCeil(rect.top) - rect.top) + PX
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			addEvent(win, 'resize', subPixelFix);
		}
	},

	/**
	 * Detect whether the renderer is hidden. This happens when one of the parent elements
	 * has display: none. #608.
	 */
	isHidden: function () {
		return !this.boxWrapper.getBBox().width;			
	},

	/**
	 * Destroys the renderer and its allocated members.
	 */
	destroy: function () {
		var renderer = this,
			rendererDefs = renderer.defs;
		renderer.box = null;
		renderer.boxWrapper = renderer.boxWrapper.destroy();

		// Call destroy on all gradient elements
		destroyObjectProperties(renderer.gradients || {});
		renderer.gradients = null;

		// Defs are null in VMLRenderer
		// Otherwise, destroy them here.
		if (rendererDefs) {
			renderer.defs = rendererDefs.destroy();
		}

		// Remove sub pixel fix handler
		removeEvent(win, 'resize', renderer.subPixelFix);

		renderer.alignedObjects = null;

		return null;
	},

	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function (nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},

	/**
	 * Dummy function for use in canvas renderer
	 */
	draw: function () {},

	/**
	 * Parse a simple HTML string into SVG tspans
	 *
	 * @param {Object} textNode The parent text SVG node
	 */
	buildText: function (wrapper) {
		var textNode = wrapper.element,
			lines = pick(wrapper.textStr, '').toString()
				.replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
				.replace(/<(i|em)>/g, '<span style="font-style:italic">')
				.replace(/<a/g, '<span')
				.replace(/<\/(b|strong|i|em|a)>/g, '</span>')
				.split(/<br.*?>/g),
			childNodes = textNode.childNodes,
			styleRegex = /style="([^"]+)"/,
			hrefRegex = /href="([^"]+)"/,
			parentX = attr(textNode, 'x'),
			textStyles = wrapper.styles,
			width = textStyles && pInt(textStyles.width),
			textLineHeight = textStyles && textStyles.lineHeight,
			lastLine,
			GET_COMPUTED_STYLE = 'getComputedStyle',
			i = childNodes.length,
			linePositions = [];

		// Needed in IE9 because it doesn't report tspan's offsetHeight (#893)
		function getLineHeightByBBox(lineNo) {
			linePositions[lineNo] = textNode.getBBox().height;
			return mathRound(linePositions[lineNo] - (linePositions[lineNo - 1] || 0));
		}

		// remove old text
		while (i--) {
			textNode.removeChild(childNodes[i]);
		}

		if (width && !wrapper.added) {
			this.box.appendChild(textNode); // attach it to the DOM to read offset width
		}

		// remove empty line at end
		if (lines[lines.length - 1] === '') {
			lines.pop();
		}

		// build the lines
		each(lines, function (line, lineNo) {
			var spans, spanNo = 0, lineHeight;

			line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
			spans = line.split('|||');

			each(spans, function (span) {
				if (span !== '' || spans.length === 1) {
					var attributes = {},
						tspan = doc.createElementNS(SVG_NS, 'tspan');
					if (styleRegex.test(span)) {
						attr(
							tspan,
							'style',
							span.match(styleRegex)[1].replace(/(;| |^)color([ :])/, '$1fill$2')
						);
					}
					if (hrefRegex.test(span)) {
						attr(tspan, 'onclick', 'location.href=\"' + span.match(hrefRegex)[1] + '\"');
						css(tspan, { cursor: 'pointer' });
					}

					span = (span.replace(/<(.|\n)*?>/g, '') || ' ')
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>');

					// issue #38 workaround.
					/*if (reverse) {
						arr = [];
						i = span.length;
						while (i--) {
							arr.push(span.charAt(i));
						}
						span = arr.join('');
					}*/

					// add the text node
					tspan.appendChild(doc.createTextNode(span));

					if (!spanNo) { // first span in a line, align it to the left
						attributes.x = parentX;
					} else {
						// Firefox ignores spaces at the front or end of the tspan
						attributes.dx = 3; // space
					}

					// first span on subsequent line, add the line height
					if (!spanNo) {
						if (lineNo) {

							// allow getting the right offset height in exporting in IE
							if (!hasSVG && wrapper.renderer.forExport) {
								css(tspan, { display: 'block' });
							}

							// Webkit and opera sometimes return 'normal' as the line height. In that
							// case, webkit uses offsetHeight, while Opera falls back to 18
							lineHeight = win[GET_COMPUTED_STYLE] &&
								pInt(win[GET_COMPUTED_STYLE](lastLine, null).getPropertyValue('line-height'));

							if (!lineHeight || isNaN(lineHeight)) {
								lineHeight = textLineHeight || lastLine.offsetHeight || getLineHeightByBBox(lineNo) || 18;
							}
							attr(tspan, 'dy', lineHeight);
						}
						lastLine = tspan; // record for use in next line
					}

					// add attributes
					attr(tspan, attributes);

					// append it
					textNode.appendChild(tspan);

					spanNo++;

					// check width and apply soft breaks
					if (width) {
						var words = span.replace(/-/g, '- ').split(' '),
							tooLong,
							actualWidth,
							rest = [];

						while (words.length || rest.length) {
							actualWidth = wrapper.getBBox().width;
							tooLong = actualWidth > width;
							if (!tooLong || words.length === 1) { // new line needed
								words = rest;
								rest = [];
								if (words.length) {
									tspan = doc.createElementNS(SVG_NS, 'tspan');
									attr(tspan, {
										dy: textLineHeight || 16,
										x: parentX
									});
									textNode.appendChild(tspan);

									if (actualWidth > width) { // a single word is pressing it out
										width = actualWidth;
									}
								}
							} else { // append to existing line tspan
								tspan.removeChild(tspan.firstChild);
								rest.unshift(words.pop());
							}
							if (words.length) {
								tspan.appendChild(doc.createTextNode(words.join(' ').replace(/- /g, '-')));
							}
						}
					}
				}
			});
		});
	},

	/**
	 * Create a button with preset states
	 * @param {String} text
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Function} callback
	 * @param {Object} normalState
	 * @param {Object} hoverState
	 * @param {Object} pressedState
	 */
	button: function (text, x, y, callback, normalState, hoverState, pressedState) {
		var label = this.label(text, x, y),
			curState = 0,
			stateOptions,
			stateStyle,
			normalStyle,
			hoverStyle,
			pressedStyle,
			STYLE = 'style',
			verticalGradient = { x1: 0, y1: 0, x2: 0, y2: 1 };

		// prepare the attributes
		/*jslint white: true*/
		normalState = merge(hash(
			STROKE_WIDTH, 1,
			STROKE, '#999',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#FFF'],
					[1, '#DDD']
				]
			),
			'r', 3,
			'padding', 3,
			STYLE, hash(
				'color', 'black'
			)
		), normalState);
		/*jslint white: false*/
		normalStyle = normalState[STYLE];
		delete normalState[STYLE];

		/*jslint white: true*/
		hoverState = merge(normalState, hash(
			STROKE, '#68A',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#FFF'],
					[1, '#ACF']
				]
			)
		), hoverState);
		/*jslint white: false*/
		hoverStyle = hoverState[STYLE];
		delete hoverState[STYLE];

		/*jslint white: true*/
		pressedState = merge(normalState, hash(
			STROKE, '#68A',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#9BD'],
					[1, '#CDF']
				]
			)
		), pressedState);
		/*jslint white: false*/
		pressedStyle = pressedState[STYLE];
		delete pressedState[STYLE];

		// add the events
		addEvent(label.element, 'mouseenter', function () {
			label.attr(hoverState)
				.css(hoverStyle);
		});
		addEvent(label.element, 'mouseleave', function () {
			stateOptions = [normalState, hoverState, pressedState][curState];
			stateStyle = [normalStyle, hoverStyle, pressedStyle][curState];
			label.attr(stateOptions)
				.css(stateStyle);
		});

		label.setState = function (state) {
			curState = state;
			if (!state) {
				label.attr(normalState)
					.css(normalStyle);
			} else if (state === 2) {
				label.attr(pressedState)
					.css(pressedStyle);
			}
		};

		return label
			.on('click', function () {
				callback.call(label);
			})
			.attr(normalState)
			.css(extend({ cursor: 'default' }, normalStyle));
	},

	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width
	 */
	crispLine: function (points, width) {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] === points[4]) {
			points[1] = points[4] = mathRound(points[1]) + (width % 2 / 2);
		}
		if (points[2] === points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
	},


	/**
	 * Draw a path
	 * @param {Array} path An SVG path in array form
	 */
	path: function (path) {
		var attr = {
			fill: NONE
		};
		if (isArray(path)) {
			attr.d = path;
		} else if (isObject(path)) { // attributes
			extend(attr, path);
		}
		return this.createElement('path').attr(attr);
	},

	/**
	 * Draw and return an SVG circle
	 * @param {Number} x The x position
	 * @param {Number} y The y position
	 * @param {Number} r The radius
	 */
	circle: function (x, y, r) {
		var attr = isObject(x) ?
			x :
			{
				x: x,
				y: y,
				r: r
			};

		return this.createElement('circle').attr(attr);
	},

	/**
	 * Draw and return an arc
	 * @param {Number} x X position
	 * @param {Number} y Y position
	 * @param {Number} r Radius
	 * @param {Number} innerR Inner radius like used in donut charts
	 * @param {Number} start Starting angle
	 * @param {Number} end Ending angle
	 */
	arc: function (x, y, r, innerR, start, end) {
		// arcs are defined as symbols for the ability to set
		// attributes in attr and animate

		if (isObject(x)) {
			y = x.y;
			r = x.r;
			innerR = x.innerR;
			start = x.start;
			end = x.end;
			x = x.x;
		}
		return this.symbol('arc', x || 0, y || 0, r || 0, r || 0, {
			innerR: innerR || 0,
			start: start || 0,
			end: end || 0
		});
	},
	
	/**
	 * Draw and return a rectangle
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} r Border corner radius
	 * @param {Number} strokeWidth A stroke width can be supplied to allow crisp drawing
	 */
	rect: function (x, y, width, height, r, strokeWidth) {
		
		r = isObject(x) ? x.r : r;
		
		var wrapper = this.createElement('rect').attr({
				rx: r,
				ry: r,
				fill: NONE
			});
		return wrapper.attr(
				isObject(x) ? 
					x : 
					// do not crispify when an object is passed in (as in column charts)
					wrapper.crisp(strokeWidth, x, y, mathMax(width, 0), mathMax(height, 0))
			);
	},

	/**
	 * Resize the box and re-align all aligned elements
	 * @param {Object} width
	 * @param {Object} height
	 * @param {Boolean} animate
	 *
	 */
	setSize: function (width, height, animate) {
		var renderer = this,
			alignedObjects = renderer.alignedObjects,
			i = alignedObjects.length;

		renderer.width = width;
		renderer.height = height;

		renderer.boxWrapper[pick(animate, true) ? 'animate' : 'attr']({
			width: width,
			height: height
		});

		while (i--) {
			alignedObjects[i].align();
		}
	},

	/**
	 * Create a group
	 * @param {String} name The group will be given a class name of 'highcharts-{name}'.
	 *     This can be used for styling and scripting.
	 */
	g: function (name) {
		var elem = this.createElement('g');
		return defined(name) ? elem.attr({ 'class': PREFIX + name }) : elem;
	},

	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var attribs = {
				preserveAspectRatio: NONE
			},
			elemWrapper;

		// optional properties
		if (arguments.length > 1) {
			extend(attribs, {
				x: x,
				y: y,
				width: width,
				height: height
			});
		}

		elemWrapper = this.createElement('image').attr(attribs);

		// set the href in the xlink namespace
		if (elemWrapper.element.setAttributeNS) {
			elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink',
				'href', src);
		} else {
			// could be exporting in IE
			// using href throws "not supported" in ie7 and under, requries regex shim to fix later
			elemWrapper.element.setAttribute('hc-svg-href', src);
	}

		return elemWrapper;
	},

	/**
	 * Draw a symbol out of pre-defined shape paths from the namespace 'symbol' object.
	 *
	 * @param {Object} symbol
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} radius
	 * @param {Object} options
	 */
	symbol: function (symbol, x, y, width, height, options) {

		var obj,

			// get the symbol definition function
			symbolFn = this.symbols[symbol],

			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				mathRound(x),
				mathRound(y),
				width,
				height,
				options
			),

			imageRegex = /^url\((.*?)\)$/,
			imageSrc,
			imageSize,
			centerImage;

		if (path) {

			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				width: width,
				height: height
			});
			if (options) {
				extend(obj, options);
			}


		// image symbols
		} else if (imageRegex.test(symbol)) {

			// On image load, set the size and position
			centerImage = function (img, size) {
				img.attr({
					width: size[0],
					height: size[1]
				});

				if (!img.alignByTranslate) { // #185
					img.translate(
						-mathRound(size[0] / 2),
						-mathRound(size[1] / 2)
					);
				}
			};

			imageSrc = symbol.match(imageRegex)[1];
			imageSize = symbolSizes[imageSrc];

			// create the image synchronously, add attribs async
			obj = this.image(imageSrc)
				.attr({
					x: x,
					y: y
				});

			if (imageSize) {
				centerImage(obj, imageSize);
			} else {
				// initialize image to be 0 size so export will still function if there's no cached sizes
				obj.attr({ width: 0, height: 0 });

				// create a dummy JavaScript image to get the width and height
				createElement('img', {
					onload: function () {
						var img = this;

						centerImage(obj, symbolSizes[imageSrc] = [img.width, img.height]);
					},
					src: imageSrc
				});
			}
		}

		return obj;
	},

	/**
	 * An extendable collection of functions for defining symbol paths.
	 */
	symbols: {
		'circle': function (x, y, w, h) {
			var cpw = 0.166 * w;
			return [
				M, x + w / 2, y,
				'C', x + w + cpw, y, x + w + cpw, y + h, x + w / 2, y + h,
				'C', x - cpw, y + h, x - cpw, y, x + w / 2, y,
				'Z'
			];
		},

		'square': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle-down': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w / 2, y + h,
				'Z'
			];
		},
		'diamond': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h / 2,
				x + w / 2, y + h,
				x, y + h / 2,
				'Z'
			];
		},
		'arc': function (x, y, w, h, options) {
			var start = options.start,
				radius = options.r || w || h,
				end = options.end - 0.000001, // to prevent cos and sin of start and end from becoming equal on 360 arcs
				innerRadius = options.innerR,
				open = options.open,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				longArc = options.end - start < mathPI ? 0 : 1;

			return [
				M,
				x + radius * cosStart,
				y + radius * sinStart,
				'A', // arcTo
				radius, // x radius
				radius, // y radius
				0, // slanting
				longArc, // long or short arc
				1, // clockwise
				x + radius * cosEnd,
				y + radius * sinEnd,
				open ? M : L,
				x + innerRadius * cosEnd,
				y + innerRadius * sinEnd,
				'A', // arcTo
				innerRadius, // x radius
				innerRadius, // y radius
				0, // slanting
				longArc, // long or short arc
				0, // clockwise
				x + innerRadius * cosStart,
				y + innerRadius * sinStart,

				open ? '' : 'Z' // close
			];
		}
	},

	/**
	 * Define a clipping rectangle
	 * @param {String} id
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {
		var wrapper,
			id = PREFIX + idCounter++,

			clipPath = this.createElement('clipPath').attr({
				id: id
			}).add(this.defs);

		wrapper = this.rect(x, y, width, height, 0).add(clipPath);
		wrapper.id = id;
		wrapper.clipPath = clipPath;

		return wrapper;
	},


	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object. Prior to Highstock, an array was used to define
	 * a linear gradient with pixel positions relative to the SVG. In newer versions
	 * we change the coordinates to apply relative to the shape, using coordinates
	 * 0-1 within the shape. To preserve backwards compatibility, linearGradient
	 * in this definition is an object of x1, y1, x2 and y2.
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop) {
		var renderer = this,
			colorObject,
			regexRgba = /^rgba/,
			gradName;
		
		// Apply linear or radial gradients
		if (color && color.linearGradient) {
			gradName = 'linearGradient';
		} else if (color && color.radialGradient) {
			gradName = 'radialGradient';
		}
		
		if (gradName) {
			var gradAttr = color[gradName],
				gradients = renderer.gradients,
				gradientObject,
				stopColor,
				stopOpacity,
				radialReference = elem.radialReference;
			
			// Check if a gradient object with the same config object is created within this renderer
			if (!gradAttr.id || !gradients[gradAttr.id]) {
				
				// Keep < 2.2 kompatibility
				if (isArray(gradAttr)) {
					color[gradName] = gradAttr = {
						x1: gradAttr[0],
						y1: gradAttr[1],
						x2: gradAttr[2],
						y2: gradAttr[3],
						gradientUnits: 'userSpaceOnUse'
					};				
				}
				
				// Correct the radial gradient for the radial reference system
				if (gradName === 'radialGradient' && radialReference && !defined(gradAttr.gradientUnits)) {
					extend(gradAttr, {
						cx: (radialReference[0] - radialReference[2] / 2) + gradAttr.cx * radialReference[2],
						cy: (radialReference[1] - radialReference[2] / 2) + gradAttr.cy * radialReference[2],
						r: gradAttr.r * radialReference[2],
						gradientUnits: 'userSpaceOnUse'
					});
				}

				// Set the id and create the element
				gradAttr.id = PREFIX + idCounter++;
				gradients[gradAttr.id] = gradientObject = renderer.createElement(gradName)
					.attr(gradAttr)
					.add(renderer.defs);
				
				
				// The gradient needs to keep a list of stops to be able to destroy them
				gradientObject.stops = [];
				each(color.stops, function (stop) {
					var stopObject;
					if (regexRgba.test(stop[1])) {
						colorObject = Color(stop[1]);
						stopColor = colorObject.get('rgb');
						stopOpacity = colorObject.get('a');
					} else {
						stopColor = stop[1];
						stopOpacity = 1;
					}
					stopObject = renderer.createElement('stop').attr({
						offset: stop[0],
						'stop-color': stopColor,
						'stop-opacity': stopOpacity
					}).add(gradientObject);

					// Add the stop element to the gradient
					gradientObject.stops.push(stopObject);
				});
			}

			// Return the reference to the gradient object
			return 'url(' + renderer.url + '#' + gradAttr.id + ')';
			
		// Webkit and Batik can't show rgba.
		} else if (regexRgba.test(color)) {
			colorObject = Color(color);
			attr(elem, prop + '-opacity', colorObject.get('a'));

			return colorObject.get('rgb');


		} else {
			// Remove the opacity attribute added above. Does not throw if the attribute is not there.
			elem.removeAttribute(prop + '-opacity');

			return color;
		}

	},


	/**
	 * Add text to the SVG object
	 * @param {String} str
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Boolean} useHTML Use HTML to render the text
	 */
	text: function (str, x, y, useHTML) {

		// declare variables
		var renderer = this,
			defaultChartStyle = defaultOptions.chart.style,
			wrapper;

		if (useHTML && !renderer.forExport) {
			return renderer.html(str, x, y);
		}

		x = mathRound(pick(x, 0));
		y = mathRound(pick(y, 0));

		wrapper = renderer.createElement('text')
			.attr({
				x: x,
				y: y,
				text: str
			})
			.css({
				fontFamily: defaultChartStyle.fontFamily,
				fontSize: defaultChartStyle.fontSize
			});

		wrapper.x = x;
		wrapper.y = y;
		return wrapper;
	},


	/**
	 * Create HTML text node. This is used by the VML renderer as well as the SVG
	 * renderer through the useHTML option.
	 *
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	html: function (str, x, y) {
		var defaultChartStyle = defaultOptions.chart.style,
			wrapper = this.createElement('span'),
			attrSetters = wrapper.attrSetters,
			element = wrapper.element,
			renderer = wrapper.renderer;

		// Text setter
		attrSetters.text = function (value) {
			element.innerHTML = value;
			return false;
		};

		// Various setters which rely on update transform
		attrSetters.x = attrSetters.y = attrSetters.align = function (value, key) {
			if (key === 'align') {
				key = 'textAlign'; // Do not overwrite the SVGElement.align method. Same as VML.
			}
			wrapper[key] = value;
			wrapper.htmlUpdateTransform();
			return false;
		};

		// Set the default attributes
		wrapper.attr({
				text: str,
				x: mathRound(x),
				y: mathRound(y)
			})
			.css({
				position: ABSOLUTE,
				whiteSpace: 'nowrap',
				fontFamily: defaultChartStyle.fontFamily,
				fontSize: defaultChartStyle.fontSize
			});

		// Use the HTML specific .css method
		wrapper.css = wrapper.htmlCss;

		// This is specific for HTML within SVG
		if (renderer.isSVG) {
			wrapper.add = function (svgGroupWrapper) {

				var htmlGroup,
					htmlGroupStyle,
					container = renderer.box.parentNode;

				// Create a mock group to hold the HTML elements
				if (svgGroupWrapper) {
					htmlGroup = svgGroupWrapper.div;
					if (!htmlGroup) {
						htmlGroup = svgGroupWrapper.div = createElement(DIV, {
							className: attr(svgGroupWrapper.element, 'class')
						}, {
							position: ABSOLUTE,
							left: svgGroupWrapper.attr('translateX') + PX,
							top: svgGroupWrapper.attr('translateY') + PX
						}, container);

						// Ensure dynamic updating position
						htmlGroupStyle = htmlGroup.style;
						extend(svgGroupWrapper.attrSetters, {
							translateX: function (value) {
								htmlGroupStyle.left = value + PX;
							},
							translateY: function (value) {
								htmlGroupStyle.top = value + PX;
							},
							visibility: function (value, key) {
								htmlGroupStyle[key] = value;
							}
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
	},

	/**
	 * Utility to return the baseline offset and total line height from the font size
	 */
	fontMetrics: function (fontSize) {
		fontSize = pInt(fontSize || 11);
		
		// Empirical values found by comparing font size and bounding box height.
		// Applies to the default font family. http://jsfiddle.net/highcharts/7xvn7/
		var lineHeight = fontSize < 24 ? fontSize + 4 : mathRound(fontSize * 1.2),
			baseline = mathRound(lineHeight * 0.8);
		
		return {
			h: lineHeight, 
			b: baseline
		};
	},

	/**
	 * Add a label, a text item that can hold a colored or gradient background
	 * as well as a border and shadow.
	 * @param {string} str
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String} shape
	 * @param {Number} anchorX In case the shape has a pointer, like a flag, this is the
	 *    coordinates it should be pinned to
	 * @param {Number} anchorY
	 * @param {Boolean} baseline Whether to position the label relative to the text baseline,
	 *    like renderer.text, or to the upper border of the rectangle. 
	 * @param {String} className Class name for the group 
	 */
	label: function (str, x, y, shape, anchorX, anchorY, useHTML, baseline, className) {

		var renderer = this,
			wrapper = renderer.g(className),
			text = renderer.text('', 0, 0, useHTML)
				.attr({
					zIndex: 1
				})
				.add(wrapper),
			box,
			bBox,
			alignFactor = 0,
			padding = 3,
			width,
			height,
			wrapperX,
			wrapperY,
			crispAdjust = 0,
			deferredAttr = {},
			baselineOffset,
			attrSetters = wrapper.attrSetters;

		/**
		 * This function runs after the label is added to the DOM (when the bounding box is
		 * available), and after the text of the label is updated to detect the new bounding
		 * box and reflect it in the border box.
		 */
		function updateBoxSize() {
			var boxY,
				style = text.element.style;
				
			bBox = (width === undefined || height === undefined || wrapper.styles.textAlign) &&
				text.getBBox(true);
			wrapper.width = (width || bBox.width || 0) + 2 * padding;
			wrapper.height = (height || bBox.height || 0) + 2 * padding;
			
			// update the label-scoped y offset
			baselineOffset = padding + renderer.fontMetrics(style && style.fontSize).b;
			
			
			// create the border box if it is not already present
			if (!box) {
				boxY = baseline ? -baselineOffset : 0;
			
				wrapper.box = box = shape ?
					renderer.symbol(shape, -alignFactor * padding, boxY, wrapper.width, wrapper.height) :
					renderer.rect(-alignFactor * padding, boxY, wrapper.width, wrapper.height, 0, deferredAttr[STROKE_WIDTH]);
				box.add(wrapper);
			}

			// apply the box attributes
			box.attr(merge({
				width: wrapper.width,
				height: wrapper.height
			}, deferredAttr));
			deferredAttr = null;
		}

		/**
		 * This function runs after setting text or padding, but only if padding is changed
		 */
		function updateTextPadding() {
			var styles = wrapper.styles,
				textAlign = styles && styles.textAlign,
				x = padding * (1 - alignFactor),
				y;
			
			// determin y based on the baseline
			y = baseline ? 0 : baselineOffset;

			// compensate for alignment
			if (defined(width) && (textAlign === 'center' || textAlign === 'right')) {
				x += { center: 0.5, right: 1 }[textAlign] * (width - bBox.width);
			}

			// update if anything changed
			if (x !== text.x || y !== text.y) {
				text.attr({
					x: x,
					y: y
				});
			}

			// record current values
			text.x = x;
			text.y = y;
		}

		/**
		 * Set a box attribute, or defer it if the box is not yet created
		 * @param {Object} key
		 * @param {Object} value
		 */
		function boxAttr(key, value) {
			if (box) {
				box.attr(key, value);
			} else {
				deferredAttr[key] = value;
			}
		}

		function getSizeAfterAdd() {
			wrapper.attr({
				text: str, // alignment is available now
				x: x,
				y: y
			});
			if (wrapper.symbolName) {
				wrapper.attr({
					anchorX: anchorX,
					anchorY: anchorY
				});
			}
		}

		/**
		 * After the text element is added, get the desired size of the border box
		 * and add it before the text in the DOM.
		 */
		addEvent(wrapper, 'add', getSizeAfterAdd);

		/*
		 * Add specific attribute setters.
		 */

		// only change local variables
		attrSetters.width = function (value) {
			width = value;
			return false;
		};
		attrSetters.height = function (value) {
			height = value;
			return false;
		};
		attrSetters.padding = function (value) {
			if (defined(value) && value !== padding) {
				padding = value;
				updateTextPadding();
			}

			return false;
		};

		// change local variable and set attribue as well
		attrSetters.align = function (value) {
			alignFactor = { left: 0, center: 0.5, right: 1 }[value];
			return false; // prevent setting text-anchor on the group
		};
		
		// apply these to the box and the text alike
		attrSetters.text = function (value, key) {
			text.attr(key, value);
			updateBoxSize();
			updateTextPadding();
			return false;
		};

		// apply these to the box but not to the text
		attrSetters[STROKE_WIDTH] = function (value, key) {
			crispAdjust = value % 2 / 2;
			boxAttr(key, value);
			return false;
		};
		attrSetters.stroke = attrSetters.fill = attrSetters.r = function (value, key) {
			boxAttr(key, value);
			return false;
		};
		attrSetters.anchorX = function (value, key) {
			anchorX = value;
			boxAttr(key, value + crispAdjust - wrapperX);
			return false;
		};
		attrSetters.anchorY = function (value, key) {
			anchorY = value;
			boxAttr(key, value - wrapperY);
			return false;
		};
		
		// rename attributes
		attrSetters.x = function (value) {
			wrapper.x = value; // for animation getter
			value -= alignFactor * ((width || bBox.width) + padding);
			wrapperX = mathRound(value); 
			
			wrapper.attr('translateX', wrapperX);
			return false;
		};
		attrSetters.y = function (value) {
			wrapperY = wrapper.y = mathRound(value);
			wrapper.attr('translateY', value);
			return false;
		};

		// Redirect certain methods to either the box or the text
		var baseCss = wrapper.css;
		return extend(wrapper, {
			/**
			 * Pick up some properties and apply them to the text instead of the wrapper
			 */
			css: function (styles) {
				if (styles) {
					var textStyles = {};
					styles = merge({}, styles); // create a copy to avoid altering the original object (#537)
					each(['fontSize', 'fontWeight', 'fontFamily', 'color', 'lineHeight', 'width'], function (prop) {
						if (styles[prop] !== UNDEFINED) {
							textStyles[prop] = styles[prop];
							delete styles[prop];
						}
					});
					text.css(textStyles);
				}
				return baseCss.call(wrapper, styles);
			},
			/**
			 * Return the bounding box of the box, not the group
			 */
			getBBox: function () {
				return box.getBBox();
			},
			/**
			 * Apply the shadow to the box
			 */
			shadow: function (b) {
				box.shadow(b);
				return wrapper;
			},
			/**
			 * Destroy and release memory.
			 */
			destroy: function () {
				removeEvent(wrapper, 'add', getSizeAfterAdd);

				// Added by button implementation
				removeEvent(wrapper.element, 'mouseenter');
				removeEvent(wrapper.element, 'mouseleave');

				if (text) {
					// Destroy the text element
					text = text.destroy();
				}
				// Call base implementation to destroy the rest
				SVGElement.prototype.destroy.call(wrapper);
			}
		});
	}
}; // end SVGRenderer


// general renderer
Renderer = SVGRenderer;
