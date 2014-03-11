/**
 * The class for stack items
 */
function StackItem(axis, options, isNegative, x, stackOption, stacking) {
	
	var inverted = axis.chart.inverted;

	this.axis = axis;

	// Tells if the stack is negative
	this.isNegative = isNegative;

	// Save the options to be able to style the label
	this.options = options;

	// Save the x value to be able to position the label later
	this.x = x;

	// Initialize total value
	this.total = null;

	// This will keep each points' extremes stored by series.index
	this.points = {};

	// Save the stack option on the series configuration object, and whether to treat it as percent
	this.stack = stackOption;
	this.percent = stacking === 'percent';

	// The align options and text align varies on whether the stack is negative and
	// if the chart is inverted or not.
	// First test the user supplied value, then use the dynamic.
	this.alignOptions = {
		align: options.align || (inverted ? (isNegative ? 'left' : 'right') : 'center'),
		verticalAlign: options.verticalAlign || (inverted ? 'middle' : (isNegative ? 'bottom' : 'top')),
		y: pick(options.y, inverted ? 4 : (isNegative ? 14 : -6)),
		x: pick(options.x, inverted ? (isNegative ? -6 : 6) : 0)
	};

	this.textAlign = options.textAlign || (inverted ? (isNegative ? 'right' : 'left') : 'center');
}

StackItem.prototype = {
	destroy: function () {
		destroyObjectProperties(this, this.axis);
	},

	/**
	 * Renders the stack total label and adds it to the stack label group.
	 */
	render: function (group) {
		var options = this.options,
			formatOption = options.format,
			str = formatOption ?
				format(formatOption, this) : 
				options.formatter.call(this);  // format the text in the label

		// Change the text to reflect the new total and set visibility to hidden in case the serie is hidden
		if (this.label) {
			this.label.attr({text: str, visibility: HIDDEN});
		// Create new label
		} else {
			this.label =
				this.axis.chart.renderer.text(str, 0, 0, options.useHTML)		// dummy positions, actual position updated with setOffset method in columnseries
					.css(options.style)				// apply style
					.attr({
						align: this.textAlign,				// fix the text-anchor
						rotation: options.rotation,	// rotation
						visibility: HIDDEN					// hidden until setOffset is called
					})				
					.add(group);							// add to the labels-group
		}
	},

	/**
	 * Sets the offset that the stack has from the x value and repositions the label.
	 */
	setOffset: function (xOffset, xWidth) {
		var stackItem = this,
			axis = stackItem.axis,
			chart = axis.chart,
			inverted = chart.inverted,
			neg = this.isNegative,							// special treatment is needed for negative stacks
			y = axis.translate(this.percent ? 100 : this.total, 0, 0, 0, 1), // stack value translated mapped to chart coordinates
			yZero = axis.translate(0),						// stack origin
			h = mathAbs(y - yZero),							// stack height
			x = chart.xAxis[0].translate(this.x) + xOffset,	// stack x position
			plotHeight = chart.plotHeight,
			stackBox = {	// this is the box for the complete stack
				x: inverted ? (neg ? y : y - h) : x,
				y: inverted ? plotHeight - x - xWidth : (neg ? (plotHeight - y - h) : plotHeight - y),
				width: inverted ? h : xWidth,
				height: inverted ? xWidth : h
			},
			label = this.label,
			alignAttr;
		
		if (label) {
			label.align(this.alignOptions, null, stackBox);	// align the label to the box
				
			// Set visibility (#678)
			alignAttr = label.alignAttr;
			label[this.options.crop === false || chart.isInsidePlot(alignAttr.x, alignAttr.y) ? 'show' : 'hide'](true);
		}
	}
};


// Stacking methods defined on the Axis prototype

/**
 * Build the stacks from top down
 */
Axis.prototype.buildStacks = function () {
	var series = this.series,
		reversedStacks = pick(this.options.reversedStacks, true),
		i = series.length;
	if (!this.isXAxis) {
		this.usePercentage = false;
		while (i--) {
			series[reversedStacks ? i : series.length - i - 1].setStackedPoints();
		}
		// Loop up again to compute percent stack
		if (this.usePercentage) {
			for (i = 0; i < series.length; i++) {
				series[i].setPercentStacks();
			}
		}
	}
};

