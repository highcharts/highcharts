/**
 * Path interpolation algorithm used across adapters
 */
pathAnim = {
	/**
	 * Prepare start and end values so that the path can be animated one to one
	 */
	init: function (elem, fromD, toD) {
		fromD = fromD || '';
		var shift = elem.shift,
			bezier = fromD.indexOf('C') > -1,
			numParams = bezier ? 7 : 3,
			endLength,
			slice,
			i,
			start = fromD.split(' '),
			end = [].concat(toD), // copy
			isArea = elem.isArea,
			positionFactor = isArea ? 2 : 1,
			sixify = function (arr) { // in splines make move points have six parameters like bezier curves
				i = arr.length;
				while (i--) {
					if (arr[i] === M || arr[i] === L) {
						arr.splice(i + 1, 0, arr[i + 1], arr[i + 2], arr[i + 1], arr[i + 2]);
					}
				}
			};

		if (bezier) {
			sixify(start);
			sixify(end);
		}

		// If shifting points, prepend a dummy point to the end path. For areas,
		// prepend both at the beginning and end of the path.
		if (shift <= end.length / numParams && start.length === end.length) {
			while (shift--) {
				end = end.slice(0, numParams).concat(end);
				if (isArea) {
					end = end.concat(end.slice(end.length - numParams));
				}
			}
		}
		elem.shift = 0; // reset for following animations

		
		// Copy and append last point until the length matches the end length
		if (start.length) {
			endLength = end.length;
			while (start.length < endLength) {

				// Pull out the slice that is going to be appended or inserted. In a line graph,
				// the positionFactor is 1, and the last point is sliced out. In an area graph,
				// the positionFactor is 2, causing the middle two points to be sliced out, since
				// an area path starts at left, follows the upper path then turns and follows the
				// bottom back. 
				slice = start.slice().splice(
					(start.length / positionFactor) - numParams, 
					numParams * positionFactor
				);
				
				// Disable first control point
				if (bezier) {
					slice[numParams - 6] = slice[numParams - 2];
					slice[numParams - 5] = slice[numParams - 1];
				}
				
				// Now insert the slice, either in the middle (for areas) or at the end (for lines)
				[].splice.apply(
					start, 
					[(start.length / positionFactor), 0].concat(slice)
				);

			}
		}

		return [start, end];
	},

	/**
	 * Interpolate each value of the path and return the array
	 */
	step: function (start, end, pos, complete) {
		var ret = [],
			i = start.length,
			startVal;

		if (pos === 1) { // land on the final path without adjustment points appended in the ends
			ret = complete;

		} else if (i === end.length && pos < 1) {
			while (i--) {
				startVal = parseFloat(start[i]);
				ret[i] =
					isNaN(startVal) ? // a letter instruction like M or L
						start[i] :
						pos * (parseFloat(end[i] - startVal)) + startVal;

			}
		} else { // if animation is finished or length not matching, land on right value
			ret = end;
		}
		return ret;
	}
};

