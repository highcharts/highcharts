
/**
 * A wrapper object for SVG elements 
 */
function SVGElement () {}

SVGElement.prototype = {
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function(renderer, nodeName) {
		this.element = doc.createElementNS(SVG_NS, nodeName);
		this.renderer = renderer;
	},
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} options The same options as in jQuery animation
	 * @param {Function} complete Function to perform at the end of animation
	 */
	animate: function(params, options, complete) {
		var animOptions = pick(options, globalAnimation, true);
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
	attr: function(hash, val) {
		var key, 
			value, 
			i, 
			child,
			element = this.element,
			nodeName = element.nodeName,
			renderer = this.renderer,
			skipAttr,
			shadows = this.shadows,
			hasSetSymbolSize,
			ret = this;
			
		// single key-value pair
		if (isString(hash) && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}
		
		// used as a getter: first argument is a string, second is undefined
		if (isString(hash)) {
			key = hash;
			if (nodeName == 'circle') {
				key = { x: 'cx', y: 'cy' }[key] || key;
			} else if (key == 'strokeWidth') {
				key = 'stroke-width';
			}
			ret = attr(element, key) || this[key] || 0;
			
			if (key != 'd' && key != 'visibility') { // 'd' is string in animation step
				ret = parseFloat(ret);
			}
			
		// setter
		} else {
		
			for (key in hash) {
				skipAttr = false; // reset
				value = hash[key];
				
				// paths
				if (key == 'd') {
					if (value && value.join) { // join path
						value = value.join(' ');
					}					
					if (/(NaN| {2}|^$)/.test(value)) {
						value = 'M 0 0';
					}
					this.d = value; // shortcut for animations
					
				// update child tspans x values
				} else if (key == 'x' && nodeName == 'text') { 
					for (i = 0; i < element.childNodes.length; i++ ) {
						child = element.childNodes[i];
						// if the x values are equal, the tspan represents a linebreak
						if (attr(child, 'x') == attr(element, 'x')) {
							//child.setAttribute('x', value);
							attr(child, 'x', value);
						}
					}
					
					if (this.rotation) {
						attr(element, 'transform', 'rotate('+ this.rotation +' '+ value +' '+
							pInt(hash.y || attr(element, 'y')) +')');
					}
					
				// apply gradients
				} else if (key == 'fill') {
					value = renderer.color(value, element, key);
				
				// circle x and y
				} else if (nodeName == 'circle' && (key == 'x' || key == 'y')) {
					key = { x: 'cx', y: 'cy' }[key] || key;
					
				// translation and text rotation
				} else if (key == 'translateX' || key == 'translateY' || key == 'rotation' || key == 'verticalAlign') {
					this[key] = value;
					this.updateTransform();
					skipAttr = true;
	
				// apply opacity as subnode (required by legacy WebKit and Batik)
				} else if (key == 'stroke') {
					value = renderer.color(value, element, key);
					
				// emulate VML's dashstyle implementation
				} else if (key == 'dashstyle') {
					key = 'stroke-dasharray';
					value = value && value.toLowerCase();
					if (value == 'solid') {
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
				} else if (key == 'isTracker') {
					this[key] = value;
				
				// IE9/MooTools combo: MooTools returns objects instead of numbers and IE9 Beta 2
				// is unable to cast them. Test again with final IE9.
				} else if (key == 'width') {
					value = pInt(value);
				
				// Text alignment
				} else if (key == 'align') {
					key = 'text-anchor';
					value = { left: 'start', center: 'middle', right: 'end' }[value];
				}
				
				
				
				// jQuery animate changes case
				if (key == 'strokeWidth') {
					key = 'stroke-width';
				}
				
				// Chrome/Win < 6 bug (http://code.google.com/p/chromium/issues/detail?id=15461)				
				if (isWebKit && key == 'stroke-width' && value === 0) {
					value = 0.000001;
				}
				
				// symbols
				if (this.symbolName && /^(x|y|r|start|end|innerR)/.test(key)) {
					
					
					if (!hasSetSymbolSize) {
						this.symbolAttr(hash);
						hasSetSymbolSize = true;
					}
					skipAttr = true;
				}
				
				// let the shadow follow the main element
				if (shadows && /^(width|height|visibility|x|y|d)$/.test(key)) {
					i = shadows.length;
					while (i--) {
						attr(shadows[i], key, value);
					}					
				}
				
				// validate heights
				if ((key == 'width' || key == 'height') && nodeName == 'rect' && value < 0) {
					value = 0;
				}
				
				if (key == 'text') {
					// only one node allowed
					this.textStr = value;
					if (this.added) {
						renderer.buildText(this);
					}
				} else if (!skipAttr) {
					//element.setAttribute(key, value);
					attr(element, key, value);
				}
				
			}
			
		}
		return ret;
	},
	
	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 * @param {Object} hash
	 */
	symbolAttr: function(hash) {
		var wrapper = this;
		
		each (['x', 'y', 'r', 'start', 'end', 'width', 'height', 'innerR'], function(key) {
			wrapper[key] = pick(hash[key], wrapper[key]);
		});
		
		wrapper.attr({ 
			d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.r, {
				start: wrapper.start, 
				end: wrapper.end,
				width: wrapper.width, 
				height: wrapper.height,
				innerR: wrapper.innerR
			})
		});
	},
	
	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function(clipRect) {
		return this.attr('clip-path', 'url('+ this.renderer.url +'#'+ clipRect.id +')');
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
	crisp: function(strokeWidth, x, y, width, height) {
		
		var wrapper = this,
			key,
			attr = {},
			values = {},
			normalizer;
			
		strokeWidth = strokeWidth || wrapper.strokeWidth || 0;
		normalizer = strokeWidth % 2 / 2;

		// normalize for crisp edges
		values.x = mathFloor(x || wrapper.x || 0) + normalizer;
		values.y = mathFloor(y || wrapper.y || 0) + normalizer;
		values.width = mathFloor((width || wrapper.width || 0) - 2 * normalizer);
		values.height = mathFloor((height || wrapper.height || 0) - 2 * normalizer);
		values.strokeWidth = strokeWidth;
		
		for (key in values) {
			if (wrapper[key] != values[key]) { // only set attribute if changed
				wrapper[key] = attr[key] = values[key];
			}
		}
		
		return attr;
	},
	
	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function(styles) {
		var elemWrapper = this,
			elem = elemWrapper.element,
			textWidth = styles && styles.width && elem.nodeName == 'text',
			camelStyles = styles,
			n;
			
		// hyphenate
		if (defined(styles)) {
			styles = {};
			for (n in camelStyles) {
				styles[hyphenate(n)] = camelStyles[n];
			}
		}
		
		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}
		
		// save the styles in an object
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
			elemWrapper.attr({
				style: serializeCSS(styles)
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
	on: function(eventType, handler) {
		var fn = handler;
		// touch
		if (hasTouch && eventType == 'click') {
			eventType = 'touchstart';
			fn = function(e) {
				e.preventDefault();
				handler();
			}
		}
		// simplest possible event model for internal use
		this.element['on'+ eventType] = fn;
		return this;
	},
	
	
	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function(x, y) {
		return this.attr({
			translateX: x,
			translateY: y
		});
	},
	
	/**
	 * Invert a group, rotate and flip
	 */
	invert: function() {
		var wrapper = this;
		wrapper.inverted = true;
		wrapper.updateTransform();
		return wrapper;
	},
	
	/**
	 * Private method to update the transform attribute based on internal 
	 * properties
	 */
	updateTransform: function() {
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
			transform.push('translate('+ translateX +','+ translateY +')');
		}
		
		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		} else if (rotation) { // text rotation
			transform.push('rotate('+ rotation +' '+ wrapper.x +' '+ wrapper.y +')');
		}
		
		if (transform.length) {
			attr(wrapper.element, 'transform', transform.join(' '));
		}
	},
	/**
	 * Bring the element to the front
	 */
	toFront: function() {
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
	align: function(alignOptions, alignByTranslate, box) {
		
		if (!alignOptions) { // called on resize
			alignOptions = this.alignOptions;
			alignByTranslate = this.alignByTranslate;
		} else { // first call on instanciate
			this.alignOptions = alignOptions;
			this.alignByTranslate = alignByTranslate;
			if (!box) { // boxes other than renderer handle this internally
				this.renderer.alignedObjects.push(this);
			}
		}
		
		box = pick(box, this.renderer);
		
		var align = alignOptions.align,
			vAlign = alignOptions.verticalAlign,
			x = (box.x || 0) + (alignOptions.x || 0), // default: left align
			y = (box.y || 0) + (alignOptions.y || 0), // default: top align
			attribs = {};
			
			
		// align
		if (/^(right|center)$/.test(align)) {
			x += (box.width - (alignOptions.width || 0) ) /
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
		this[this.placed ? 'animate' : 'attr'](attribs);
		this.placed = true;
		
		return this;
	},
	
	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function() {		
		var	bBox,
			width,
			height,
			rotation = this.rotation,
			rad = rotation * deg2rad;
			
		try { // fails in Firefox if the container has display: none
			// use extend because IE9 is not allowed to change width and height in case 
			// of rotation (below)
			bBox = extend({}, this.element.getBBox());
		} catch(e) {
			bBox = { width: 0, height: 0 };
		}
		width = bBox.width;
		height = bBox.height;
			
		// adjust for rotated text
		if (rotation) {
			bBox.width = mathAbs(height * mathSin(rad)) + mathAbs(width * mathCos(rad));
			bBox.height = mathAbs(height * mathCos(rad)) + mathAbs(width * mathSin(rad));
		}
		
		return bBox;
	},
	
	/* *
	 * Manually compute width and height of rotated text from non-rotated. Shared by SVG and VML
	 * @param {Object} bBox
	 * @param {number} rotation
	 * /
	rotateBBox: function(bBox, rotation) {
		var rad = rotation * math.PI * 2 / 360, // radians
			width = bBox.width,
			height = bBox.height;
			
		
	},*/
	
	/**
	 * Show the element
	 */
	show: function() {
		return this.attr({ visibility: VISIBLE });
	},
	
	/**
	 * Hide the element
	 */
	hide: function() {
		return this.attr({ visibility: HIDDEN });
	},
	
	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *    to append the element to the renderer.box.
	 */ 
	add: function(parent) {
	
		var renderer = this.renderer,
			parentWrapper = parent || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes = parentNode.childNodes,
			element = this.element,
			zIndex = attr(element, 'zIndex'),
			otherElement,
			otherZIndex,
			i;
			
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
				if (otherElement != element && (
						// insert before the first element with a higher zIndex
						pInt(otherZIndex) > zIndex || 
						// if no zIndex given, insert before the first element with a zIndex
						(!defined(zIndex) && defined(otherZIndex))  
						
						)) {
					parentNode.insertBefore(element, otherElement);
					return this;
				}
			}
		}
		
		// default: append at the end
		parentNode.appendChild(element);
		
		this.added = true;
		
		return this;
	},

	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function() {
		var wrapper = this,
			element = wrapper.element || {},
			shadows = wrapper.shadows,
			parentNode = element.parentNode,
			key;
		
		// remove events
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = null;
		stop(wrapper); // stop running animations
		
		// remove element
		if (parentNode) {
			parentNode.removeChild(element);
		}
		
		// destroy shadows
		if (shadows) {
			each(shadows, function(shadow) {
				parentNode = shadow.parentNode;
				if (parentNode) { // the entire chart HTML can be overwritten
					parentNode.removeChild(shadow);
				}				
			});
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
	empty: function() {
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
	shadow: function(apply, group) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			
			// compensate for inverted plot area
			transform = this.parentInverted ? '(-1,-1)' : '(1,1)';
			
		
		if (apply) {
			for (i = 1; i <= 3; i++) {
				shadow = element.cloneNode(0);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': 'rgb(0, 0, 0)',
					'stroke-opacity': 0.05 * i,
					'stroke-width': 7 - 2 * i,
					'transform': 'translate'+ transform,
					'fill': NONE
				});
				
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