Axis.prototype.renderStackTotals = function () {
	var axis = this,
		chart = axis.chart,
		renderer = chart.renderer,
		stacks = axis.stacks,
		stackKey, 
		oneStack, 
		stackCategory,
		stackTotalGroup = axis.stackTotalGroup;

	// Create a separate group for the stack total labels
	if (!stackTotalGroup) {
		axis.stackTotalGroup = stackTotalGroup =
			renderer.g('stack-labels')
				.attr({
					visibility: VISIBLE,
					zIndex: 6
				})
				.add();
	}

	// plotLeft/Top will change when y axis gets wider so we need to translate the
	// stackTotalGroup at every render call. See bug #506 and #516
	stackTotalGroup.translate(chart.plotLeft, chart.plotTop);

	// Render each stack total
	for (stackKey in stacks) {
		oneStack = stacks[stackKey];
		for (stackCategory in oneStack) {
			oneStack[stackCategory].render(stackTotalGroup);
		}
	}
};


// Stacking methods defnied for Series prototype

/**
 * Adds series' points value to corresponding stack
 */
Series.prototype.setStackedPoints = function () {
	if (!this.options.stacking || (this.visible !== true && this.chart.options.chart.ignoreHiddenSeries !== false)) {
		return;
	}

	var series = this,
		xData = series.processedXData,
		yData = series.processedYData,
		stackedYData = [],
		yDataLength = yData.length,
		seriesOptions = series.options,
		threshold = seriesOptions.threshold,
		stackOption = seriesOptions.stack,
		stacking = seriesOptions.stacking,
		stackKey = series.stackKey,
		negKey = '-' + stackKey,
		negStacks = series.negStacks,
		yAxis = series.yAxis,
		stacks = yAxis.stacks,
		oldStacks = yAxis.oldStacks,
		isNegative,
		stack,
		other,
		key,
		i,
		x,
		y;

	// loop over the non-null y values and read them into a local array
	for (i = 0; i < yDataLength; i++) {
		x = xData[i];
		y = yData[i];

		// Read stacked values into a stack based on the x value,
		// the sign of y and the stack key. Stacking is also handled for null values (#739)
		isNegative = negStacks && y < threshold;
		key = isNegative ? negKey : stackKey;

		// Create empty object for this stack if it doesn't exist yet
		if (!stacks[key]) {
			stacks[key] = {};
		}

		// Initialize StackItem for this x
		if (!stacks[key][x]) {
			if (oldStacks[key] && oldStacks[key][x]) {
				stacks[key][x] = oldStacks[key][x];
				stacks[key][x].total = null;
			} else {
				stacks[key][x] = new StackItem(yAxis, yAxis.options.stackLabels, isNegative, x, stackOption, stacking);
			}
		}

		// If the StackItem doesn't exist, create it first
		stack = stacks[key][x];
		stack.points[series.index] = [stack.cum || 0];

		// Add value to the stack total
		if (stacking === 'percent') {

			// Percent stacked column, totals are the same for the positive and negative stacks
			other = isNegative ? stackKey : negKey;
			if (negStacks && stacks[other] && stacks[other][x]) {
				other = stacks[other][x];
				stack.total = other.total = mathMax(other.total, stack.total) + mathAbs(y) || 0;

			// Percent stacked areas
			} else {
				stack.total = correctFloat(stack.total + (mathAbs(y) || 0));
			}
		} else {
			stack.total = correctFloat(stack.total + (y || 0));
		}

		stack.cum = (stack.cum || 0) + (y || 0);

		stack.points[series.index].push(stack.cum);
		stackedYData[i] = stack.cum;

	}

	if (stacking === 'percent') {
		yAxis.usePercentage = true;
	}

	this.stackedYData = stackedYData; // To be used in getExtremes

	// Reset old stacks
	yAxis.oldStacks = {};
};

/**
 * Iterate over all stacks and compute the absolute values to percent
 */
Series.prototype.setPercentStacks = function () {
	var series = this,
		stackKey = series.stackKey,
		stacks = series.yAxis.stacks,
		processedXData = series.processedXData;

	each([stackKey, '-' + stackKey], function (key) {
		var i = processedXData.length,
			x,
			stack,
			pointExtremes,
			totalFactor;

		while (i--) {
			x = processedXData[i];
			stack = stacks[key] && stacks[key][x];
			pointExtremes = stack && stack.points[series.index];
			if (pointExtremes) {
				totalFactor = stack.total ? 100 / stack.total : 0;
				pointExtremes[0] = correctFloat(pointExtremes[0] * totalFactor); // Y bottom value
				pointExtremes[1] = correctFloat(pointExtremes[1] * totalFactor); // Y value
				series.stackedYData[i] = pointExtremes[1];
			}
		}
	});
};

