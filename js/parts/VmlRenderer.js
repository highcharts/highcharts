

/* ****************************************************************************
 *                                                                            *
 * START OF INTERNET EXPLORER <= 8 SPECIFIC CODE                              *
 *                                                                            *
 * For applications and websites that don't need IE support, like platform    *
 * targeted mobile apps and web apps, this code can be removed.               *
 *                                                                            *
 *****************************************************************************/
var VMLRenderer;
if (!hasSVG) {

/**
 * The VML element wrapper.
 */
var VMLElement = extendClass(SVGElement, {

	/**
	 * Initialize a new VML element wrapper. It builds the markup as a string
	 * to minimize DOM traffic.
	 * @param {Object} renderer
	 * @param {Object} nodeName
	 */
	init: function (renderer, nodeName) {
		var markup =  ['<', nodeName, ' filled="f" stroked="f"'],
			style = ['position: ', ABSOLUTE, ';'];

		// divs and shapes need size
		if (nodeName === 'shape' || nodeName === DIV) {
			style.push('left:0;top:0;width:10px;height:10px;');
		}
		if (docMode8) {
			style.push('visibility: ', nodeName === DIV ? HIDDEN : VISIBLE);
		}

		markup.push(' style="', style.join(''), '"/>');

		// create element with default attributes and style
		if (nodeName) {
			markup = nodeName === DIV || nodeName === 'span' || nodeName === 'img' ?
				markup.join('')
				: renderer.prepVML(markup);
			this.element = createElement(markup);
		}

		this.renderer = renderer;
	},

	/**
	 * Add the node to the given parent
	 * @param {Object} parent
	 */
	add: function (parent) {
		var wrapper = this,
			renderer = wrapper.renderer,
			element = wrapper.element,
			box = renderer.box,
			inverted = parent && parent.inverted,

			// get the parent node
			parentNode = parent ?
				parent.element || parent :
				box;


		// if the parent group is inverted, apply inversion on all children
		if (inverted) { // only on groups
			renderer.invertChild(element, parentNode);
		}

		// issue #140 workaround - related to #61 and #74
		if (docMode8 && parentNode.gVis === HIDDEN) {
			css(element, { visibility: HIDDEN });
		}

		// append it
		parentNode.appendChild(element);

		// align text after adding to be able to read offset
		wrapper.added = true;
		if (wrapper.alignOnAdd) {
			wrapper.updateTransform();
		}

		return wrapper;
	},

	/**
	 * Get or set attributes
	 */
	attr: function (hash, val) {
		var key,
			value,
			i,
			element = this.element || {},
			elemStyle = element.style,
			nodeName = element.nodeName,
			renderer = this.renderer,
			symbolName = this.symbolName,
			childNodes,
			hasSetSymbolSize,
			shadows = this.shadows,
			skipAttr,
			ret = this;

		// single key-value pair
		if (isString(hash) && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter, val is undefined
		if (isString(hash)) {
			key = hash;
			if (key === 'strokeWidth' || key === 'stroke-width') {
				ret = this.strokeweight;
			} else {
				ret = this[key];
			}

		// setter
		} else {
			for (key in hash) {
				value = hash[key];
				skipAttr = false;

				// prepare paths
				// symbols
				if (symbolName && /^(x|y|r|start|end|width|height|innerR)/.test(key)) {
					// if one of the symbol size affecting parameters are changed,
					// check all the others only once for each call to an element's
					// .attr() method
					if (!hasSetSymbolSize) {
						this.symbolAttr(hash);

						hasSetSymbolSize = true;
					}

					skipAttr = true;

				} else if (key === 'd') {
					value = value || [];
					this.d = value.join(' '); // used in getter for animation

					// convert paths
					i = value.length;
					var convertedPath = [];
					while (i--) {

						// Multiply by 10 to allow subpixel precision.
						// Substracting half a pixel seems to make the coordinates
						// align with SVG, but this hasn't been tested thoroughly
						if (isNumber(value[i])) {
							convertedPath[i] = mathRound(value[i] * 10) - 5;
						} else if (value[i] === 'Z') { // close the path
							convertedPath[i] = 'x';
						} else {
							convertedPath[i] = value[i];
						}

					}
					value = convertedPath.join(' ') || 'x';
					element.path = value;

					// update shadows
					if (shadows) {
						i = shadows.length;
						while (i--) {
							shadows[i].path = value;
						}
					}
					skipAttr = true;

				// directly mapped to css
				} else if (key === 'zIndex' || key === 'visibility') {

					// issue 61 workaround
					if (docMode8 && key === 'visibility' && nodeName === 'DIV') {
						element.gVis = value;
						childNodes = element.childNodes;
						i = childNodes.length;
						while (i--) {
							css(childNodes[i], { visibility: value });
						}
						if (value === VISIBLE) { // issue 74
							value = null;
						}
					}

					if (value) {
						elemStyle[key] = value;
					}



					skipAttr = true;

				// width and height
				} else if (/^(width|height)$/.test(key)) {

					this[key] = value; // used in getter

					// clipping rectangle special
					if (this.updateClipping) {
						this[key] = value;
						this.updateClipping();

					} else {
						// normal
						elemStyle[key] = value;
					}

					skipAttr = true;

				// x and y
				} else if (/^(x|y)$/.test(key)) {

					this[key] = value; // used in getter

					if (element.tagName === 'SPAN') {
						this.updateTransform();

					} else {
						elemStyle[{ x: 'left', y: 'top' }[key]] = value;
					}

				// class name
				} else if (key === 'class') {
					// IE8 Standards mode has problems retrieving the className
					element.className = value;

				// stroke
				} else if (key === 'stroke') {

					value = renderer.color(value, element, key);

					key = 'strokecolor';

				// stroke width
				} else if (key === 'stroke-width' || key === 'strokeWidth') {
					element.stroked = value ? true : false;
					key = 'strokeweight';
					this[key] = value; // used in getter, issue #113
					if (isNumber(value)) {
						value += PX;
					}

				// dashStyle
				} else if (key === 'dashstyle') {
					var strokeElem = element.getElementsByTagName('stroke')[0] ||
						createElement(renderer.prepVML(['<stroke/>']), null, null, element);
					strokeElem[key] = value || 'solid';
					this.dashstyle = value; /* because changing stroke-width will change the dash length
						and cause an epileptic effect */
					skipAttr = true;

				// fill
				} else if (key === 'fill') {

					if (nodeName === 'SPAN') { // text color
						elemStyle.color = value;
					} else {
						element.filled = value !== NONE ? true : false;

						value = renderer.color(value, element, key);

						key = 'fillcolor';
					}

				// translation for animation
				} else if (key === 'translateX' || key === 'translateY' || key === 'rotation' || key === 'align') {
					if (key === 'align') {
						key = 'textAlign';
					}
					this[key] = value;
					this.updateTransform();

					skipAttr = true;
				} else if (key === 'text') { // text for rotated and non-rotated elements
					this.bBox = null;
					element.innerHTML = value;
					skipAttr = true;
				}


				// let the shadow follow the main element
				if (shadows && key === 'visibility') {
					i = shadows.length;
					while (i--) {
						shadows[i].style[key] = value;
					}
				}



				if (!skipAttr) {
					if (docMode8) { // IE8 setAttribute bug
						element[key] = value;
					} else {
						attr(element, key, value);
					}
				}
			}
		}
		return ret;
	},

	/**
	 * Set the element's clipping to a predefined rectangle
	 *
	 * @param {String} id The id of the clip rectangle
	 */
	clip: function (clipRect) {
		var wrapper = this,
			clipMembers = clipRect.members;

		clipMembers.push(wrapper);
		wrapper.destroyClip = function () {
			erase(clipMembers, wrapper);
		};
		return wrapper.css(clipRect.getCSS(wrapper.inverted));
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function (styles) {
		var wrapper = this,
			element = wrapper.element,
			textWidth = styles && element.tagName === 'SPAN' && styles.width;

		/*if (textWidth) {
			extend(styles, {
				display: 'block',
				whiteSpace: 'normal'
			});
		}*/
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
	 * Extend element.destroy by removing it from the clip members array
	 */
	destroy: function () {
		var wrapper = this;

		if (wrapper.destroyClip) {
			wrapper.destroyClip();
		}

		return SVGElement.prototype.destroy.apply(wrapper);
	},

	/**
	 * Remove all child nodes of a group, except the v:group element
	 */
	empty: function () {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length,
			node;

		while (i--) {
			node = childNodes[i];
			node.parentNode.removeChild(node);
		}
	},

	/**
	 * VML override for calculating the bounding box based on offsets
	 *
	 * @return {Object} A hash containing values for x, y, width and height
	 */

	getBBox: function () {
		var wrapper = this,
			element = wrapper.element,
			bBox = wrapper.bBox;

		if (!bBox) {
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
	 * Add an event listener. VML override for normalizing event parameters.
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		// simplest possible event model for internal use
		this.element['on' + eventType] = function () {
			var evt = win.event;
			evt.target = evt.srcElement;
			handler(evt);
		};
		return this;
	},


	/**
	 * VML override private method to update elements based on internal
	 * properties based on SVG transform
	 */
	updateTransform: function () {
		// aligning non added elements is expensive
		if (!this.added) {
			this.alignOnAdd = true;
			return;
		}

		var wrapper = this,
			elem = wrapper.element,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			x = wrapper.x || 0,
			y = wrapper.y || 0,
			align = wrapper.textAlign || 'left',
			alignCorrection = { left: 0, center: 0.5, right: 1 }[align],
			nonLeft = align && align !== 'left';

		// apply translate
		if (translateX || translateY) {
			wrapper.css({
				marginLeft: translateX,
				marginTop: translateY
			});
		}

		// apply inversion
		if (wrapper.inverted) { // wrapper is a group
			each(elem.childNodes, function (child) {
				wrapper.renderer.invertChild(child, elem);
			});
		}

		if (elem.tagName === 'SPAN') {

			var width, height,
				rotation = wrapper.rotation,
				lineHeight,
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

					// Adjust for alignment and rotation.
					// Test case: http://highcharts.com/tests/?file=text-rotation
					css(elem, {
						filter: rotation ? ['progid:DXImageTransform.Microsoft.Matrix(M11=', costheta,
							', M12=', -sintheta, ', M21=', sintheta, ', M22=', costheta,
							', sizingMethod=\'auto expand\')'].join('') : NONE
					});
				}

				width = elem.offsetWidth;
				height = elem.offsetHeight;

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
				lineHeight = mathRound((pInt(elem.style.fontSize) || 12) * 1.2);
				xCorr = costheta < 0 && -width;
				yCorr = sintheta < 0 && -height;

				// correct for lineHeight and corners spilling out after rotation
				quad = costheta * sintheta < 0;
				xCorr += sintheta * lineHeight * (quad ? 1 - alignCorrection : alignCorrection);
				yCorr -= costheta * lineHeight * (rotation ? (quad ? alignCorrection : 1 - alignCorrection) : 1);

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
				left: x + xCorr,
				top: y + yCorr
			});

			// record current text transform
			wrapper.cTT = currentTextTransform;
		}
	},

	/**
	 * Apply a drop shadow by copying elements and giving them different strokes
	 * @param {Boolean} apply
	 */
	shadow: function (apply, group) {
		var shadows = [],
			i,
			element = this.element,
			renderer = this.renderer,
			shadow,
			elemStyle = element.style,
			markup,
			path = element.path;

		// some times empty paths are not strings
		if (path && typeof path.value !== 'string') {
			path = 'x';
		}

		if (apply) {
			for (i = 1; i <= 3; i++) {
				markup = ['<shape isShadow="true" strokeweight="', (7 - 2 * i),
					'" filled="false" path="', path,
					'" coordsize="100,100" style="', element.style.cssText, '" />'];
				shadow = createElement(renderer.prepVML(markup),
					null, {
						left: pInt(elemStyle.left) + 1,
						top: pInt(elemStyle.top) + 1
					}
				);

				// apply the opacity
				markup = ['<stroke color="black" opacity="', (0.05 * i), '"/>'];
				createElement(renderer.prepVML(markup), null, null, shadow);


				// insert it
				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				// record it
				shadows.push(shadow);

			}

			this.shadows = shadows;
		}
		return this;

	}
});

/**
 * The VML renderer
 */
VMLRenderer = function () {
	this.init.apply(this, arguments);
};
VMLRenderer.prototype = merge(SVGRenderer.prototype, { // inherit SVGRenderer

	Element: VMLElement,
	isIE8: userAgent.indexOf('MSIE 8.0') > -1,


	/**
	 * Initialize the VMLRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function (container, width, height) {
		var renderer = this,
			boxWrapper;

		renderer.alignedObjects = [];

		boxWrapper = renderer.createElement(DIV);
		container.appendChild(boxWrapper.element);


		// generate the containing box
		renderer.box = boxWrapper.element;
		renderer.boxWrapper = boxWrapper;


		renderer.setSize(width, height, false);

		// The only way to make IE6 and IE7 print is to use a global namespace. However,
		// with IE8 the only way to make the dynamic shapes visible in screen and print mode
		// seems to be to add the xmlns attribute and the behaviour style inline.
		if (!doc.namespaces.hcv) {

			doc.namespaces.add('hcv', 'urn:schemas-microsoft-com:vml');

			// setup default css
			doc.createStyleSheet().cssText =
				'hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke' +
				'{ behavior:url(#default#VML); display: inline-block; } ';

		}
	},

	/**
	 * Define a clipping rectangle. In VML it is accomplished by storing the values
	 * for setting the CSS style to all associated members.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {

		// create a dummy element
		var clipRect = this.createElement();

		// mimic a rectangle with its style object for automatic updating in attr
		return extend(clipRect, {
			members: [],
			left: x,
			top: y,
			width: width,
			height: height,
			getCSS: function (inverted) {
				var rect = this,//clipRect.element.style,
					top = rect.top,
					left = rect.left,
					right = left + rect.width,
					bottom = top + rect.height,
					ret = {
						clip: 'rect(' +
							mathRound(inverted ? left : top) + 'px,' +
							mathRound(inverted ? bottom : right) + 'px,' +
							mathRound(inverted ? right : bottom) + 'px,' +
							mathRound(inverted ? top : left) + 'px)'
					};

				// issue 74 workaround
				if (!inverted && docMode8) {
					extend(ret, {
						width: right + PX,
						height: bottom + PX
					});
				}
				return ret;
			},

			// used in attr and animation to update the clipping of all members
			updateClipping: function () {
				each(clipRect.members, function (member) {
					member.css(clipRect.getCSS(member.inverted));
				});
			}
		});

	},


	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object, and apply opacity.
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/,
			markup;

		if (color && color.linearGradient) {

			var stopColor,
				stopOpacity,
				linearGradient = color.linearGradient,
				angle,
				color1,
				opacity1,
				color2,
				opacity2;

			each(color.stops, function (stop, i) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}

				if (!i) { // first
					color1 = stopColor;
					opacity1 = stopOpacity;
				} else {
					color2 = stopColor;
					opacity2 = stopOpacity;
				}
			});



			// calculate the angle based on the linear vector
			angle = 90  - math.atan(
				(linearGradient[3] - linearGradient[1]) / // y vector
				(linearGradient[2] - linearGradient[0]) // x vector
				) * 180 / mathPI;

			// when colors attribute is used, the meanings of opacity and o:opacity2
			// are reversed.
			markup = ['<', prop, ' colors="0% ', color1, ',100% ', color2, '" angle="', angle,
				'" opacity="', opacity2, '" o:opacity2="', opacity1,
				'" type="gradient" focus="100%" />'];
			createElement(this.prepVML(markup), null, null, elem);



		// if the color is an rgba color, split it and add a fill node
		// to hold the opacity component
		} else if (regexRgba.test(color) && elem.tagName !== 'IMG') {

			colorObject = Color(color);

			markup = ['<', prop, ' opacity="', colorObject.get('a'), '"/>'];
			createElement(this.prepVML(markup), null, null, elem);

			return colorObject.get('rgb');


		} else {
			var strokeNodes = elem.getElementsByTagName(prop);
			if (strokeNodes.length) {
				strokeNodes[0].opacity = 1;
			}
			return color;
		}

	},

	/**
	 * Take a VML string and prepare it for either IE8 or IE6/IE7.
	 * @param {Array} markup A string array of the VML markup to prepare
	 */
	prepVML: function (markup) {
		var vmlStyle = 'display:inline-block;behavior:url(#default#VML);',
			isIE8 = this.isIE8;

		markup = markup.join('');

		if (isIE8) { // add xmlns and style inline
			markup = markup.replace('/>', ' xmlns="urn:schemas-microsoft-com:vml" />');
			if (markup.indexOf('style="') === -1) {
				markup = markup.replace('/>', ' style="' + vmlStyle + '" />');
			} else {
				markup = markup.replace('style="', 'style="' + vmlStyle);
			}

		} else { // add namespace
			markup = markup.replace('<', '<hcv:');
		}

		return markup;
	},

	/**
	 * Create rotated and aligned text
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	text: function (str, x, y) {

		var defaultChartStyle = defaultOptions.chart.style;

		return this.createElement('span')
			.attr({
				text: str,
				x: mathRound(x),
				y: mathRound(y)
			})
			.css({
				whiteSpace: 'nowrap',
				fontFamily: defaultChartStyle.fontFamily,
				fontSize: defaultChartStyle.fontSize
			});
	},

	/**
	 * Create and return a path element
	 * @param {Array} path
	 */
	path: function (path) {
		// create the shape
		return this.createElement('shape').attr({
			// subpixel precision down to 0.1 (width and height = 10px)
			coordsize: '100 100',
			d: path
		});
	},

	/**
	 * Create and return a circle element. In VML circles are implemented as
	 * shapes, which is faster than v:oval
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} r
	 */
	circle: function (x, y, r) {
		return this.symbol('circle').attr({ x: x, y: y, r: r});
	},

	/**
	 * Create a group using an outer div and an inner v:group to allow rotating
	 * and flipping. A simple v:group would have problems with positioning
	 * child HTML elements and CSS clip.
	 *
	 * @param {String} name The name of the group
	 */
	g: function (name) {
		var wrapper,
			attribs;

		// set the class name
		if (name) {
			attribs = { 'className': PREFIX + name, 'class': PREFIX + name };
		}

		// the div to hold HTML and clipping
		wrapper = this.createElement(DIV).attr(attribs);

		return wrapper;
	},

	/**
	 * VML override to create a regular HTML image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var obj = this.createElement('img')
			.attr({ src: src });

		if (arguments.length > 1) {
			obj.css({
				left: x,
				top: y,
				width: width,
				height: height
			});
		}
		return obj;
	},

	/**
	 * VML uses a shape for rect to overcome bugs and rotation problems
	 */
	rect: function (x, y, width, height, r, strokeWidth) {

		if (isObject(x)) {
			y = x.y;
			width = x.width;
			height = x.height;
			r = x.r;
			strokeWidth = x.strokeWidth;
			x = x.x;
		}
		var wrapper = this.symbol('rect');
		wrapper.r = r;

		return wrapper.attr(wrapper.crisp(strokeWidth, x, y, mathMax(width, 0), mathMax(height, 0)));
	},

	/**
	 * In the VML renderer, each child of an inverted div (group) is inverted
	 * @param {Object} element
	 * @param {Object} parentNode
	 */
	invertChild: function (element, parentNode) {
		var parentStyle = parentNode.style;

		css(element, {
			flip: 'x',
			left: pInt(parentStyle.width) - 10,
			top: pInt(parentStyle.height) - 10,
			rotation: -90
		});
	},

	/**
	 * Symbol definitions that override the parent SVG renderer's symbols
	 *
	 */
	symbols: {
		// VML specific arc function
		arc: function (x, y, radius, options) {
			var start = options.start,
				end = options.end,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				innerRadius = options.innerR,
				circleCorrection = 0.07 / radius,
				innerCorrection = (innerRadius && 0.1 / innerRadius) || 0;

			if (end - start === 0) { // no angle, don't show it.
				return ['x'];

			//} else if (end - start == 2 * mathPI) { // full circle
			} else if (2 * mathPI - end + start < circleCorrection) { // full circle
				// empirical correction found by trying out the limits for different radii
				cosEnd = -circleCorrection;
			} else if (end - start < innerCorrection) { // issue #186, another mysterious VML arc problem
				cosEnd = mathCos(start + innerCorrection);
			}

			return [
				'wa', // clockwise arc to
				x - radius, // left
				y - radius, // top
				x + radius, // right
				y + radius, // bottom
				x + radius * cosStart, // start x
				y + radius * sinStart, // start y
				x + radius * cosEnd, // end x
				y + radius * sinEnd, // end y


				'at', // anti clockwise arc to
				x - innerRadius, // left
				y - innerRadius, // top
				x + innerRadius, // right
				y + innerRadius, // bottom
				x + innerRadius * cosEnd, // start x
				y + innerRadius * sinEnd, // start y
				x + innerRadius * cosStart, // end x
				y + innerRadius * sinStart, // end y

				'x', // finish path
				'e' // close
			];

		},
		// Add circle symbol path. This performs significantly faster than v:oval.
		circle: function (x, y, r) {
			return [
				'wa', // clockwisearcto
				x - r, // left
				y - r, // top
				x + r, // right
				y + r, // bottom
				x + r, // start x
				y,     // start y
				x + r, // end x
				y,     // end y
				//'x', // finish path
				'e' // close
			];
		},
		/**
		 * Add rectangle symbol path which eases rotation and omits arcsize problems
		 * compared to the built-in VML roundrect shape
		 *
		 * @param {Number} left Left position
		 * @param {Number} top Top position
		 * @param {Number} r Border radius
		 * @param {Object} options Width and height
		 */

		rect: function (left, top, r, options) {
			if (!defined(options)) {
				return [];
			}
			var width = options.width,
				height = options.height,
				right = left + width,
				bottom = top + height;

			r = mathMin(r, width, height);

			return [
				M,
				left + r, top,

				L,
				right - r, top,
				'wa',
				right - 2 * r, top,
				right, top + 2 * r,
				right - r, top,
				right, top + r,

				L,
				right, bottom - r,
				'wa',
				right - 2 * r, bottom - 2 * r,
				right, bottom,
				right, bottom - r,
				right - r, bottom,

				L,
				left + r, bottom,
				'wa',
				left, bottom - 2 * r,
				left + 2 * r, bottom,
				left + r, bottom,
				left, bottom - r,

				L,
				left, top + r,
				'wa',
				left, top,
				left + 2 * r, top + 2 * r,
				left, top + r,
				left + r, top,


				'x',
				'e'
			];

		}
	}
});

// general renderer
Renderer = VMLRenderer;
}
/* ****************************************************************************
 *                                                                            *
 * END OF INTERNET EXPLORER <= 8 SPECIFIC CODE                                *
 *                                                                            *
 *****************************************************************************/
