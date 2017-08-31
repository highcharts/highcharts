/* global Highcharts module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';


	// Utils:
	function setInitialPsar(PSAR, accelerationFactor, previousPSARHigh, beforePreviousPSARHigh, previousPSARLow, beforePreviousPSARLow, extremePoint, isTrendFalling) {
		var multipliedVal = accelerationFactor * (PSAR - extremePoint);
		return isTrendFalling ?
			(Math.max(PSAR - multipliedVal, previousPSARHigh, beforePreviousPSARHigh)) :
			(Math.min(PSAR - multipliedVal, previousPSARLow, beforePreviousPSARLow));
	}
	function calculatePSAR(initialPSAR, isTrendFalling, point, extremePoint) {
		var psar;
		if (isTrendFalling) {
			psar = point[1] < initialPSAR ? initialPSAR : extremePoint;
		} else {
			psar = point[2] > initialPSAR ? initialPSAR : extremePoint;
		}
		return psar;
	}
	function checkTrend(PSAR, point) {
		var isTrendFalling = PSAR > point[3] ? true : false;
		return isTrendFalling;
	}
	function getExtremePoint(isTrendFalling, EP, point) {
		EP = isTrendFalling ? Math.min(EP, point[2]) : Math.max(EP, point[1]);
		return EP;
	}
	function getAccelerationFactor(isTrendFalling, oldIsTrendFalling, initialAccelerationFactor, maxAccelerationFactor, accelerationFactor, increment, extremePoint, oldExtremePoint) {
		var newAccelerationFactor;
		if (isTrendFalling === oldIsTrendFalling) {
			newAccelerationFactor = (extremePoint !== oldExtremePoint) ?
				Math.min(accelerationFactor + increment, maxAccelerationFactor) :
				accelerationFactor;
		} else {
			newAccelerationFactor = initialAccelerationFactor;
		}
		return newAccelerationFactor;
	}

	H.seriesType('psar', 'sma', {
		name: 'PSAR',
		lineWidth: 0,
		marker: {
			enabled: true
		},
		states: {
			hover: {
				lineWidthPlus: 0
			}
		},
		params: {
			initialAccelerationFactor: 0.02,
			maxAccelerationFactor: 0.2,
			increment: 0.02
		}
	}, {
		getValues: function (series, params) {
			var xVal = series.xData,
				yVal = series.yData,
				extremePoint, // Extreme point is the lowest low for falling and highest high for rising psar - and we are starting with falling
				oldExtremePoint,
				accelerationFactor = params.initialAccelerationFactor,
				maxAccelerationFactor = params.maxAccelerationFactor,
				increment = params.increment,
				initialAccelerationFactor = params.initialAccelerationFactor, // Set initial acc factor (for every new trend!)
				PSAR,
				initialPSAR,
				index = 0,
				isTrendFalling = true, // Set initial psar trend to falling (it will corect itself quickly!)
				PSARArr = [],
				xData = [],
				yData = [],
				point, oldIsTrendFalling;

			extremePoint = isTrendFalling ? yVal[index][2] : yVal[index][1];
			PSAR = isTrendFalling ? yVal[index][1] : yVal[index][2];
			PSARArr.push([xVal[index], PSAR]);
			xData.push(xVal[index]);
			yData.push(PSAR);

			for (var ind = index + 1; ind < yVal.length - 1; ind++) {
				point = yVal[ind];
				initialPSAR = setInitialPsar(PSAR, accelerationFactor, yVal[ind - 1][1], yVal[(ind - 2 >= 0 ? ind - 2 : 0)][1], yVal[ind - 1][2], yVal[(ind - 2 >= 0 ? ind - 2 : 0)][2], extremePoint, isTrendFalling); // initial psar calculations
				PSAR = calculatePSAR(initialPSAR, isTrendFalling, point, extremePoint);
				oldIsTrendFalling = isTrendFalling;
				isTrendFalling = checkTrend(PSAR, point);
				oldExtremePoint = extremePoint;
				extremePoint = getExtremePoint(isTrendFalling, oldExtremePoint, point);
				accelerationFactor = getAccelerationFactor(isTrendFalling, oldIsTrendFalling, initialAccelerationFactor, maxAccelerationFactor, accelerationFactor, increment, extremePoint, oldExtremePoint);
				PSARArr.push([xVal[ind], PSAR]);
				xData.push(xVal[ind]);
				yData.push(PSAR);
			}
			return {
				values: PSARArr,
				xData: xData,
				yData: yData
			};
		}
	});
}));
