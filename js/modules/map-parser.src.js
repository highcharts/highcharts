/**
 * SVG map parser. 
 * This file requires data.js.
 */

/*global Highcharts */
(function (H) {

"use strict";

var each = H.each;

H.wrap(H.Data.prototype, 'init', function (proceed, options) {
	proceed.call(this, options);

	if (options.svg) {
		this.loadSVG();
	}
});

H.extend(H.Data.prototype, {
	/**
	 * Parse an SVG path into a simplified array that Highcharts can read
	 */
	pathToArray: function (path, translate) {
		
		var i = 0,
			position = 0,
			positions,
			fixedPoint = [0, 0],
			isRelative,
			isString,
			operator;

		path = path
			// Scientific notation
			.replace(/[0-9]+e-?[0-9]+/g, function (a) {
				return +a; // cast to number
			})
			// Move letters apart
			.replace(/([A-Za-z])/g, ' $1 ')
			// Add space before minus
			.replace(/-/g, ' -')
			// Trim
			.replace(/^\s*/, "").replace(/\s*$/, "")
		
			// Split on spaces, minus and commas
			.split(/[ ,]+/);
		
		// Blank path
		if (path.length === 1) {
			return [];	
		}

		// Real path
		for (i = 0; i < path.length; i++) {
			isString = /[a-zA-Z]/.test(path[i]);
			
			// Handle strings
			if (isString) {
				operator = path[i];
				positions = 2;
				
				// Curves have six positions
				if (operator === 'c' || operator === 'C') {
					positions = 6;
				}
				
				// Enter or exit relative mode
				if (operator === 'm' || operator === 'l' || operator === 'c') {
					path[i] = operator.toUpperCase();
					isRelative = true;
				} else if (operator === 'M' || operator === 'L' || operator === 'C') {
					isRelative = false;

				
				// Horizontal and vertical line to
				} else if (operator === 'h') {
					isRelative = true;
					path[i] = 'L';
					path.splice(i + 2, 0, 0);
				} else if (operator === 'v') {
					isRelative = true;
					path[i] = 'L';
					path.splice(i + 1, 0, 0);
				} else if (operator === 'H' || operator === 'h') {
					isRelative = false;
					path[i] = 'L';
					path.splice(i + 2, 0, fixedPoint[1]);
				} else if (operator === 'V' || operator === 'v') {
					isRelative = false;
					path[i] = 'L';
					path.splice(i + 1, 0, fixedPoint[0]);
				}
			
			// Handle numbers
			} else {
				
				path[i] = parseFloat(path[i]);
				if (isRelative) {
					path[i] += fixedPoint[position % 2];
				
				} 
				if (translate && (!isRelative || (operator === 'm' && i < 3))) { // only translate absolute points or initial moveTo
					path[i] += translate[position % 2];
				}
				
				path[i] = Math.round(path[i] * 100) / 100;
				
				// Set the fixed point for the next pair
				if (position === positions - 1) {
					fixedPoint = [path[i - 1], path[i]];
				}
				
				// Reset to zero position (x/y switching)
				if (position === positions - 1) {
					position = 0;
				} else {
					position += 1;
				}
			}
		}

		// Handle polygon points
		if (typeof path[0] === 'number' && path.length >= 4) {
			path.unshift('M');
			path.splice(3, 0, 'L');
		}

		return path;
	},

	/**
	 * Join the path back to a string for compression
	 */
	pathToString: function (arr) {
		each(arr, function (point) {
			var path = point.path;

			// Join all by commas
			path = path.join(',');

			// Remove commas next to a letter
			path = path.replace(/,?([a-zA-Z]),?/g, '$1');
			
			// Reinsert
			point.path = path;
		});

		return arr;
		//return path.join(',')
	},

	/**
	 * Scale the path to fit within a given box and round all numbers
	 */
	roundPaths: function (arr, scale) {
		var mapProto = Highcharts.seriesTypes.map.prototype,
			fakeSeries,
			origSize,
			transA;

		
		// Borrow the map series type's getBox method
		mapProto.getBox.call(arr, arr);

		origSize = Math.max(arr.maxX - arr.minX, arr.maxY - arr.minY);
		scale = scale || 999;
		transA = scale / origSize;

		fakeSeries = {
			xAxis: {
				min: arr.minX,
				len: scale,//arr.maxX - arr.minX,
				translate: Highcharts.Axis.prototype.translate,
				options: {},
				minPixelPadding: 0,
				transA: transA
			}, 
			yAxis: {
				min: (arr.minY + scale) / transA,
				len: scale,//arr.maxY - arr.minY,
				translate: Highcharts.Axis.prototype.translate,
				options: {},
				minPixelPadding: 0,
				transA: -transA
			}
		};

		each(arr, function (point) {
			point.path = mapProto.translatePath.call(fakeSeries, point.path);
		});

		return arr;
	},
	
	/**
	 * Load an SVG file and extract the paths
	 * @param {Object} url
	 */
	loadSVG: function () {
		
		var data = this,
			options = this.options;

		function getPathLikeChildren(parent) {
			return Array.prototype.slice.call(parent.getElementsByTagName('path'))
						.concat(Array.prototype.slice.call(parent.getElementsByTagName('polygon')));
		}

		function getPathDefinition(path) {
			if (path.nodeName === 'path') {
				return path.getAttribute('d');
			} else if (path.nodeName === 'polygon') {
				return path.getAttribute('points');
			}
		}
		
		function getTranslate(elem) {
			var translateX = 0,
				translateY = 0,
				transform,
				match;

			while (elem && elem.nodeName !== 'svg') {
				transform = elem.getAttribute('transform'),
				match = transform && transform.match(/translate\(([0-9\-\. ]+),([0-9\-\. ]+)\)/);

				if (match) {
					translateX += parseFloat(match[1]);
					translateY += parseFloat(match[2]);
				}
				elem = elem.parentNode;
			}
			
			return (translateX || translateY) && [translateX, translateY]; 
		}
		
		function getName(elem) {
			return elem.getAttribute('inkscape:label') || elem.getAttribute('id') || elem.getAttribute('class');
		}

		function hasFill(elem) {
			return !/fill[\s]?\:[\s]?none/.test(elem.getAttribute('style')) && elem.getAttribute('fill') !== 'none';
		}
		
		jQuery.ajax({
			url: options.svg,
			dataType: 'xml',
			success: function (xml) {
				var arr = [],
					currentParent,
					allPaths = getPathLikeChildren(xml),
					commonLineage,
					lastCommonAncestor,
					handleGroups,
					defs = xml.getElementsByTagName('defs')[0],
					clipPaths;
					
				// Skip clip paths
				clipPaths = defs && defs.getElementsByTagName('path');
				if (clipPaths) {
					each(clipPaths, function (path) {
						path.skip = true;
					});
				}
				
				// If not all paths belong to the same group, handle groups
				each(allPaths, function (path, i) {
					if (!path.skip) {
						var itemLineage = [],
							parentNode,
							j;
						
						if (i > 0 && path.parentNode !== currentParent) {
							handleGroups = true;
						}
						currentParent = path.parentNode;
						
						// Handle common lineage
						parentNode = path;
						while (parentNode) {
							itemLineage.push(parentNode);
							parentNode = parentNode.parentNode;
						}
						itemLineage.reverse();
						
						if (!commonLineage) {
							commonLineage = itemLineage; // first iteration
						} else {
							for (j = 0; j < commonLineage.length; j++) {
								if (commonLineage[j] !== itemLineage[j]) {
									commonLineage = commonLineage.slice(0, j);
								}
							}
						}
					}
				});
				lastCommonAncestor = commonLineage[commonLineage.length - 1];
				
				// Iterate groups to find sub paths
				if (false && handleGroups) {
					each(lastCommonAncestor.getElementsByTagName('g'), function (g) {
						var groupPath = [],
							pathHasFill;
						
						each(getPathLikeChildren(g), function (path) {
							if (!path.skip) {
								groupPath = groupPath.concat(
									data.pathToArray(getPathDefinition(path), getTranslate(path))
								);

								if (hasFill(path)) {
									pathHasFill = true;
								}
								
								path.skip = true;
							}
						});
						arr.push({
							name: getName(g),
							path: groupPath,
							hasFill: pathHasFill
						});
					});
				}
				
				// Iterate the remaining paths that are not parts of groups
				each(allPaths, function (path) {
					if (!path.skip) {
						arr.push({
							name: getName(path),
							path: data.pathToArray(getPathDefinition(path), getTranslate(path)),
							hasFill: hasFill(path)
						});
					}			
				});

				// Round off to compress
				data.roundPaths(arr);
				
				// Do the callback
				options.complete({
					series: [{
						data: arr
					}]
				});
			}
		});
	}
});
}(Highcharts));

