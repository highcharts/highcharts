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
		return path;
	},
	
	/**
	 * Load an SVG file and extract the paths
	 * @param {Object} url
	 */
	loadSVG: function () {
		
		var data = this,
			options = this.options;
		
		function getTranslate(elem) {
			var transform = elem.getAttribute('transform'),
				translate = transform && transform.match(/translate\(([0-9\-\. ]+),([0-9\-\. ]+)\)/);
			
			return translate && [parseFloat(translate[1]), parseFloat(translate[2])]; 
		}
		
		function getName(elem) {
			return elem.getAttribute('inkscape:label') || elem.getAttribute('id') || elem.getAttribute('class');
		}
		
		jQuery.ajax({
			url: options.svg,
			dataType: 'xml',
			success: function (xml) {
				var arr = [],
					currentParent,
					allPaths = xml.getElementsByTagName('path'),
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
									commonLineage.slice(0, j);
								}
							}
						}
					}
				});
				lastCommonAncestor = commonLineage[commonLineage.length - 1];
				
				// Iterate groups to find sub paths
				if (handleGroups) {
					each(lastCommonAncestor.getElementsByTagName('g'), function (g) {
						var groupPath = [],
							translate = getTranslate(g);
						
						each(g.getElementsByTagName('path'), function (path) {
							if (!path.skip) {
								groupPath = groupPath.concat(
									data.pathToArray(path.getAttribute('d'), translate)
								);
								
								path.skip = true;
							}
						});
						arr.push({
							name: getName(g),
							path: groupPath
						});
					});
				}
				
				// Iterate the remaining paths that are not parts of groups
				each(allPaths, function (path) {
					if (!path.skip) {
						arr.push({
							name: getName(path),
							path: data.pathToArray(path.getAttribute('d'), getTranslate(path))
						});
					}			
				});
				
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

