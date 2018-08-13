/*
*  This file contains things that are referrenced in the old API dump, which   *
*  can't be found in the source code. All items here should be moved over to   *
*  the appropriate location in the source.                                     *
*******************************************************************************/

/* eslint max-len: 0 */





/**
 * Deprecated. Set the `text` to `null` to disable the title.
 *
 * @type {String}
 * @deprecated
 * @default middle
 * @product highcharts
 * @apioption xAxis.title.enabled
 */

/**
 * Alignment of the text, can be `"left"`, `"right"` or `"center"`.
 * Default alignment depends on the [title.align](xAxis.title.align):
 *
 * Horizontal axes:
 * - for `align` = `"low"`, `textAlign` is set to `left`
 * - for `align` = `"middle"`, `textAlign` is set to `center`
 * - for `align` = `"high"`, `textAlign` is set to `right`
 *
 * Vertical axes:
 * - for `align` = `"low"` and `opposite` = `true`, `textAlign` is set to
 * `right`
 * - for `align` = `"low"` and `opposite` = `false`, `textAlign` is set to
 * `left`
 * - for `align` = `"middle"`, `textAlign` is set to `center`
 * - for `align` = `"high"` and `opposite` = `true` `textAlign` is set to
 * `left`
 * - for `align` = `"high"` and `opposite` = `false` `textAlign` is set to
 * `right`
 *
 * @type {String}
 * @defaults undefined
 * @apioption xAxis.title.textAlign
 */

/**
 * The pixel distance between the axis labels or line and the title.
 *  Defaults to 0 for horizontal axes, 10 for vertical
 *
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/title-margin/ Y axis title margin of 60
 * @apioption xAxis.title.margin
 */

/**
 * The distance of the axis title from the axis line. By default, this
 * distance is computed from the offset width of the labels, the labels'
 * distance from the axis and the title's margin. However when the offset
 * option is set, it overrides all this.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/title-offset/ Place the axis title on top of the axis
 * @sample {highstock} highcharts/yaxis/title-offset/ Place the axis title on top of the Y axis
 * @since 2.2.0
 * @apioption xAxis.title.offset
 */

/**
 * Whether to reserve space for the title when laying out the axis.
 *
 * @type {Boolean}
 * @default true
 * @since 5.0.11
 * @product highcharts highstock
 * @apioption xAxis.title.reserveSpace
 */

/**
 * The rotation of the text in degrees. 0 is horizontal, 270 is vertical
 * reading from bottom to top.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/title-offset/ Horizontal
 * @default 0
 * @apioption xAxis.title.rotation
 */

/**
 * The actual text of the axis title. It can contain basic HTML text
 * markup like <b>, <i> and spans with style.
 *
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/title-text/ Custom HTML
 * @sample {highstock} stock/xaxis/title-text/ Titles for both axes
 * @default null
 * @apioption xAxis.title.text
 */

/**
 * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the axis title.
 *
 * @type {Boolean}
 * @default false
 * @product highcharts highstock
 * @apioption xAxis.title.useHTML
 */

/**
 * Horizontal pixel offset of the title position.
 *
 * @type {Number}
 * @default 0
 * @since 4.1.6
 * @product highcharts highstock
 * @apioption xAxis.title.x
 */

/**
 * Vertical pixel offset of the title position.
 *
 * @type {Number}
 * @product highcharts highstock
 * @apioption xAxis.title.y
 */

/**
 * In a polar chart, this is the angle of the Y axis in degrees, where
 * 0 is up and 90 is right. The angle determines the position of the
 * axis line and the labels, though the coordinate system is unaffected.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/angle/ Dual axis polar chart
 * @default 0
 * @since 4.2.7
 * @product highcharts
 * @apioption yAxis.angle
 */

/**
 * Polar charts only. Whether the grid lines should draw as a polygon
 * with straight lines between categories, or as circles. Can be either
 * `circle` or `polygon`.
 *
 * @validvalue ["circle", "polygon"]
 * @type {String}
 * @sample {highcharts} highcharts/demo/polar-spider/ Polygon grid lines
 * @sample {highcharts} highcharts/yaxis/gridlineinterpolation/ Circle and polygon
 * @default null
 * @product highcharts
 * @apioption yAxis.gridLineInterpolation
 */

/**
 * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
 * to represent the maximum value of the Y axis.
 *
 * @type {Color}
 * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/ Min and max colors
 * @default #003399
 * @since 4.0
 * @product highcharts
 * @apioption yAxis.maxColor
 */

