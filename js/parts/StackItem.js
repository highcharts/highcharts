/**
 * The class for stack items
 */
function StackItem(axis, options, isNegative, x, stackOption) {
	var inverted = axis.chart.inverted;

	this.axis = axis;

	// Tells if the stack is negative
	this.isNegative = isNegative;

	// Save the options to be able to style the label
	this.options = options;

	// Save the x value to be able to position the label later
	this.x = x;

	// Save the stack option on the series configuration object
	this.stack = stackOption;

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
	 * Sets the total of this stack. Should be called when a serie is hidden or shown
	 * since that will affect the total of other stacks.
	 */
	setTotal: function (total) {
		this.total = total;
		this.cum = total;
	},

	/**
	 * Renders the stack total label and adds it to the stack label group.
	 */
	render: function (group) {
		var str = this.options.formatter.call(this);  // format the text in the label

		// Change the text to reflect the new total and set visibility to hidden in case the serie is hidden
		if (this.label) {
			this.label.attr({text: str, visibility: HIDDEN});
		// Create new label
		} else {
			this.label =
				this.axis.chart.renderer.text(str, 0, 0)		// dummy positions, actual position updated with setOffset method in columnseries
					.css(this.options.style)				// apply style
					.attr({align: this.textAlign,			// fix the text-anchor
						rotation: this.options.rotation,	// rotation
						visibility: HIDDEN })				// hidden until setOffset is called
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
			y = axis.translate(this.total, 0, 0, 0, 1),		// stack value translated mapped to chart coordinates
			yZero = axis.translate(0),						// stack origin
			h = mathAbs(y - yZero),							// stack height
			x = chart.xAxis[0].translate(this.x) + xOffset,	// stack x position
			plotHeight = chart.plotHeight,
			stackBox = {	// this is the box for the complete stack
					x: inverted ? (neg ? y : y - h) : x,
					y: inverted ? plotHeight - x - xWidth : (neg ? (plotHeight - y - h) : plotHeight - y),
					width: inverted ? h : xWidth,
					height: inverted ? xWidth : h
			};

		if (this.label) {
			this.label
				.align(this.alignOptions, null, stackBox)	// align the label to the box
				.attr({visibility: VISIBLE});				// set visibility
		}
		
	}
};
