

/**
 * The default SVG renderer
 */
var SVGRenderer = function() {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Boolean} forExport
	 */
	init: function(container, width, height, forExport) {
		var renderer = this,
			loc = location,
			boxWrapper;
					
		renderer.Element = SVGElement;
		boxWrapper = renderer.createElement('svg')
			.attr({
				xmlns: SVG_NS,
				version: '1.1'
			});
		container.appendChild(boxWrapper.element);
		
		// object properties
		renderer.box = boxWrapper.element;
		renderer.boxWrapper = boxWrapper;
		renderer.alignedObjects = [];
		renderer.url = isIE ? '' : loc.href.replace(/#.*?$/, ''); // page url used for internal references
		renderer.defs = this.createElement('defs').add();
		renderer.forExport = forExport;
		
		renderer.setSize(width, height, false);
		
	},
	
	
	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function(nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},
	
	
	/** 
	 * Parse a simple HTML string into SVG tspans
	 * 
	 * @param {Object} textNode The parent text SVG node
	 */
	buildText: function(wrapper) {
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
			reverse = isFirefox && textStyles && textStyles.HcDirection == 'rtl' && !this.forExport, // issue #38
			arr,
			width = textStyles && pInt(textStyles.width),
			textLineHeight = textStyles && textStyles['line-height'],
			lastLine,
			GET_COMPUTED_STYLE = 'getComputedStyle',
			i = childNodes.length;
		
		// remove old text
		while (i--) {
			textNode.removeChild(childNodes[i]);
		}
		
		if (width && !wrapper.added) {
			this.box.appendChild(textNode); // attach it to the DOM to read offset width
		}
		
		each(lines, function(line, lineNo) {
			var spans, spanNo = 0, lineHeight;
			
			line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
			spans = line.split('|||');
			
			each(spans, function (span) {
				if (span !== '' || spans.length == 1) {
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
						attr(tspan, 'onclick', 'location.href=\"'+ span.match(hrefRegex)[1] +'\"');
						css(tspan, { cursor: 'pointer' });
					}
					
					span = span.replace(/<(.|\n)*?>/g, '') || ' ';
					
					// issue #38 workaround.
					if (reverse) {
						arr = [];
						i = span.length;
						while (i--) {
							arr.push(span.charAt(i))
						}
						span = arr.join('');
					}
					
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
							};
							
							// Webkit and opera sometimes return 'normal' as the line height. In that
							// case, webkit uses offsetHeight, while Opera falls back to 18
							lineHeight = win[GET_COMPUTED_STYLE] &&
								win[GET_COMPUTED_STYLE](lastLine, null).getPropertyValue('line-height');
							
							if (!lineHeight || isNaN(lineHeight)) {
								lineHeight = textLineHeight || lastLine.offsetHeight || 18;
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
							actualWidth = textNode.getBBox().width;
							tooLong = actualWidth > width;
							if (!tooLong || words.length == 1) { // new line needed
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
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width 
	 */
	crispLine: function(points, width) {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] == points[4]) {
			points[1] = points[4] = mathRound(points[1]) + (width % 2 / 2);
		}
		if (points[2] == points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
	},
	
	
	/**
	 * Draw a path
	 * @param {Array} path An SVG path in array form
	 */
	path: function (path) {
		return this.createElement('path').attr({ 
			d: path, 
			fill: NONE
		});
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
		
		return this.symbol('arc', x || 0, y || 0, r || 0, {
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
		if (isObject(x)) {
			y = x.y;
			width = x.width;
			height = x.height;
			r = x.r;
			x = x.x;	
		}
		var wrapper = this.createElement('rect').attr({
			rx: r,
			ry: r,
			fill: NONE
		});
		
		return wrapper.attr(wrapper.crisp(strokeWidth, x, y, mathMax(width, 0), mathMax(height, 0)));
	},
	
	/**
	 * Resize the box and re-align all aligned elements
	 * @param {Object} width
	 * @param {Object} height
	 * @param {Boolean} animate
	 * 
	 */
	setSize: function(width, height, animate) {
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
	g: function(name) {
		return this.createElement('g').attr(
			defined(name) && { 'class': PREFIX + name }
		);
	},
	
	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function(src, x, y, width, height) {
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
		elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink', 
			'href', src);
			
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
	symbol: function(symbol, x, y, radius, options) {
		
		var obj,
			
			// get the symbol definition function
			symbolFn = this.symbols[symbol],
			
			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				x, 
				y, 
				radius, 
				options
			),
			
			imageRegex = /^url\((.*?)\)$/,
			imageSrc;
			
		if (path) {
		
			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				r: radius
			});
			if (options) {
				extend(obj, options);
			}
			
			
		// image symbols
		} else if (imageRegex.test(symbol)) {
			
			imageSrc = symbol.match(imageRegex)[1];
			
			// create the image synchronously, add attribs async
			obj = this.image(imageSrc)
				.attr({
					x: x,
					y: y
				});
			
			// create a dummy JavaScript image to get the width and height  
			createElement('img', {
				onload: function() {
					var img = this,
						size = symbolSizes[img.src] || [img.width, img.height];
					obj.attr({						
						width: size[0],
						height: size[1]
					}).translate(
						-mathRound(size[0] / 2),
						-mathRound(size[1] / 2)
					);
				},
				src: imageSrc
			});
				
		// default circles
		} else {
			obj = this.circle(x, y, radius);
		}
		
		return obj;
	},
	
	/**
	 * An extendable collection of functions for defining symbol paths.
	 */
	symbols: {
		'square': function (x, y, radius) {
			var len = 0.707 * radius;
			return [
				M, x-len, y-len,
				L, x+len, y-len,
				x+len, y+len,
				x-len, y+len,
				'Z'
			];
		},
			
		'triangle': function (x, y, radius) {
			return [
				M, x, y-1.33 * radius,
				L, x+radius, y + 0.67 * radius,
				x-radius, y + 0.67 * radius,
				'Z'
			];
		},
			
		'triangle-down': function (x, y, radius) {
			return [
				M, x, y + 1.33 * radius,
				L, x-radius, y-0.67 * radius,
				x+radius, y-0.67 * radius,
				'Z'
			];
		},
		'diamond': function (x, y, radius) {
			return [
				M, x, y-radius,
				L, x+radius, y,
				x, y+radius,
				x-radius, y,
				'Z'
			];
		},
		'arc': function (x, y, radius, options) {
			var start = options.start,
				end = options.end - 0.000001, // to prevent cos and sin of start and end from becoming equal on 360 arcs
				innerRadius = options.innerR,
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
				L,				
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
				
				'Z' // close
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
		
		return wrapper;
	},
	
	
	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object
	 * 
	 * @param {Object} color The color or config object
	 */
	color: function(color, elem, prop) {
		var colorObject,
			regexRgba = /^rgba/;
		if (color && color.linearGradient) {
			var renderer = this,
				strLinearGradient = 'linearGradient',
				linearGradient = color[strLinearGradient],
				id = PREFIX + idCounter++,
				gradientObject,
				stopColor,
				stopOpacity;
			gradientObject = renderer.createElement(strLinearGradient).attr({
				id: id,
				gradientUnits: 'userSpaceOnUse',
				x1: linearGradient[0],
				y1: linearGradient[1],
				x2: linearGradient[2],
				y2: linearGradient[3]
			}).add(renderer.defs);
			
			each(color.stops, function(stop) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}
				renderer.createElement('stop').attr({
					offset: stop[0],
					'stop-color': stopColor,
					'stop-opacity': stopOpacity
				}).add(gradientObject);
			});
			
			return 'url('+ this.url +'#'+ id +')';
			
		// Webkit and Batik can't show rgba.
		} else if (regexRgba.test(color)) {
			colorObject = Color(color);
			attr(elem, prop +'-opacity', colorObject.get('a'));
			
			return colorObject.get('rgb');
			
			
		} else {
			return color;
		}
		
	},
	
		
	/**
	 * Add text to the SVG object
	 * @param {String} str
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 */
	text: function(str, x, y) {
		
		// declare variables
		var defaultChartStyle = defaultOptions.chart.style,
			wrapper;
	
		x = mathRound(pick(x, 0));
		y = mathRound(pick(y, 0));
		
		wrapper = this.createElement('text')
			.attr({
				x: x,
				y: y,
				text: str	
			})
			.css({
				'font-family': defaultChartStyle.fontFamily,
				'font-size': defaultChartStyle.fontSize
			});
			
		wrapper.x = x;
		wrapper.y = y;
		return wrapper;
	}
}; // end SVGRenderer