/**
 * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
 * to represent the minimum value of the Y axis.
 *
 * @type {Color}
 * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/ Min and max color
 * @default #e6ebf5
 * @since 4.0
 * @product highcharts
 * @apioption yAxis.minColor
 */

/**
 * This option determines how stacks should be ordered within a group.
 * For example reversed xAxis also reverses stacks, so first series comes last
 * in a group. To keep order like for non-reversed xAxis enable this option.
 *
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/reversedstacks/ Reversed stacks comparison
 * @sample {highstock} highcharts/xaxis/reversedstacks/ Reversed stacks comparison
 * @default false
 * @since 6.1.1
 * @product highcharts highstock
 * @apioption xAxis.reversedStacks
 */

/**
 * If `true`, the first series in a stack will be drawn on top in a
 * positive, non-reversed Y axis. If `false`, the first series is in
 * the base of the stack.
 *
 * @type {Boolean}
 * @sample {highcharts} highcharts/yaxis/reversedstacks-false/ Non-reversed stacks
 * @sample {highstock} highcharts/yaxis/reversedstacks-false/ Non-reversed stacks
 * @default true
 * @since 3.0.10
 * @product highcharts highstock
 * @apioption yAxis.reversedStacks
 */

/**
 * Solid gauge series only. Color stops for the solid gauge. Use this
 * in cases where a linear gradient between a `minColor` and `maxColor`
 * is not sufficient. The stops is an array of tuples, where the first
 * item is a float between 0 and 1 assigning the relative position in
 * the gradient, and the second item is the color.
 *
 * For solid gauges, the Y axis also inherits the concept of [data classes](http://api.
 * highcharts.com/highmaps#colorAxis.dataClasses) from the Highmaps
 * color axis.
 *
 * @type {Array<Array>}
 * @see [minColor](#yAxis.minColor), [maxColor](#yAxis.maxColor).
 * @sample {highcharts} highcharts/demo/gauge-solid/ True by default
 * @since 4.0
 * @product highcharts
 * @apioption yAxis.stops
 */

/**
 * The pixel width of the major tick marks.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/tickwidth/ 10 px width
 * @sample {highstock} stock/xaxis/ticks/ Formatted ticks on X axis
 * @default 0
 * @product highcharts highstock
 * @apioption yAxis.tickWidth
 */

/**
 * Angular gauges and solid gauges only. The label's pixel distance
 * from the perimeter of the plot area.
 *
 * @type {Number}
 * @default -25
 * @product highcharts
 * @apioption yAxis.labels.distance
 */

/**
 * The y position offset of the label relative to the tick position
 * on the axis.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-x/ Y axis labels placed on grid lines
 * @default {highcharts} 3
 * @default {highstock} -2
 * @default {highmaps} 3
 * @apioption yAxis.labels.y
 */

/**
 * An array of objects defining plot bands on the Y axis.
 *
 * @type {Array<Object>}
 * @extends xAxis.plotBands
 * @product highcharts highstock
 * @apioption yAxis.plotBands
 */

/**
 * In a gauge chart, this option determines the inner radius of the
 * plot band that stretches along the perimeter. It can be given as
 * a percentage string, like `"100%"`, or as a pixel number, like `100`.
 * By default, the inner radius is controlled by the [thickness](
 * #yAxis.plotBands.thickness) option.
 *
 * @type {Number|String}
 * @sample {highcharts} highcharts/xaxis/plotbands-gauge Gauge plot band
 * @default null
 * @since 2.3
 * @product highcharts
 * @apioption yAxis.plotBands.innerRadius
 */

/**
 * In a gauge chart, this option determines the outer radius of the
 * plot band that stretches along the perimeter. It can be given as
 * a percentage string, like `"100%"`, or as a pixel number, like `100`.
 *
 * @type {Number|String}
 * @sample {highcharts} highcharts/xaxis/plotbands-gauge Gauge plot band
 * @default 100%
 * @since 2.3
 * @product highcharts
 * @apioption yAxis.plotBands.outerRadius
 */

/**
 * In a gauge chart, this option sets the width of the plot band stretching
 * along the perimeter. It can be given as a percentage string, like
 * `"10%"`, or as a pixel number, like `10`. The default value 10 is
 * the same as the default [tickLength](#yAxis.tickLength), thus making
 * the plot band act as a background for the tick markers.
 *
 * @type {Number|String}
 * @sample {highcharts} highcharts/xaxis/plotbands-gauge Gauge plot band
 * @default 10
 * @since 2.3
 * @product highcharts
 * @apioption yAxis.plotBands.thickness
 */

