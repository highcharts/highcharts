/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';
	var UNDEFINED;

	H.seriesType('zigzag', 'sma', {
		name: 'Zig Zag (1%)',
		params: {
			lowIndex: 2,
			highIndex: 1,
			deviation: 1
		}
	}, {
		getValues: function (series, params) {
			var lowIndex = params.lowIndex,
				highIndex = params.highIndex,
				deviation = params.deviation / 100,
				deviations = {
					'low': 1 + deviation,
					'high': 1 - deviation
				},
				xVal = series.xData,
				yVal = series.yData,
				yValLen = yVal ? yVal.length : 0,
				Zigzag = [],
				xData = [],
				yData = [],
				i, j,
				ZigzagPoint,
				firstZigzagLow,
				firstZigzagHigh,
				directionUp,
				zigZagLen,
				exitLoop = false,
				yIndex = false;
			
			// Exit if not enught points or no low or high values
			if (xVal.length <= 1 || (yValLen && (yVal[0][lowIndex] === UNDEFINED || yVal[0][highIndex] === UNDEFINED))) {
				return false;
			}

			// Set first zigzag point candidate
			firstZigzagLow = yVal[0][lowIndex];
			firstZigzagHigh = yVal[0][highIndex];

			// Search for a second zigzag point candidate, this will also set first zigzag point
			for (i = 1; i < yValLen; i++) {
				if (yVal[i][lowIndex] <= firstZigzagHigh * deviations.high) { // requried change to go down
					Zigzag.push([xVal[0], firstZigzagHigh]);
					ZigzagPoint = [xVal[i], yVal[i][lowIndex]]; // second zigzag point candidate
					directionUp = true; // next line will be going up
					exitLoop = true;
				} else if (yVal[i][highIndex] >= firstZigzagLow * deviations.low) { // requried change to go up
					Zigzag.push([xVal[0], firstZigzagLow]);
					ZigzagPoint = [xVal[i], yVal[i][highIndex]]; // second zigzag point candidate
					directionUp = false; // next line will be going down
					exitLoop = true;
				}
				if (exitLoop) {
					xData.push(Zigzag[0][0]);
					yData.push(Zigzag[0][1]);
					j = i++;
					i = yValLen;
				}
			}

			// Search for next zigzags
			for (i = j; i < yValLen; i++) {
				if (directionUp) { // next line up
					if (yVal[i][lowIndex] <= ZigzagPoint[1]) { // lower when going down -> change zigzag candidate
						ZigzagPoint = [xVal[i], yVal[i][lowIndex]];
					}
					if (yVal[i][highIndex] >= ZigzagPoint[1] * deviations.low) { // requried change to go down -> new zigzagpoint and direction change
						yIndex = highIndex;
					}
				} else { // next line down
					if (yVal[i][highIndex] >= ZigzagPoint[1]) { // higher when going up -> change zigzag candidate
						ZigzagPoint = [xVal[i], yVal[i][highIndex]];
					}
					if (yVal[i][lowIndex] <= ZigzagPoint[1] * deviations.high) { // requried change to go down -> new zigzagpoint and direction change
						yIndex = lowIndex;
					}
				}
				if (yIndex !== false) { // new zigzag point and direction change
					Zigzag.push(ZigzagPoint);
					xData.push(ZigzagPoint[0]);
					yData.push(ZigzagPoint[1]);
					ZigzagPoint = [xVal[i], yVal[i][yIndex]];
					directionUp = !directionUp;

					yIndex = false;
				}
			}

			zigZagLen = Zigzag.length;
			
			if (zigZagLen !== 0 && Zigzag[zigZagLen - 1][0] < xVal[yValLen - 1]) { // no zigzag for last point
				Zigzag.push(ZigzagPoint); // set last point from zigzag candidate
				xData.push(ZigzagPoint[0]);
				yData.push(ZigzagPoint[1]);
			}
			
			return {
				values: Zigzag,
				xData: xData,
				yData: yData
			};
		}
	});
}));
