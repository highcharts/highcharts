var TooltipTest = TestCase("TooltipTest");



/**
 * Tests if a point is inside a rectangle
 * The rectangle coordinate system is: x and y specifies the _top_ left corner width is the width and height is the height.
 */
TooltipTest.prototype.pointInRect = function (x, y, rect) {
	if (rect.plotWidth) { // chart format
		rect = {
			x: rect.plotLeft,
			y: rect.plotTop,
			width: rect.plotWidth, 
			height: rect.plotHeight
		};
	}
	
	var inside =
		x >= rect.x && x <= (rect.x + rect.width) &&
		y >= rect.y && y <= (rect.y + rect.height)
	return inside;
};

/**
 * Tests if a small rectangle is inside a bigger rectangle by testing each corner.
 */
TooltipTest.prototype.rectInRect = function (smallRect, largeRect) {
	// (Maybe only two corners need to be tested)
	var inside = this.pointInRect(smallRect.x, smallRect.y, largeRect); // left top
	inside = inside && this.pointInRect(smallRect.x + smallRect.width, smallRect.y, largeRect); // right top
	inside = inside && this.pointInRect(smallRect.x + smallRect.width, smallRect.y + smallRect.height, largeRect); // right bottom
	inside = inside && this.pointInRect(smallRect.x, smallRect.y + smallRect.height, largeRect); // left bottom
	return inside;
};

/**
 * Test the getPosition method. It should adjust a tooltip rectangle to be inside the chart but not cover the point itself.
 */
TooltipTest.prototype.testGetPosition = function () {
	function reset () {
		tooltip = {
			chart: { 
				plotLeft: 0, 
				plotTop: 0, 
				plotWidth: 100, 
				plotHeight: 100 
			},
			options: {
				
			}
		};
		tooltipSize = {width: 50, height: 20};
		dataPoint = { plotX: 0, plotY: 50 };
		tooltipPoint = undefined;
		boxPoint = undefined;
	}
	
	var getPosition = Tooltip.prototype.getPosition,
		tooltip,
		tooltipSize,
		dataPoint,
		tooltipPoint,
		boxPoint;
		
	reset();
		
	boxPoint = getPosition.call(tooltip, tooltipSize.width, tooltipSize.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('Left rectInRect chart', this.rectInRect(boxPoint, tooltip.chart));
	assertFalse('Left tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.plotX = 100;
	boxPoint = getPosition.call(tooltip, tooltipSize.width, tooltipSize.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('Right rectInRect chart', this.rectInRect(boxPoint, tooltip.chart));
	assertFalse('Right tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.plotX = 50;
	boxPoint = getPosition.call(tooltip, tooltipSize.width, tooltipSize.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('Mid rectInRect chart', this.rectInRect(boxPoint, tooltip.chart));
	assertFalse('Mid tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));

	dataPoint.plotX = 75;
	dataPoint.plotY = 5;
	boxPoint = getPosition.call(tooltip, tooltipSize.width, tooltipSize.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('TopRight rectInRect chart', this.rectInRect(boxPoint, tooltip.chart));
	assertFalse('TopRight tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));
	
	// #834
	reset();
	tooltipSize.width = 64;
	tooltipSize.height = 46;
	dataPoint.plotX = 13;
	dataPoint.plotY = 48;
	tooltip.chart.plotLeft = 32;
	tooltip.chart.plotTop = 10;
	tooltip.chart.plotWidth = 78;
	tooltip.chart.plotHeight = 63;
	boxPoint = getPosition.call(tooltip, tooltipSize.width, tooltipSize.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('TopRight rectInRect chart', this.rectInRect(boxPoint, tooltip.chart));
	assertFalse('TopRight tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));
	
	// #1231
	reset();
	tooltipSize.width = 96;
	tooltipSize.height = 35;
	dataPoint.plotX = -41;
	dataPoint.plotY = 19;
	tooltip.chart.plotLeft = 25;
	tooltip.chart.plotTop = 40;
	tooltip.chart.plotWidth = 165;
	tooltip.chart.plotHeight = 75;
	tooltip.chart.inverted = true;
	boxPoint = getPosition.call(tooltip, tooltipSize.width, tooltipSize.height, dataPoint);
	extend(boxPoint, tooltipSize);
	assertTrue('Inverted rectInRect chart', this.rectInRect(boxPoint, tooltip.chart));
	assertFalse('Inverted tooltip cover point', this.pointInRect(dataPoint.x, dataPoint.y, boxPoint));
};