/**
 * An array of objects representing plot lines on the X axis
 *
 * @type {Array<Object>}
 * @extends xAxis.plotLines
 * @product highcharts highstock
 * @apioption yAxis.plotLines
 */

/**
 * Defines the horizontal alignment of the stack total label. Can be
 * one of `"left"`, `"center"` or `"right"`. The default value is calculated
 * at runtime and depends on orientation and whether the stack is positive
 * or negative.
 *
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/stacklabels-align-left/ Aligned to the left
 * @sample {highcharts} highcharts/yaxis/stacklabels-align-center/ Aligned in center
 * @sample {highcharts} highcharts/yaxis/stacklabels-align-right/ Aligned to the right
 * @since 2.1.5
 * @product highcharts
 * @apioption yAxis.stackLabels.align
 */

/**
 * A [format string](http://docs.highcharts.com/#formatting) for the
 * data label. Available variables are the same as for `formatter`.
 *
 * @type {String}
 * @default {total}
 * @since 3.0.2
 * @product highcharts highstock
 * @apioption yAxis.stackLabels.format
 */

/**
 * Rotation of the labels in degrees.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/stacklabels-rotation/ Labels rotated 45°
 * @default 0
 * @since 2.1.5
 * @product highcharts
 * @apioption yAxis.stackLabels.rotation
 */

/**
 * The text alignment for the label. While `align` determines where
 * the texts anchor point is placed with regards to the stack, `textAlign`
 * determines how the text is aligned against its anchor point. Possible
 * values are `"left"`, `"center"` and `"right"`. The default value
 * is calculated at runtime and depends on orientation and whether the
 * stack is positive or negative.
 *
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/stacklabels-textalign-left/ Label in center position but text-aligned left
 * @since 2.1.5
 * @product highcharts
 * @apioption yAxis.stackLabels.textAlign
 */

/**
 * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
 * to render the labels.
 *
 * @type {Boolean}
 * @default false
 * @since 3.0
 * @product highcharts highstock
 * @apioption yAxis.stackLabels.useHTML
 */

/**
 * Defines the vertical alignment of the stack total label. Can be one
 * of `"top"`, `"middle"` or `"bottom"`. The default value is calculated
 * at runtime and depends on orientation and whether the stack is positive
 * or negative.
 *
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/stacklabels-verticalalign-top/ "Vertically aligned top"
 * @sample {highcharts} highcharts/yaxis/stacklabels-verticalalign-middle/ "Vertically aligned middle"
 * @sample {highcharts} highcharts/yaxis/stacklabels-verticalalign-bottom/ "Vertically aligned bottom"
 * @since 2.1.5
 * @product highcharts
 * @apioption yAxis.stackLabels.verticalAlign
 */

/**
 * The x position offset of the label relative to the left of the stacked
 * bar. The default value is calculated at runtime and depends on orientation
 * and whether the stack is positive or negative.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/stacklabels-x/ Stack total labels with x offset
 * @since 2.1.5
 * @product highcharts
 * @apioption yAxis.stackLabels.x
 */

/**
 * The y position offset of the label relative to the tick position
 * on the axis. The default value is calculated at runtime and depends
 * on orientation and whether the stack is positive or negative.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/stacklabels-y/ Stack total labels with y offset
 * @since 2.1.5
 * @product highcharts
 * @apioption yAxis.stackLabels.y
 */

/**
 * The pixel distance between the axis labels and the title. Positive
 * values are outside the axis line, negative are inside.
 *
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/title-margin/ Y axis title margin of 60
 * @default 40
 * @apioption yAxis.title.margin
 */

/**
 * The Z axis or depth axis for 3D plots.
 *
 * See [the Axis object](/class-reference/Highcharts.Axis) for programmatic
 * access to the axis.
 *
 * @extends xAxis
 * @excluding breaks,crosshair,lineColor,lineWidth,nameToX,showEmpty
 * @sample {highcharts} highcharts/3d/scatter-zaxis-categories/ Z-Axis with Categories
 * @sample {highcharts} highcharts/3d/scatter-zaxis-grid/ Z-Axis with styling
 * @since 5.0.0
 * @product highcharts
 * @apioption zAxis
 */

/**
 * Whether the navigator and scrollbar should adapt to updated data
 * in the base X axis. When loading data async, as in the demo below,
 * this should be `false`. Otherwise new data will trigger navigator
 * redraw, which will cause unwanted looping. In the demo below, the
 * data in the navigator is set only once. On navigating, only the main
 * chart content is updated.
 *
 * @type {Boolean}
 * @sample {highstock} stock/demo/lazy-loading/ Set to false with async data loading
 * @default true
 * @product highstock
 * @apioption navigator.adaptToUpdatedData
 */

/**
 * An integer identifying the index to use for the base series, or a
 * string representing the id of the series.
 *
 * **Note**: As of Highcharts 5.0, this is now a deprecated option.
 * Prefer [series.showInNavigator](#plotOptions.series.showInNavigator).
 *
 * @type {Mixed}
 * @see [series.showInNavigator](#plotOptions.series.showInNavigator)
 * @deprecated
 * @default 0
 * @product highstock
 * @apioption navigator.baseSeries
 */

/**
 * Enable or disable the navigator.
 *
 * @type {Boolean}
 * @sample {highstock} stock/navigator/enabled/ Disable the navigator
 * @default true
 * @product highstock
 * @apioption navigator.enabled
 */

/**
 * When the chart is inverted, whether to draw the navigator on the
 * opposite side.
 *
 * @type {Boolean}
 * @default false
 * @since 5.0.8
 * @product highstock
 * @apioption navigator.opposite
 */

/**
 * Additional range on the right side of the xAxis. Works similar to
 * `xAxis.maxPadding`, but value is set in milliseconds. Can be set for both
 * main `xAxis` and the navigator's `xAxis`.
 *
 * @type {Number}
 * @default 0
 * @sample {highstock} stock/xaxis/overscroll/ One minute overscroll with live data
 * @since 6.0.0
 * @product highstock
 * @apioption xAxis.overscroll
 */

























/**
 * Whether to enable all buttons from the start. By default buttons
 * are only enabled if the corresponding time range exists on the X
 * axis, but enabling all buttons allows for dynamically loading different
 * time ranges.
 *
 * @type {Boolean}
 * @sample {highstock} stock/rangeselector/allbuttonsenabled-true/ All buttons enabled
 * @default false
 * @since 2.0.3
 * @product highstock
 * @apioption rangeSelector.allButtonsEnabled
 */

/**
 * The space in pixels between the buttons in the range selector.
 *
 * @type {Number}
 * @default 0
 * @product highstock
 * @apioption rangeSelector.buttonSpacing
 */

/**
 * Enable or disable the range selector.
 *
 * @type {Boolean}
 * @sample {highstock} stock/rangeselector/enabled/ Disable the range selector
 * @default true
 * @product highstock
 * @apioption rangeSelector.enabled
 */

/**
 * The border color of the date input boxes.
 *
 * @type {Color}
 * @sample {highstock} stock/rangeselector/styling/ Styling the buttons and inputs
 * @default #cccccc
 * @since 1.3.7
 * @product highstock
 * @apioption rangeSelector.inputBoxBorderColor
 */

/**
 * The pixel height of the date input boxes.
 *
 * @type {Number}
 * @sample {highstock} stock/rangeselector/styling/ Styling the buttons and inputs
 * @default 17
 * @since 1.3.7
 * @product highstock
 * @apioption rangeSelector.inputBoxHeight
 */

/**
 * CSS for the container DIV holding the input boxes. Deprecated as
 * of 1.2.5\. Use [inputPosition](#rangeSelector.inputPosition) instead.
 *
 * @type {CSSObject}
 * @deprecated
 * @sample {highstock} stock/rangeselector/styling/ Styling the buttons and inputs
 * @product highstock
 * @apioption rangeSelector.inputBoxStyle
 */

/**
 * The pixel width of the date input boxes.
 *
 * @type {Number}
 * @sample {highstock} stock/rangeselector/styling/ Styling the buttons and inputs
 * @default 90
 * @since 1.3.7
 * @product highstock
 * @apioption rangeSelector.inputBoxWidth
 */

/**
 * The date format in the input boxes when not selected for editing.
 *  Defaults to `%b %e, %Y`.
 *
 * @type {String}
 * @sample {highstock} stock/rangeselector/input-format/ Milliseconds in the range selector
 * @default %b %e %Y,
 * @product highstock
 * @apioption rangeSelector.inputDateFormat
 */

/**
 * A custom callback function to parse values entered in the input boxes
 * and return a valid JavaScript time as milliseconds since 1970.
 *
 * @type {Function}
 * @sample {highstock} stock/rangeselector/input-format/ Milliseconds in the range selector
 * @since 1.3.3
 * @product highstock
 * @apioption rangeSelector.inputDateParser
 */

/**
 * The date format in the input boxes when they are selected for editing.
 * This must be a format that is recognized by JavaScript Date.parse.
 *
 * @type {String}
 * @sample {highstock} stock/rangeselector/input-format/ Milliseconds in the range selector
 * @default %Y-%m-%d
 * @product highstock
 * @apioption rangeSelector.inputEditDateFormat
 */

/**
 * Enable or disable the date input boxes. Defaults to enabled when
 * there is enough space, disabled if not (typically mobile).
 *
 * @type {Boolean}
 * @sample {highstock} stock/rangeselector/input-datepicker/ Extending the input with a jQuery UI datepicker
 * @product highstock
 * @apioption rangeSelector.inputEnabled
 */

/**
 * CSS for the HTML inputs in the range selector.
 *
 * In styled mode, the inputs are styled by the `.highcharts-range-input text`
 * rule in SVG mode, and `input.highcharts-range-selector` when active.
 *
 * @type {CSSObject}
 * @sample {highstock} stock/rangeselector/styling/ Styling the buttons and inputs
 * @product highstock
 * @apioption rangeSelector.inputStyle
 */

/**
 * The index of the button to appear pre-selected.
 *
 * @type {Number}
 * @default undefined
 * @product highstock
 * @apioption rangeSelector.selected
 */

/**
 * An array of configuration objects for the buttons.
 *
 * Defaults to
 *
 * <pre>buttons: [{
 *     type: 'month',
 *     count: 1,
 *     text: '1m'
 * }, {
 *     type: 'month',
 *     count: 3,
 *     text: '3m'
 * }, {
 *     type: 'month',
 *     count: 6,
 *     text: '6m'
 * }, {
 *     type: 'ytd',
 *     text: 'YTD'
 * }, {
 *     type: 'year',
 *     count: 1,
 *     text: '1y'
 * }, {
 *     type: 'all',
 *     text: 'All'
 * }]</pre>
 *
 * @type {Array<Object>}
 * @sample {highstock} stock/rangeselector/datagrouping/ Data grouping by buttons
 * @product highstock
 * @apioption rangeSelector.buttons
 */

/**
 * How many units of the defined type the button should span. If `type`
 * is "month" and `count` is 3, the button spans three months.
 *
 * @type {Number}
 * @default 1
 * @product highstock
 * @apioption rangeSelector.buttons.count
 */

/**
 * Fires when clicking on the rangeSelector button. One parameter, event,
 * is passed to the function, containing common event information.
 * <pre>
 * click: function(e) {
 *   console.log(this);
 * }
 * </pre>
 *
 * Return false to stop default button's click action.
 *
 * @type {Function}
 * @default undefined
 * @product highstock
 * @apioption rangeSelector.buttons.events.click
 * @sample {highstock} stock/rangeselector/button-click/ Click event on the button
 */

 /**
 * Additional range (in milliseconds) added to the end of the calculated time span.
 *
 * @type {Number}
 * @default 0
 * @sample {highstock} stock/rangeselector/min-max-offsets/ Button offsets
 * @product highstock
 * @since 6.0.0
 * @apioption rangeSelector.buttons.offsetMax
 */

 /**
 * Additional range (in milliseconds) added to the start of the calculated time span.
 *
 * @type {Number}
 * @default 0
 * @sample {highstock} stock/rangeselector/min-max-offsets/ Button offsets
 * @product highstock
 * @since 6.0.0
 * @apioption rangeSelector.buttons.offsetMin
 */


/**
 * When buttons apply dataGrouping on a series, by deafault zooming in/out will
 * deselect buttons and unset dataGrouping. Enable this option to keep buttons
 * selected when extremes change.
 *
 * @type {Boolean}
 * @since 6.1.2
 * @default false
 * @sample {highstock} stock/rangeselector/preserve-datagrouping/ Different preserveDataGrouping settings
 * @product highstock
 * @apioption rangeSelector.buttons.preserveDataGrouping
 */

/**
 * A custom data grouping object for each button.
 *
 * @type {Object}
 * @extends plotOptions.series.dataGrouping
 * @see [series.dataGrouping](#plotOptions.series.dataGrouping)
 * @sample {highstock} stock/rangeselector/datagrouping/ Data grouping by range selector buttons
 * @product highstock
 * @apioption rangeSelector.buttons.dataGrouping
 */

/**
 * The text for the button itself.
 *
 * @type {String}
 * @product highstock
 * @apioption rangeSelector.buttons.text
 */

/**
 * Defined the time span for the button. Can be one of `millisecond`,
 * `second`, `minute`, `hour`, `day`, `week`, `month`, `ytd`, `all`.
 *
 * @validvalue ["millisecond", "second", "minute", "day", "week", "month", "ytd", "all"]
 * @type {String}
 * @product highstock
 * @apioption rangeSelector.buttons.type
 */

/**
 * Enable or disable the scrollbar.
 *
 * @type {Boolean}
 * @sample {highstock} stock/scrollbar/enabled/ Disable the scrollbar, only use navigator
 * @default true
 * @product highstock
 * @apioption scrollbar.enabled
 */

/**
 * Whether to show or hide the scrollbar when the scrolled content is
 * zoomed out to it full extent.
 *
 * @type {Boolean}
 * @default true
 * @product highstock
 * @apioption scrollbar.showFull
 */

/**
 * The corner radius of the border of the scrollbar track.
 *
 * @type {Number}
 * @sample {highstock} stock/scrollbar/style/ Scrollbar styling
 * @default 0
 * @product highstock
 * @apioption scrollbar.trackBorderRadius
 */





/**
 * How many decimals to show for the `point.change` value when the
 * `series.compare` option is set. This is overridable in each series' tooltip
 * options object. The default is to preserve all decimals.
 *
 * @type {Number}
 * @since 1.0.1
 * @product highstock
 * @apioption tooltip.changeDecimals
 */

/**
 * In an ordinal axis, the points are equally spaced in the chart regardless
 * of the actual time or x distance between them. This means that missing
 * data for nights or weekends will not take up space in the chart.
 *
 * @type {Boolean}
 * @sample {highstock} stock/xaxis/ordinal-true/ True by default
 * @sample {highstock} stock/xaxis/ordinal-false/ False
 * @default true
 * @since 1.1
 * @product highstock
 * @apioption xAxis.ordinal
 */

/**
 * The zoomed range to display when only defining one or none of `min`
 * or `max`. For example, to show the latest month, a range of one month
 * can be set.
 *
 * @type {Number}
 * @sample {highstock} stock/xaxis/range/ Setting a zoomed range when the rangeSelector      is disabled
 * @default undefined
 * @product highstock
 * @apioption xAxis.range
 */

/**
 * A label on the axis next to the crosshair.
 *
 * In styled mode, the label is styled with the `.highcharts-crosshair-label` class.
 *
 * @type {Object}
 * @sample {highstock} stock/xaxis/crosshair-label/ Crosshair labels
 * @sample {highstock} highcharts/css/crosshair-label/ Style mode
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label
 */

/**
 * Alignment of the label compared to the axis. Defaults to `left` for
 * right-side axes, `right` for left-side axes and `center` for horizontal
 * axes.
 *
 * @type {String}
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.align
 */

/**
 * The background color for the label. Defaults to the related series
 * color, or `#666666` if that is not available.
 *
 * @type {Color}
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.backgroundColor
 */

/**
 * The border color for the crosshair label
 *
 * @type {Color}
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.borderColor
 */

/**
 * The border corner radius of the crosshair label.
 *
 * @type {Number}
 * @default 3
 * @since 2.1.10
 * @product highstock
 * @apioption xAxis.crosshair.label.borderRadius
 */

/**
 * The border width for the crosshair label.
 *
 * @type {Number}
 * @default 0
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.borderWidth
 */

/**
 * A format string for the crosshair label. Defaults to `{value}` for
 * numeric axes and `{value:%b %d, %Y}` for datetime axes.
 *
 * @type {String}
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.format
 */

/**
 * Formatter function for the label text.
 *
 * @type {Function}
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.formatter
 */

/**
 * Padding inside the crosshair label.
 *
 * @type {Number}
 * @default 8
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.padding
 */

/**
 * The shape to use for the label box.
 *
 * @type {String}
 * @default callout
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.shape
 */

/**
 * Text styles for the crosshair label.
 *
 * @type {CSSObject}
 * @default { "color": "white", "fontWeight": "normal", "fontSize": "11px", "textAlign": "center" }
 * @since 2.1
 * @product highstock
 * @apioption xAxis.crosshair.label.style
 */

/**
 * Horizontal axis only. When `staggerLines` is not set, `maxStaggerLines`
 * defines how many lines the axis is allowed to add to automatically
 * avoid overlapping X labels. Set to `1` to disable overlap detection.
 *
 * @type {Number}
 * @deprecated
 * @default 5
 * @since 1.3.3
 * @product highstock highmaps
 * @apioption xAxis.labels.maxStaggerLines
 */

/**
 * The height of the Y axis. If it's a number, it is interpreted as
 * pixels.
 *
 * Since Highstock 2: If it's a percentage string, it is interpreted
 * as percentages of the total plot height.
 *
 * @type {Number|String}
 * @see [yAxis.top](#yAxis.top)
 * @sample {highstock} stock/demo/candlestick-and-volume/ Percentage height panes
 * @default null
 * @product highstock
 * @apioption yAxis.height
 */

/**
 * A soft maximum for the axis. If the series data maximum is less
 * than this, the axis will stay at this maximum, but if the series
 * data maximum is higher, the axis will flex to show all data.
 *
 * **Note**: The [series.softThreshold](#plotOptions.series.softThreshold) option
 * takes precedence over this option.
 *
 * @type {Number}
 * @sample highcharts/yaxis/softmin-softmax/ Soft min and max
 * @since 5.0.1
 * @product highcharts highstock
 * @apioption yAxis.softMax
 */

/**
 * A soft minimum for the axis. If the series data minimum is greater
 * than this, the axis will stay at this minimum, but if the series
 * data minimum is lower, the axis will flex to show all data.
 *
 * **Note**: The [series.softThreshold](#plotOptions.series.softThreshold) option
 * takes precedence over this option.
 *
 * @type {Number}
 * @sample highcharts/yaxis/softmin-softmax/ Soft min and max
 * @since 5.0.1
 * @product highcharts highstock
 * @apioption yAxis.softMin
 */

/**
 * The top position of the Y axis. If it's a number, it is interpreted
 * as pixel position relative to the chart.
 *
 * Since Highstock 2: If it's a percentage string, it is interpreted
 * as percentages of the plot height, offset from plot area top.
 *
 * @type {Number|String}
 * @see [yAxis.height](#yAxis.height)
 * @sample {highstock} stock/demo/candlestick-and-volume/ Percentage height panes
 * @default null
 * @product highstock
 * @apioption yAxis.top
 */

/**
 * An optional scrollbar to display on the Y axis in response to limiting
 * the minimum an maximum of the axis values.
 *
 * In styled mode, all the presentational options for the scrollbar
 * are replaced by the classes `.highcharts-scrollbar-thumb`, `.highcharts-scrollbar-arrow`, `.highcharts-scrollbar-button`, `.highcharts-scrollbar-rifles` and `.highcharts-scrollbar-track`.
 *
 * @extends scrollbar
 * @excluding height
 * @sample {highstock} stock/yaxis/scrollbar/ Scrollbar on the Y axis
 * @since 4.2.6
 * @product highstock
 * @apioption yAxis.scrollbar
 */

/**
 * Enable the scrollbar on the Y axis.
 *
 * @type {Boolean}
 * @sample {highstock} stock/yaxis/scrollbar/ Enabled on Y axis
 * @default false
 * @since 4.2.6
 * @product highstock
 * @apioption yAxis.scrollbar.enabled
 */

/**
 * Pixel margin between the scrollbar and the axis elements.
 *
 * @type {Number}
 * @default 10
 * @since 4.2.6
 * @product highstock
 * @apioption yAxis.scrollbar.margin
 */

/**
 * Whether to show the scrollbar when it is fully zoomed out at max
 * range. Setting it to `false` on the Y axis makes the scrollbar stay
 * hidden until the user zooms in, like common in browsers.
 *
 * @type {Boolean}
 * @default true
 * @since 4.2.6
 * @product highstock
 * @apioption yAxis.scrollbar.showFull
 */

/**
 * The width of a vertical scrollbar or height of a horizontal scrollbar.
 *  Defaults to 20 on touch devices.
 *
 * @type {Number}
 * @default 14
 * @since 4.2.6
 * @product highstock
 * @apioption yAxis.scrollbar.size
 */

/**
 * Z index of the scrollbar elements.
 *
 * @type {Number}
 * @default 3
 * @since 4.2.6
 * @product highstock
 * @apioption yAxis.scrollbar.zIndex
 */

/**
 * Default `mapData` for all series. If set to a string, it functions
 * as an index into the `Highcharts.maps` array. Otherwise it is interpreted
 * as map data.
 *
 * @type {String|Array<Object>}
 * @see [mapData](#series.map.mapData)
 * @default undefined
 * @since 5.0.0
 * @product highmaps
 * @apioption chart.map
 */

/**
 * Set lat/lon transformation definitions for the chart. If not defined,
 *  these are extracted from the map data.
 *
 * @type {Object}
 * @default undefined
 * @since 5.0.0
 * @product highmaps
 * @apioption chart.mapTransforms
 */























/**
 * Credits for map source to be concatenated with conventional credit
 * text. By default this is a format string that collects copyright
 * information from the map if available.
 *
 * @type {String}
 * @see [mapTextFull](#credits.mapTextFull), [text](#credits.text)
 * @default \u00a9 <a href="{geojson.copyrightUrl}">{geojson.copyrightShort}</a>
 * @since 4.2.2
 * @product highmaps
 * @apioption credits.mapText
 */

/**
 * Detailed credits for map source to be displayed on hover of credits
 * text. By default this is a format string that collects copyright
 * information from the map if available.
 *
 * @type {String}
 * @see [mapText](#credits.mapText), [text](#credits.text)
 * @default {geojson.copyright}
 * @since 4.2.2
 * @product highmaps
 * @apioption credits.mapTextFull
 */

/**
 * The title appearing on hovering the zoom in button. The text itself
 * defaults to "+" and can be changed in the button options.
 *
 * @type {String}
 * @default Zoom in
 * @product highmaps
 * @apioption lang.zoomIn
 */

/**
 * The title appearing on hovering the zoom out button. The text itself
 * defaults to "-" and can be changed in the button options.
 *
 * @type {String}
 * @default Zoom out
 * @product highmaps
 * @apioption lang.zoomOut
 */

/**
 * Whether to enable navigation buttons. By default it inherits the
 * [enabled](#mapNavigation.enabled) setting.
 *
 * @type {Boolean}
 * @product highmaps
 * @apioption mapNavigation.enableButtons
 */

/**
 * Enables zooming in on an area on double clicking in the map. By default
 * it inherits the [enabled](#mapNavigation.enabled) setting.
 *
 * @type {Boolean}
 * @product highmaps
 * @apioption mapNavigation.enableDoubleClickZoom
 */

/**
 * Whether to zoom in on an area when that area is double clicked.
 *
 * @type {Boolean}
 * @sample {highmaps} maps/mapnavigation/doubleclickzoomto/ Enable double click zoom to
 * @default false
 * @product highmaps
 * @apioption mapNavigation.enableDoubleClickZoomTo
 */

/**
 * Enables zooming by mouse wheel. By default it inherits the [enabled](
 * #mapNavigation.enabled) setting.
 *
 * @type {Boolean}
 * @product highmaps
 * @apioption mapNavigation.enableMouseWheelZoom
 */

/**
 * Whether to enable multitouch zooming. Note that if the chart covers
 * the viewport, this prevents the user from using multitouch and touchdrag
 * on the web page, so you should make sure the user is not trapped
 * inside the chart. By default it inherits the [enabled](
 * #mapNavigation.enabled) setting.
 *
 * @type {Boolean}
 * @product highmaps
 * @apioption mapNavigation.enableTouchZoom
 */

/**
 * Whether to enable map navigation. The default is not to enable navigation,
 * as many choropleth maps are simple and don't need it. Additionally,
 * when touch zoom and mousewheel zoom is enabled, it breaks the default
 * behaviour of these interactions in the website, and the implementer
 * should be aware of this.
 *
 * Individual interactions can be enabled separately, namely buttons,
 * multitouch zoom, double click zoom, double click zoom to element
 * and mousewheel zoom.
 *
 * @type {Boolean}
 * @default false
 * @product highmaps
 * @apioption mapNavigation.enabled
 */

/**
 * Options for the zoom in button
 *
 * @type {Object}
 * @extends mapNavigation.buttonOptions
 * @product highmaps
 * @apioption mapNavigation.buttons.
 */












































