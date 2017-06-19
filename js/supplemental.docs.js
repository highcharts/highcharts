/*
   This file contains things that are referrenced in the old API dump,
   which can't be found in the source code.
*/

/**
 * Whether or not to add series descriptions to charts with a single
 * series.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.describeSingleSeries docs to actual source code
 * @apioption accessibility.describeSingleSeries
 */

/**
 * Function to run upon clicking the "View as Data Table" link in the
 * screen reader region.
 * 
 * By default Highcharts will insert and set focus to a data table representation
 * of the chart.
 * 
 * @type {Function}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.onTableAnchorClick docs to actual source code
 * @apioption accessibility.onTableAnchorClick
 */

/**
 * Date format to use for points on datetime axes when describing them
 * to screen reader users.
 * 
 * Defaults to the same format as in tooltip.
 * 
 * For an overview of the replacement codes, see [dateFormat](#Highcharts.
 * dateFormat).
 * 
 * @type {String}
 * @see [pointDateFormatter](#accessibility.pointDateFormatter)
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.pointDateFormat docs to actual source code
 * @apioption accessibility.pointDateFormat
 */

/**
 * Formatter function to determine the date/time format used with points
 * on datetime axes when describing them to screen reader users. Receives
 * one argument, `point`, referring to the point to describe. Should
 * return a date format string compatible with [dateFormat](#Highcharts.
 * dateFormat).
 * 
 * @type {Function}
 * @see [pointDateFormat](#accessibility.pointDateFormat)
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.pointDateFormatter docs to actual source code
 * @apioption accessibility.pointDateFormatter
 */

/**
 * Formatter function to use instead of the default for point descriptions.
 * Receives one argument, `point`, referring to the point to describe.
 * Should return a String with the description of the point for a screen
 * reader user.
 * 
 * @type {Function}
 * @see [point.description](#series<line>.data.description)
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.pointDescriptionFormatter docs to actual source code
 * @apioption accessibility.pointDescriptionFormatter
 */

/**
 * A formatter function to create the HTML contents of the hidden screen
 * reader information region. Receives one argument, `chart`, referring
 * to the chart object. Should return a String with the HTML content
 * of the region.
 * 
 * The link to view the chart as a data table will be added automatically
 * after the custom HTML content.
 * 
 * @type {Function}
 * @default {all} undefined
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.screenReaderSectionFormatter docs to actual source code
 * @apioption accessibility.screenReaderSectionFormatter
 */

/**
 * Formatter function to use instead of the default for series descriptions.
 * Receives one argument, `series`, referring to the series to describe.
 * Should return a String with the description of the series for a
 * screen reader user.
 * 
 * @type {Function}
 * @see [series.description](#plotOptions.series.description)
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.seriesDescriptionFormatter docs to actual source code
 * @apioption accessibility.seriesDescriptionFormatter
 */

/**
 * Skip null points when navigating through points with the keyboard.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy accessibility.keyboardNavigation.skipNullPoints docs to actual source code
 * @apioption accessibility.keyboardNavigation.skipNullPoints
 */

/**
 * When using multiple axis, the ticks of two or more opposite axes
 * will automatically be aligned by adding ticks to the axis or axes
 * with the least ticks, as if `tickAmount` were specified.
 * 
 * This can be prevented by setting `alignTicks` to false. If the grid
 * lines look messy, it's a good idea to hide them for the secondary
 * axis by setting `gridLineWidth` to 0.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/chart/alignticks-true/ True by default
 * @sample {highcharts} highcharts/chart/alignticks-false/ False
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/alignticks-true/ True by default
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/alignticks-false/ False
 * @default {all} true
 * @product highcharts highstock
 * @todo Copy chart.alignTicks docs to actual source code
 * @apioption chart.alignTicks
 */

/**
 * Set the overall animation for all chart updating. Animation can be
 * disabled throughout the chart by setting it to false here. It can
 * be overridden for each individual API method as a function parameter.
 * The only animation not affected by this option is the initial series
 * animation, see [plotOptions.series.animation](#plotOptions.series.
 * animation).
 * 
 * The animation can either be set as a boolean or a configuration object.
 * If `true`, it will use the 'swing' jQuery easing and a duration
 * of 500 ms. If used as a configuration object, the following properties
 * are supported:
 * 
 * <dl>
 * 
 * <dt>duration</dt>
 * 
 * <dd>The duration of the animation in milliseconds.</dd>
 * 
 * <dt>easing</dt>
 * 
 * <dd>A string reference to an easing function set on the `Math` object.
 * See [the easing demo](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-
 * animation-easing/).</dd>
 * 
 * </dl>
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/chart/animation-none/ Updating with no animation
 * @sample {highcharts} highcharts/chart/animation-duration/ With a longer duration
 * @sample {highcharts} highcharts/chart/animation-easing/ With a jQuery UI easing
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/animation-none/ Updating with no animation
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/animation-duration/ With a longer duration
 * @default {all} true
 * @product highcharts highstock highmaps
 * @todo Copy chart.animation docs to actual source code
 * @apioption chart.animation
 */

/**
 * The pixel width of the outer chart border.
 * 
 * @type {Number}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the stroke is set with the `.highcharts-background`
 * class.
 * @sample {highcharts} highcharts/chart/borderwidth/ 5px border
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/border/ 2px border
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/border/ Border options
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy chart.borderWidth docs to actual source code
 * @apioption chart.borderWidth
 */

/**
 * A CSS class name to apply to the charts container `div`, allowing
 * unique CSS styling for each chart.
 * 
 * @type {String}
 * @product highcharts highstock highmaps
 * @todo Copy chart.className docs to actual source code
 * @apioption chart.className
 */

/**
 * A text description of the chart.
 * 
 * If the Accessibility module is loaded, this is included by default
 * as a long description of the chart and its contents in the hidden
 * screen reader information region.
 * 
 * @type {String}
 * @see [typeDescription](#chart.typeDescription)
 * @default {all} undefined
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.description docs to actual source code
 * @apioption chart.description
 */

/**
 * Whether to invert the axes so that the x axis is vertical and y axis
 * is horizontal. When true, the x axis is [reversed](#xAxis.reversed)
 * by default. If a bar series is present in the chart, it will be inverted
 * automatically.
 * 
 * Inverting the chart doesn't have an effect if there are no cartesian
 * series in the chart, or if the chart is [polar](#chart.polar).
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/chart/inverted/ Inverted line
 * @sample {highstock} highcharts/tree/master/samples/stock/navigator/inverted/ Inverted stock chart
 * @default {all} false
 * @product highcharts highstock
 * @todo Copy chart.inverted docs to actual source code
 * @apioption chart.inverted
 */

/**
 * The margin between the outer edge of the chart and the plot area.
 * The numbers in the array designate top, right, bottom and left respectively.
 * Use the options `marginTop`, `marginRight`, `marginBottom` and `marginLeft`
 * for shorthand setting of one option.
 * 
 * By default there is no margin. The actual space is dynamically calculated
 * from the offset of axis labels, axis title, title, subtitle and legend
 * in addition to the `spacingTop`, `spacingRight`, `spacingBottom`
 * and `spacingLeft` options.
 * 
 * Defaults to `[null]`.
 * 
 * @type {Array}
 * @sample {highcharts} highcharts/chart/margins-zero/ Zero margins
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/margin-zero/ Zero margins
 * @product highcharts highstock highmaps
 * @todo Copy chart.margin docs to actual source code
 * @apioption chart.margin
 */

/**
 * The margin between the bottom outer edge of the chart and the plot
 * area. Use this to set a fixed pixel value for the margin as opposed
 * to the default dynamic margin. See also `spacingBottom`.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/marginbottom/ 100px bottom margin
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/marginbottom/ 100px bottom margin
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/margin/ 100px margins
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.marginBottom docs to actual source code
 * @apioption chart.marginBottom
 */

/**
 * The margin between the left outer edge of the chart and the plot
 * area. Use this to set a fixed pixel value for the margin as opposed
 * to the default dynamic margin. See also `spacingLeft`.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/marginleft/ 150px left margin
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/marginleft/ 150px left margin
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/margin/ 100px margins
 * @default {all} null
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.marginLeft docs to actual source code
 * @apioption chart.marginLeft
 */

/**
 * The margin between the right outer edge of the chart and the plot
 * area. Use this to set a fixed pixel value for the margin as opposed
 * to the default dynamic margin. See also `spacingRight`.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/marginright/ 100px right margin
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/marginright/ 100px right margin
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/margin/ 100px margins
 * @default {all} null
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.marginRight docs to actual source code
 * @apioption chart.marginRight
 */

/**
 * The margin between the top outer edge of the chart and the plot area.
 * Use this to set a fixed pixel value for the margin as opposed to
 * the default dynamic margin. See also `spacingTop`.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/margintop/ 100px top margin
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/margintop/ 100px top margin
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/margin/ 100px margins
 * @default {all} null
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.marginTop docs to actual source code
 * @apioption chart.marginTop
 */

/**
 * Allows setting a key to switch between zooming and panning. Can be
 * one of `alt`, `ctrl`, `meta` (the command key on Mac and Windows
 * key on Windows) or `shift`. The keys are mapped directly to the key
 * properties of the click event argument (`event.altKey`, `event.ctrlKey`,
 *  `event.metaKey` and `event.shiftKey`).
 * 
 * @validvalue [null, "alt", "ctrl", "meta", "shift"]
 * @type {String}
 * @since 4.0.3
 * @product highcharts
 * @todo Copy chart.panKey docs to actual source code
 * @apioption chart.panKey
 */

/**
 * Allow panning in a chart. Best used with [panKey](#chart.panKey)
 * to combine zooming and panning.
 * 
 * On touch devices, when the [tooltip.followTouchMove](#tooltip.followTouchMove)
 * option is `true` (default), panning requires two fingers. To allow
 * panning with one finger, set `followTouchMove` to `false`.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/chart/pankey/ Zooming and panning
 * @default {highcharts} false
 * @default {highstock} true
 * @since 4.0.3
 * @product highcharts highstock
 * @todo Copy chart.panning docs to actual source code
 * @apioption chart.panning
 */

/**
 * Equivalent to [zoomType](#chart.zoomType), but for multitouch gestures
 * only. By default, the `pinchType` is the same as the `zoomType` setting.
 * However, pinching can be enabled separately in some cases, for example
 * in stock charts where a mouse drag pans the chart, while pinching
 * is enabled. When [tooltip.followTouchMove](#tooltip.followTouchMove)
 * is true, pinchType only applies to two-finger touches.
 * 
 * @validvalue ["x", "y", "xy"]
 * @type {String}
 * @default {highcharts} null
 * @default {highstock} x
 * @since 3.0
 * @product highcharts highstock
 * @todo Copy chart.pinchType docs to actual source code
 * @apioption chart.pinchType
 */

/**
 * The background color or gradient for the plot area.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the plot background is set with the `.highcharts-
 * plot-background` class.
 * @sample {highcharts} highcharts/chart/plotbackgroundcolor-color/ Color
 * @sample {highcharts} highcharts/chart/plotbackgroundcolor-gradient/ Gradient
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/plotbackgroundcolor-color/ Color
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/plotbackgroundcolor-gradient/ Gradient
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/plotbackgroundcolor-color/ Color
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/plotbackgroundcolor-gradient/ Gradient
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy chart.plotBackgroundColor docs to actual source code
 * @apioption chart.plotBackgroundColor
 */

/**
 * The URL for an image to use as the plot background. To set an image
 * as the background for the entire chart, set a CSS background image
 * to the container element. Note that for the image to be applied to
 * exported charts, its URL needs to be accessible by the export server.
 * 
 * @type {String}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), a plot background image can be set with the
 * `.highcharts-plot-background` class and a [custom pattern](http://www.
 * highcharts.com/docs/chart-design-and-style/gradients-shadows-and-
 * patterns).
 * @sample {highcharts} highcharts/chart/plotbackgroundimage/ Skies
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/plotbackgroundimage/ Skies
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy chart.plotBackgroundImage docs to actual source code
 * @apioption chart.plotBackgroundImage
 */

/**
 * The pixel width of the plot area border.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/plotborderwidth/ 1px border
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/plotborder/ 2px border
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/plotborder/ Plot border options
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy chart.plotBorderWidth docs to actual source code
 * @apioption chart.plotBorderWidth
 */

/**
 * Whether to apply a drop shadow to the plot area. Requires that plotBackgroundColor
 * be set. The shadow can be an object configuration containing `color`,
 *  `offsetX`, `offsetY`, `opacity` and `width`.
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/chart/plotshadow/ Plot shadow
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/plotshadow/ Plot shadow
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/plotborder/ Plot border options
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy chart.plotShadow docs to actual source code
 * @apioption chart.plotShadow
 */

/**
 * When true, cartesian charts like line, spline, area and column are
 * transformed into the polar coordinate system. Requires `highcharts-
 * more.js`.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 2.3.0
 * @product highcharts
 * @todo Copy chart.polar docs to actual source code
 * @apioption chart.polar
 */

/**
 * Whether to reflow the chart to fit the width of the container div
 * on resizing the window.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/chart/reflow-true/ True by default
 * @sample {highcharts} highcharts/chart/reflow-false/ False
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/reflow-true/ True by default
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/reflow-false/ False
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/reflow-true/ True by default
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/reflow-false/ False
 * @default {all} true
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy chart.reflow docs to actual source code
 * @apioption chart.reflow
 */

/**
 * The HTML element where the chart will be rendered. If it is a string,
 * the element by that id is used. The HTML element can also be passed
 * by direct reference, or as the first argument of the chart constructor,
 *  in which case the option is not needed.
 * 
 * @type {String|Object}
 * @sample {highcharts} highcharts/chart/reflow-true/ String
 * @sample {highcharts} highcharts/chart/renderto-object/ Object reference
 * @sample {highcharts} highcharts/chart/renderto-jquery/ Object reference through jQuery
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/renderto-string/ String
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/renderto-object/ Object reference
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/renderto-jquery/ Object reference through jQuery
 * @product highcharts highstock highmaps
 * @todo Copy chart.renderTo docs to actual source code
 * @apioption chart.renderTo
 */

/**
 * The background color of the marker square when selecting (zooming
 * in on) an area of the chart.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the selection marker fill is set with the `.
 * highcharts-selection-marker` class.
 * @default {all} rgba(51,92,173,0.25)
 * @since 2.1.7
 * @product highcharts highstock highmaps
 * @todo Copy chart.selectionMarkerFill docs to actual source code
 * @apioption chart.selectionMarkerFill
 */

/**
 * Whether to apply a drop shadow to the outer chart area. Requires
 * that backgroundColor be set. The shadow can be an object configuration
 * containing `color`, `offsetX`, `offsetY`, `opacity` and `width`.
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/chart/shadow/ Shadow
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/shadow/ Shadow
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/border/ Chart border and shadow
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy chart.shadow docs to actual source code
 * @apioption chart.shadow
 */

/**
 * Whether to show the axes initially. This only applies to empty charts
 * where series are added dynamically, as axes are automatically added
 * to cartesian series.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/chart/showaxes-false/ False by default
 * @sample {highcharts} highcharts/chart/showaxes-true/ True
 * @since 1.2.5
 * @product highcharts
 * @todo Copy chart.showAxes docs to actual source code
 * @apioption chart.showAxes
 */

/**
 * The space between the bottom edge of the chart and the content (plot
 * area, axis title and labels, title, subtitle or legend in top position).
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/spacingbottom/ Spacing bottom set to 100
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/spacingbottom/ Spacing bottom set to 100
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/spacing/ Spacing 100 all around
 * @default {all} 15
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy chart.spacingBottom docs to actual source code
 * @apioption chart.spacingBottom
 */

/**
 * The space between the left edge of the chart and the content (plot
 * area, axis title and labels, title, subtitle or legend in top position).
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/spacingleft/ Spacing left set to 100
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/spacingleft/ Spacing left set to 100
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/spacing/ Spacing 100 all around
 * @default {all} 10
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy chart.spacingLeft docs to actual source code
 * @apioption chart.spacingLeft
 */

/**
 * The space between the right edge of the chart and the content (plot
 * area, axis title and labels, title, subtitle or legend in top position).
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/spacingright-100/ Spacing set to 100
 * @sample {highcharts} highcharts/chart/spacingright-legend/ Legend in right position with default spacing
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/spacingright/ Spacing set to 100
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/spacing/ Spacing 100 all around
 * @default {all} 10
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy chart.spacingRight docs to actual source code
 * @apioption chart.spacingRight
 */

/**
 * The space between the top edge of the chart and the content (plot
 * area, axis title and labels, title, subtitle or legend in top position).
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/chart/spacingtop-100/ A top spacing of 100
 * @sample {highcharts} highcharts/chart/spacingtop-10/ Floating chart title makes the plot area align to the     default spacingTop of 10.
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/spacingtop/ A top spacing of 100
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/spacing/ Spacing 100 all around
 * @default {all} 10
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy chart.spacingTop docs to actual source code
 * @apioption chart.spacingTop
 */

/**
 * Additional CSS styles to apply inline to the container `div`. Note
 * that since the default font styles are applied in the renderer, it
 * is ignorant of the individual chart options and must be set globally.
 * 
 * @type {CSSObject}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), general chart styles can be set with the `.highcharts-
 * root` class.
 * @sample {highcharts} highcharts/chart/style-serif-font/ Using a serif type font
 * @sample {highcharts} highcharts/css/em/ Styled mode with relative font sizes
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/style/ Using a serif type font
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/style-serif-font/ Using a serif type font
 * @default {all} {"fontFamily":"\"Lucida Grande\", \"Lucida Sans Unicode\", Verdana, Arial, Helvetica, sans-serif","fontSize":"12px"}
 * @product highcharts highstock highmaps
 * @todo Copy chart.style docs to actual source code
 * @apioption chart.style
 */

/**
 * The default series type for the chart. Can be any of the chart types
 * listed under [plotOptions](#plotOptions).
 * 
 * @validvalue ["line", "spline", "column", "bar", "area", "areaspline", "pie", "arearange", "areasplinerange", "boxplot", "bubble", "columnrange", "errorbar", "funnel", "gauge", "heatmap", "polygon", "pyramid", "scatter", "solidgauge", "treemap", "waterfall"]
 * @type {String}
 * @sample {highcharts} highcharts/chart/type-bar/ Bar
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/type/ Areaspline
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/type-mapline/ Mapline
 * @default {highcharts} line
 * @default {highstock} line
 * @default {highmaps} map
 * @since 2.1.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.type docs to actual source code
 * @apioption chart.type
 */

/**
 * A text description of the chart type.
 * 
 * If the Accessibility module is loaded, this will be included in the
 * description of the chart in the screen reader information region.
 * 
 * 
 * Highcharts will by default attempt to guess the chart type, but for
 * more complex charts it is recommended to specify this property for
 * clarity.
 * 
 * @type {String}
 * @default {all} undefined
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.typeDescription docs to actual source code
 * @apioption chart.typeDescription
 */

/**
 * Decides in what dimensions the user can zoom by dragging the mouse.
 *  Can be one of `x`, `y` or `xy`.
 * 
 * @validvalue [null, "x", "y", "xy"]
 * @type {String}
 * @see [panKey](#chart.panKey)
 * @sample {highcharts} highcharts/chart/zoomtype-none/ None by default
 * @sample {highcharts} highcharts/chart/zoomtype-x/ X
 * @sample {highcharts} highcharts/chart/zoomtype-y/ Y
 * @sample {highcharts} highcharts/chart/zoomtype-xy/ Xy
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/basic-line/ None by default
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/zoomtype-x/ X
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/zoomtype-y/ Y
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/zoomtype-xy/ Xy
 * @product highcharts highstock
 * @todo Copy chart.zoomType docs to actual source code
 * @apioption chart.zoomType
 */

/**
 * Event listeners for the chart.
 * 
 * @product highcharts highstock highmaps
 * @todo Copy chart.events docs to actual source code
 * @apioption chart.events
 */

/**
 * Fires when a series is added to the chart after load time, using
 * the `addSeries` method. One parameter, `event`, is passed to the
 * function. This contains common event information based on jQuery
 * or MooTools depending on which library is used as the base for Highcharts.
 * Through `event.options` you can access the series options that was
 * passed to the `addSeries` method. Returning false prevents the series
 * from being added.
 * 
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/chart/events-addseries/ Alert on add series
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/events-addseries/ Alert on add series
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.addSeries docs to actual source code
 * @apioption chart.events.addSeries
 */

/**
 * Fires after a chart is printed through the context menu item or the
 * `Chart.print` method. Requires the exporting module.
 * 
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/chart/events-beforeprint-afterprint/ Rescale the chart to print
 * @sample {highstock} highcharts/chart/events-beforeprint-afterprint/ Rescale the chart to print
 * @sample {highmaps} highcharts/chart/events-beforeprint-afterprint/ Rescale the chart to print
 * @since 4.1.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.afterPrint docs to actual source code
 * @apioption chart.events.afterPrint
 */

/**
 * Fires before a chart is printed through the context menu item or
 * the `Chart.print` method. Requires the exporting module.
 * 
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/chart/events-beforeprint-afterprint/ Rescale the chart to print
 * @sample {highstock} highcharts/chart/events-beforeprint-afterprint/ Rescale the chart to print
 * @sample {highmaps} highcharts/chart/events-beforeprint-afterprint/ Rescale the chart to print
 * @since 4.1.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.beforePrint docs to actual source code
 * @apioption chart.events.beforePrint
 */

/**
 * Fires when clicking on the plot background. One parameter, `event`,
 * is passed to the function. This contains common event information
 * based on jQuery or MooTools depending on which library is used as
 * the base for Highcharts.
 * 
 * Information on the clicked spot can be found through `event.xAxis`
 * and `event.yAxis`, which are arrays containing the axes of each dimension
 * and each axis' value at the clicked spot. The primary axes are `event.
 * xAxis[0]` and `event.yAxis[0]`. Remember the unit of a datetime axis
 * is milliseconds since 1970-01-01 00:00:00.
 * 
 * <pre>click: function(e) {
 * console.log(
 * Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', e.xAxis[0].value),
 * e.yAxis[0].value
 * )
 * }</pre>
 * 
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/chart/events-click/ Alert coordinates on click
 * @sample {highcharts} highcharts/chart/events-container/ Alternatively, attach event to container
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/events-click/ Alert coordinates on click
 * @sample {highstock} highcharts/chart/events-container/ Alternatively, attach event to container
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/events-click/ Record coordinates on click
 * @sample {highmaps} highcharts/chart/events-container/ Alternatively, attach event to container
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.click docs to actual source code
 * @apioption chart.events.click
 */

/**
 * Fires when a drilldown point is clicked, before the new series is
 * added. This event is also utilized for async drilldown, where the
 * seriesOptions are not added by option, but rather loaded async. Note
 * that when clicking a category label to trigger multiple series drilldown,
 * one `drilldown` event is triggered per point in the category.
 * 
 * Event arguments:
 * 
 * <dl>
 * 
 * <dt>`category`</dt>
 * 
 * <dd>If a category label was clicked, which index.</dd>
 * 
 * <dt>`point`</dt>
 * 
 * <dd>The originating point.</dd>
 * 
 * <dt>`originalEvent`</dt>
 * 
 * <dd>The original browser event (usually click) that triggered the
 * drilldown.</dd>
 * 
 * <dt>`points`</dt>
 * 
 * <dd>If a category label was clicked, this array holds all points
 * corresponing to the category.</dd>
 * 
 * <dt>`seriesOptions`</dt>
 * 
 * <dd>Options for the new series</dd>
 * 
 * </dl>
 * 
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/drilldown/async/ Async drilldown
 * @since 3.0.8
 * @product highcharts highmaps
 * @todo Copy chart.events.drilldown docs to actual source code
 * @apioption chart.events.drilldown
 */

/**
 * Fires when drilling up from a drilldown series.
 * 
 * @type {Function}
 * @context Chart
 * @since 3.0.8
 * @product highcharts highmaps
 * @todo Copy chart.events.drillup docs to actual source code
 * @apioption chart.events.drillup
 */

/**
 * In a chart with multiple drilldown series, this event fires after
 * all the series have been drilled up.
 * 
 * @type {Function}
 * @context Chart
 * @since 4.2.4
 * @product highcharts highmaps
 * @todo Copy chart.events.drillupall docs to actual source code
 * @apioption chart.events.drillupall
 */

/**
 * Fires when the chart is finished loading. Since v4.2.2, it also waits
 * for images to be loaded, for example from point markers. One parameter,
 * `event`, is passed to the function. This contains common event information
 * based on jQuery or MooTools depending on which library is used as
 * the base for Highcharts.
 * 
 * There is also a second parameter to the chart constructor where a
 * callback function can be passed to be executed on chart.load.
 * 
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/chart/events-load/ Alert on chart load
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/events-load/ Alert on chart load
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/events-load/ Add series on chart load
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.load docs to actual source code
 * @apioption chart.events.load
 */

/**
 * Fires when the chart is redrawn, either after a call to chart.redraw()
 * or after an axis, series or point is modified with the `redraw` option
 * set to true. One parameter, `event`, is passed to the function. This
 * contains common event information based on jQuery or MooTools depending
 * on which library is used as the base for Highcharts.
 * 
 * @type {Function}
 * @context Chart
 * @sample {highcharts} highcharts/chart/events-redraw/ Alert on chart redraw
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/events-redraw/ Alert on chart redraw,     when adding a series or moving the zoomed range
 * @sample {highmaps} highcharts/tree/master/samples/maps/chart/events-redraw/ Set subtitle on chart redraw
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.redraw docs to actual source code
 * @apioption chart.events.redraw
 */

/**
 * Fires after initial load of the chart (directly after the `load`
 * event), and after each redraw (directly after the `redraw` event).
 * 
 * @type {Function}
 * @context Chart
 * @since 5.0.7
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.render docs to actual source code
 * @apioption chart.events.render
 */

/**
 * Fires when an area of the chart has been selected. Selection is enabled
 * by setting the chart's zoomType. One parameter, `event`, is passed
 * to the function. This contains common event information based on
 * jQuery or MooTools depending on which library is used as the base
 * for Highcharts. The default action for the selection event is to
 * zoom the chart to the selected area. It can be prevented by calling
 * `event.preventDefault()`.
 * 
 * Information on the selected area can be found through `event.xAxis`
 * and `event.yAxis`, which are arrays containing the axes of each dimension
 * and each axis' min and max values. The primary axes are `event.xAxis[0]`
 * and `event.yAxis[0]`. Remember the unit of a datetime axis is milliseconds
 * since 1970-01-01 00:00:00.
 * 
 * <pre>selection: function(event) {
 * // log the min and max of the primary, datetime x-axis
 * console.log(
 * Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].min),
 * 
 * Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].max)
 * );
 * // log the min and max of the y axis
 * console.log(event.yAxis[0].min, event.yAxis[0].max);
 * }</pre>
 * 
 * @type {Function}
 * @sample {highcharts} highcharts/chart/events-selection/ Report on selection and reset
 * @sample {highcharts} highcharts/chart/events-selection-points/ Select a range of points through a drag selection
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/events-selection/ Report on selection and reset
 * @sample {highstock} highcharts/chart/events-selection-points/ Select a range of points through a drag selection (Highcharts)
 * @product highcharts highstock highmaps
 * @todo Copy chart.events.selection docs to actual source code
 * @apioption chart.events.selection
 */

/**
 * The color of the panel.
 * 
 * @type {Color}
 * @default {all} transparent
 * @since 4.0
 * @product highcharts
 * @todo Copy chart.options3d.frame.back.color docs to actual source code
 * @apioption chart.options3d.frame.back.color
 */

/**
 * Thickness of the panel.
 * 
 * @type {Number}
 * @default {all} 1
 * @since 4.0
 * @product highcharts
 * @todo Copy chart.options3d.frame.back.size docs to actual source code
 * @apioption chart.options3d.frame.back.size
 */

/**
 * Whether to display the frame. Possible values are `true`, `false`,
 * `"auto"` to display only the frames behind the data, and `"default"`
 * to display faces behind the data based on the axis layout, ignoring
 * the point of view.
 * 
 * @validvalue ["default", "auto", true, false]
 * @type {Boolean|String}
 * @sample {highcharts} highcharts/3d/scatter-frame/ Auto frames
 * @default {all} default
 * @since 5.0.12
 * @product highcharts
 * @todo Copy chart.options3d.frame.back.visible docs to actual source code
 * @apioption chart.options3d.frame.back.visible
 */

/**
 * The color of the panel.
 * 
 * @type {Color}
 * @default {all} transparent
 * @since 4.0
 * @product highcharts
 * @todo Copy chart.options3d.frame.bottom.color docs to actual source code
 * @apioption chart.options3d.frame.bottom.color
 */

/**
 * The thickness of the panel.
 * 
 * @type {Number}
 * @default {all} 1
 * @since 4.0
 * @product highcharts
 * @todo Copy chart.options3d.frame.bottom.size docs to actual source code
 * @apioption chart.options3d.frame.bottom.size
 */

/**
 * Whether to display the frame. Possible values are `true`, `false`,
 * `"auto"` to display only the frames behind the data, and `"default"`
 * to display faces behind the data based on the axis layout, ignoring
 * the point of view.
 * 
 * @validvalue ["default", "auto", true, false]
 * @type {Boolean|String}
 * @sample {highcharts} highcharts/3d/scatter-frame/ Auto frames
 * @default {all} default
 * @since 5.0.12
 * @product highcharts
 * @todo Copy chart.options3d.frame.bottom.visible docs to actual source code
 * @apioption chart.options3d.frame.bottom.visible
 */

/**
 * Note: As of v5.0.12, `frame.left` or `frame.right` should be used
 * instead.
 * 
 * The side for the frame around a 3D chart.
 * 
 * @since 4.0
 * @product highcharts
 * @todo Copy chart.options3d.frame.side docs to actual source code
 * @apioption chart.options3d.frame.side
 */

/**
 * The color of the panel.
 * 
 * @type {Color}
 * @default {all} transparent
 * @since 4.0
 * @product highcharts
 * @todo Copy chart.options3d.frame.side.color docs to actual source code
 * @apioption chart.options3d.frame.side.color
 */

/**
 * The thickness of the panel.
 * 
 * @type {Number}
 * @default {all} 1
 * @since 4.0
 * @product highcharts
 * @todo Copy chart.options3d.frame.side.size docs to actual source code
 * @apioption chart.options3d.frame.side.size
 */

/**
 * The color of the panel.
 * 
 * @type {Color}
 * @default {all} transparent
 * @product highcharts
 * @todo Copy chart.options3d.frame.top.color docs to actual source code
 * @apioption chart.options3d.frame.top.color
 */

/**
 * The pixel thickness of the panel.
 * 
 * @type {Number}
 * @default {all} 1
 * @product highcharts
 * @todo Copy chart.options3d.frame.top.size docs to actual source code
 * @apioption chart.options3d.frame.top.size
 */

/**
 * What frame the button should be placed related to. Can be either
 * "plot" or "chart".
 * 
 * @validvalue ["plot", "chart"]
 * @type {String}
 * @sample {highcharts} highcharts/chart/resetzoombutton-relativeto/ Relative to the chart
 * @sample {highstock} highcharts/chart/resetzoombutton-relativeto/ Relative to the chart
 * @default {all} plot
 * @since 2.2
 * @product highcharts highstock highmaps
 * @todo Copy chart.resetZoomButton.relativeTo docs to actual source code
 * @apioption chart.resetZoomButton.relativeTo
 */

/**
 * The vertical alignment of the button.
 * 
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @default {all} top
 * @product highcharts highstock highmaps
 * @todo Copy chart.resetZoomButton.position.verticalAlign docs to actual source code
 * @apioption chart.resetZoomButton.position.verticalAlign
 */

/**
 * The Data module provides a simplified interface for adding data to
 * a chart from sources like CVS, HTML tables or grid views. See also
 * the [tutorial article on the Data module](http://www.highcharts.com/docs/working-
 * with-data/data-module).
 * 
 * It requires the `modules/data.js` file to be loaded.
 * 
 * Please note that the default way of adding data in Highcharts, without
 * the need of a module, is through the [series.data](#series.data)
 * option.
 * 
 * @sample {highcharts} highcharts/demo/column-parsed/ HTML table
 * @sample {highcharts} highcharts/data/csv/ CSV
 * @since 4.0
 * @product highcharts
 * @todo Copy data docs to actual source code
 * @apioption data
 */

/**
 * A two-dimensional array representing the input data on tabular form.
 * This input can be used when the data is already parsed, for example
 * from a grid view component. Each cell can be a string or number.
 * If not switchRowsAndColumns is set, the columns are interpreted as
 * series.
 * 
 * @type {Array<Array<Mixed>>}
 * @see [data.rows](#data.rows)
 * @sample {highcharts} highcharts/data/columns/ Columns
 * @since 4.0
 * @product highcharts
 * @todo Copy data.columns docs to actual source code
 * @apioption data.columns
 */

/**
 * The callback that is evaluated when the data is finished loading,
 * optionally from an external source, and parsed. The first argument
 * passed is a finished chart options object, containing the series.
 * These options can be extended with additional options and passed
 * directly to the chart constructor.
 * 
 * @type {Function}
 * @see [data.parsed](#data.parsed)
 * @sample {highcharts} highcharts/data/complete/ Modify data on complete
 * @since 4.0
 * @product highcharts
 * @todo Copy data.complete docs to actual source code
 * @apioption data.complete
 */

/**
 * A comma delimited string to be parsed. Related options are [startRow](#data.
 * startRow), [endRow](#data.endRow), [startColumn](#data.startColumn)
 * and [endColumn](#data.endColumn) to delimit what part of the table
 * is used. The [lineDelimiter](#data.lineDelimiter) and [itemDelimiter](#data.
 * itemDelimiter) options define the CSV delimiter formats.
 * 
 * The built-in CSV parser doesn't support all flavours of CSV, so in
 * some cases it may be necessary to use an external CSV parser. See
 * [this example](http://jsfiddle.net/highcharts/u59176h4/) of parsing
 * CSV through the MIT licensed [Papa Parse](http://papaparse.com/)
 * library.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/data/csv/ Data from CSV
 * @since 4.0
 * @product highcharts
 * @todo Copy data.csv docs to actual source code
 * @apioption data.csv
 */

/**
 * Which of the predefined date formats in Date.prototype.dateFormats
 * to use to parse date values. Defaults to a best guess based on what
 * format gives valid and ordered dates.
 * 
 * Valid options include:
 * 
 * *   `YYYY-mm-dd`
 * *   `dd/mm/YYYY`
 * *   `mm/dd/YYYY`
 * *   `dd/mm/YY`
 * *   `mm/dd/YY`
 * 
 * @validvalue [undefined, "YYYY-mm-dd", "dd/mm/YYYY", "mm/dd/YYYY", "dd/mm/YYYY", "dd/mm/YY", "mm/dd/YY"]
 * @type {String}
 * @see [data.parseDate](#data.parseDate)
 * @sample {highcharts} highcharts/data/dateformat-auto/ Best guess date format
 * @since 4.0
 * @product highcharts
 * @todo Copy data.dateFormat docs to actual source code
 * @apioption data.dateFormat
 */

/**
 * The decimal point used for parsing numbers in the CSV.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/data/delimiters/ Comma as decimal point
 * @default {all} .
 * @since 4.1.0
 * @product highcharts
 * @todo Copy data.decimalPoint docs to actual source code
 * @apioption data.decimalPoint
 */

/**
 * In tabular input data, the last column (indexed by 0) to use. Defaults
 * to the last column containing data.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/data/start-end/ Limited data
 * @since 4.0
 * @product highcharts
 * @todo Copy data.endColumn docs to actual source code
 * @apioption data.endColumn
 */

/**
 * In tabular input data, the last row (indexed by 0) to use. Defaults
 * to the last row containing data.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/data/start-end/ Limited data
 * @since 4.0.4
 * @product highcharts
 * @todo Copy data.endRow docs to actual source code
 * @apioption data.endRow
 */

/**
 * Whether to use the first row in the data set as series names.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/data/start-end/ Don't get series names from the CSV
 * @sample {highstock} highcharts/data/start-end/ Don't get series names from the CSV
 * @default {all} true
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy data.firstRowAsNames docs to actual source code
 * @apioption data.firstRowAsNames
 */

/**
 * The key for a Google Spreadsheet to load. See [general information
 * on GS](https://developers.google.com/gdata/samples/spreadsheet_sample).
 * 
 * @type {String}
 * @sample {highcharts} highcharts/data/google-spreadsheet/ Load a Google Spreadsheet
 * @since 4.0
 * @product highcharts
 * @todo Copy data.googleSpreadsheetKey docs to actual source code
 * @apioption data.googleSpreadsheetKey
 */

/**
 * The Google Spreadsheet worksheet to use in combination with [googleSpreadsheetKey](#data.
 * googleSpreadsheetKey). The available id's from your sheet can be
 * read from `https://spreadsheets.google.com/feeds/worksheets/{key}/public/basic`
 * 
 * @type {String}
 * @sample {highcharts} highcharts/data/google-spreadsheet/ Load a Google Spreadsheet
 * @since 4.0
 * @product highcharts
 * @todo Copy data.googleSpreadsheetWorksheet docs to actual source code
 * @apioption data.googleSpreadsheetWorksheet
 */

/**
 * Item or cell delimiter for parsing CSV. Defaults to the tab character
 * `\t` if a tab character is found in the CSV string, if not it defaults
 * to `,`.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/data/delimiters/ Delimiters
 * @since 4.0
 * @product highcharts
 * @todo Copy data.itemDelimiter docs to actual source code
 * @apioption data.itemDelimiter
 */

/**
 * Line delimiter for parsing CSV.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/data/delimiters/ Delimiters
 * @default {all} \n
 * @since 4.0
 * @product highcharts
 * @todo Copy data.lineDelimiter docs to actual source code
 * @apioption data.lineDelimiter
 */

/**
 * A callback function to parse string representations of dates into
 * JavaScript timestamps. Should return an integer timestamp on success.
 * 
 * @type {Function}
 * @see [dateFormat](#data.dateFormat)
 * @since 4.0
 * @product highcharts
 * @todo Copy data.parseDate docs to actual source code
 * @apioption data.parseDate
 */

/**
 * A callback function to access the parsed columns, the two-dimentional
 * input data array directly, before they are interpreted into series
 * data and categories. Return `false` to stop completion, or call `this.
 * complete()` to continue async.
 * 
 * @type {Function}
 * @see [data.complete](#data.complete)
 * @sample {highcharts} highcharts/data/parsed/ Modify data after parse
 * @since 4.0
 * @product highcharts
 * @todo Copy data.parsed docs to actual source code
 * @apioption data.parsed
 */

/**
 * The same as the columns input option, but defining rows intead of
 * columns.
 * 
 * @type {Array<Array<Mixed>>}
 * @see [data.columns](#data.columns)
 * @sample {highcharts} highcharts/data/rows/ Data in rows
 * @since 4.0
 * @product highcharts
 * @todo Copy data.rows docs to actual source code
 * @apioption data.rows
 */

/**
 * An array containing object with Point property names along with what
 * column id the property should be taken from.
 * 
 * @type {Array<Object>}
 * @sample {highcharts} highcharts/data/seriesmapping-label/ Label from data set
 * @since 4.0.4
 * @product highcharts
 * @todo Copy data.seriesMapping docs to actual source code
 * @apioption data.seriesMapping
 */

/**
 * In tabular input data, the first column (indexed by 0) to use.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/data/start-end/ Limited data
 * @default {all} 0
 * @since 4.0
 * @product highcharts
 * @todo Copy data.startColumn docs to actual source code
 * @apioption data.startColumn
 */

/**
 * In tabular input data, the first row (indexed by 0) to use.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/data/start-end/ Limited data
 * @default {all} 0
 * @since 4.0
 * @product highcharts
 * @todo Copy data.startRow docs to actual source code
 * @apioption data.startRow
 */

/**
 * Switch rows and columns of the input data, so that `this.columns`
 * effectively becomes the rows of the data set, and the rows are interpreted
 * as series.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/data/switchrowsandcolumns/ Switch rows and columns
 * @default {all} false
 * @since 4.0
 * @product highcharts
 * @todo Copy data.switchRowsAndColumns docs to actual source code
 * @apioption data.switchRowsAndColumns
 */

/**
 * A HTML table or the id of such to be parsed as input data. Related
 * options are `startRow`, `endRow`, `startColumn` and `endColumn` to
 * delimit what part of the table is used.
 * 
 * @type {String|HTMLElement}
 * @sample {highcharts} highcharts/demo/column-parsed/ Parsed table
 * @since 4.0
 * @product highcharts
 * @todo Copy data.table docs to actual source code
 * @apioption data.table
 */

/**
 * [Styled mode](http://www.highcharts.com/docs/chart-design-and-style/style-
 * by-css) only. Configuration object for adding SVG definitions for
 * reusable elements. See [gradients, shadows and patterns](http://www.
 * highcharts.com/docs/chart-design-and-style/gradients-shadows-and-
 * patterns) for more information and code examples.
 * 
 * @type {Object}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy defs docs to actual source code
 * @apioption defs
 */

/**
 * When this option is false, clicking a single point will drill down
 * all points in the same category, equivalent to clicking the X axis
 * label.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/drilldown/allowpointdrilldown-false/ Don't allow point drilldown
 * @default {all} true
 * @since 4.1.7
 * @product highcharts
 * @todo Copy drilldown.allowPointDrilldown docs to actual source code
 * @apioption drilldown.allowPointDrilldown
 */

/**
 * An array of series configurations for the drill down. Each series
 * configuration uses the same syntax as the [series](#series) option
 * set. These drilldown series are hidden by default. The drilldown
 * series is linked to the parent series' point by its `id`.
 * 
 * @type {Array<Object>}
 * @since 3.0.8
 * @product highcharts highmaps
 * @todo Copy drilldown.series docs to actual source code
 * @apioption drilldown.series
 */

/**
 * What box to align the button to. Can be either "plotBox" or "spacingBox".
 * 
 * @type {String}
 * @default {all} plotBox
 * @since 3.0.8
 * @product highcharts highmaps
 * @todo Copy drilldown.drillUpButton.relativeTo docs to actual source code
 * @apioption drilldown.drillUpButton.relativeTo
 */

/**
 * A collection of attributes for the button. The object takes SVG attributes
 * like `fill`, `stroke`, `stroke-width` or `r`, the border radius.
 * The theme also supports `style`, a collection of CSS properties for
 * the text. Equivalent attributes for the hover state are given in
 * `theme.states.hover`.
 * 
 * @type {Object}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), drill-up button styles can be applied with the
 * `.highcharts-drillup-button` class.
 * @sample {highcharts} highcharts/drilldown/drillupbutton/ Button theming
 * @sample {highmaps} highcharts/drilldown/drillupbutton/ Button theming
 * @since 3.0.8
 * @product highcharts highmaps
 * @todo Copy drilldown.drillUpButton.theme docs to actual source code
 * @apioption drilldown.drillUpButton.theme
 */

/**
 * Experimental setting to allow HTML inside the chart (added through
 * the `useHTML` options), directly in the exported image. This allows
 * you to preserve complicated HTML structures like tables or bi-directional
 * text in exported charts.
 * 
 * Disclaimer: The HTML is rendered in a `foreignObject` tag in the
 * generated SVG. The official export server is based on PhantomJS,
 * which supports this, but other SVG clients, like Batik, does not
 * support it. This also applies to downloaded SVG that you want to
 * open in a desktop client.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 4.1.8
 * @product highcharts highstock highmaps
 * @todo Copy exporting.allowHTML docs to actual source code
 * @apioption exporting.allowHTML
 */

/**
 * Additional chart options to be merged into an exported chart. For
 * example, a common use case is to add data labels to improve readaility
 * of the exported chart, or to add a printer-friendly color scheme.
 * 
 * @type {Object}
 * @sample {highcharts} highcharts/exporting/chartoptions-data-labels/ Added data labels
 * @sample {highstock} highcharts/exporting/chartoptions-data-labels/ Added data labels
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy exporting.chartOptions docs to actual source code
 * @apioption exporting.chartOptions
 */

/**
 * Whether to enable the exporting module. Disabling the module will
 * hide the context button, but API methods will still be available.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/exporting/enabled-false/ Exporting module is loaded but disabled
 * @sample {highstock} highcharts/exporting/enabled-false/ Exporting module is loaded but disabled
 * @default {all} true
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.enabled docs to actual source code
 * @apioption exporting.enabled
 */

/**
 * Function to call if the offline-exporting module fails to export
 * a chart on the client side, and [fallbackToExportServer](#exporting.
 * fallbackToExportServer) is disabled. If left undefined, an exception
 * is thrown instead.
 * 
 * @type {Function}
 * @see [fallbackToExportServer](#exporting.fallbackToExportServer)
 * @default {all} undefined
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.error docs to actual source code
 * @apioption exporting.error
 */

/**
 * Whether or not to fall back to the export server if the offline-exporting
 * module is unable to export the chart on the client side.
 * 
 * @type {Boolean}
 * @default {all} true
 * @since 4.1.8
 * @product highcharts highstock highmaps
 * @todo Copy exporting.fallbackToExportServer docs to actual source code
 * @apioption exporting.fallbackToExportServer
 */

/**
 * The filename, without extension, to use for the exported chart.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/exporting/filename/ Custom file name
 * @sample {highstock} highcharts/exporting/filename/ Custom file name
 * @default {all} chart
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.filename docs to actual source code
 * @apioption exporting.filename
 */

/**
 * An object containing additional attributes for the POST form that
 * sends the SVG to the export server. For example, a `target` can be
 * set to make sure the generated image is received in another frame,
 *  or a custom `enctype` or `encoding` can be set.
 * 
 * @type {Object}
 * @since 3.0.8
 * @product highcharts highstock highmaps
 * @todo Copy exporting.formAttributes docs to actual source code
 * @apioption exporting.formAttributes
 */

/**
 * Path where Highcharts will look for export module dependencies to
 * load on demand if they don't already exist on `window`. Should currently
 * point to location of [CanVG](https://github.com/canvg/canvg) library,
 * [RGBColor.js](https://github.com/canvg/canvg), [jsPDF](https://github.
 * com/yWorks/jsPDF) and [svg2pdf.js](https://github.com/yWorks/svg2pdf.
 * js), required for client side export in certain browsers.
 * 
 * @type {String}
 * @default {all} https://code.highcharts.com/{version}/lib
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.libURL docs to actual source code
 * @apioption exporting.libURL
 */

/**
 * Analogous to [sourceWidth](#exporting.sourceWidth)
 * 
 * @type {Number}
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.sourceHeight docs to actual source code
 * @apioption exporting.sourceHeight
 */

/**
 * The width of the original chart when exported, unless an explicit
 * [chart.width](#chart.width) is set. The width exported raster image
 * is then multiplied by [scale](#exporting.scale).
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/exporting/sourcewidth/ Source size demo
 * @sample {highstock} highcharts/exporting/sourcewidth/ Source size demo
 * @sample {highmaps} highcharts/tree/master/samples/maps/exporting/sourcewidth/ Source size demo
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.sourceWidth docs to actual source code
 * @apioption exporting.sourceWidth
 */

/**
 * The pixel width of charts exported to PNG or JPG. As of Highcharts
 * 3.0, the default pixel width is a function of the [chart.width](#chart.
 * width) or [exporting.sourceWidth](#exporting.sourceWidth) and the
 * [exporting.scale](#exporting.scale).
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/exporting/width/ Export to 200px wide images
 * @sample {highstock} highcharts/exporting/width/ Export to 200px wide images
 * @default {all} undefined
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.width docs to actual source code
 * @apioption exporting.width
 */

/**
 * A click handler callback to use on the button directly instead of
 * the popup menu.
 * 
 * @type {Function}
 * @sample {highcharts} highcharts/exporting/buttons-contextbutton-onclick/ Skip the menu and export the chart directly
 * @sample {highstock} highcharts/exporting/buttons-contextbutton-onclick/ Skip the menu and export the chart directly
 * @sample {highmaps} highcharts/exporting/buttons-contextbutton-onclick/ Skip the menu and export the chart directly
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.buttons.contextButton.onclick docs to actual source code
 * @apioption exporting.buttons.contextButton.onclick
 */

/**
 * See [navigation.buttonOptions](#navigation.buttonOptions) => symbolFill.
 * 
 * @type {Color}
 * @default {all} #666666
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.buttons.contextButton.symbolFill docs to actual source code
 * @apioption exporting.buttons.contextButton.symbolFill
 */

/**
 * The horizontal position of the button relative to the `align` option.
 * 
 * @type {Number}
 * @default {all} -10
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy exporting.buttons.contextButton.x docs to actual source code
 * @apioption exporting.buttons.contextButton.x
 */

/**
 * A custom `Date` class for advanced date handling. For example, [JDate](https://github.
 * com/tahajahangir/jdate) can be hooked in to handle Jalali dates.
 * 
 * @type {Object}
 * @since 4.0.4
 * @product highcharts highstock
 * @todo Copy global.Date docs to actual source code
 * @apioption global.Date
 */

/**
 * _Canvg rendering for Android 2.x is removed as of Highcharts 5.0\.
 * Use the [libURL](#exporting.libURL) option to configure exporting.
 * _
 * 
 * The URL to the additional file to lazy load for Android 2.x devices.
 * These devices don't support SVG, so we download a helper file that
 * contains [canvg](http://code.google.com/p/canvg/), its dependency
 * rbcolor, and our own CanVG Renderer class. To avoid hotlinking to
 * our site, you can install canvas-tools.js on your own server and
 * change this option accordingly.
 * 
 * @type {String}
 * @deprecated
 * @default {all} http://code.highcharts.com/{version}/modules/canvas-tools.js
 * @product highcharts highmaps
 * @todo Copy global.canvasToolsURL docs to actual source code
 * @apioption global.canvasToolsURL
 */

/**
 * A callback to return the time zone offset for a given datetime. It
 * takes the timestamp in terms of milliseconds since January 1 1970,
 * and returns the timezone offset in minutes. This provides a hook
 * for drawing time based charts in specific time zones using their
 * local DST crossover dates, with the help of external libraries.
 * 
 * @type {Function}
 * @see [global.timezoneOffset](#global.timezoneOffset)
 * @sample {highcharts} highcharts/global/gettimezoneoffset/ Use moment.js to draw Oslo time regardless of browser locale
 * @sample {highstock} highcharts/global/gettimezoneoffset/ Use moment.js to draw Oslo time regardless of browser locale
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy global.getTimezoneOffset docs to actual source code
 * @apioption global.getTimezoneOffset
 */

/**
 * Requires [moment.js](http://momentjs.com/). If the timezone option
 * is specified, it creates a default [getTimezoneOffset](#global.getTimezoneOffset)
 * function that looks up the specified timezone in moment.js. If moment.
 * js is not included, this throws a Highcharts error in the console,
 *  but does not crash the chart.
 * 
 * @type {String}
 * @see [getTimezoneOffset](#global.getTimezoneOffset)
 * @sample {highcharts} highcharts/global/timezone/ Europe/Oslo
 * @sample {highstock} highcharts/global/timezone/ Europe/Oslo
 * @default {all} undefined
 * @since 5.0.7
 * @product highcharts highstock
 * @todo Copy global.timezone docs to actual source code
 * @apioption global.timezone
 */

/**
 * The timezone offset in minutes. Positive values are west, negative
 * values are east of UTC, as in the ECMAScript [getTimezoneOffset](https://developer.
 * mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
 * method. Use this to display UTC based data in a predefined time zone.
 * 
 * @type {Number}
 * @see [global.getTimezoneOffset](#global.getTimezoneOffset)
 * @sample {highcharts} highcharts/global/timezoneoffset/ Timezone offset
 * @sample {highstock} highcharts/global/timezoneoffset/ Timezone offset
 * @default {all} 0
 * @since 3.0.8
 * @product highcharts highstock
 * @todo Copy global.timezoneOffset docs to actual source code
 * @apioption global.timezoneOffset
 */

/**
 * A HTML label that can be positioned anywhere in the chart area.
 * 
 * @type {Array<Object>}
 * @product highcharts highstock highmaps
 * @todo Copy labels.items docs to actual source code
 * @apioption labels.items
 */

/**
 * Inner HTML or text for the label.
 * 
 * @type {String}
 * @product highcharts highstock highmaps
 * @todo Copy labels.items.html docs to actual source code
 * @apioption labels.items.html
 */

/**
 * CSS styles for each label. To position the label, use left and top
 * like this:
 * 
 * <pre>style: {
 * left: '100px',
 * top: '100px'
 * }</pre>
 * 
 * @type {CSSObject}
 * @product highcharts highstock highmaps
 * @todo Copy labels.items.style docs to actual source code
 * @apioption labels.items.style
 */

/**
 * Exporting module menu. The tooltip title for the context menu holding
 * print and export menu items.
 * 
 * @type {String}
 * @default {all} Chart context menu
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy lang.contextButtonTitle docs to actual source code
 * @apioption lang.contextButtonTitle
 */

/**
 * Exporting module only. The text for the JPEG download menu item.
 * 
 * @type {String}
 * @default {all} Download JPEG image
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy lang.downloadJPEG docs to actual source code
 * @apioption lang.downloadJPEG
 */

/**
 * Exporting module only. The text for the PDF download menu item.
 * 
 * @type {String}
 * @default {all} Download PDF document
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy lang.downloadPDF docs to actual source code
 * @apioption lang.downloadPDF
 */

/**
 * Exporting module only. The text for the PNG download menu item.
 * 
 * @type {String}
 * @default {all} Download PNG image
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy lang.downloadPNG docs to actual source code
 * @apioption lang.downloadPNG
 */

/**
 * Exporting module only. The text for the SVG download menu item.
 * 
 * @type {String}
 * @default {all} Download SVG vector image
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy lang.downloadSVG docs to actual source code
 * @apioption lang.downloadSVG
 */

/**
 * The text for the button that appears when drilling down, linking
 * back to the parent series. The parent series' name is inserted for
 * `{series.name}`.
 * 
 * @type {String}
 * @default {all} Back to {series.name}
 * @since 3.0.8
 * @product highcharts highmaps
 * @todo Copy lang.drillUpText docs to actual source code
 * @apioption lang.drillUpText
 */

/**
 * What to show in a date field for invalid dates. Defaults to an empty
 * string.
 * 
 * @type {String}
 * @since 4.1.8
 * @product highcharts highstock
 * @todo Copy lang.invalidDate docs to actual source code
 * @apioption lang.invalidDate
 */

/**
 * The text to display when the chart contains no data. Requires the
 * no-data module, see [noData](#noData).
 * 
 * @type {String}
 * @default {all} No data to display
 * @since 3.0.8
 * @product highcharts
 * @todo Copy lang.noData docs to actual source code
 * @apioption lang.noData
 */

/**
 * The magnitude of [numericSymbols](#lang.numericSymbol) replacements.
 * Use 10000 for Japanese, Korean and various Chinese locales, which
 * use symbols for 10^4, 10^8 and 10^12.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/lang/numericsymbolmagnitude/ 10000 magnitude for Japanese
 * @sample {highstock} highcharts/lang/numericsymbolmagnitude/ 10000 magnitude for Japanese
 * @sample {highmaps} highcharts/lang/numericsymbolmagnitude/ 10000 magnitude for Japanese
 * @default {all} 1000
 * @since 5.0.3
 * @product highcharts highstock highmaps
 * @todo Copy lang.numericSymbolMagnitude docs to actual source code
 * @apioption lang.numericSymbolMagnitude
 */

/**
 * Exporting module only. The text for the menu item to print the chart.
 * 
 * @type {String}
 * @default {all} Print chart
 * @since 3.0.1
 * @product highcharts highstock highmaps
 * @todo Copy lang.printChart docs to actual source code
 * @apioption lang.printChart
 */

/**
 * Short week days, starting Sunday. If not specified, Highcharts uses
 * the first three letters of the `lang.weekdays` option.
 * 
 * @type {Array<String>}
 * @sample {highcharts} highcharts/lang/shortweekdays/ Finnish two-letter abbreviations
 * @sample {highstock} highcharts/lang/shortweekdays/ Finnish two-letter abbreviations
 * @sample {highmaps} highcharts/lang/shortweekdays/ Finnish two-letter abbreviations
 * @since 4.2.4
 * @product highcharts highstock highmaps
 * @todo Copy lang.shortWeekdays docs to actual source code
 * @apioption lang.shortWeekdays
 */

/**
 * The background color of the legend.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the legend background fill can be applied with
 * the `.highcharts-legend-box` class.
 * @sample {highcharts} highcharts/legend/backgroundcolor/ Yellowish background
 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/border-background/ Border and background options
 * @product highcharts highstock highmaps
 * @todo Copy legend.backgroundColor docs to actual source code
 * @apioption legend.backgroundColor
 */

/**
 * The width of the drawn border around the legend.
 * 
 * @type {Number}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the legend border stroke width can be applied
 * with the `.highcharts-legend-box` class.
 * @sample {highcharts} highcharts/legend/borderwidth/ 2px border width
 * @sample {highstock} highcharts/tree/master/samples/stock/legend/align/ Various legend options
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/border-background/ Border and background options
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy legend.borderWidth docs to actual source code
 * @apioption legend.borderWidth
 */

/**
 * When the legend is floating, the plot area ignores it and is allowed
 * to be placed below it.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/legend/floating-false/ False by default
 * @sample {highcharts} highcharts/legend/floating-true/ True
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/alignment/ Floating legend
 * @default {all} false
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy legend.floating docs to actual source code
 * @apioption legend.floating
 */

/**
 * In a legend with horizontal layout, the itemDistance defines the
 * pixel distance between each item.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/layout-horizontal/ 50px item distance
 * @sample {highstock} highcharts/legend/layout-horizontal/ 50px item distance
 * @default {highcharts} 20
 * @default {highstock} 20
 * @default {highmaps} 8
 * @since 3.0.3
 * @product highcharts highstock highmaps
 * @todo Copy legend.itemDistance docs to actual source code
 * @apioption legend.itemDistance
 */

/**
 * The pixel bottom margin for each legend item.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highstock} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @default {all} 0
 * @since 2.2.0
 * @product highcharts highstock highmaps
 * @todo Copy legend.itemMarginBottom docs to actual source code
 * @apioption legend.itemMarginBottom
 */

/**
 * The pixel top margin for each legend item.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highstock} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @default {all} 0
 * @since 2.2.0
 * @product highcharts highstock highmaps
 * @todo Copy legend.itemMarginTop docs to actual source code
 * @apioption legend.itemMarginTop
 */

/**
 * The width for each legend item. This is useful in a horizontal layout
 * with many items when you want the items to align vertically. .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/itemwidth-default/ Null by default
 * @sample {highcharts} highcharts/legend/itemwidth-80/ 80 for aligned legend items
 * @default {all} null
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy legend.itemWidth docs to actual source code
 * @apioption legend.itemWidth
 */

/**
 * A [format string](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting) for each legend label. Available variables
 * relates to properties on the series, or the point in case of pies.
 * 
 * @type {String}
 * @default {all} {name}
 * @since 1.3
 * @product highcharts highstock highmaps
 * @todo Copy legend.labelFormat docs to actual source code
 * @apioption legend.labelFormat
 */

/**
 * Line height for the legend items. Deprecated as of 2.1\. Instead,
 * the line height for each item can be set using itemStyle.lineHeight,
 * and the padding between items using itemMarginTop and itemMarginBottom.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/lineheight/ Setting padding
 * @default {all} 16
 * @since 2.0
 * @product highcharts
 * @todo Copy legend.lineHeight docs to actual source code
 * @apioption legend.lineHeight
 */

/**
 * If the plot area sized is calculated automatically and the legend
 * is not floating, the legend margin is the space between the legend
 * and the axis labels or plot area.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/margin-default/ 12 pixels by default
 * @sample {highcharts} highcharts/legend/margin-30/ 30 pixels
 * @default {all} 12
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy legend.margin docs to actual source code
 * @apioption legend.margin
 */

/**
 * Maximum pixel height for the legend. When the maximum height is extended,
 *  navigation will show.
 * 
 * @type {Number}
 * @default {all} undefined
 * @since 2.3.0
 * @product highcharts highstock highmaps
 * @todo Copy legend.maxHeight docs to actual source code
 * @apioption legend.maxHeight
 */

/**
 * The inner padding of the legend box.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highstock} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @default {all} 8
 * @since 2.2.0
 * @product highcharts highstock highmaps
 * @todo Copy legend.padding docs to actual source code
 * @apioption legend.padding
 */

/**
 * Whether to reverse the order of the legend items compared to the
 * order of the series or points as defined in the configuration object.
 * 
 * @type {Boolean}
 * @see [yAxis.reversedStacks](#yAxis.reversedStacks), [series.legendIndex](#series.
 * legendIndex)
 * @sample {highcharts} highcharts/legend/reversed/ Stacked bar with reversed legend
 * @default {all} false
 * @since 1.2.5
 * @product highcharts highstock highmaps
 * @todo Copy legend.reversed docs to actual source code
 * @apioption legend.reversed
 */

/**
 * Whether to show the symbol on the right side of the text rather than
 * the left side. This is common in Arabic and Hebraic.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/legend/rtl/ Symbol to the right
 * @default {all} false
 * @since 2.2
 * @product highcharts highmaps
 * @todo Copy legend.rtl docs to actual source code
 * @apioption legend.rtl
 */

/**
 * CSS styles for the legend area. In the 1.x versions the position
 * of the legend area was determined by CSS. In 2.x, the position is
 * determined by properties like `align`, `verticalAlign`, `x` and `y`,
 *  but the styles are still parsed for backwards compatibility.
 * 
 * @type {CSSObject}
 * @deprecated
 * @product highcharts highstock
 * @todo Copy legend.style docs to actual source code
 * @apioption legend.style
 */

/**
 * The pixel height of the symbol for series types that use a rectangle
 * in the legend. Defaults to the font size of legend items.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/layout-vertical-sized/ Sized vertical gradient
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/padding-itemmargin/ No distance between data classes
 * @since 3.0.8
 * @product highcharts highstock highmaps
 * @todo Copy legend.symbolHeight docs to actual source code
 * @apioption legend.symbolHeight
 */

/**
 * The border radius of the symbol for series types that use a rectangle
 * in the legend. Defaults to half the `symbolHeight`.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/symbolradius/ Round symbols
 * @sample {highstock} highcharts/legend/symbolradius/ Round symbols
 * @sample {highmaps} highcharts/legend/symbolradius/ Round symbols
 * @since 3.0.8
 * @product highcharts highstock highmaps
 * @todo Copy legend.symbolRadius docs to actual source code
 * @apioption legend.symbolRadius
 */

/**
 * The pixel width of the legend item symbol. When the `squareSymbol`
 * option is set, this defaults to the `symbolHeight`, otherwise 16.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/symbolwidth/ Greater symbol width and padding
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highmaps} highcharts/tree/master/samples/maps/legend/layout-vertical-sized/ Sized vertical gradient
 * @product highcharts highstock highmaps
 * @todo Copy legend.symbolWidth docs to actual source code
 * @apioption legend.symbolWidth
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the legend item texts. Prior
 * to 4.1.7, when using HTML, [legend.navigation](#legend.navigation)
 * was disabled.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy legend.useHTML docs to actual source code
 * @apioption legend.useHTML
 */

/**
 * The width of the legend box.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/width/ Aligned to the plot area
 * @default {all} null
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy legend.width docs to actual source code
 * @apioption legend.width
 */

/**
 * @since next
 * @product highcharts
 * @todo Copy legend.keyboardNavigation docs to actual source code
 * @apioption legend.keyboardNavigation
 */

/**
 * Enable/disable keyboard navigation for the legend. Requires the Accessibility
 * module.
 * 
 * @type {Boolean}
 * @see [accessibility.keyboardNavigation](#accessibility.keyboardNavigation.
 * enabled)
 * @default {all} true
 * @since next
 * @product highcharts
 * @todo Copy legend.keyboardNavigation.enabled docs to actual source code
 * @apioption legend.keyboardNavigation.enabled
 */

/**
 * How to animate the pages when navigating up or down. A value of `true`
 * applies the default navigation given in the chart.animation option.
 * Additional options can be given as an object containing values for
 * easing and duration. .
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @sample {highstock} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @default {all} true
 * @since 2.2.4
 * @product highcharts highstock highmaps
 * @todo Copy legend.navigation.animation docs to actual source code
 * @apioption legend.navigation.animation
 */

/**
 * The pixel size of the up and down arrows in the legend paging navigation.
 *  .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @sample {highstock} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @default {all} 12
 * @since 2.2.4
 * @product highcharts highstock highmaps
 * @todo Copy legend.navigation.arrowSize docs to actual source code
 * @apioption legend.navigation.arrowSize
 */

/**
 * Whether to enable the legend navigation. In most cases, disabling
 * the navigation results in an unwanted overflow.
 * 
 * See also the [adapt chart to legend](http://www.highcharts.com/plugin-
 * registry/single/8/Adapt-Chart-To-Legend) plugin for a solution to
 * extend the chart height to make room for the legend, optionally in
 * exported charts only.
 * 
 * @type {Boolean}
 * @default {all} true
 * @since 4.2.4
 * @product highcharts highstock highmaps
 * @todo Copy legend.navigation.enabled docs to actual source code
 * @apioption legend.navigation.enabled
 */

/**
 * Text styles for the legend page navigation.
 * 
 * @type {CSSObject}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the navigation items are styled with the `.highcharts-
 * legend-navigation` class.
 * @sample {highcharts} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @sample {highstock} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @since 2.2.4
 * @product highcharts highstock highmaps
 * @todo Copy legend.navigation.style docs to actual source code
 * @apioption legend.navigation.style
 */

/**
 * A text or HTML string for the title.
 * 
 * @type {String}
 * @default {all} null
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy legend.title.text docs to actual source code
 * @apioption legend.title.text
 */

/**
 * The duration in milliseconds of the fade out effect.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/loading/hideduration/ Fade in and out over a second
 * @default {all} 100
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy loading.hideDuration docs to actual source code
 * @apioption loading.hideDuration
 */

/**
 * The duration in milliseconds of the fade in effect.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/loading/hideduration/ Fade in and out over a second
 * @default {highcharts} 100
 * @default {highstock} 0
 * @default {highmaps} 100
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy loading.showDuration docs to actual source code
 * @apioption loading.showDuration
 */

/**
 * Alignment for the buttons.
 * 
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/navigation/buttonoptions-align/ Center aligned
 * @sample {highstock} highcharts/navigation/buttonoptions-align/ Center aligned
 * @sample {highmaps} highcharts/navigation/buttonoptions-align/ Center aligned
 * @default {all} right
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.align docs to actual source code
 * @apioption navigation.buttonOptions.align
 */

/**
 * Whether to enable buttons.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/navigation/buttonoptions-enabled/ Exporting module loaded but buttons disabled
 * @sample {highstock} highcharts/navigation/buttonoptions-enabled/ Exporting module loaded but buttons disabled
 * @sample {highmaps} highcharts/navigation/buttonoptions-enabled/ Exporting module loaded but buttons disabled
 * @default {all} true
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.enabled docs to actual source code
 * @apioption navigation.buttonOptions.enabled
 */

/**
 * Pixel height of the buttons.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default {all} 20
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.height docs to actual source code
 * @apioption navigation.buttonOptions.height
 */

/**
 * The pixel size of the symbol on the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default {all} 14
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.symbolSize docs to actual source code
 * @apioption navigation.buttonOptions.symbolSize
 */

/**
 * The x position of the center of the symbol inside the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default {all} 12.5
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.symbolX docs to actual source code
 * @apioption navigation.buttonOptions.symbolX
 */

/**
 * The y position of the center of the symbol inside the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default {all} 10.5
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.symbolY docs to actual source code
 * @apioption navigation.buttonOptions.symbolY
 */

/**
 * A text string to add to the individual button.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/exporting/buttons-text/ Full text button
 * @sample {highcharts} highcharts/exporting/buttons-text-symbol/ Combined symbol and text
 * @sample {highstock} highcharts/exporting/buttons-text/ Full text button
 * @sample {highstock} highcharts/exporting/buttons-text-symbol/ Combined symbol and text
 * @sample {highmaps} highcharts/exporting/buttons-text/ Full text button
 * @sample {highmaps} highcharts/exporting/buttons-text-symbol/ Combined symbol and text
 * @default {all} null
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.text docs to actual source code
 * @apioption navigation.buttonOptions.text
 */

/**
 * The vertical alignment of the buttons. Can be one of "top", "middle"
 * or "bottom".
 * 
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @sample {highcharts} highcharts/navigation/buttonoptions-verticalalign/ Buttons at lower right
 * @sample {highstock} highcharts/navigation/buttonoptions-verticalalign/ Buttons at lower right
 * @sample {highmaps} highcharts/navigation/buttonoptions-verticalalign/ Buttons at lower right
 * @default {all} top
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.verticalAlign docs to actual source code
 * @apioption navigation.buttonOptions.verticalAlign
 */

/**
 * The pixel width of the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default {all} 24
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.width docs to actual source code
 * @apioption navigation.buttonOptions.width
 */

/**
 * The vertical offset of the button's position relative to its `verticalAlign`.
 *  .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-verticalalign/ Buttons at lower right
 * @sample {highstock} highcharts/navigation/buttonoptions-verticalalign/ Buttons at lower right
 * @sample {highmaps} highcharts/navigation/buttonoptions-verticalalign/ Buttons at lower right
 * @default {all} 0
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy navigation.buttonOptions.y docs to actual source code
 * @apioption navigation.buttonOptions.y
 */

/**
 * An object of additional SVG attributes for the no-data label.
 * 
 * @type {Object}
 * @since 3.0.8
 * @product highcharts highstock
 * @todo Copy noData.attr docs to actual source code
 * @apioption noData.attr
 */

/**
 * Whether to insert the label as HTML, or as pseudo-HTML rendered with
 * SVG.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 4.1.10
 * @product highcharts highstock
 * @todo Copy noData.useHTML docs to actual source code
 * @apioption noData.useHTML
 */

/**
 * The end angle of the polar X axis or gauge value axis, given in degrees
 * where 0 is north. Defaults to [startAngle](#pane.startAngle) + 360.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/demo/gauge-vu-meter/ VU-meter with custom start and end angle
 * @since 2.3.0
 * @product highcharts
 * @todo Copy pane.endAngle docs to actual source code
 * @apioption pane.endAngle
 */

/**
 * The class name for this background.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/css/pane/ Panes styled by CSS
 * @sample {highstock} highcharts/css/pane/ Panes styled by CSS
 * @sample {highmaps} highcharts/css/pane/ Panes styled by CSS
 * @default {all} highcharts-pane
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy pane.background.className docs to actual source code
 * @apioption pane.background.className
 */

/**
 * Fill color or gradient for the area. When `null`, the series' `color`
 * is used with the series' `fillOpacity`.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the fill color can be set with the `.highcharts-
 * area` class name.
 * @sample {highcharts} highcharts/plotoptions/area-fillcolor-default/ Null by default
 * @sample {highcharts} highcharts/plotoptions/area-fillcolor-gradient/ Gradient
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy plotOptions.area.fillColor docs to actual source code
 * @apioption plotOptions.area.fillColor
 */

/**
 * Fill opacity for the area. When you set an explicit `fillColor`,
 * the `fillOpacity` is not applied. Instead, you should define the
 * opacity in the `fillColor` with an rgba color definition. The `fillOpacity`
 * setting, also the default setting, overrides the alpha component
 * of the `color` setting.
 * 
 * @type {Number}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the fill opacity can be set with the `.highcharts-
 * area` class name.
 * @sample {highcharts} highcharts/plotoptions/area-fillopacity/ Automatic fill color and fill opacity of 0.1
 * @default {highcharts} 0.75
 * @default {highstock} .75
 * @product highcharts highstock
 * @todo Copy plotOptions.area.fillOpacity docs to actual source code
 * @apioption plotOptions.area.fillOpacity
 */

/**
 * A separate color for the graph line. By default the line takes the
 * `color` of the series, but the lineColor setting allows setting a
 * separate color for the line without altering the `fillColor`.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the line stroke can be set with the `.highcharts-
 * graph` class name.
 * @sample {highcharts} highcharts/plotoptions/area-linecolor/ Dark gray line
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy plotOptions.area.lineColor docs to actual source code
 * @apioption plotOptions.area.lineColor
 */

/**
 * A separate color for the negative part of the area.
 * 
 * @type {Color}
 * @see [negativeColor](#plotOptions.area.negativeColor). In [styled mode](http://www.
 * highcharts.com/docs/chart-design-and-style/style-by-css), a negative
 * color is set with the `.highcharts-negative` class name ([view live
 * demo](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-
 * negative-color/)).
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.area.negativeFillColor docs to actual source code
 * @apioption plotOptions.area.negativeFillColor
 */

/**
 * Whether to apply steps to the line. Possible values are `left`, `center`
 * and `right`. Prior to 2.3.5, only `left` was supported.
 * 
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/line-step/ Different step line options
 * @sample {highcharts} highcharts/plotoptions/area-step/ Stepped, stacked area
 * @default {all} false
 * @since 1.2.5
 * @product highcharts
 * @todo Copy plotOptions.area.step docs to actual source code
 * @apioption plotOptions.area.step
 */

/**
 * Whether the whole area or just the line should respond to mouseover
 * tooltips and other mouse or touch events.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/area-trackbyarea/ Display the tooltip when the     area is hovered
 * @sample {highstock} highcharts/plotoptions/area-trackbyarea/ Display the tooltip when the     area is hovered
 * @default {all} false
 * @since 1.1.6
 * @product highcharts highstock
 * @todo Copy plotOptions.area.trackByArea docs to actual source code
 * @apioption plotOptions.area.trackByArea
 */

/**
 * Whether to apply a drop shadow to the graph line. Since 2.3 the shadow
 * can be an object configuration containing `color`, `offsetX`, `offsetY`,
 *  `opacity` and `width`.
 * 
 * @type {Boolean|Object}
 * @product highcharts
 * @todo Copy plotOptions.arearange.shadow docs to actual source code
 * @apioption plotOptions.arearange.shadow
 */

/**
 * Whether to apply steps to the line. Possible values are `left`, `center`
 * and `right`. Prior to 2.3.5, only `left` was supported.
 * 
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/line-step/ Different step line options
 * @default {all} false
 * @since 1.2.5
 * @product highcharts
 * @todo Copy plotOptions.arearange.step docs to actual source code
 * @apioption plotOptions.arearange.step
 */

/**
 * @extends plotOptions.area
 * @excluding step
 * @product highcharts highstock
 * @todo Copy plotOptions.areaspline docs to actual source code
 * @apioption plotOptions.areaspline
 */

/**
 * The area spline range is a cartesian series type with higher and
 * lower Y values along an X axis. Requires `highcharts-more.js`.
 * 
 * @extends plotOptions.arearange
 * @excluding step
 * @since 2.3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.areasplinerange docs to actual source code
 * @apioption plotOptions.areasplinerange
 */

/**
 * @extends plotOptions.column.dataLabels
 * @product highcharts
 * @todo Copy plotOptions.bar.dataLabels docs to actual source code
 * @apioption plotOptions.bar.dataLabels
 */

/**
 * Alignment of the data label relative to the data point.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/bar-datalabels-align-inside-bar/ Data labels inside the bar
 * @default {all} left
 * @product highcharts
 * @todo Copy plotOptions.bar.dataLabels.align docs to actual source code
 * @apioption plotOptions.bar.dataLabels.align
 */

/**
 * The x position of the data label relative to the data point.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/bar-datalabels-align-inside-bar/ Data labels inside the bar
 * @default {all} 5
 * @product highcharts
 * @todo Copy plotOptions.bar.dataLabels.x docs to actual source code
 * @apioption plotOptions.bar.dataLabels.x
 */

/**
 * The color of the median line. If `null`, the general series color
 * applies.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the median stroke width can be set with the
 * `.highcharts-boxplot-median` class ([view live demo](http://jsfiddle.
 * net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/boxplot/)).
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/ Box plot styling
 * @sample {highcharts} highcharts/plotoptions/error-bar-styling/ Error bar styling
 * @default {all} null
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.boxplot.medianColor docs to actual source code
 * @apioption plotOptions.boxplot.medianColor
 */

/**
 * The color of the stem, the vertical line extending from the box to
 * the whiskers. If `null`, the series color is used.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the stem stroke can be set with the `.highcharts-
 * boxplot-stem` class ([view live demo](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/boxplot/)).
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/ Box plot styling
 * @sample {highcharts} highcharts/plotoptions/error-bar-styling/ Error bar styling
 * @default {all} null
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.boxplot.stemColor docs to actual source code
 * @apioption plotOptions.boxplot.stemColor
 */

/**
 * The dash style of the stem, the vertical line extending from the
 * box to the whiskers.
 * 
 * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/ Box plot styling
 * @sample {highcharts} highcharts/plotoptions/error-bar-styling/ Error bar styling
 * @default {all} Solid
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.boxplot.stemDashStyle docs to actual source code
 * @apioption plotOptions.boxplot.stemDashStyle
 */

/**
 * The width of the stem, the vertical line extending from the box to
 * the whiskers. If `null`, the width is inherited from the [lineWidth](#plotOptions.
 * boxplot.lineWidth) option.
 * 
 * @type {Number}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the stem stroke width can be set with the `.
 * highcharts-boxplot-stem` class ([view live demo](http://jsfiddle.
 * net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/boxplot/)).
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/ Box plot styling
 * @sample {highcharts} highcharts/plotoptions/error-bar-styling/ Error bar styling
 * @default {all} null
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.boxplot.stemWidth docs to actual source code
 * @apioption plotOptions.boxplot.stemWidth
 */

/**
 * The color of the whiskers, the horizontal lines marking low and high
 * values. When `null`, the general series color is used.
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the whisker stroke can be set with the `.highcharts-
 * boxplot-whisker` class ([view live demo](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/boxplot/)).
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/ Box plot styling
 * @default {all} null
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.boxplot.whiskerColor docs to actual source code
 * @apioption plotOptions.boxplot.whiskerColor
 */

/**
 * Whether to display negative sized bubbles. The threshold is given
 * by the [zThreshold](#plotOptions.bubble.zThreshold) option, and negative
 * bubbles can be visualized by setting [negativeColor](#plotOptions.
 * bubble.negativeColor).
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/bubble-negative/ Negative bubbles
 * @default {all} true
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.bubble.displayNegative docs to actual source code
 * @apioption plotOptions.bubble.displayNegative
 */

/**
 * When a point's Z value is below the [zThreshold](#plotOptions.bubble.
 * zThreshold) setting, this color is used.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/bubble-negative/ Negative bubbles
 * @default {all} null
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.bubble.negativeColor docs to actual source code
 * @apioption plotOptions.bubble.negativeColor
 */

/**
 * Whether the bubble's value should be represented by the area or the
 * width of the bubble. The default, `area`, corresponds best to the
 * human perception of the size of each bubble.
 * 
 * @validvalue ["area", "width"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/bubble-sizeby/ Comparison of area and size
 * @default {all} area
 * @since 3.0.7
 * @product highcharts
 * @todo Copy plotOptions.bubble.sizeBy docs to actual source code
 * @apioption plotOptions.bubble.sizeBy
 */

/**
 * When this is true, the absolute value of z determines the size of
 * the bubble. This means that with the default `zThreshold` of 0, a
 * bubble of value -1 will have the same size as a bubble of value 1,
 * while a bubble of value 0 will have a smaller size according to
 * `minSize`.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/bubble-sizebyabsolutevalue/ Size by absolute value, various thresholds
 * @default {all} false
 * @since 4.1.9
 * @product highcharts
 * @todo Copy plotOptions.bubble.sizeByAbsoluteValue docs to actual source code
 * @apioption plotOptions.bubble.sizeByAbsoluteValue
 */

/**
 * The minimum for the Z value range. Defaults to the highest Z value
 * in the data.
 * 
 * @type {Number}
 * @see [zMax](#plotOptions.bubble.zMin)
 * @sample {highcharts} highcharts/plotoptions/bubble-zmin-zmax/ Z has a possible range of 0-100
 * @default {all} null
 * @since 4.0.3
 * @product highcharts
 * @todo Copy plotOptions.bubble.zMax docs to actual source code
 * @apioption plotOptions.bubble.zMax
 */

/**
 * The minimum for the Z value range. Defaults to the lowest Z value
 * in the data.
 * 
 * @type {Number}
 * @see [zMax](#plotOptions.bubble.zMax)
 * @sample {highcharts} highcharts/plotoptions/bubble-zmin-zmax/ Z has a possible range of 0-100
 * @default {all} null
 * @since 4.0.3
 * @product highcharts
 * @todo Copy plotOptions.bubble.zMin docs to actual source code
 * @apioption plotOptions.bubble.zMin
 */

/**
 * The width of the border surrounding each column or bar.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the stroke width can be set with the `.highcharts-
 * point` rule.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/column-borderwidth/ 2px black border
 * @default {all} 1
 * @product highcharts highstock
 * @todo Copy plotOptions.column.borderWidth docs to actual source code
 * @apioption plotOptions.column.borderWidth
 */

/**
 * When using automatic point colors pulled from the `options.colors`
 * collection, this option determines whether the chart should receive
 * one color per series or one color per point.
 * 
 * @type {Boolean}
 * @see [series colors](#plotOptions.column.colors)
 * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-false/ False by default
 * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-true/ True
 * @default {all} false
 * @since 2.0
 * @product highcharts highstock
 * @todo Copy plotOptions.column.colorByPoint docs to actual source code
 * @apioption plotOptions.column.colorByPoint
 */

/**
 * A series specific or series type specific color set to apply instead
 * of the global [colors](#colors) when [colorByPoint](#plotOptions.
 * column.colorByPoint) is true.
 * 
 * @type {Array<Color>}
 * @since 3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.column.colors docs to actual source code
 * @apioption plotOptions.column.colors
 */

/**
 * Depth of the columns in a 3D column chart. Requires `highcharts-3d.
 * js`.
 * 
 * @type {Number}
 * @default {all} 25
 * @since 4.0
 * @product highcharts
 * @todo Copy plotOptions.column.depth docs to actual source code
 * @apioption plotOptions.column.depth
 */

/**
 * 3D columns only. The color of the edges. Similar to `borderColor`,
 *  except it defaults to the same color as the column.
 * 
 * @type {Color}
 * @product highcharts
 * @todo Copy plotOptions.column.edgeColor docs to actual source code
 * @apioption plotOptions.column.edgeColor
 */

/**
 * 3D columns only. The width of the colored edges.
 * 
 * @type {Number}
 * @default {all} 1
 * @product highcharts
 * @todo Copy plotOptions.column.edgeWidth docs to actual source code
 * @apioption plotOptions.column.edgeWidth
 */

/**
 * The spacing between columns on the Z Axis in a 3D chart. Requires
 * `highcharts-3d.js`.
 * 
 * @type {Number}
 * @default {all} 1
 * @since 4.0
 * @product highcharts
 * @todo Copy plotOptions.column.groupZPadding docs to actual source code
 * @apioption plotOptions.column.groupZPadding
 */

/**
 * Whether to group non-stacked columns or to let them render independent
 * of each other. Non-grouped columns will be laid out individually
 * and overlap each other.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/column-grouping-false/ Grouping disabled
 * @sample {highstock} highcharts/plotoptions/column-grouping-false/ Grouping disabled
 * @default {all} true
 * @since 2.3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.column.grouping docs to actual source code
 * @apioption plotOptions.column.grouping
 */

/**
 * The maximum allowed pixel width for a column, translated to the height
 * of a bar in a bar chart. This prevents the columns from becoming
 * too wide when there is a small number of points in the chart.
 * 
 * @type {Number}
 * @see [pointWidth](#plotOptions.column.pointWidth)
 * @sample {highcharts} highcharts/plotoptions/column-maxpointwidth-20/ Limited to 50
 * @sample {highstock} highcharts/plotoptions/column-maxpointwidth-20/ Limited to 50
 * @default {all} null
 * @since 4.1.8
 * @product highcharts highstock
 * @todo Copy plotOptions.column.maxPointWidth docs to actual source code
 * @apioption plotOptions.column.maxPointWidth
 */

/**
 * A pixel value specifying a fixed width for each column or bar. When
 * `null`, the width is calculated from the `pointPadding` and `groupPadding`.
 * 
 * @type {Number}
 * @see [maxPointWidth](#plotOptions.column.maxPointWidth)
 * @sample {highcharts} highcharts/plotoptions/column-pointwidth-20/ 20px wide columns regardless of chart width    or the amount of data points
 * @default {all} null
 * @since 1.2.5
 * @product highcharts highstock
 * @todo Copy plotOptions.column.pointWidth docs to actual source code
 * @apioption plotOptions.column.pointWidth
 */

/**
 * @product highcharts
 * @todo Copy plotOptions.column.dataLabels.inside docs to actual source code
 * @apioption plotOptions.column.dataLabels.inside
 */

/**
 * A specific border color for the hovered point. Defaults to inherit
 * the normal state border color.
 * 
 * @type {Color}
 * @product highcharts
 * @todo Copy plotOptions.column.states.hover.borderColor docs to actual source code
 * @apioption plotOptions.column.states.hover.borderColor
 */

/**
 * A specific color for the hovered point.
 * 
 * @type {Color}
 * @default {all} undefined
 * @product highcharts
 * @todo Copy plotOptions.column.states.hover.color docs to actual source code
 * @apioption plotOptions.column.states.hover.color
 */

/**
 * The column range is a cartesian series type with higher and lower
 * Y values along an X axis. Requires `highcharts-more.js`. To display
 * horizontal bars, set [chart.inverted](#chart.inverted) to `true`.
 * 
 * @type {Object}
 * @extends plotOptions.column
 * @excluding negativeColor,stacking,softThreshold,threshold
 * @sample {highcharts} highcharts/demo/columnrange/ Inverted column range
 * @sample {highstock} highcharts/demo/columnrange/ Inverted column range
 * @since 2.3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.columnrange docs to actual source code
 * @apioption plotOptions.columnrange
 */

/**
 * Extended data labels for range series types. Range series data labels
 * have no `x` and `y` options. Instead, they have `xLow`, `xHigh`,
 * `yLow` and `yHigh` options to allow the higher and lower data label
 * sets individually.
 * 
 * @type {Object}
 * @extends plotOptions.arearange.dataLabels
 * @since 2.3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.columnrange.dataLabels docs to actual source code
 * @apioption plotOptions.columnrange.dataLabels
 */

/**
 * Allow the dial to overshoot the end of the perimeter axis by this
 * many degrees. Say if the gauge axis goes from 0 to 60, a value of
 * 100, or 1000, will show 5 degrees beyond the end of the axis.
 * 
 * @type {Number}
 * @see [wrap](#plotOptions.gauge.wrap)
 * @sample {highcharts} highcharts/plotoptions/gauge-overshoot/ Allow 5 degrees overshoot
 * @default {all} 0
 * @since 3.0.10
 * @product highcharts
 * @todo Copy plotOptions.gauge.overshoot docs to actual source code
 * @apioption plotOptions.gauge.overshoot
 */

/**
 * When this option is `true`, the dial will wrap around the axes. For
 * instance, in a full-range gauge going from 0 to 360, a value of 400
 * will point to 40\. When `wrap` is `false`, the dial stops at 360.
 * 
 * @type {Boolean}
 * @see [overshoot](#plotOptions.gauge.overshoot)
 * @default {all} true
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.wrap docs to actual source code
 * @apioption plotOptions.gauge.wrap
 */

/**
 * The background or fill color of the gauge's dial.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} #000000
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.backgroundColor docs to actual source code
 * @apioption plotOptions.gauge.dial.backgroundColor
 */

/**
 * The length of the dial's base part, relative to the total radius
 * or length of the dial.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} 70%
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.baseLength docs to actual source code
 * @apioption plotOptions.gauge.dial.baseLength
 */

/**
 * The pixel width of the base of the gauge dial. The base is the part
 * closest to the pivot, defined by baseLength.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} 3
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.baseWidth docs to actual source code
 * @apioption plotOptions.gauge.dial.baseWidth
 */

/**
 * The border color or stroke of the gauge's dial. By default, the borderWidth
 * is 0, so this must be set in addition to a custom border color.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} #cccccc
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.borderColor docs to actual source code
 * @apioption plotOptions.gauge.dial.borderColor
 */

/**
 * The width of the gauge dial border in pixels.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} 0
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.borderWidth docs to actual source code
 * @apioption plotOptions.gauge.dial.borderWidth
 */

/**
 * The radius or length of the dial, in percentages relative to the
 * radius of the gauge itself.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} 80%
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.radius docs to actual source code
 * @apioption plotOptions.gauge.dial.radius
 */

/**
 * The length of the dial's rear end, the part that extends out on the
 * other side of the pivot. Relative to the dial's length.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} 10%
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.rearLength docs to actual source code
 * @apioption plotOptions.gauge.dial.rearLength
 */

/**
 * The width of the top of the dial, closest to the perimeter. The pivot
 * narrows in from the base to the top.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/gauge-dial/ Dial options demonstrated
 * @default {all} 1
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.dial.topWidth docs to actual source code
 * @apioption plotOptions.gauge.dial.topWidth
 */

/**
 * The background color or fill of the pivot.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/gauge-pivot/ Pivot options demonstrated
 * @default {all} #000000
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.pivot.backgroundColor docs to actual source code
 * @apioption plotOptions.gauge.pivot.backgroundColor
 */

/**
 * The border or stroke color of the pivot. In able to change this,
 * the borderWidth must also be set to something other than the default
 * 0.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/gauge-pivot/ Pivot options demonstrated
 * @default {all} #cccccc
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.pivot.borderColor docs to actual source code
 * @apioption plotOptions.gauge.pivot.borderColor
 */

/**
 * The border or stroke width of the pivot.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/gauge-pivot/ Pivot options demonstrated
 * @default {all} 0
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.pivot.borderWidth docs to actual source code
 * @apioption plotOptions.gauge.pivot.borderWidth
 */

/**
 * The pixel radius of the pivot.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/gauge-pivot/ Pivot options demonstrated
 * @default {all} 5
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.gauge.pivot.radius docs to actual source code
 * @apioption plotOptions.gauge.pivot.radius
 */

/**
 * The main color of the series. In heat maps this color is rarely used,
 * as we mostly use the color to denote the value of each point. Unless
 * options are set in the [colorAxis](#colorAxis), the default value
 * is pulled from the [options.colors](#colors) array.
 * 
 * @type {Color}
 * @default {all} null
 * @since 4.0
 * @product highcharts
 * @todo Copy plotOptions.heatmap.color docs to actual source code
 * @apioption plotOptions.heatmap.color
 */

/**
 * The column size - how many X axis units each column in the heatmap
 * should span.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/tree/master/samples/maps/demo/heatmap/ One day
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/heatmap/ One day
 * @default {all} 1
 * @since 4.0
 * @product highcharts highmaps
 * @todo Copy plotOptions.heatmap.colsize docs to actual source code
 * @apioption plotOptions.heatmap.colsize
 */

/**
 * The row size - how many Y axis units each heatmap row should span.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/tree/master/samples/maps/demo/heatmap/ 1 by default
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/heatmap/ 1 by default
 * @default {all} 1
 * @since 4.0
 * @product highcharts highmaps
 * @todo Copy plotOptions.heatmap.rowsize docs to actual source code
 * @apioption plotOptions.heatmap.rowsize
 */

/**
 * @extends plotOptions.series
 * @product highcharts highstock
 * @todo Copy plotOptions.line docs to actual source code
 * @apioption plotOptions.line
 */

/**
 * Whether to apply steps to the line. Possible values are `left`, `center`
 * and `right`. Prior to 2.3.5, only `left` was supported.
 * 
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/line-step/ Different step line options
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/line-step/ Step line
 * @default {all} false
 * @since 1.2.5
 * @product highcharts highstock
 * @todo Copy plotOptions.line.step docs to actual source code
 * @apioption plotOptions.line.step
 */

/**
 * A series specific or series type specific color set to use instead
 * of the global [colors](#colors).
 * 
 * @type {Array<Color>}
 * @sample {highcharts} highcharts/demo/pie-monochrome/ Set default colors for all pies
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.pie.colors docs to actual source code
 * @apioption plotOptions.pie.colors
 */

/**
 * The thickness of a 3D pie. Requires `highcharts-3d.js`
 * 
 * @type {Number}
 * @default {all} 0
 * @since 4.0
 * @product highcharts
 * @todo Copy plotOptions.pie.depth docs to actual source code
 * @apioption plotOptions.pie.depth
 */

/**
 * The end angle of the pie in degrees where 0 is top and 90 is right.
 *  Defaults to `startAngle` plus 360.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/demo/pie-semi-circle/ Semi-circle donut
 * @default {all} null
 * @since 1.3.6
 * @product highcharts
 * @todo Copy plotOptions.pie.endAngle docs to actual source code
 * @apioption plotOptions.pie.endAngle
 */

/**
 * The size of the inner diameter for the pie. A size greater than 0
 * renders a donut chart. Can be a percentage or pixel value. Percentages
 * are relative to the pie size. Pixel values are given as integers.
 * 
 * 
 * Note: in Highcharts < 4.1.2, the percentage was relative to the plot
 * area, not the pie size.
 * 
 * @type {String|Number}
 * @sample {highcharts} highcharts/plotoptions/pie-innersize-80px/ 80px inner size
 * @sample {highcharts} highcharts/plotoptions/pie-innersize-50percent/ 50% of the plot area
 * @sample {highcharts} highcharts/demo/3d-pie-donut/ 3D donut
 * @default {all} 0
 * @since 2.0
 * @product highcharts
 * @todo Copy plotOptions.pie.innerSize docs to actual source code
 * @apioption plotOptions.pie.innerSize
 */

/**
 * The minimum size for a pie in response to auto margins. The pie will
 * try to shrink to make room for data labels in side the plot area,
 *  but only to this size.
 * 
 * @type {Number}
 * @default {all} 80
 * @since 3.0
 * @product highcharts
 * @todo Copy plotOptions.pie.minSize docs to actual source code
 * @apioption plotOptions.pie.minSize
 */

/**
 * The start angle of the pie slices in degrees where 0 is top and 90
 * right.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/pie-startangle-90/ Start from right
 * @default {all} 0
 * @since 2.3.4
 * @product highcharts
 * @todo Copy plotOptions.pie.startAngle docs to actual source code
 * @apioption plotOptions.pie.startAngle
 */

/**
 * N/A for pies.
 * 
 * @type {String}
 * @since 2.1
 * @product highcharts
 * @todo Copy plotOptions.pie.dataLabels.align docs to actual source code
 * @apioption plotOptions.pie.dataLabels.align
 */

/**
 * The color of the line connecting the data label to the pie slice.
 * The default color is the same as the point's color.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the connector stroke is given in the `.highcharts-
 * data-label-connector` class.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorcolor/ Blue connectors
 * @sample {highcharts} highcharts/css/pie-point/ Styled connectors
 * @default {all} {point.color}
 * @since 2.1
 * @product highcharts
 * @todo Copy plotOptions.pie.dataLabels.connectorColor docs to actual source code
 * @apioption plotOptions.pie.dataLabels.connectorColor
 */

/**
 * The distance from the data label to the connector.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorpadding/ No padding
 * @default {all} 5
 * @since 2.1
 * @product highcharts
 * @todo Copy plotOptions.pie.dataLabels.connectorPadding docs to actual source code
 * @apioption plotOptions.pie.dataLabels.connectorPadding
 */

/**
 * The width of the line connecting the data label to the pie slice.
 * 
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the connector stroke width is given in the `.
 * highcharts-data-label-connector` class.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorwidth-disabled/ Disable the connector
 * @sample {highcharts} highcharts/css/pie-point/ Styled connectors
 * @default {all} 1
 * @since 2.1
 * @product highcharts
 * @todo Copy plotOptions.pie.dataLabels.connectorWidth docs to actual source code
 * @apioption plotOptions.pie.dataLabels.connectorWidth
 */

/**
 * Whether to render the connector as a soft arc or a line with sharp
 * break.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-true/ Soft
 * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-false/ Non soft
 * @since 2.1.7
 * @product highcharts
 * @todo Copy plotOptions.pie.dataLabels.softConnector docs to actual source code
 * @apioption plotOptions.pie.dataLabels.softConnector
 */

/**
 * @extends plotOptions.series.events
 * @product highcharts
 * @todo Copy plotOptions.pie.events docs to actual source code
 * @apioption plotOptions.pie.events
 */

/**
 * Fires when the checkbox next to the point name in the legend is clicked.
 * One parameter, event, is passed to the function. The state of the
 * checkbox is found by event.checked. The checked item is found by
 * event.item. Return false to prevent the default action which is to
 * toggle the select state of the series.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-events-checkboxclick/ Alert checkbox status
 * @since 1.2.0
 * @product highcharts
 * @todo Copy plotOptions.pie.events.checkboxClick docs to actual source code
 * @apioption plotOptions.pie.events.checkboxClick
 */

/**
 * Not applicable to pies, as the legend item is per point. See point.
 * events.
 * 
 * @type {Function}
 * @since 1.2.0
 * @product highcharts
 * @todo Copy plotOptions.pie.events.legendItemClick docs to actual source code
 * @apioption plotOptions.pie.events.legendItemClick
 */

/**
 * @extends plotOptions.series.point.events
 * @product highcharts
 * @todo Copy plotOptions.pie.point.events docs to actual source code
 * @apioption plotOptions.pie.point.events
 */

/**
 * Fires when the legend item belonging to the pie point (slice) is
 * clicked. The `this` keyword refers to the point itself. One parameter,
 * `event`, is passed to the function. This contains common event information
 * based on jQuery or MooTools depending on which library is used as
 * the base for Highcharts. The default action is to toggle the visibility
 * of the point. This can be prevented by calling `event.preventDefault()`.
 * 
 * @type {Function}
 * @sample {highcharts} highcharts/plotoptions/pie-point-events-legenditemclick/ Confirm toggle visibility
 * @since 1.2.0
 * @product highcharts
 * @todo Copy plotOptions.pie.point.events.legendItemClick docs to actual source code
 * @apioption plotOptions.pie.point.events.legendItemClick
 */

/**
 * A polygon series can be used to draw any freeform shape in the cartesian
 * coordinate system. A fill is applied with the `color` option, and
 * stroke is applied through `lineWidth` and `lineColor` options. Requires
 * the `highcharts-more.js` file.
 * 
 * @type {Object}
 * @extends plotOptions.scatter
 * @excluding softThreshold,threshold
 * @sample {highcharts} highcharts/demo/polygon/ Polygon
 * @sample {highstock} highcharts/demo/polygon/ Polygon
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.polygon docs to actual source code
 * @apioption plotOptions.polygon
 */

/**
 * Sticky tracking of mouse events. When true, the `mouseOut` event
 * on a series isn't triggered until the mouse moves over another series,
 * or out of the plot area. When false, the `mouseOut` event on a series
 * is triggered when the mouse leaves the area around the series' graph
 * or markers. This also implies the tooltip. When `stickyTracking`
 * is false and `tooltip.shared` is false, the tooltip will be hidden
 * when moving the mouse between series.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highcharts highstock
 * @todo Copy plotOptions.scatter.stickyTracking docs to actual source code
 * @apioption plotOptions.scatter.stickyTracking
 */

/**
 * @extends plotOptions.series.states.hover
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.scatter.states.hover docs to actual source code
 * @apioption plotOptions.scatter.states.hover
 */

/**
 * The width of the line connecting the data points.
 * 
 * @type {Number}
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.scatter.states.hover.lineWidth docs to actual source code
 * @apioption plotOptions.scatter.states.hover.lineWidth
 */

/**
 * For some series, there is a limit that shuts down initial animation
 * by default when the total number of points in the chart is too high.
 * For example, for a column chart and its derivatives, animation doesn't
 * run if there is more than 250 points totally. To disable this cap,
 *  set `animationLimit` to `Infinity`.
 * 
 * @type {Number}
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.animationLimit docs to actual source code
 * @apioption plotOptions.series.animationLimit
 */

/**
 * A class name to apply to the series' graphical elements.
 * 
 * @type {String}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.className docs to actual source code
 * @apioption plotOptions.series.className
 */

/**
 * The main color or the series. In line type series it applies to the
 * line and the point markers unless otherwise specified. In bar type
 * series it applies to the bars unless a color is specified per point.
 * The default value is pulled from the `options.colors` array.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the color can be defined by the [colorIndex](#plotOptions.
 * series.colorIndex) option. Also, the series color can be set with
 * the `.highcharts-series`, `.highcharts-color-{n}`, `.highcharts-{type}-
 * series` or `.highcharts-series-{n}` class, or individual classes
 * given by the `className` option.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/series-color-general/ General plot option
 * @sample {highcharts} highcharts/plotoptions/series-color-specific/ One specific series
 * @sample {highcharts} highcharts/plotoptions/series-color-area/ Area color
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/category-map/ Category map by multiple series
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.color docs to actual source code
 * @apioption plotOptions.series.color
 */

/**
 * [Styled mode](http://www.highcharts.com/docs/chart-design-and-style/style-
 * by-css) only. A specific color index to use for the series, so its
 * graphic representations are given the class name `highcharts-color-
 * {n}`.
 * 
 * @type {Number}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.colorIndex docs to actual source code
 * @apioption plotOptions.series.colorIndex
 */

/**
 * Polar charts only. Whether to connect the ends of a line series plot
 * across the extremes.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/line-connectends-false/ Do not connect
 * @since 2.3.0
 * @product highcharts
 * @todo Copy plotOptions.series.connectEnds docs to actual source code
 * @apioption plotOptions.series.connectEnds
 */

/**
 * Whether to connect a graph line across null points.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-connectnulls-false/ False by default
 * @sample {highcharts} highcharts/plotoptions/series-connectnulls-true/ True
 * @product highcharts highstock
 * @todo Copy plotOptions.series.connectNulls docs to actual source code
 * @apioption plotOptions.series.connectNulls
 */

/**
 * You can set the cursor to "pointer" if you have click events attached
 * to the series, to signal to the user that the points and lines can
 * be clicked.
 * 
 * @validvalue [null, "default", "none", "help", "pointer", "crosshair"]
 * @type {String}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the series cursor can be set with the same classes
 * as listed under [series.color](#plotOptions.series.color).
 * @sample {highcharts} highcharts/plotoptions/series-cursor-line/ On line graph
 * @sample {highcharts} highcharts/plotoptions/series-cursor-column/ On columns
 * @sample {highcharts} highcharts/plotoptions/series-cursor-scatter/ On scatter markers
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/cursor/ Pointer on a line graph
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-allowpointselect/ Map area
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/mapbubble-allowpointselect/ Map bubble
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.cursor docs to actual source code
 * @apioption plotOptions.series.cursor
 */

/**
 * A name for the dash style to use for the graph. Applies only to series
 * type having a graph, like `line`, `spline`, `area` and `scatter`
 * in case it has a `lineWidth`. The value for the `dashStyle` include:
 * 
 * *   Solid
 * *   ShortDash
 * *   ShortDot
 * *   ShortDashDot
 * *   ShortDashDotDot
 * *   Dot
 * *   Dash
 * *   LongDash
 * *   DashDot
 * *   LongDashDot
 * *   LongDashDotDot
 * 
 * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
 * @type {String}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the [stroke dash-array](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-
 * dashstyle/) can be set with the same classes as listed under [series.
 * color](#plotOptions.series.color).
 * @sample {highcharts} highcharts/plotoptions/series-dashstyle-all/ Possible values demonstrated
 * @sample {highcharts} highcharts/plotoptions/series-dashstyle/ Chart suitable for printing in black and white
 * @sample {highstock} highcharts/plotoptions/series-dashstyle-all/ Possible values demonstrated
 * @sample {highmaps} highcharts/plotoptions/series-dashstyle-all/ Possible values demonstrated
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-dashstyle/ Dotted borders on a map
 * @default {all} Solid
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dashStyle docs to actual source code
 * @apioption plotOptions.series.dashStyle
 */

/**
 * _Requires Accessibility module_
 * 
 * A description of the series to add to the screen reader information
 * about the series.
 * 
 * @type {String}
 * @default {all} undefined
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.description docs to actual source code
 * @apioption plotOptions.series.description
 */

/**
 * Enable or disable the mouse tracking for a specific series. This
 * includes point tooltips and click events on graphs and points. For
 * large datasets it improves performance.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-enablemousetracking-false/ No mouse tracking
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-enablemousetracking-false/ No mouse tracking
 * @default {all} true
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.enableMouseTracking docs to actual source code
 * @apioption plotOptions.series.enableMouseTracking
 */

/**
 * By default, series are exposed to screen readers as regions. By enabling
 * this option, the series element itself will be exposed in the same
 * way as the data points. This is useful if the series is not used
 * as a grouping entity in the chart, but you still want to attach a
 * description to the series.
 * 
 * Requires the Accessibility module.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/accessibility/art-grants/ Accessible data visualization
 * @sample {highstock} highcharts/accessibility/art-grants/ Accessible data visualization
 * @sample {highmaps} highcharts/accessibility/art-grants/ Accessible data visualization
 * @default {all} undefined
 * @since 5.0.12
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.exposeElementToA11y docs to actual source code
 * @apioption plotOptions.series.exposeElementToA11y
 */

/**
 * Whether to use the Y extremes of the total chart width or only the
 * zoomed area when zooming in on parts of the X axis. By default, the
 * Y axis adjusts to the min and max of the visible data. Cartesian
 * series only.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 4.1.6
 * @product highcharts highstock
 * @todo Copy plotOptions.series.getExtremesFromAll docs to actual source code
 * @apioption plotOptions.series.getExtremesFromAll
 */

/**
 * An array specifying which option maps to which key in the data point
 * array. This makes it convenient to work with unstructured data arrays
 * from different sources.
 * 
 * @type {Array<String>}
 * @see [series.data](#series<line>.data)
 * @sample {highcharts} highcharts/series/data-keys/ An extended data array with keys
 * @sample {highstock} highcharts/series/data-keys/ An extended data array with keys
 * @since 4.1.6
 * @product highcharts highstock
 * @todo Copy plotOptions.series.keys docs to actual source code
 * @apioption plotOptions.series.keys
 */

/**
 * The line cap used for line ends and line joins on the graph.
 * 
 * @validvalue ["round", "square"]
 * @type {String}
 * @default {all} round
 * @product highcharts highstock
 * @todo Copy plotOptions.series.linecap docs to actual source code
 * @apioption plotOptions.series.linecap
 */

/**
 * The [id](#series.id) of another series to link to. Additionally,
 * the value can be ":previous" to link to the previous series. When
 * two series are linked, only the first one appears in the legend.
 * Toggling the visibility of this also toggles the linked series.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/demo/arearange-line/ Linked series
 * @sample {highstock} highcharts/demo/arearange-line/ Linked series
 * @since 3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.linkedTo docs to actual source code
 * @apioption plotOptions.series.linkedTo
 */

/**
 * The color for the parts of the graph or points that are below the
 * [threshold](#plotOptions.series.threshold).
 * 
 * @type {Color}
 * @see In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), a negative color is applied by setting this
 * option to `true` combined with the `.highcharts-negative` class name
 * ([view live demo](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/series-
 * negative-color/)).
 * @sample {highcharts} highcharts/plotoptions/series-negative-color/ Spline, area and column
 * @sample {highcharts} highcharts/plotoptions/arearange-negativecolor/ Arearange
 * @sample {highstock} highcharts/plotoptions/series-negative-color/ Spline, area and column
 * @sample {highstock} highcharts/plotoptions/arearange-negativecolor/ Arearange
 * @sample {highmaps} highcharts/plotoptions/series-negative-color/ Spline, area and column
 * @sample {highmaps} highcharts/plotoptions/arearange-negativecolor/ Arearange
 * @default {all} null
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.negativeColor docs to actual source code
 * @apioption plotOptions.series.negativeColor
 */

/**
 * Same as [accessibility.pointDescriptionFormatter](#accessibility.
 * pointDescriptionFormatter), but for an individual series. Overrides
 * the chart wide configuration.
 * 
 * @type {Function}
 * @since 5.0.12
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.pointDescriptionFormatter docs to actual source code
 * @apioption plotOptions.series.pointDescriptionFormatter
 */

/**
 * If no x values are given for the points in a series, pointInterval
 * defines the interval of the x values. For example, if a series contains
 * one value every decade starting from year 0, set pointInterval to
 * 10.
 * 
 * Since Highcharts 4.1, it can be combined with `pointIntervalUnit`
 * to draw irregular intervals.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-pointstart-datetime/ Datetime X axis
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/pointinterval-pointstart/ Using pointStart and pointInterval
 * @default {all} 1
 * @product highcharts highstock
 * @todo Copy plotOptions.series.pointInterval docs to actual source code
 * @apioption plotOptions.series.pointInterval
 */

/**
 * On datetime series, this allows for setting the [pointInterval](#plotOptions.
 * series.pointInterval) to irregular time units, `day`, `month` and
 * `year`. A day is usually the same as 24 hours, but pointIntervalUnit
 * also takes the DST crossover into consideration when dealing with
 * local time. Combine this option with `pointInterval` to draw weeks,
 *  quarters, 6 months, 10 years etc.
 * 
 * @validvalue [null, "day", "month", "year"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/series-pointintervalunit/ One point a month
 * @sample {highstock} highcharts/plotoptions/series-pointintervalunit/ One point a month
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.pointIntervalUnit docs to actual source code
 * @apioption plotOptions.series.pointIntervalUnit
 */

/**
 * Possible values: `null`, `"on"`, `"between"`.
 * 
 * In a column chart, when pointPlacement is `"on"`, the point will
 * not create any padding of the X axis. In a polar column chart this
 * means that the first column points directly north. If the pointPlacement
 * is `"between"`, the columns will be laid out between ticks. This
 * is useful for example for visualising an amount between two points
 * in time or in a certain sector of a polar chart.
 * 
 * Since Highcharts 3.0.2, the point placement can also be numeric,
 * where 0 is on the axis value, -0.5 is between this value and the
 * previous, and 0.5 is between this value and the next. Unlike the
 * textual options, numeric point placement options won't affect axis
 * padding.
 * 
 * Note that pointPlacement needs a [pointRange](#plotOptions.series.
 * pointRange) to work. For column series this is computed, but for
 * line-type series it needs to be set.
 * 
 * Defaults to `null` in cartesian charts, `"between"` in polar charts.
 * 
 * @validvalue [null, "on", "between"]
 * @type {String|Number}
 * @see [xAxis.tickmarkPlacement](#xAxis.tickmarkPlacement)
 * @sample {highcharts} highcharts/plotoptions/series-pointplacement-between/ Between in a column chart
 * @sample {highcharts} highcharts/plotoptions/series-pointplacement-numeric/ Numeric placement for custom layout
 * @sample {highstock} highcharts/plotoptions/series-pointplacement-between/ Between in a column chart
 * @sample {highstock} highcharts/plotoptions/series-pointplacement-numeric/ Numeric placement for custom layout
 * @default {all} null
 * @since 2.3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.pointPlacement docs to actual source code
 * @apioption plotOptions.series.pointPlacement
 */

/**
 * If no x values are given for the points in a series, pointStart defines
 * on what value to start. For example, if a series contains one yearly
 * value starting from 1945, set pointStart to 1945.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-pointstart-linear/ Linear
 * @sample {highcharts} highcharts/plotoptions/series-pointstart-datetime/ Datetime
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/pointinterval-pointstart/ Using pointStart and pointInterval
 * @default {all} 0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.pointStart docs to actual source code
 * @apioption plotOptions.series.pointStart
 */

/**
 * Whether to select the series initially. If `showCheckbox` is true,
 * the checkbox next to the series name will be checked for a selected
 * series.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-selected/ One out of two series selected
 * @default {all} false
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.selected docs to actual source code
 * @apioption plotOptions.series.selected
 */

/**
 * Whether to apply a drop shadow to the graph line. Since 2.3 the shadow
 * can be an object configuration containing `color`, `offsetX`, `offsetY`,
 *  `opacity` and `width`.
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/plotoptions/series-shadow/ Shadow enabled
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.shadow docs to actual source code
 * @apioption plotOptions.series.shadow
 */

/**
 * Whether to display this particular series or series type in the legend.
 * The default value is `true` for standalone series, `false` for linked
 * series.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-showinlegend/ One series in the legend, one hidden
 * @default {all} true
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.showInLegend docs to actual source code
 * @apioption plotOptions.series.showInLegend
 */

/**
 * If set to `True`, the accessibility module will skip past the points
 * in this series for keyboard navigation.
 * 
 * @type {Boolean}
 * @since 5.0.12
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.skipKeyboardNavigation docs to actual source code
 * @apioption plotOptions.series.skipKeyboardNavigation
 */

/**
 * Whether to stack the values of each series on top of each other.
 * Possible values are null to disable, "normal" to stack by value or
 * "percent". When stacking is enabled, data must be sorted in ascending
 * X order.
 * 
 * @validvalue [null, "normal", "percent"]
 * @type {String}
 * @see [yAxis.reversedStacks](#yAxis.reversedStacks)
 * @sample {highcharts} highcharts/plotoptions/series-stacking-line/ Line
 * @sample {highcharts} highcharts/plotoptions/series-stacking-column/ Column
 * @sample {highcharts} highcharts/plotoptions/series-stacking-bar/ Bar
 * @sample {highcharts} highcharts/plotoptions/series-stacking-area/ Area
 * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-line/ Line
 * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-column/ Column
 * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-bar/ Bar
 * @sample {highcharts} highcharts/plotoptions/series-stacking-percent-area/ Area
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/stacking/ Area
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy plotOptions.series.stacking docs to actual source code
 * @apioption plotOptions.series.stacking
 */

/**
 * Whether to apply steps to the line. Possible values are `left`, `center`
 * and `right`. Prior to 2.3.5, only `left` was supported.
 * 
 * @validvalue [null, "left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/line-step/ Different step line options
 * @sample {highcharts} highcharts/plotoptions/area-step/ Stepped, stacked area
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/line-step/ Step line
 * @default {highcharts} null
 * @default {highstock} false
 * @since 1.2.5
 * @product highcharts highstock
 * @todo Copy plotOptions.series.step docs to actual source code
 * @apioption plotOptions.series.step
 */

/**
 * The threshold, also called zero level or base level. For line type
 * series this is only used in conjunction with [negativeColor](#plotOptions.
 * series.negativeColor).
 * 
 * @type {Number}
 * @see [softThreshold](#plotOptions.series.softThreshold).
 * @default {all} 0
 * @since 3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.threshold docs to actual source code
 * @apioption plotOptions.series.threshold
 */

/**
 * Set the initial visibility of the series.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-visible/ Two series, one hidden and one visible
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-visibility/ Hidden series
 * @default {all} true
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.visible docs to actual source code
 * @apioption plotOptions.series.visible
 */

/**
 * Defines the Axis on which the zones are applied.
 * 
 * @type {String}
 * @see [zones](#plotOption.series.zones)
 * @sample {highcharts} highcharts/series/color-zones-zoneaxis-x/ Zones on the X-Axis
 * @sample {highstock} highcharts/series/color-zones-zoneaxis-x/ Zones on the X-Axis
 * @default {all} y
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.zoneAxis docs to actual source code
 * @apioption plotOptions.series.zoneAxis
 */

/**
 * Whether to allow data labels to overlap. To make the labels less
 * sensitive for overlapping, the [dataLabels.padding](#plotOptions.
 * series.dataLabels.padding) can be set to 0.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-allowoverlap-false/ Don't allow overlap
 * @sample {highstock} highcharts/plotoptions/series-datalabels-allowoverlap-false/ Don't allow overlap
 * @sample {highmaps} highcharts/plotoptions/series-datalabels-allowoverlap-false/ Don't allow overlap
 * @default {all} false
 * @since 4.1.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.allowOverlap docs to actual source code
 * @apioption plotOptions.series.dataLabels.allowOverlap
 */

/**
 * The background color or gradient for the data label. Defaults to
 * `undefined`.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-datalabels-box/ Data labels box options
 * @since 2.2.1
 * @product highcharts highmaps
 * @todo Copy plotOptions.series.dataLabels.backgroundColor docs to actual source code
 * @apioption plotOptions.series.dataLabels.backgroundColor
 */

/**
 * The border color for the data label. Defaults to `undefined`.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @sample {highstock} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @default {all} undefined
 * @since 2.2.1
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.borderColor docs to actual source code
 * @apioption plotOptions.series.dataLabels.borderColor
 */

/**
 * The border radius in pixels for the data label.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @sample {highstock} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-datalabels-box/ Data labels box options
 * @default {all} 0
 * @since 2.2.1
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.borderRadius docs to actual source code
 * @apioption plotOptions.series.dataLabels.borderRadius
 */

/**
 * The border width in pixels for the data label.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @sample {highstock} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @default {all} 0
 * @since 2.2.1
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.borderWidth docs to actual source code
 * @apioption plotOptions.series.dataLabels.borderWidth
 */

/**
 * A class name for the data label. Particularly in [styled mode](http://www.
 * highcharts.com/docs/chart-design-and-style/style-by-css), this can
 * be used to give each series' or point's data label unique styling.
 * In addition to this option, a default color class name is added
 * so that we can give the labels a [contrast text shadow](http://jsfiddle.
 * net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/data-
 * label-contrast/).
 * 
 * @type {String}
 * @sample {highcharts} highcharts/css/series-datalabels/ Styling by CSS
 * @sample {highstock} highcharts/css/series-datalabels/ Styling by CSS
 * @sample {highmaps} highcharts/css/series-datalabels/ Styling by CSS
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.className docs to actual source code
 * @apioption plotOptions.series.dataLabels.className
 */

/**
 * The text color for the data labels. Defaults to `null`.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-color/ Red data labels
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/color-axis/ White data labels
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.color docs to actual source code
 * @apioption plotOptions.series.dataLabels.color
 */

/**
 * Whether to hide data labels that are outside the plot area. By default,
 * the data label is moved inside the plot area according to the [overflow](#plotOptions.
 * series.dataLabels.overflow) option.
 * 
 * @type {Boolean}
 * @default {all} true
 * @since 2.3.3
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.crop docs to actual source code
 * @apioption plotOptions.series.dataLabels.crop
 */

/**
 * Whether to defer displaying the data labels until the initial series
 * animation has finished.
 * 
 * @type {Boolean}
 * @default {all} true
 * @since 4.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.dataLabels.defer docs to actual source code
 * @apioption plotOptions.series.dataLabels.defer
 */

/**
 * Enable or disable the data labels.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-enabled/ Data labels enabled
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/color-axis/ Data labels enabled
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.enabled docs to actual source code
 * @apioption plotOptions.series.dataLabels.enabled
 */

/**
 * A [format string](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting) for the data label. Available variables are
 * the same as for `formatter`.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-format/ Add a unit
 * @sample {highstock} highcharts/plotoptions/series-datalabels-format/ Add a unit
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-datalabels-format/ Formatted value in the data label
 * @default {highcharts} {y}
 * @default {highstock} {y}
 * @default {highmaps} {point.value}
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.format docs to actual source code
 * @apioption plotOptions.series.dataLabels.format
 */

/**
 * For points with an extent, like columns, whether to align the data
 * label inside the box or to the actual value point. Defaults to `false`
 * in most cases, `true` in stacked columns.
 * 
 * @type {Boolean}
 * @since 3.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.dataLabels.inside docs to actual source code
 * @apioption plotOptions.series.dataLabels.inside
 */

/**
 * How to handle data labels that flow outside the plot area. The default
 * is `justify`, which aligns them inside the plot area. For columns
 * and bars, this means it will be moved inside the bar. To display
 * data labels outside the plot area, set `crop` to `false` and `overflow`
 * to `"none"`.
 * 
 * @validvalue ["justify", "none"]
 * @type {String}
 * @default {all} justify
 * @since 3.0.6
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.overflow docs to actual source code
 * @apioption plotOptions.series.dataLabels.overflow
 */

/**
 * Text rotation in degrees. Note that due to a more complex structure,
 * backgrounds, borders and padding will be lost on a rotated data
 * label.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-rotation/ Vertical labels
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.rotation docs to actual source code
 * @apioption plotOptions.series.dataLabels.rotation
 */

/**
 * The shadow of the box. Works best with `borderWidth` or `backgroundColor`.
 * Since 2.3 the shadow can be an object configuration containing `color`,
 *  `offsetX`, `offsetY`, `opacity` and `width`.
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @sample {highstock} highcharts/plotoptions/series-datalabels-box/ Data labels box options
 * @default {all} false
 * @since 2.2.1
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.shadow docs to actual source code
 * @apioption plotOptions.series.dataLabels.shadow
 */

/**
 * The name of a symbol to use for the border around the label. Symbols
 * are predefined functions on the Renderer object.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/series-datalabels-shape/ A callout for annotations
 * @sample {highstock} highcharts/plotoptions/series-datalabels-shape/ A callout for annotations
 * @sample {highmaps} highcharts/plotoptions/series-datalabels-shape/ A callout for annotations (Highcharts demo)
 * @default {all} square
 * @since 4.1.2
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.shape docs to actual source code
 * @apioption plotOptions.series.dataLabels.shape
 */

/**
 * n/a for data labels
 * 
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.staggerLines docs to actual source code
 * @apioption plotOptions.series.dataLabels.staggerLines
 */

/**
 * n/a for data labels
 * 
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.step docs to actual source code
 * @apioption plotOptions.series.dataLabels.step
 */

/**
 * The Z index of the data labels. The default Z index puts it above
 * the series. Use a Z index of 2 to display it behind the series.
 * 
 * @type {Number}
 * @default {all} 6
 * @since 2.3.5
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.dataLabels.zIndex docs to actual source code
 * @apioption plotOptions.series.dataLabels.zIndex
 */

/**
 * Fires after the series has finished its initial animation, or in
 * case animation is disabled, immediately as the series is displayed.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-afteranimate/ Show label after animate
 * @sample {highstock} highcharts/plotoptions/series-events-afteranimate/ Show label after animate
 * @since 4.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.events.afterAnimate docs to actual source code
 * @apioption plotOptions.series.events.afterAnimate
 */

/**
 * Fires when the checkbox next to the series' name in the legend is
 * clicked. One parameter, `event`, is passed to the function. The state
 * of the checkbox is found by `event.checked`. The checked item is
 * found by `event.item`. Return `false` to prevent the default action
 * which is to toggle the select state of the series.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-checkboxclick/ Alert checkbox status
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.events.checkboxClick docs to actual source code
 * @apioption plotOptions.series.events.checkboxClick
 */

/**
 * Fires when the series is clicked. One parameter, `event`, is passed
 * to the function. This contains common event information based on
 * jQuery or MooTools depending on which library is used as the base
 * for Highcharts. Additionally, `event.point` holds a pointer to the
 * nearest point on the graph.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-click/ Alert click info
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-events-click/ Alert click info
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-events-click/ Display click info in subtitle
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.events.click docs to actual source code
 * @apioption plotOptions.series.events.click
 */

/**
 * Fires when the series is hidden after chart generation time, either
 * by clicking the legend item or by calling `.hide()`.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-hide/ Alert when the series is hidden by clicking     the legend item
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.events.hide docs to actual source code
 * @apioption plotOptions.series.events.hide
 */

/**
 * Fires when the legend item belonging to the series is clicked. One
 * parameter, `event`, is passed to the function. The default action
 * is to toggle the visibility of the series. This can be prevented
 * by returning `false` or calling `event.preventDefault()`.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-legenditemclick/ Confirm hiding and showing
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.events.legendItemClick docs to actual source code
 * @apioption plotOptions.series.events.legendItemClick
 */

/**
 * Fires when the mouse leaves the graph. One parameter, `event`, is
 * passed to the function. This contains common event information based
 * on jQuery or MooTools depending on which library is used as the base
 * for Highcharts. If the [stickyTracking](#plotOptions.series) option
 * is true, `mouseOut` doesn't happen before the mouse enters another
 * graph or leaves the plot area.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/ With sticky tracking    by default
 * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/ Without sticky tracking
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.events.mouseOut docs to actual source code
 * @apioption plotOptions.series.events.mouseOut
 */

/**
 * Fires when the mouse enters the graph. One parameter, `event`, is
 * passed to the function. This contains common event information based
 * on jQuery or MooTools depending on which library is used as the base
 * for Highcharts.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-sticky/ With sticky tracking    by default
 * @sample {highcharts} highcharts/plotoptions/series-events-mouseover-no-sticky/ Without sticky tracking
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.events.mouseOver docs to actual source code
 * @apioption plotOptions.series.events.mouseOver
 */

/**
 * Fires when the series is shown after chart generation time, either
 * by clicking the legend item or by calling `.show()`.
 * 
 * @type {Function}
 * @context Series
 * @sample {highcharts} highcharts/plotoptions/series-events-show/ Alert when the series is shown by clicking     the legend item.
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.events.show docs to actual source code
 * @apioption plotOptions.series.events.show
 */

/**
 * Enable or disable the point marker. If `null`, the markers are hidden
 * when the data is dense, and shown for more widespread data points.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-marker-enabled/ Disabled markers
 * @sample {highcharts} highcharts/plotoptions/series-marker-enabled-false/ Disabled in normal state but enabled on hover
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-marker/ Enabled markers
 * @default {highcharts} null
 * @default {highstock} false
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.enabled docs to actual source code
 * @apioption plotOptions.series.marker.enabled
 */

/**
 * The fill color of the point marker. When `null`, the series' or point's
 * color is used.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/series-marker-fillcolor/ White fill
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.fillColor docs to actual source code
 * @apioption plotOptions.series.marker.fillColor
 */

/**
 * Image markers only. Set the image width explicitly. When using this
 * option, a `width` must also be set.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-marker-width-height/ Fixed width and height
 * @sample {highstock} highcharts/plotoptions/series-marker-width-height/ Fixed width and height
 * @default {all} null
 * @since 4.0.4
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.height docs to actual source code
 * @apioption plotOptions.series.marker.height
 */

/**
 * A predefined shape or symbol for the marker. When null, the symbol
 * is pulled from options.symbols. Other possible values are "circle",
 * "square", "diamond", "triangle" and "triangle-down".
 * 
 * Additionally, the URL to a graphic can be given on this form: "url(graphic.
 * png)". Note that for the image to be applied to exported charts,
 * its URL needs to be accessible by the export server.
 * 
 * Custom callbacks for symbol path generation can also be added to
 * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
 * used by its method name, as shown in the demo.
 * 
 * @validvalue [null, "circle", "square", "diamond", "triangle", "triangle-down"]
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/ Predefined, graphic and custom markers
 * @sample {highstock} highcharts/plotoptions/series-marker-symbol/ Predefined, graphic and custom markers
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.symbol docs to actual source code
 * @apioption plotOptions.series.marker.symbol
 */

/**
 * Image markers only. Set the image width explicitly. When using this
 * option, a `height` must also be set.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-marker-width-height/ Fixed width and height
 * @sample {highstock} highcharts/plotoptions/series-marker-width-height/ Fixed width and height
 * @default {all} null
 * @since 4.0.4
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.width docs to actual source code
 * @apioption plotOptions.series.marker.width
 */

/**
 * The fill color of the marker in hover state.
 * 
 * @type {Color}
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.states.hover.fillColor docs to actual source code
 * @apioption plotOptions.series.marker.states.hover.fillColor
 */

/**
 * The color of the point marker's outline. When `null`, the series'
 * or point's color is used.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-linecolor/ White fill color, black line color
 * @default {all} #ffffff
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.states.hover.lineColor docs to actual source code
 * @apioption plotOptions.series.marker.states.hover.lineColor
 */

/**
 * The width of the point marker's outline.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-linewidth/ 3px line width
 * @default {all} 0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.states.hover.lineWidth docs to actual source code
 * @apioption plotOptions.series.marker.states.hover.lineWidth
 */

/**
 * The radius of the point marker. In hover state, it defaults to the
 * normal state's radius + 2 as per the [radiusPlus](#plotOptions.series.
 * marker.states.hover.radiusPlus) option.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-radius/ 10px radius
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.states.hover.radius docs to actual source code
 * @apioption plotOptions.series.marker.states.hover.radius
 */

/**
 * Enable or disable visible feedback for selection.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-enabled/ Disabled select state
 * @default {all} true
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.states.select.enabled docs to actual source code
 * @apioption plotOptions.series.marker.states.select.enabled
 */

/**
 * The radius of the point marker. In hover state, it defaults to the
 * normal state's radius + 2.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-marker-states-select-radius/ 10px radius for selected points
 * @product highcharts highstock
 * @todo Copy plotOptions.series.marker.states.select.radius docs to actual source code
 * @apioption plotOptions.series.marker.states.select.radius
 */

/**
 * Fires when a point is clicked. One parameter, `event`, is passed
 * to the function. This contains common event information based on
 * jQuery or MooTools depending on which library is used as the base
 * for Highcharts.
 * 
 * If the `series.allowPointSelect` option is true, the default action
 * for the point's click event is to toggle the point's select state.
 *  Returning `false` cancels this action.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-point-events-click/ Click marker to alert values
 * @sample {highcharts} highcharts/plotoptions/series-point-events-click-column/ Click column
 * @sample {highcharts} highcharts/plotoptions/series-point-events-click-url/ Go to URL
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-point-events-click/ Click marker to display values
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-point-events-click-url/ Go to URL
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.point.events.click docs to actual source code
 * @apioption plotOptions.series.point.events.click
 */

/**
 * Fires when the mouse leaves the area close to the point. One parameter,
 * `event`, is passed to the function. This contains common event information
 * based on jQuery or MooTools depending on which library is used as
 * the base for Highcharts.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/ Show values in the chart's corner on mouse over
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.point.events.mouseOut docs to actual source code
 * @apioption plotOptions.series.point.events.mouseOut
 */

/**
 * Fires when the mouse enters the area close to the point. One parameter,
 * `event`, is passed to the function. This contains common event information
 * based on jQuery or MooTools depending on which library is used as
 * the base for Highcharts.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-point-events-mouseover/ Show values in the chart's corner on mouse over
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.point.events.mouseOver docs to actual source code
 * @apioption plotOptions.series.point.events.mouseOver
 */

/**
 * Fires when the point is removed using the `.remove()` method. One
 * parameter, `event`, is passed to the function. Returning `false`
 * cancels the operation.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-point-events-remove/ Remove point and confirm
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.point.events.remove docs to actual source code
 * @apioption plotOptions.series.point.events.remove
 */

/**
 * Fires when the point is selected either programmatically or following
 * a click on the point. One parameter, `event`, is passed to the function.
 *  Returning `false` cancels the operation.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-point-events-select/ Report the last selected point
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-allowpointselect/ Report select and unselect
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.point.events.select docs to actual source code
 * @apioption plotOptions.series.point.events.select
 */

/**
 * Fires when the point is unselected either programmatically or following
 * a click on the point. One parameter, `event`, is passed to the function.
 *  Returning `false` cancels the operation.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-point-events-unselect/ Report the last unselected point
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-allowpointselect/ Report select and unselect
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.point.events.unselect docs to actual source code
 * @apioption plotOptions.series.point.events.unselect
 */

/**
 * Fires when the point is updated programmatically through the `.update()`
 * method. One parameter, `event`, is passed to the function. The new
 * point options can be accessed through `event.options`. Returning
 * `false` cancels the operation.
 * 
 * @type {Function}
 * @context Point
 * @sample {highcharts} highcharts/plotoptions/series-point-events-update/ Confirm point updating
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.point.events.update docs to actual source code
 * @apioption plotOptions.series.point.events.update
 */

/**
 * Enable separate styles for the hovered series to visualize that the
 * user hovers either the series itself or the legend. .
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled/ Line
 * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-column/ Column
 * @sample {highcharts} highcharts/plotoptions/series-states-hover-enabled-pie/ Pie
 * @default {all} true
 * @since 1.2
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.states.hover.enabled docs to actual source code
 * @apioption plotOptions.series.states.hover.enabled
 */

/**
 * Pixel with of the graph line.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidth/ 5px line on hover
 * @default {all} 2
 * @product highcharts highstock
 * @todo Copy plotOptions.series.states.hover.lineWidth docs to actual source code
 * @apioption plotOptions.series.states.hover.lineWidth
 */

/**
 * A collection of SVG attributes to override the appearance of the
 * halo, for example `fill`, `stroke` and `stroke-width`.
 * 
 * @type {Object}
 * @since 4.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.states.hover.halo.attributes docs to actual source code
 * @apioption plotOptions.series.states.hover.halo.attributes
 */

/**
 * @product highcharts highstock
 * @todo Copy plotOptions.series.states.hover.marker.states docs to actual source code
 * @apioption plotOptions.series.states.hover.marker.states
 */

/**
 * A configuration object for the tooltip rendering of each single series.
 * Properties are inherited from [tooltip](#tooltip), but only the
 * following properties can be defined on a series level.
 * 
 * @type {Object}
 * @extends tooltip
 * @excluding animation,backgroundColor,borderColor,borderRadius,borderWidth,crosshairs,enabled,formatter,positioner,shadow,shared,shape,snap,style,useHTML
 * @since 2.3
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.tooltip docs to actual source code
 * @apioption plotOptions.series.tooltip
 */

/**
 * An array defining zones within a series. Zones can be applied to
 * the X axis, Y axis or Z axis for bubbles, according to the `zoneAxis`
 * option.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the color zones are styled with the `.highcharts-
 * zone-{n}` class, or custom classed from the `className` option ([view
 * live demo](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/color-
 * zones/)).
 * 
 * @type {Array}
 * @see [zoneAxis](#plotOption.series.zoneAxis)
 * @sample {highcharts} highcharts/series/color-zones-simple/ Color zones
 * @sample {highstock} highcharts/series/color-zones-simple/ Color zones
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.zones docs to actual source code
 * @apioption plotOptions.series.zones
 */

/**
 * [Styled mode](http://www.highcharts.com/docs/chart-design-and-style/style-
 * by-css) only. A custom class name for the zone.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/css/color-zones/ Zones styled by class name
 * @sample {highstock} highcharts/css/color-zones/ Zones styled by class name
 * @sample {highmaps} highcharts/css/color-zones/ Zones styled by class name
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy plotOptions.series.zones.className docs to actual source code
 * @apioption plotOptions.series.zones.className
 */

/**
 * Defines the color of the series.
 * 
 * @type {Color}
 * @see [series color](#plotOption.series.color)
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.zones.color docs to actual source code
 * @apioption plotOptions.series.zones.color
 */

/**
 * A name for the dash style to use for the graph.
 * 
 * @type {String}
 * @see [series.dashStyle](#plotOption.series.dashStyle)
 * @sample {highcharts} highcharts/series/color-zones-dashstyle-dot/ Dashed line indicates prognosis
 * @sample {highstock} highcharts/series/color-zones-dashstyle-dot/ Dashed line indicates prognosis
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.zones.dashStyle docs to actual source code
 * @apioption plotOptions.series.zones.dashStyle
 */

/**
 * Defines the fill color for the series (in area type series)
 * 
 * @type {Color}
 * @see [fillColor](#plotOption.area.fillColor)
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.zones.fillColor docs to actual source code
 * @apioption plotOptions.series.zones.fillColor
 */

/**
 * The value up to where the zone extends, if undefined the zones stretches
 * to the last value in the series.
 * 
 * @type {Number}
 * @default {all} undefined
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy plotOptions.series.zones.value docs to actual source code
 * @apioption plotOptions.series.zones.value
 */

/**
 * Whether the strokes of the solid gauge should be `round` or `square`.
 * 
 * @validvalue ["square", "round"]
 * @type {String}
 * @sample {highcharts} highcharts/demo/gauge-activity/ Rounded gauge
 * @default {all} round
 * @since 4.2.2
 * @product highcharts
 * @todo Copy plotOptions.solidgauge.linecap docs to actual source code
 * @apioption plotOptions.solidgauge.linecap
 */

/**
 * Wether to draw rounded edges on the gauge.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/demo/gauge-activity/ Activity Gauge
 * @default {all} false
 * @since 5.0.8
 * @product highcharts
 * @todo Copy plotOptions.solidgauge.rounded docs to actual source code
 * @apioption plotOptions.solidgauge.rounded
 */

/**
 * The threshold or base level for the gauge.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/solidgauge-threshold/ Zero threshold with negative and positive values
 * @default {all} null
 * @since 5.0.3
 * @product highcharts
 * @todo Copy plotOptions.solidgauge.threshold docs to actual source code
 * @apioption plotOptions.solidgauge.threshold
 */

/**
 * @extends plotOptions.series
 * @excluding step
 * @product highcharts highstock
 * @todo Copy plotOptions.spline docs to actual source code
 * @apioption plotOptions.spline
 */

/**
 * When enabled the user can click on a point which is a parent and
 * zoom in on its children.
 * 
 * @validvalue ["false", "true"]
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/treemap-allowdrilltonode/ Enabled
 * @default {all} false
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.allowDrillToNode docs to actual source code
 * @apioption plotOptions.treemap.allowDrillToNode
 */

/**
 * When the series contains less points than the crop threshold, all
 * points are drawn, event if the points fall outside the visible plot
 * area at the current zoom. The advantage of drawing all points (including
 * markers and columns), is that animation is performed on updates.
 * On the other hand, when the series contains more points than the
 * crop threshold, the series data is cropped to only contain points
 * that fall within the plot area. The advantage of cropping away invisible
 * points is to increase performance on large series.
 * 
 * @type {Number}
 * @default {all} 300
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.cropThreshold docs to actual source code
 * @apioption plotOptions.treemap.cropThreshold
 */

/**
 * This option decides if the user can interact with the parent nodes
 * or just the leaf nodes. When this option is undefined, it will be
 * true by default. However when allowDrillToNode is true, then it will
 * be false by default.
 * 
 * @validvalue false, true
 * @type {Boolean}
 * @sample {highcharts} highcharts/plotoptions/treemap-interactbyleaf-false/ False
 * @sample {highcharts} highcharts/plotoptions/treemap-interactbyleaf-true-and-allowdrilltonode/ InteractByLeaf and allowDrillToNode is true
 * @since 4.1.2
 * @product highcharts
 * @todo Copy plotOptions.treemap.interactByLeaf docs to actual source code
 * @apioption plotOptions.treemap.interactByLeaf
 */

/**
 * The sort index of the point inside the treemap level.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/treemap-sortindex/ Sort by years
 * @since 4.1.10
 * @product highcharts
 * @todo Copy plotOptions.treemap.sortIndex docs to actual source code
 * @apioption plotOptions.treemap.sortIndex
 */

/**
 * Set options on specific levels. Takes precedence over series options,
 *  but not point options.
 * 
 * @type {Array<Object>}
 * @sample {highcharts} highcharts/plotoptions/treemap-levels/ Styling dataLabels and borders
 * @sample {highcharts} highcharts/demo/treemap-with-levels/ Different layoutAlgorithm
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels docs to actual source code
 * @apioption plotOptions.treemap.levels
 */

/**
 * Can set a `borderColor` on all points which lies on the same level.
 * 
 * @type {Color}
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.borderColor docs to actual source code
 * @apioption plotOptions.treemap.levels.borderColor
 */

/**
 * Set the dash style of the border of all the point which lies on the
 * level. See <a href"#plotoptions.scatter.dashstyle"="">plotOptions.
 * scatter.dashStyle</a> for possible options.
 * 
 * @type {String}
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.borderDashStyle docs to actual source code
 * @apioption plotOptions.treemap.levels.borderDashStyle
 */

/**
 * Can set the borderWidth on all points which lies on the same level.
 * 
 * @type {Number}
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.borderWidth docs to actual source code
 * @apioption plotOptions.treemap.levels.borderWidth
 */

/**
 * Can set a color on all points which lies on the same level.
 * 
 * @type {Color}
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.color docs to actual source code
 * @apioption plotOptions.treemap.levels.color
 */

/**
 * Can set the options of dataLabels on each point which lies on the
 * level. [plotOptions.treemap.dataLabels](#plotOptions.treemap.dataLabels)
 * for possible values.
 * 
 * @type {Object}
 * @default {all} undefined
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.dataLabels docs to actual source code
 * @apioption plotOptions.treemap.levels.dataLabels
 */

/**
 * Can set the layoutAlgorithm option on a specific level.
 * 
 * @validvalue ["sliceAndDice", "stripes", "squarified", "strip"]
 * @type {String}
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.layoutAlgorithm docs to actual source code
 * @apioption plotOptions.treemap.levels.layoutAlgorithm
 */

/**
 * Can set the layoutStartingDirection option on a specific level.
 * 
 * @validvalue ["vertical", "horizontal"]
 * @type {String}
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.layoutStartingDirection docs to actual source code
 * @apioption plotOptions.treemap.levels.layoutStartingDirection
 */

/**
 * Decides which level takes effect from the options set in the levels
 * object.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/treemap-levels/ Styling of both levels
 * @since 4.1.0
 * @product highcharts
 * @todo Copy plotOptions.treemap.levels.level docs to actual source code
 * @apioption plotOptions.treemap.levels.level
 */

/**
 * The color used specifically for positive point columns. When not
 * specified, the general series color is used.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the waterfall colors can be set with the `.highcharts-
 * point-negative`, `.highcharts-sum` and `.highcharts-intermediate-
 * sum` classes.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/demo/waterfall/ Waterfall
 * @product highcharts
 * @todo Copy plotOptions.waterfall.upColor docs to actual source code
 * @apioption plotOptions.waterfall.upColor
 */

/**
 * Allows setting a set of rules to apply for different screen or chart
 * sizes. Each rule specifies additional chart options.
 * 
 * @sample {highcharts} highcharts/responsive/axis/ Axis
 * @sample {highcharts} highcharts/responsive/legend/ Legend
 * @sample {highcharts} highcharts/responsive/classname/ Class name
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/responsive/ Stock chart
 * @sample {highstock} highcharts/responsive/axis/ Axis
 * @sample {highstock} highcharts/responsive/legend/ Legend
 * @sample {highstock} highcharts/responsive/classname/ Class name
 * @sample {highmaps} highcharts/responsive/axis/ Axis
 * @sample {highmaps} highcharts/responsive/legend/ Legend
 * @sample {highmaps} highcharts/responsive/classname/ Class name
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive docs to actual source code
 * @apioption responsive
 */

/**
 * A set of rules for responsive settings. The rules are executed from
 * the top down.
 * 
 * @type {Array<Object>}
 * @sample {highcharts} highcharts/responsive/axis/ Axis changes
 * @sample {highstock} highcharts/responsive/axis/ Axis changes
 * @sample {highmaps} highcharts/responsive/axis/ Axis changes
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules docs to actual source code
 * @apioption responsive.rules
 */

/**
 * A full set of chart options to apply as overrides to the general
 * chart options. The chart options are applied when the given rule
 * is active.
 * 
 * A special case is configuration objects that take arrays, for example
 * [xAxis](#xAxis), [yAxis](#yAxis) or [series](#series). For these
 * collections, an `id` option is used to map the new option set to
 * an existing object. If an existing object of the same id is not found,
 * the item of the same indexupdated. So for example, setting `chartOptions`
 * with two series items without an `id`, will cause the existing chart's
 * two series to be updated with respective options.
 * 
 * @type {Object}
 * @sample {highcharts} highcharts/responsive/axis/ Axis
 * @sample {highcharts} highcharts/responsive/legend/ Legend
 * @sample {highcharts} highcharts/responsive/classname/ Class name
 * @sample {highstock} highcharts/responsive/axis/ Axis
 * @sample {highstock} highcharts/responsive/legend/ Legend
 * @sample {highstock} highcharts/responsive/classname/ Class name
 * @sample {highmaps} highcharts/responsive/axis/ Axis
 * @sample {highmaps} highcharts/responsive/legend/ Legend
 * @sample {highmaps} highcharts/responsive/classname/ Class name
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules.chartOptions docs to actual source code
 * @apioption responsive.rules.chartOptions
 */

/**
 * Under which conditions the rule applies.
 * 
 * @type {Object}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules.condition docs to actual source code
 * @apioption responsive.rules.condition
 */

/**
 * A callback function to gain complete control on when the responsive
 * rule applies. Return `true` if it applies. This opens for checking
 * against other metrics than the chart size, or example the document
 * size or other elements.
 * 
 * @type {Function}
 * @context Chart
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules.condition.callback docs to actual source code
 * @apioption responsive.rules.condition.callback
 */

/**
 * The responsive rule applies if the chart height is less than this.
 * 
 * @type {Number}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules.condition.maxHeight docs to actual source code
 * @apioption responsive.rules.condition.maxHeight
 */

/**
 * The responsive rule applies if the chart width is less than this.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/responsive/axis/ Max width is 500
 * @sample {highstock} highcharts/responsive/axis/ Max width is 500
 * @sample {highmaps} highcharts/responsive/axis/ Max width is 500
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules.condition.maxWidth docs to actual source code
 * @apioption responsive.rules.condition.maxWidth
 */

/**
 * The responsive rule applies if the chart height is greater than this.
 * 
 * @type {Number}
 * @default {all} 0
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules.condition.minHeight docs to actual source code
 * @apioption responsive.rules.condition.minHeight
 */

/**
 * The responsive rule applies if the chart width is greater than this.
 * 
 * @type {Number}
 * @default {all} 0
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy responsive.rules.condition.minWidth docs to actual source code
 * @apioption responsive.rules.condition.minWidth
 */

/**
 * This method is deprecated as of version 2.0\. Instead, use options
 * preprocessing as described in [the docs](http://docs.highcharts.com/#preprocessing).
 * 
 * @type {Function}
 * @deprecated
 * @product highcharts
 * @todo Copy series.dataParser docs to actual source code
 * @apioption series.dataParser
 */

/**
 * This method is deprecated as of version 2.0\. Instead, load the data
 * using jQuery.ajax and use options preprocessing as described in [the
 * docs](http://docs.highcharts.com/#preprocessing).
 * 
 * @type {String}
 * @deprecated
 * @product highcharts
 * @todo Copy series.dataURL docs to actual source code
 * @apioption series.dataURL
 */

/**
 * An id for the series. This can be used after render time to get a
 * pointer to the series object through `chart.get()`.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/plotoptions/series-id/ Get series by id
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy series.id docs to actual source code
 * @apioption series.id
 */

/**
 * The index of the series in the chart, affecting the internal index
 * in the `chart.series` array, the visible Z index as well as the order
 * in the legend.
 * 
 * @type {Number}
 * @default {all} undefined
 * @since 2.3.0
 * @product highcharts highstock highmaps
 * @todo Copy series.index docs to actual source code
 * @apioption series.index
 */

/**
 * The sequential index of the series in the legend.
 * 
 * <div class="demo">Try it: [Legend in opposite order](http://jsfiddle.
 * net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series/legendindex/)</div>
 * 
 * .
 * 
 * @type {Number}
 * @see [legend.reversed](#legend.reversed), [yAxis.reversedStacks](#yAxis.
 * reversedStacks)
 * @product highcharts highstock highmaps
 * @todo Copy series.legendIndex docs to actual source code
 * @apioption series.legendIndex
 */

/**
 * The name of the series as shown in the legend, tooltip etc.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/series/name/ Series name
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/category-map/ Series name
 * @product highcharts highstock highmaps
 * @todo Copy series.name docs to actual source code
 * @apioption series.name
 */

/**
 * This option allows grouping series in a stacked chart. The stack
 * option can be a string or a number or anything else, as long as the
 * grouped series' stack options match each other.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/series/stack/ Stacked and grouped columns
 * @default {all} null
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy series.stack docs to actual source code
 * @apioption series.stack
 */

/**
 * The type of series. Can be one of `area`, `areaspline`, `bar`, `column`,
 * `line`, `pie`, `scatter` or `spline`. From version 2.3, `arearange`,
 * `areasplinerange` and `columnrange` are supported with the highcharts-
 * more.js component.
 * 
 * @validvalue [null, "line", "spline", "column", "area", "areaspline", "pie", "arearange", "areasplinerange", "boxplot", "bubble", "columnrange", "errorbar", "funnel", "gauge", "scatter", "waterfall"]
 * @type {String}
 * @sample {highcharts} highcharts/series/type/ Line and column in the same chart
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/mapline-mappoint/ Multiple types in the same map
 * @product highcharts highstock highmaps
 * @todo Copy series.type docs to actual source code
 * @apioption series.type
 */

/**
 * When using dual or multiple x axes, this number defines which xAxis
 * the particular series is connected to. It refers to either the [axis
 * id](#xAxis.id) or the index of the axis in the xAxis array, with
 * 0 being the first.
 * 
 * @type {Number|String}
 * @default {all} 0
 * @product highcharts highstock
 * @todo Copy series.xAxis docs to actual source code
 * @apioption series.xAxis
 */

/**
 * When using dual or multiple y axes, this number defines which yAxis
 * the particular series is connected to. It refers to either the [axis
 * id](#yAxis.id) or the index of the axis in the yAxis array, with
 * 0 being the first.
 * 
 * @type {Number|String}
 * @sample {highcharts} highcharts/series/yaxis/ Apply the column series to the secondary Y axis
 * @default {all} 0
 * @product highcharts highstock
 * @todo Copy series.yAxis docs to actual source code
 * @apioption series.yAxis
 */

/**
 * Define the visual z index of the series.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/plotoptions/series-zindex-default/ With no z index, the series defined last are on top
 * @sample {highcharts} highcharts/plotoptions/series-zindex/ With a z index, the series with the highest z index is on top
 * @sample {highstock} highcharts/plotoptions/series-zindex-default/ With no z index, the series defined last are on top
 * @sample {highstock} highcharts/plotoptions/series-zindex/ With a z index, the series with the highest z index is on top
 * @product highcharts highstock
 * @todo Copy series.zIndex docs to actual source code
 * @apioption series.zIndex
 */

/**
 * An array of data points for the series. The points can be given in
 * three ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as y values, and x values will be automatically
 * calculated, either starting at 0 and incrementing by 1, or from `pointStart`
 * and `pointInterval` given in the plotOptions. If the axis is has
 * categories, these will be used. This option is not available for
 * range series. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with two values. In this case, the first value
 * is the x value and the second is the y value. If the first value
 * is a string, it is applied as the name of the point, and the x value
 * is incremented following the above rules.
 * 
 * For range series, the arrays will be interpreted as `[x, low,
 * high]`. In this cases, the X value can be skipped altogether to
 * make use of `pointStart` and `pointRange`.
 * 
 * Example:
 * 
 * <pre>data: [[5, 2], [6, 3], [8, 2]]</pre>
 * 
 * 3.  An array of objects with named values. In this case the objects
 * are point configuration objects as seen below.
 * 
 * Range series values are given by `low` and `high`.
 * 
 * Example:
 * 
 * <pre>data: [{
 * name: 'Point 1',
 * color: '#00FF00',
 * y: 0
 * }, {
 * name: 'Point 2',
 * color: '#FF00FF',
 * y: 5
 * }]</pre>
 * 
 * Note that line series and derived types like spline and area, require
 * data to be sorted by X because it interpolates mouse coordinates
 * for the tooltip. Column and scatter series, where each point has
 * its own mouse event, does not require sorting.
 * 
 * @type {Array<Object|Array|Number>}
 * @sample {highcharts} highcharts/chart/reflow-true/ 1) Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ 2a) arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ 2b) arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ 2c) arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ 3) config objects
 * @sample {highcharts} highcharts/demo/3d-column-null-values/ 4) 3D column with null values
 * @product highcharts highstock highmaps
 * @todo Copy series.data docs to actual source code
 * @apioption series.data
 */

/**
 * Individual color for the point. By default the color is pulled from
 * the global `colors` array.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/point/color/ Mark the highest point
 * @default {all} undefined
 * @product highcharts highstock
 * @todo Copy series.line.data.color docs to actual source code
 * @apioption series.line.data.color
 */

/**
 * Serves a purpose only if a colorAxis object is defined in the chart
 * options. This value will decide which color the point gets from the
 * scale of the colorAxis.
 * 
 * @type {Number}
 * @default {all} undefined
 * @since 4.1.0
 * @product highcharts
 * @todo Copy series.treemap.data.colorValue docs to actual source code
 * @apioption series.treemap.data.colorValue
 */

/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](#plotOptions.series.
 * dataLabels)
 * 
 * @type {Object}
 * @sample {highcharts} highcharts/point/datalabels/ Show a label for the last value
 * @sample {highstock} highcharts/point/datalabels/ Show a label for the last value
 * @product highcharts highstock
 * @todo Copy series.line.data.dataLabels docs to actual source code
 * @apioption series.line.data.dataLabels
 */

/**
 * The `id` of a series in the [drilldown.series](#drilldown.series)
 * array to use for a drilldown for this point.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/drilldown/basic/ Basic drilldown
 * @since 3.0.8
 * @product highcharts
 * @todo Copy series.line.data.drilldown docs to actual source code
 * @apioption series.line.data.drilldown
 */

/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/point/id/ Remove an id'd point
 * @default {all} null
 * @since 1.2.0
 * @product highcharts highstock
 * @todo Copy series.line.data.id docs to actual source code
 * @apioption series.line.data.id
 */

/**
 * When this property is true, the points acts as a summary column for
 * the values added or substracted since the last intermediate sum,
 * or since the start of the series. The `y` value is ignored.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/demo/waterfall/ Waterfall
 * @default {all} false
 * @product highcharts
 * @todo Copy series.waterfall.data.isIntermediateSum docs to actual source code
 * @apioption series.waterfall.data.isIntermediateSum
 */

/**
 * When this property is true, the point display the total sum across
 * the entire series. The `y` value is ignored.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/demo/waterfall/ Waterfall
 * @default {all} false
 * @product highcharts
 * @todo Copy series.waterfall.data.isSum docs to actual source code
 * @apioption series.waterfall.data.isSum
 */

/**
 * The sequential index of the data point in the legend.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.pie.data.legendIndex docs to actual source code
 * @apioption series.pie.data.legendIndex
 */

/**
 * The name of the point as shown in the legend, tooltip, dataLabel
 * etc.
 * 
 * If the [xAxis.type](#xAxis.type) is set to `category`, and no [categories](#xAxis.
 * categories) option exists, the category will be pulled from the `point.
 * name` of the last series defined. For multiple series, best practice
 * however is to define `xAxis.categories`.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Point names
 * @product highcharts highstock
 * @todo Copy series.line.data.name docs to actual source code
 * @apioption series.line.data.name
 */

/**
 * Only for treemap. Use this option to build a tree structure. The
 * value should be the id of the point which is the parent. If no points
 * has a matching id, or this option is undefined, then the parent will
 * be set to the root.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/point/parent/ Point parent
 * @sample {highcharts} highcharts/demo/treemap-with-levels/ Example where parent id is not matching
 * @default {all} undefined
 * @since 4.1.0
 * @product highcharts
 * @todo Copy series.treemap.data.parent docs to actual source code
 * @apioption series.treemap.data.parent
 */

/**
 * Whether to display a slice offset from the center.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/point/sliced/ One sliced point
 * @product highcharts
 * @todo Copy series.pie.data.sliced docs to actual source code
 * @apioption series.pie.data.sliced
 */

/**
 * The x value of the point. For datetime axes, the X value is the timestamp
 * in milliseconds since 1970.
 * 
 * @type {Number}
 * @product highcharts highstock
 * @todo Copy series.line.data.x docs to actual source code
 * @apioption series.line.data.x
 */

/**
 * The y value of the point.
 * 
 * @type {Number}
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy series.line.data.y docs to actual source code
 * @apioption series.line.data.y
 */

/**
 * Individual point events
 * 
 * @extends plotOptions.series.point.events
 * @product highcharts highstock
 * @todo Copy series.line.data.events docs to actual source code
 * @apioption series.line.data.events
 */

/**
 * @extends plotOptions.series.marker
 * @product highcharts highstock
 * @todo Copy series.line.data.marker docs to actual source code
 * @apioption series.line.data.marker
 */

/**
 * A `area` series. If the [type](#series<area>.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * area](#plotOptions.area).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.area
 * @excluding dataParser,dataURL
 * @product highcharts highstock
 * @todo Copy series.area docs to actual source code
 * @apioption series.area
 */

/**
 * An array of data points for the series. For the `area` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 9],
 * [1, 7],
 * [2, 6]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<area>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 9,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 6,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<line>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.area.data docs to actual source code
 * @apioption series.area.data
 */

/**
 * @extends plotOptions.area.states
 * @product highcharts highstock
 * @todo Copy series.area.data.marker.states docs to actual source code
 * @apioption series.area.data.marker.states
 */

/**
 * @extends plotOptions.area.dataLabels
 * @product highcharts highstock
 * @todo Copy series.area.dataLabels docs to actual source code
 * @apioption series.area.dataLabels
 */

/**
 * @extends plotOptions.area.events
 * @product highcharts highstock
 * @todo Copy series.area.events docs to actual source code
 * @apioption series.area.events
 */

/**
 * @extends plotOptions.area.marker
 * @product highcharts highstock
 * @todo Copy series.area.marker docs to actual source code
 * @apioption series.area.marker
 */

/**
 * @extends plotOptions.area.point
 * @product highcharts highstock
 * @todo Copy series.area.point docs to actual source code
 * @apioption series.area.point
 */

/**
 * @extends plotOptions.area.states
 * @product highcharts highstock
 * @todo Copy series.area.states docs to actual source code
 * @apioption series.area.states
 */

/**
 * @extends plotOptions.area.tooltip
 * @product highcharts highstock
 * @todo Copy series.area.tooltip docs to actual source code
 * @apioption series.area.tooltip
 */

/**
 * @extends plotOptions.area.zones
 * @product highcharts highstock
 * @todo Copy series.area.zones docs to actual source code
 * @apioption series.area.zones
 */

/**
 * A `arearange` series. If the [type](#series<arearange>.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 * 
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * arearange](#plotOptions.arearange).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.arearange
 * @excluding dataParser,dataURL,stack
 * @product highcharts highstock
 * @todo Copy series.arearange docs to actual source code
 * @apioption series.arearange
 */

/**
 * An array of data points for the series. For the `arearange` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,low,high`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 8, 3],
 * [1, 1, 1],
 * [2, 6, 8]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<arearange>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * low: 9,
 * high: 0,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * low: 3,
 * high: 4,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<line>.data
 * @excluding marker,y
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.arearange.data docs to actual source code
 * @apioption series.arearange.data
 */

/**
 * The high or maximum value for each data point.
 * 
 * @type {Number}
 * @product highcharts highstock
 * @todo Copy series.arearange.data.high docs to actual source code
 * @apioption series.arearange.data.high
 */

/**
 * The low or minimum value for each data point.
 * 
 * @type {Number}
 * @product highcharts highstock
 * @todo Copy series.arearange.data.low docs to actual source code
 * @apioption series.arearange.data.low
 */

/**
 * @extends plotOptions.arearange.states
 * @product highcharts highstock
 * @todo Copy series.arearange.data.marker.states docs to actual source code
 * @apioption series.arearange.data.marker.states
 */

/**
 * @extends plotOptions.arearange.dataLabels
 * @product highcharts highstock
 * @todo Copy series.arearange.dataLabels docs to actual source code
 * @apioption series.arearange.dataLabels
 */

/**
 * @extends plotOptions.arearange.events
 * @product highcharts highstock
 * @todo Copy series.arearange.events docs to actual source code
 * @apioption series.arearange.events
 */

/**
 * @extends plotOptions.arearange.marker
 * @product highcharts highstock
 * @todo Copy series.arearange.marker docs to actual source code
 * @apioption series.arearange.marker
 */

/**
 * @extends plotOptions.arearange.point
 * @product highcharts highstock
 * @todo Copy series.arearange.point docs to actual source code
 * @apioption series.arearange.point
 */

/**
 * @extends plotOptions.arearange.states
 * @product highcharts highstock
 * @todo Copy series.arearange.states docs to actual source code
 * @apioption series.arearange.states
 */

/**
 * @extends plotOptions.arearange.tooltip
 * @product highcharts highstock
 * @todo Copy series.arearange.tooltip docs to actual source code
 * @apioption series.arearange.tooltip
 */

/**
 * @extends plotOptions.arearange.zones
 * @product highcharts highstock
 * @todo Copy series.arearange.zones docs to actual source code
 * @apioption series.arearange.zones
 */

/**
 * A `areaspline` series. If the [type](#series<areaspline>.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 * 
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * areaspline](#plotOptions.areaspline).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.areaspline
 * @excluding dataParser,dataURL
 * @product highcharts highstock
 * @todo Copy series.areaspline docs to actual source code
 * @apioption series.areaspline
 */

/**
 * An array of data points for the series. For the `areaspline` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 10],
 * [1, 9],
 * [2, 3]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<areaspline>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 4,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 4,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<line>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.areaspline.data docs to actual source code
 * @apioption series.areaspline.data
 */

/**
 * @extends plotOptions.areaspline.states
 * @product highcharts highstock
 * @todo Copy series.areaspline.data.marker.states docs to actual source code
 * @apioption series.areaspline.data.marker.states
 */

/**
 * @extends plotOptions.areaspline.dataLabels
 * @product highcharts highstock
 * @todo Copy series.areaspline.dataLabels docs to actual source code
 * @apioption series.areaspline.dataLabels
 */

/**
 * @extends plotOptions.areaspline.events
 * @product highcharts highstock
 * @todo Copy series.areaspline.events docs to actual source code
 * @apioption series.areaspline.events
 */

/**
 * @extends plotOptions.areaspline.marker
 * @product highcharts highstock
 * @todo Copy series.areaspline.marker docs to actual source code
 * @apioption series.areaspline.marker
 */

/**
 * @extends plotOptions.areaspline.point
 * @product highcharts highstock
 * @todo Copy series.areaspline.point docs to actual source code
 * @apioption series.areaspline.point
 */

/**
 * @extends plotOptions.areaspline.states
 * @product highcharts highstock
 * @todo Copy series.areaspline.states docs to actual source code
 * @apioption series.areaspline.states
 */

/**
 * @extends plotOptions.areaspline.tooltip
 * @product highcharts highstock
 * @todo Copy series.areaspline.tooltip docs to actual source code
 * @apioption series.areaspline.tooltip
 */

/**
 * @extends plotOptions.areaspline.zones
 * @product highcharts highstock
 * @todo Copy series.areaspline.zones docs to actual source code
 * @apioption series.areaspline.zones
 */

/**
 * A `areasplinerange` series. If the [type](#series<areasplinerange>.
 * type) option is not specified, it is inherited from [chart.type](#chart.
 * type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * areasplinerange](#plotOptions.areasplinerange).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.areasplinerange
 * @excluding dataParser,dataURL,stack
 * @product highcharts highstock
 * @todo Copy series.areasplinerange docs to actual source code
 * @apioption series.areasplinerange
 */

/**
 * An array of data points for the series. For the `areasplinerange`
 * series type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,low,high`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 0, 5],
 * [1, 9, 1],
 * [2, 5, 2]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<areasplinerange>.
 * turboThreshold), this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * low: 5,
 * high: 0,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * low: 4,
 * high: 1,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<arearange>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.data docs to actual source code
 * @apioption series.areasplinerange.data
 */

/**
 * @extends plotOptions.areasplinerange.states
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.data.marker.states docs to actual source code
 * @apioption series.areasplinerange.data.marker.states
 */

/**
 * @extends plotOptions.areasplinerange.dataLabels
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.dataLabels docs to actual source code
 * @apioption series.areasplinerange.dataLabels
 */

/**
 * @extends plotOptions.areasplinerange.events
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.events docs to actual source code
 * @apioption series.areasplinerange.events
 */

/**
 * @extends plotOptions.areasplinerange.marker
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.marker docs to actual source code
 * @apioption series.areasplinerange.marker
 */

/**
 * @extends plotOptions.areasplinerange.point
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.point docs to actual source code
 * @apioption series.areasplinerange.point
 */

/**
 * @extends plotOptions.areasplinerange.states
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.states docs to actual source code
 * @apioption series.areasplinerange.states
 */

/**
 * @extends plotOptions.areasplinerange.tooltip
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.tooltip docs to actual source code
 * @apioption series.areasplinerange.tooltip
 */

/**
 * @extends plotOptions.areasplinerange.zones
 * @product highcharts highstock
 * @todo Copy series.areasplinerange.zones docs to actual source code
 * @apioption series.areasplinerange.zones
 */

/**
 * A `bar` series. If the [type](#series<bar>.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * bar](#plotOptions.bar).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.bar
 * @excluding dataParser,dataURL
 * @product highcharts
 * @todo Copy series.bar docs to actual source code
 * @apioption series.bar
 */

/**
 * An array of data points for the series. For the `bar` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 5],
 * [1, 10],
 * [2, 3]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<bar>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 1,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 10,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<column>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.bar.data docs to actual source code
 * @apioption series.bar.data
 */

/**
 * @extends plotOptions.bar.states
 * @product highcharts
 * @todo Copy series.bar.data.marker.states docs to actual source code
 * @apioption series.bar.data.marker.states
 */

/**
 * @extends plotOptions.bar.dataLabels
 * @product highcharts
 * @todo Copy series.bar.dataLabels docs to actual source code
 * @apioption series.bar.dataLabels
 */

/**
 * @extends plotOptions.bar.events
 * @product highcharts
 * @todo Copy series.bar.events docs to actual source code
 * @apioption series.bar.events
 */

/**
 * @extends plotOptions.bar.marker
 * @product highcharts
 * @todo Copy series.bar.marker docs to actual source code
 * @apioption series.bar.marker
 */

/**
 * @extends plotOptions.bar.point
 * @product highcharts
 * @todo Copy series.bar.point docs to actual source code
 * @apioption series.bar.point
 */

/**
 * @extends plotOptions.bar.states
 * @product highcharts
 * @todo Copy series.bar.states docs to actual source code
 * @apioption series.bar.states
 */

/**
 * @extends plotOptions.bar.tooltip
 * @product highcharts
 * @todo Copy series.bar.tooltip docs to actual source code
 * @apioption series.bar.tooltip
 */

/**
 * @extends plotOptions.bar.zones
 * @product highcharts
 * @todo Copy series.bar.zones docs to actual source code
 * @apioption series.bar.zones
 */

/**
 * A `boxplot` series. If the [type](#series<boxplot>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * boxplot](#plotOptions.boxplot).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.boxplot
 * @excluding dataParser,dataURL,stack
 * @product highcharts
 * @todo Copy series.boxplot docs to actual source code
 * @apioption series.boxplot
 */

/**
 * An array of data points for the series. For the `boxplot` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 6 or 5 values. In this case, the values
 * correspond to `x,low,q1,median,q3,high`. If the first value is a
 * string, it is applied as the name of the point, and the `x` value
 * is inferred. The `x` value can also be omitted, in which case the
 * inner arrays should be of length 5\. Then the `x` value is automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 3, 0, 10, 3, 5],
 * [1, 7, 8, 7, 2, 9],
 * [2, 6, 9, 5, 1, 3]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<boxplot>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * low: 4,
 * q1: 9,
 * median: 9,
 * q3: 1,
 * high: 10,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * low: 5,
 * q1: 7,
 * median: 3,
 * q3: 6,
 * high: 2,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<line>.data
 * @excluding marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.boxplot.data docs to actual source code
 * @apioption series.boxplot.data
 */

/**
 * The `high` value for each data point, signifying the highest value
 * in the sample set. The top whisker is drawn here.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.boxplot.data.high docs to actual source code
 * @apioption series.boxplot.data.high
 */

/**
 * The `low` value for each data point, signifying the lowest value
 * in the sample set. The bottom whisker is drawn here.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.boxplot.data.low docs to actual source code
 * @apioption series.boxplot.data.low
 */

/**
 * The median for each data point. This is drawn as a line through the
 * middle area of the box.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.boxplot.data.median docs to actual source code
 * @apioption series.boxplot.data.median
 */

/**
 * The lower quartile for each data point. This is the bottom of the
 * box.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.boxplot.data.q1 docs to actual source code
 * @apioption series.boxplot.data.q1
 */

/**
 * The higher quartile for each data point. This is the top of the box.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.boxplot.data.q3 docs to actual source code
 * @apioption series.boxplot.data.q3
 */

/**
 * @extends plotOptions.boxplot.states
 * @product highcharts
 * @todo Copy series.boxplot.data.marker.states docs to actual source code
 * @apioption series.boxplot.data.marker.states
 */

/**
 * @extends plotOptions.boxplot.dataLabels
 * @product highcharts
 * @todo Copy series.boxplot.dataLabels docs to actual source code
 * @apioption series.boxplot.dataLabels
 */

/**
 * @extends plotOptions.boxplot.events
 * @product highcharts
 * @todo Copy series.boxplot.events docs to actual source code
 * @apioption series.boxplot.events
 */

/**
 * @extends plotOptions.boxplot.marker
 * @product highcharts
 * @todo Copy series.boxplot.marker docs to actual source code
 * @apioption series.boxplot.marker
 */

/**
 * @extends plotOptions.boxplot.point
 * @product highcharts
 * @todo Copy series.boxplot.point docs to actual source code
 * @apioption series.boxplot.point
 */

/**
 * @extends plotOptions.boxplot.states
 * @product highcharts
 * @todo Copy series.boxplot.states docs to actual source code
 * @apioption series.boxplot.states
 */

/**
 * @extends plotOptions.boxplot.tooltip
 * @product highcharts
 * @todo Copy series.boxplot.tooltip docs to actual source code
 * @apioption series.boxplot.tooltip
 */

/**
 * @extends plotOptions.boxplot.zones
 * @product highcharts
 * @todo Copy series.boxplot.zones docs to actual source code
 * @apioption series.boxplot.zones
 */

/**
 * A `bubble` series. If the [type](#series<bubble>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * bubble](#plotOptions.bubble).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.bubble
 * @excluding dataParser,dataURL,stack
 * @product highcharts
 * @todo Copy series.bubble docs to actual source code
 * @apioption series.bubble
 */

/**
 * An array of data points for the series. For the `bubble` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,z`. If the first value is a string, it is applied
 * as the name of the point, and the `x` value is inferred. The `x`
 * value can also be omitted, in which case the inner arrays should
 * be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart` and
 * `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 1, 2],
 * [1, 5, 5],
 * [2, 0, 2]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<bubble>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 1,
 * z: 1,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 5,
 * z: 4,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<line>.data
 * @excluding marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.bubble.data docs to actual source code
 * @apioption series.bubble.data
 */

/**
 * The size value for each bubble. The bubbles' diameters are computed
 * based on the `z`, and controlled by series options like `minSize`,
 *  `maxSize`, `sizeBy`, `zMin` and `zMax`.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.bubble.data.z docs to actual source code
 * @apioption series.bubble.data.z
 */

/**
 * @extends plotOptions.bubble.states
 * @product highcharts
 * @todo Copy series.bubble.data.marker.states docs to actual source code
 * @apioption series.bubble.data.marker.states
 */

/**
 * @extends plotOptions.bubble.dataLabels
 * @product highcharts
 * @todo Copy series.bubble.dataLabels docs to actual source code
 * @apioption series.bubble.dataLabels
 */

/**
 * @extends plotOptions.bubble.events
 * @product highcharts
 * @todo Copy series.bubble.events docs to actual source code
 * @apioption series.bubble.events
 */

/**
 * @extends plotOptions.bubble.marker
 * @product highcharts
 * @todo Copy series.bubble.marker docs to actual source code
 * @apioption series.bubble.marker
 */

/**
 * @extends plotOptions.bubble.point
 * @product highcharts
 * @todo Copy series.bubble.point docs to actual source code
 * @apioption series.bubble.point
 */

/**
 * @extends plotOptions.bubble.states
 * @product highcharts
 * @todo Copy series.bubble.states docs to actual source code
 * @apioption series.bubble.states
 */

/**
 * @extends plotOptions.bubble.tooltip
 * @product highcharts
 * @todo Copy series.bubble.tooltip docs to actual source code
 * @apioption series.bubble.tooltip
 */

/**
 * @extends plotOptions.bubble.zones
 * @product highcharts
 * @todo Copy series.bubble.zones docs to actual source code
 * @apioption series.bubble.zones
 */

/**
 * A `column` series. If the [type](#series<column>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * column](#plotOptions.column).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.column
 * @excluding dataParser,dataURL
 * @product highcharts highstock
 * @todo Copy series.column docs to actual source code
 * @apioption series.column
 */

/**
 * An array of data points for the series. For the `column` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 6],
 * [1, 2],
 * [2, 6]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<column>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 5,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 9,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<line>.data
 * @excluding marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.column.data docs to actual source code
 * @apioption series.column.data
 */

/**
 * @extends plotOptions.column.states
 * @product highcharts highstock
 * @todo Copy series.column.data.marker.states docs to actual source code
 * @apioption series.column.data.marker.states
 */

/**
 * @extends plotOptions.column.dataLabels
 * @product highcharts highstock
 * @todo Copy series.column.dataLabels docs to actual source code
 * @apioption series.column.dataLabels
 */

/**
 * @extends plotOptions.column.events
 * @product highcharts highstock
 * @todo Copy series.column.events docs to actual source code
 * @apioption series.column.events
 */

/**
 * @extends plotOptions.column.marker
 * @product highcharts highstock
 * @todo Copy series.column.marker docs to actual source code
 * @apioption series.column.marker
 */

/**
 * @extends plotOptions.column.point
 * @product highcharts highstock
 * @todo Copy series.column.point docs to actual source code
 * @apioption series.column.point
 */

/**
 * @extends plotOptions.column.states
 * @product highcharts highstock
 * @todo Copy series.column.states docs to actual source code
 * @apioption series.column.states
 */

/**
 * @extends plotOptions.column.tooltip
 * @product highcharts highstock
 * @todo Copy series.column.tooltip docs to actual source code
 * @apioption series.column.tooltip
 */

/**
 * @extends plotOptions.column.zones
 * @product highcharts highstock
 * @todo Copy series.column.zones docs to actual source code
 * @apioption series.column.zones
 */

/**
 * A `columnrange` series. If the [type](#series<columnrange>.type)
 * option is not specified, it is inherited from [chart.type](#chart.
 * type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * columnrange](#plotOptions.columnrange).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.columnrange
 * @excluding dataParser,dataURL,stack
 * @product highcharts highstock
 * @todo Copy series.columnrange docs to actual source code
 * @apioption series.columnrange
 */

/**
 * An array of data points for the series. For the `columnrange` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,low,high`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 4, 2],
 * [1, 2, 1],
 * [2, 9, 10]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<columnrange>.
 * turboThreshold), this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * low: 0,
 * high: 4,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * low: 5,
 * high: 3,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<arearange>.data
 * @excluding marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.columnrange.data docs to actual source code
 * @apioption series.columnrange.data
 */

/**
 * @extends plotOptions.columnrange.states
 * @product highcharts highstock
 * @todo Copy series.columnrange.data.marker.states docs to actual source code
 * @apioption series.columnrange.data.marker.states
 */

/**
 * @extends plotOptions.columnrange.dataLabels
 * @product highcharts highstock
 * @todo Copy series.columnrange.dataLabels docs to actual source code
 * @apioption series.columnrange.dataLabels
 */

/**
 * @extends plotOptions.columnrange.events
 * @product highcharts highstock
 * @todo Copy series.columnrange.events docs to actual source code
 * @apioption series.columnrange.events
 */

/**
 * @extends plotOptions.columnrange.marker
 * @product highcharts highstock
 * @todo Copy series.columnrange.marker docs to actual source code
 * @apioption series.columnrange.marker
 */

/**
 * @extends plotOptions.columnrange.point
 * @product highcharts highstock
 * @todo Copy series.columnrange.point docs to actual source code
 * @apioption series.columnrange.point
 */

/**
 * @extends plotOptions.columnrange.states
 * @product highcharts highstock
 * @todo Copy series.columnrange.states docs to actual source code
 * @apioption series.columnrange.states
 */

/**
 * @extends plotOptions.columnrange.tooltip
 * @product highcharts highstock
 * @todo Copy series.columnrange.tooltip docs to actual source code
 * @apioption series.columnrange.tooltip
 */

/**
 * @extends plotOptions.columnrange.zones
 * @product highcharts highstock
 * @todo Copy series.columnrange.zones docs to actual source code
 * @apioption series.columnrange.zones
 */

/**
 * A `errorbar` series. If the [type](#series<errorbar>.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 * 
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * errorbar](#plotOptions.errorbar).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.errorbar
 * @excluding dataParser,dataURL,stack
 * @product highcharts
 * @todo Copy series.errorbar docs to actual source code
 * @apioption series.errorbar
 */

/**
 * An array of data points for the series. For the `errorbar` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,low,high`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 10, 2],
 * [1, 1, 8],
 * [2, 4, 5]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<errorbar>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * low: 0,
 * high: 0,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * low: 5,
 * high: 5,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<arearange>.data
 * @excluding dataLabels,drilldown,marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.errorbar.data docs to actual source code
 * @apioption series.errorbar.data
 */

/**
 * @extends plotOptions.errorbar.states
 * @product highcharts
 * @todo Copy series.errorbar.data.marker.states docs to actual source code
 * @apioption series.errorbar.data.marker.states
 */

/**
 * @extends plotOptions.errorbar.dataLabels
 * @product highcharts
 * @todo Copy series.errorbar.dataLabels docs to actual source code
 * @apioption series.errorbar.dataLabels
 */

/**
 * @extends plotOptions.errorbar.events
 * @product highcharts
 * @todo Copy series.errorbar.events docs to actual source code
 * @apioption series.errorbar.events
 */

/**
 * @extends plotOptions.errorbar.marker
 * @product highcharts
 * @todo Copy series.errorbar.marker docs to actual source code
 * @apioption series.errorbar.marker
 */

/**
 * @extends plotOptions.errorbar.point
 * @product highcharts
 * @todo Copy series.errorbar.point docs to actual source code
 * @apioption series.errorbar.point
 */

/**
 * @extends plotOptions.errorbar.states
 * @product highcharts
 * @todo Copy series.errorbar.states docs to actual source code
 * @apioption series.errorbar.states
 */

/**
 * @extends plotOptions.errorbar.tooltip
 * @product highcharts
 * @todo Copy series.errorbar.tooltip docs to actual source code
 * @apioption series.errorbar.tooltip
 */

/**
 * @extends plotOptions.errorbar.zones
 * @product highcharts
 * @todo Copy series.errorbar.zones docs to actual source code
 * @apioption series.errorbar.zones
 */

/**
 * A `funnel` series. If the [type](#series<funnel>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * funnel](#plotOptions.funnel).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.funnel
 * @excluding dataParser,dataURL,stack,xAxis,yAxis
 * @product highcharts
 * @todo Copy series.funnel docs to actual source code
 * @apioption series.funnel
 */

/**
 * An array of data points for the series. For the `funnel` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<funnel>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * y: 3,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * y: 1,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Number>}
 * @extends series<pie>.data
 * @excluding sliced
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.funnel.data docs to actual source code
 * @apioption series.funnel.data
 */

/**
 * @extends plotOptions.funnel.states
 * @product highcharts
 * @todo Copy series.funnel.data.marker.states docs to actual source code
 * @apioption series.funnel.data.marker.states
 */

/**
 * @extends plotOptions.funnel.dataLabels
 * @product highcharts
 * @todo Copy series.funnel.dataLabels docs to actual source code
 * @apioption series.funnel.dataLabels
 */

/**
 * @extends plotOptions.funnel.events
 * @product highcharts
 * @todo Copy series.funnel.events docs to actual source code
 * @apioption series.funnel.events
 */

/**
 * @extends plotOptions.funnel.marker
 * @product highcharts
 * @todo Copy series.funnel.marker docs to actual source code
 * @apioption series.funnel.marker
 */

/**
 * @extends plotOptions.funnel.point
 * @product highcharts
 * @todo Copy series.funnel.point docs to actual source code
 * @apioption series.funnel.point
 */

/**
 * @extends plotOptions.funnel.states
 * @product highcharts
 * @todo Copy series.funnel.states docs to actual source code
 * @apioption series.funnel.states
 */

/**
 * @extends plotOptions.funnel.tooltip
 * @product highcharts
 * @todo Copy series.funnel.tooltip docs to actual source code
 * @apioption series.funnel.tooltip
 */

/**
 * @extends plotOptions.funnel.zones
 * @product highcharts
 * @todo Copy series.funnel.zones docs to actual source code
 * @apioption series.funnel.zones
 */

/**
 * A `gauge` series. If the [type](#series<gauge>.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * gauge](#plotOptions.gauge).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.gauge
 * @excluding dataParser,dataURL,stack
 * @product highcharts
 * @todo Copy series.gauge docs to actual source code
 * @apioption series.gauge
 */

/**
 * An array of data points for the series. For the `gauge` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<gauge>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * y: 6,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * y: 8,
 * name: "Point1",
 * color: "#FF00FF"
 * }]</pre>
 * 
 * The typical gauge only contains a single data value.
 * 
 * @type {Array<Object|Number>}
 * @extends series<line>.data
 * @excluding drilldown,marker,x
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.gauge.data docs to actual source code
 * @apioption series.gauge.data
 */

/**
 * @extends plotOptions.gauge.states
 * @product highcharts
 * @todo Copy series.gauge.data.marker.states docs to actual source code
 * @apioption series.gauge.data.marker.states
 */

/**
 * @extends plotOptions.gauge.dataLabels
 * @product highcharts
 * @todo Copy series.gauge.dataLabels docs to actual source code
 * @apioption series.gauge.dataLabels
 */

/**
 * @extends plotOptions.gauge.events
 * @product highcharts
 * @todo Copy series.gauge.events docs to actual source code
 * @apioption series.gauge.events
 */

/**
 * @extends plotOptions.gauge.marker
 * @product highcharts
 * @todo Copy series.gauge.marker docs to actual source code
 * @apioption series.gauge.marker
 */

/**
 * @extends plotOptions.gauge.point
 * @product highcharts
 * @todo Copy series.gauge.point docs to actual source code
 * @apioption series.gauge.point
 */

/**
 * @extends plotOptions.gauge.states
 * @product highcharts
 * @todo Copy series.gauge.states docs to actual source code
 * @apioption series.gauge.states
 */

/**
 * @extends plotOptions.gauge.tooltip
 * @product highcharts
 * @todo Copy series.gauge.tooltip docs to actual source code
 * @apioption series.gauge.tooltip
 */

/**
 * @extends plotOptions.gauge.zones
 * @product highcharts
 * @todo Copy series.gauge.zones docs to actual source code
 * @apioption series.gauge.zones
 */

/**
 * A `heatmap` series. If the [type](#series<heatmap>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * heatmap](#plotOptions.heatmap).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.heatmap
 * @excluding dataParser,dataURL,stack
 * @product highcharts highmaps
 * @todo Copy series.heatmap docs to actual source code
 * @apioption series.heatmap
 */

/**
 * An array of data points for the series. For the `heatmap` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,value`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 9, 7],
 * [1, 10, 4],
 * [2, 6, 3]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<heatmap>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 3,
 * value: 10,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 7,
 * value: 10,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<line>.data
 * @excluding marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highmaps
 * @todo Copy series.heatmap.data docs to actual source code
 * @apioption series.heatmap.data
 */

/**
 * The color of the point. In heat maps the point color is rarely set
 * explicitly, as we use the color to denote the `value`. Options for
 * this are set in the [colorAxis](#colorAxis) configuration.
 * 
 * @type {Color}
 * @product highcharts highmaps
 * @todo Copy series.heatmap.data.color docs to actual source code
 * @apioption series.heatmap.data.color
 */

/**
 * The value of the point, resulting in a color controled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 * 
 * @type {Number}
 * @product highcharts highmaps
 * @todo Copy series.heatmap.data.value docs to actual source code
 * @apioption series.heatmap.data.value
 */

/**
 * @extends plotOptions.heatmap.states
 * @product highcharts highmaps
 * @todo Copy series.heatmap.data.marker.states docs to actual source code
 * @apioption series.heatmap.data.marker.states
 */

/**
 * @extends plotOptions.heatmap.dataLabels
 * @product highcharts highmaps
 * @todo Copy series.heatmap.dataLabels docs to actual source code
 * @apioption series.heatmap.dataLabels
 */

/**
 * @extends plotOptions.heatmap.events
 * @product highcharts highmaps
 * @todo Copy series.heatmap.events docs to actual source code
 * @apioption series.heatmap.events
 */

/**
 * @extends plotOptions.heatmap.marker
 * @product highcharts highmaps
 * @todo Copy series.heatmap.marker docs to actual source code
 * @apioption series.heatmap.marker
 */

/**
 * @extends plotOptions.heatmap.point
 * @product highcharts highmaps
 * @todo Copy series.heatmap.point docs to actual source code
 * @apioption series.heatmap.point
 */

/**
 * @extends plotOptions.heatmap.states
 * @product highcharts highmaps
 * @todo Copy series.heatmap.states docs to actual source code
 * @apioption series.heatmap.states
 */

/**
 * @extends plotOptions.heatmap.tooltip
 * @product highcharts highmaps
 * @todo Copy series.heatmap.tooltip docs to actual source code
 * @apioption series.heatmap.tooltip
 */

/**
 * @extends plotOptions.heatmap.zones
 * @product highcharts highmaps
 * @todo Copy series.heatmap.zones docs to actual source code
 * @apioption series.heatmap.zones
 */

/**
 * A `line` series. If the [type](#series<line>.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * line](#plotOptions.line).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.line
 * @excluding dataParser,dataURL
 * @product highcharts highstock
 * @todo Copy series.line docs to actual source code
 * @apioption series.line
 */

/**
 * An array of data points for the series. For the `line` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 1],
 * [1, 2],
 * [2, 8]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<line>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 10,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 6,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock highmaps
 * @todo Copy series.line.data docs to actual source code
 * @apioption series.line.data
 */

/**
 * An additional, individual class name for the data point's graphic
 * representation.
 * 
 * @type {String}
 * @since 5.0.0
 * @product highcharts
 * @todo Copy series.line.data.className docs to actual source code
 * @apioption series.line.data.className
 */

/**
 * [Styled mode](http://www.highcharts.com/docs/chart-design-and-style/style-
 * by-css) only. A specific color index to use for the point, so its
 * graphic representations are given the class name `highcharts-color-
 * {n}`.
 * 
 * @type {Number}
 * @since 5.0.0
 * @product highcharts
 * @todo Copy series.line.data.colorIndex docs to actual source code
 * @apioption series.line.data.colorIndex
 */

/**
 * _Requires Accessibility module_
 * 
 * A description of the point to add to the screen reader information
 * about the point.
 * 
 * @type {String}
 * @default {all} undefined
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy series.line.data.description docs to actual source code
 * @apioption series.line.data.description
 */

/**
 * The rank for this point's data label in case of collision. If two
 * data labels are about to overlap, only the one with the highest `labelrank`
 * will be drawn.
 * 
 * @type {Number}
 * @product highcharts highstock highmaps
 * @todo Copy series.line.data.labelrank docs to actual source code
 * @apioption series.line.data.labelrank
 */

/**
 * Whether the data point is selected initially.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highcharts highstock
 * @todo Copy series.line.data.selected docs to actual source code
 * @apioption series.line.data.selected
 */

/**
 * @extends plotOptions.line.states
 * @product highcharts highstock
 * @todo Copy series.line.data.marker.states docs to actual source code
 * @apioption series.line.data.marker.states
 */

/**
 * @extends plotOptions.line.dataLabels
 * @product highcharts highstock
 * @todo Copy series.line.dataLabels docs to actual source code
 * @apioption series.line.dataLabels
 */

/**
 * @extends plotOptions.line.events
 * @product highcharts highstock
 * @todo Copy series.line.events docs to actual source code
 * @apioption series.line.events
 */

/**
 * @extends plotOptions.line.marker
 * @product highcharts highstock
 * @todo Copy series.line.marker docs to actual source code
 * @apioption series.line.marker
 */

/**
 * @extends plotOptions.line.point
 * @product highcharts highstock
 * @todo Copy series.line.point docs to actual source code
 * @apioption series.line.point
 */

/**
 * @extends plotOptions.line.states
 * @product highcharts highstock
 * @todo Copy series.line.states docs to actual source code
 * @apioption series.line.states
 */

/**
 * @extends plotOptions.line.tooltip
 * @product highcharts highstock
 * @todo Copy series.line.tooltip docs to actual source code
 * @apioption series.line.tooltip
 */

/**
 * @extends plotOptions.line.zones
 * @product highcharts highstock
 * @todo Copy series.line.zones docs to actual source code
 * @apioption series.line.zones
 */

/**
 * A `pie` series. If the [type](#series<pie>.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * pie](#plotOptions.pie).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.pie
 * @excluding dataParser,dataURL,stack,xAxis,yAxis
 * @product highcharts
 * @todo Copy series.pie docs to actual source code
 * @apioption series.pie
 */

/**
 * An array of data points for the series. For the `pie` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<pie>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * y: 1,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * y: 7,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Number>}
 * @extends series<line>.data
 * @excluding marker,x
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.pie.data docs to actual source code
 * @apioption series.pie.data
 */

/**
 * @extends plotOptions.pie.states
 * @product highcharts
 * @todo Copy series.pie.data.marker.states docs to actual source code
 * @apioption series.pie.data.marker.states
 */

/**
 * @extends plotOptions.pie.dataLabels
 * @product highcharts
 * @todo Copy series.pie.dataLabels docs to actual source code
 * @apioption series.pie.dataLabels
 */

/**
 * @extends plotOptions.pie.events
 * @product highcharts
 * @todo Copy series.pie.events docs to actual source code
 * @apioption series.pie.events
 */

/**
 * @extends plotOptions.pie.marker
 * @product highcharts
 * @todo Copy series.pie.marker docs to actual source code
 * @apioption series.pie.marker
 */

/**
 * @extends plotOptions.pie.point
 * @product highcharts
 * @todo Copy series.pie.point docs to actual source code
 * @apioption series.pie.point
 */

/**
 * @extends plotOptions.pie.states
 * @product highcharts
 * @todo Copy series.pie.states docs to actual source code
 * @apioption series.pie.states
 */

/**
 * @extends plotOptions.pie.tooltip
 * @product highcharts
 * @todo Copy series.pie.tooltip docs to actual source code
 * @apioption series.pie.tooltip
 */

/**
 * @extends plotOptions.pie.zones
 * @product highcharts
 * @todo Copy series.pie.zones docs to actual source code
 * @apioption series.pie.zones
 */

/**
 * A `polygon` series. If the [type](#series<polygon>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * polygon](#plotOptions.polygon).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.polygon
 * @excluding dataParser,dataURL,stack
 * @product highcharts highstock
 * @todo Copy series.polygon docs to actual source code
 * @apioption series.polygon
 */

/**
 * An array of data points for the series. For the `polygon` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 10],
 * [1, 3],
 * [2, 1]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<polygon>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 1,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 8,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<line>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.polygon.data docs to actual source code
 * @apioption series.polygon.data
 */

/**
 * @extends plotOptions.polygon.states
 * @product highcharts highstock
 * @todo Copy series.polygon.data.marker.states docs to actual source code
 * @apioption series.polygon.data.marker.states
 */

/**
 * @extends plotOptions.polygon.dataLabels
 * @product highcharts highstock
 * @todo Copy series.polygon.dataLabels docs to actual source code
 * @apioption series.polygon.dataLabels
 */

/**
 * @extends plotOptions.polygon.events
 * @product highcharts highstock
 * @todo Copy series.polygon.events docs to actual source code
 * @apioption series.polygon.events
 */

/**
 * @extends plotOptions.polygon.marker
 * @product highcharts highstock
 * @todo Copy series.polygon.marker docs to actual source code
 * @apioption series.polygon.marker
 */

/**
 * @extends plotOptions.polygon.point
 * @product highcharts highstock
 * @todo Copy series.polygon.point docs to actual source code
 * @apioption series.polygon.point
 */

/**
 * @extends plotOptions.polygon.states
 * @product highcharts highstock
 * @todo Copy series.polygon.states docs to actual source code
 * @apioption series.polygon.states
 */

/**
 * @extends plotOptions.polygon.tooltip
 * @product highcharts highstock
 * @todo Copy series.polygon.tooltip docs to actual source code
 * @apioption series.polygon.tooltip
 */

/**
 * @extends plotOptions.polygon.zones
 * @product highcharts highstock
 * @todo Copy series.polygon.zones docs to actual source code
 * @apioption series.polygon.zones
 */

/**
 * A `pyramid` series. If the [type](#series<pyramid>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * pyramid](#plotOptions.pyramid).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.pyramid
 * @excluding dataParser,dataURL,stack,xAxis,yAxis
 * @product highcharts
 * @todo Copy series.pyramid docs to actual source code
 * @apioption series.pyramid
 */

/**
 * An array of data points for the series. For the `pyramid` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<pyramid>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * y: 6,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * y: 7,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Number>}
 * @extends series<pie>.data
 * @excluding sliced
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.pyramid.data docs to actual source code
 * @apioption series.pyramid.data
 */

/**
 * @extends plotOptions.pyramid.states
 * @product highcharts
 * @todo Copy series.pyramid.data.marker.states docs to actual source code
 * @apioption series.pyramid.data.marker.states
 */

/**
 * @extends plotOptions.pyramid.dataLabels
 * @product highcharts
 * @todo Copy series.pyramid.dataLabels docs to actual source code
 * @apioption series.pyramid.dataLabels
 */

/**
 * @extends plotOptions.pyramid.events
 * @product highcharts
 * @todo Copy series.pyramid.events docs to actual source code
 * @apioption series.pyramid.events
 */

/**
 * @extends plotOptions.pyramid.marker
 * @product highcharts
 * @todo Copy series.pyramid.marker docs to actual source code
 * @apioption series.pyramid.marker
 */

/**
 * @extends plotOptions.pyramid.point
 * @product highcharts
 * @todo Copy series.pyramid.point docs to actual source code
 * @apioption series.pyramid.point
 */

/**
 * @extends plotOptions.pyramid.states
 * @product highcharts
 * @todo Copy series.pyramid.states docs to actual source code
 * @apioption series.pyramid.states
 */

/**
 * @extends plotOptions.pyramid.tooltip
 * @product highcharts
 * @todo Copy series.pyramid.tooltip docs to actual source code
 * @apioption series.pyramid.tooltip
 */

/**
 * @extends plotOptions.pyramid.zones
 * @product highcharts
 * @todo Copy series.pyramid.zones docs to actual source code
 * @apioption series.pyramid.zones
 */

/**
 * A `scatter` series. If the [type](#series<scatter>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * scatter](#plotOptions.scatter).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.scatter
 * @excluding dataParser,dataURL,stack
 * @product highcharts highstock
 * @todo Copy series.scatter docs to actual source code
 * @apioption series.scatter
 */

/**
 * An array of data points for the series. For the `scatter` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 0],
 * [1, 8],
 * [2, 9]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<scatter>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 2,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 4,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<line>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.scatter.data docs to actual source code
 * @apioption series.scatter.data
 */

/**
 * @extends plotOptions.scatter.states
 * @product highcharts highstock
 * @todo Copy series.scatter.data.marker.states docs to actual source code
 * @apioption series.scatter.data.marker.states
 */

/**
 * @extends plotOptions.scatter.dataLabels
 * @product highcharts highstock
 * @todo Copy series.scatter.dataLabels docs to actual source code
 * @apioption series.scatter.dataLabels
 */

/**
 * @extends plotOptions.scatter.events
 * @product highcharts highstock
 * @todo Copy series.scatter.events docs to actual source code
 * @apioption series.scatter.events
 */

/**
 * @extends plotOptions.scatter.marker
 * @product highcharts highstock
 * @todo Copy series.scatter.marker docs to actual source code
 * @apioption series.scatter.marker
 */

/**
 * @extends plotOptions.scatter.point
 * @product highcharts highstock
 * @todo Copy series.scatter.point docs to actual source code
 * @apioption series.scatter.point
 */

/**
 * @extends plotOptions.scatter.states
 * @product highcharts highstock
 * @todo Copy series.scatter.states docs to actual source code
 * @apioption series.scatter.states
 */

/**
 * @extends plotOptions.scatter.tooltip
 * @product highcharts highstock
 * @todo Copy series.scatter.tooltip docs to actual source code
 * @apioption series.scatter.tooltip
 */

/**
 * @extends plotOptions.scatter.zones
 * @product highcharts highstock
 * @todo Copy series.scatter.zones docs to actual source code
 * @apioption series.scatter.zones
 */

/**
 * A `solidgauge` series. If the [type](#series<solidgauge>.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 * 
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * solidgauge](#plotOptions.solidgauge).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.solidgauge
 * @excluding dataParser,dataURL,stack
 * @product highcharts
 * @todo Copy series.solidgauge docs to actual source code
 * @apioption series.solidgauge
 */

/**
 * Wether to draw rounded edges on the gauge.
 * 
 * @validvalue true, false
 * @type {Boolean}
 * @sample {highcharts} highcharts/demo/gauge-activity/ Activity Gauge
 * @default {all} false
 * @since 5.0.11
 * @product highcharts
 * @todo Copy series.solidgauge.rounded docs to actual source code
 * @apioption series.solidgauge.rounded
 */

/**
 * An array of data points for the series. For the `solidgauge` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<solidgauge>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * y: 5,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * y: 7,
 * name: "Point1",
 * color: "#FF00FF"
 * }]</pre>
 * 
 * The typical gauge only contains a single data value.
 * 
 * @type {Array<Object|Number>}
 * @extends series<gauge>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.solidgauge.data docs to actual source code
 * @apioption series.solidgauge.data
 */

/**
 * The inner radius of an individual point in a solid gauge. Can be
 * given as a number (pixels) or percentage string.
 * 
 * @type {Number|String}
 * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/ Individual radius and innerRadius
 * @since 4.1.6
 * @product highcharts
 * @todo Copy series.solidgauge.data.innerRadius docs to actual source code
 * @apioption series.solidgauge.data.innerRadius
 */

/**
 * The outer radius of an individual point in a solid gauge. Can be
 * given as a number (pixels) or percentage string.
 * 
 * @type {Number|String}
 * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/ Individual radius and innerRadius
 * @since 4.1.6
 * @product highcharts
 * @todo Copy series.solidgauge.data.radius docs to actual source code
 * @apioption series.solidgauge.data.radius
 */

/**
 * @extends plotOptions.solidgauge.states
 * @product highcharts
 * @todo Copy series.solidgauge.data.marker.states docs to actual source code
 * @apioption series.solidgauge.data.marker.states
 */

/**
 * @extends plotOptions.solidgauge.dataLabels
 * @product highcharts
 * @todo Copy series.solidgauge.dataLabels docs to actual source code
 * @apioption series.solidgauge.dataLabels
 */

/**
 * @extends plotOptions.solidgauge.events
 * @product highcharts
 * @todo Copy series.solidgauge.events docs to actual source code
 * @apioption series.solidgauge.events
 */

/**
 * @extends plotOptions.solidgauge.marker
 * @product highcharts
 * @todo Copy series.solidgauge.marker docs to actual source code
 * @apioption series.solidgauge.marker
 */

/**
 * @extends plotOptions.solidgauge.point
 * @product highcharts
 * @todo Copy series.solidgauge.point docs to actual source code
 * @apioption series.solidgauge.point
 */

/**
 * @extends plotOptions.solidgauge.states
 * @product highcharts
 * @todo Copy series.solidgauge.states docs to actual source code
 * @apioption series.solidgauge.states
 */

/**
 * @extends plotOptions.solidgauge.tooltip
 * @product highcharts
 * @todo Copy series.solidgauge.tooltip docs to actual source code
 * @apioption series.solidgauge.tooltip
 */

/**
 * @extends plotOptions.solidgauge.zones
 * @product highcharts
 * @todo Copy series.solidgauge.zones docs to actual source code
 * @apioption series.solidgauge.zones
 */

/**
 * A `spline` series. If the [type](#series<spline>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * spline](#plotOptions.spline).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.spline
 * @excluding dataParser,dataURL
 * @product highcharts highstock
 * @todo Copy series.spline docs to actual source code
 * @apioption series.spline
 */

/**
 * An array of data points for the series. For the `spline` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 9],
 * [1, 2],
 * [2, 8]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<spline>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 9,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 0,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<line>.data
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts highstock
 * @todo Copy series.spline.data docs to actual source code
 * @apioption series.spline.data
 */

/**
 * @extends plotOptions.spline.states
 * @product highcharts highstock
 * @todo Copy series.spline.data.marker.states docs to actual source code
 * @apioption series.spline.data.marker.states
 */

/**
 * @extends plotOptions.spline.dataLabels
 * @product highcharts highstock
 * @todo Copy series.spline.dataLabels docs to actual source code
 * @apioption series.spline.dataLabels
 */

/**
 * @extends plotOptions.spline.events
 * @product highcharts highstock
 * @todo Copy series.spline.events docs to actual source code
 * @apioption series.spline.events
 */

/**
 * @extends plotOptions.spline.marker
 * @product highcharts highstock
 * @todo Copy series.spline.marker docs to actual source code
 * @apioption series.spline.marker
 */

/**
 * @extends plotOptions.spline.point
 * @product highcharts highstock
 * @todo Copy series.spline.point docs to actual source code
 * @apioption series.spline.point
 */

/**
 * @extends plotOptions.spline.states
 * @product highcharts highstock
 * @todo Copy series.spline.states docs to actual source code
 * @apioption series.spline.states
 */

/**
 * @extends plotOptions.spline.tooltip
 * @product highcharts highstock
 * @todo Copy series.spline.tooltip docs to actual source code
 * @apioption series.spline.tooltip
 */

/**
 * @extends plotOptions.spline.zones
 * @product highcharts highstock
 * @todo Copy series.spline.zones docs to actual source code
 * @apioption series.spline.zones
 */

/**
 * A `treemap` series. If the [type](#series<treemap>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * treemap](#plotOptions.treemap).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.treemap
 * @excluding dataParser,dataURL,stack
 * @product highcharts
 * @todo Copy series.treemap docs to actual source code
 * @apioption series.treemap
 */

/**
 * An array of data points for the series. For the `treemap` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `value` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<treemap>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * value: 7,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * value: 2,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Number>}
 * @extends series<heatmap>.data
 * @excluding x,y
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.treemap.data docs to actual source code
 * @apioption series.treemap.data
 */

/**
 * The value of the point, resulting in a relative area of the point
 * in the treemap.
 * 
 * @type {Number}
 * @product highcharts
 * @todo Copy series.treemap.data.value docs to actual source code
 * @apioption series.treemap.data.value
 */

/**
 * @extends plotOptions.treemap.states
 * @product highcharts
 * @todo Copy series.treemap.data.marker.states docs to actual source code
 * @apioption series.treemap.data.marker.states
 */

/**
 * @extends plotOptions.treemap.dataLabels
 * @product highcharts
 * @todo Copy series.treemap.dataLabels docs to actual source code
 * @apioption series.treemap.dataLabels
 */

/**
 * @extends plotOptions.treemap.events
 * @product highcharts
 * @todo Copy series.treemap.events docs to actual source code
 * @apioption series.treemap.events
 */

/**
 * @extends plotOptions.treemap.marker
 * @product highcharts
 * @todo Copy series.treemap.marker docs to actual source code
 * @apioption series.treemap.marker
 */

/**
 * @extends plotOptions.treemap.point
 * @product highcharts
 * @todo Copy series.treemap.point docs to actual source code
 * @apioption series.treemap.point
 */

/**
 * @extends plotOptions.treemap.states
 * @product highcharts
 * @todo Copy series.treemap.states docs to actual source code
 * @apioption series.treemap.states
 */

/**
 * @extends plotOptions.treemap.tooltip
 * @product highcharts
 * @todo Copy series.treemap.tooltip docs to actual source code
 * @apioption series.treemap.tooltip
 */

/**
 * @extends plotOptions.treemap.zones
 * @product highcharts
 * @todo Copy series.treemap.zones docs to actual source code
 * @apioption series.treemap.zones
 */

/**
 * A `waterfall` series. If the [type](#series<waterfall>.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 * 
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * waterfall](#plotOptions.waterfall).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.waterfall
 * @excluding dataParser,dataURL
 * @product highcharts
 * @todo Copy series.waterfall docs to actual source code
 * @apioption series.waterfall
 */

/**
 * An array of data points for the series. For the `waterfall` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 7],
 * [1, 8],
 * [2, 3]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<waterfall>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 8,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 8,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<line>.data
 * @excluding marker
 * @sample {highcharts} highcharts/chart/reflow-true/ Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/ Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/ Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/ Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/ Config objects
 * @product highcharts
 * @todo Copy series.waterfall.data docs to actual source code
 * @apioption series.waterfall.data
 */

/**
 * @extends plotOptions.waterfall.states
 * @product highcharts
 * @todo Copy series.waterfall.data.marker.states docs to actual source code
 * @apioption series.waterfall.data.marker.states
 */

/**
 * @extends plotOptions.waterfall.dataLabels
 * @product highcharts
 * @todo Copy series.waterfall.dataLabels docs to actual source code
 * @apioption series.waterfall.dataLabels
 */

/**
 * @extends plotOptions.waterfall.events
 * @product highcharts
 * @todo Copy series.waterfall.events docs to actual source code
 * @apioption series.waterfall.events
 */

/**
 * @extends plotOptions.waterfall.marker
 * @product highcharts
 * @todo Copy series.waterfall.marker docs to actual source code
 * @apioption series.waterfall.marker
 */

/**
 * @extends plotOptions.waterfall.point
 * @product highcharts
 * @todo Copy series.waterfall.point docs to actual source code
 * @apioption series.waterfall.point
 */

/**
 * @extends plotOptions.waterfall.states
 * @product highcharts
 * @todo Copy series.waterfall.states docs to actual source code
 * @apioption series.waterfall.states
 */

/**
 * @extends plotOptions.waterfall.tooltip
 * @product highcharts
 * @todo Copy series.waterfall.tooltip docs to actual source code
 * @apioption series.waterfall.tooltip
 */

/**
 * @extends plotOptions.waterfall.zones
 * @product highcharts
 * @todo Copy series.waterfall.zones docs to actual source code
 * @apioption series.waterfall.zones
 */

/**
 * When the subtitle is floating, the plot area will not move to make
 * space for it.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/subtitle/floating/ Floating title and subtitle
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-footnote Footnote floating at bottom right of plot area
 * @default {all} false
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy subtitle.floating docs to actual source code
 * @apioption subtitle.floating
 */

/**
 * CSS styles for the title.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the subtitle style is given in the `.highcharts-
 * subtitle` class.
 * 
 * @type {CSSObject}
 * @sample {highcharts} highcharts/subtitle/style/ Custom color and weight
 * @sample {highcharts} highcharts/css/titles/ Styled mode
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-style Custom color and weight
 * @sample {highstock} highcharts/css/titles/ Styled mode
 * @sample {highmaps} highcharts/css/titles/ Styled mode
 * @default {all} { "color": "#666666" }
 * @product highcharts highstock highmaps
 * @todo Copy subtitle.style docs to actual source code
 * @apioption subtitle.style
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the text.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy subtitle.useHTML docs to actual source code
 * @apioption subtitle.useHTML
 */

/**
 * The vertical alignment of the title. Can be one of "top", "middle"
 * and "bottom". When a value is given, the title behaves as floating.
 * 
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @sample {highcharts} highcharts/subtitle/verticalalign/ Footnote at the bottom right of plot area
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-footnote Footnote at the bottom right of plot area
 * @default {all}  
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy subtitle.verticalAlign docs to actual source code
 * @apioption subtitle.verticalAlign
 */

/**
 * The x position of the subtitle relative to the alignment within chart.
 * spacingLeft and chart.spacingRight.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/subtitle/align/ Footnote at right of plot area
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-footnote Footnote at the bottom right of plot area
 * @default {all} 0
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy subtitle.x docs to actual source code
 * @apioption subtitle.x
 */

/**
 * The y position of the subtitle relative to the alignment within chart.
 * spacingTop and chart.spacingBottom. By default the subtitle is laid
 * out below the title unless the title is floating.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/subtitle/verticalalign/ Footnote at the bottom right of plot area
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/subtitle-footnote Footnote at the bottom right of plot area
 * @default {highcharts}  null
 * @default {highstock}  null
 * @default {highmaps}  
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy subtitle.y docs to actual source code
 * @apioption subtitle.y
 */

/**
 * When the title is floating, the plot area will not move to make space
 * for it.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/chart/zoomtype-none/ False by default
 * @sample {highcharts} highcharts/title/floating/ True - title on top of the plot area
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-floating/ True - title on top of the plot area
 * @default {all} false
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy title.floating docs to actual source code
 * @apioption title.floating
 */

/**
 * CSS styles for the title. Use this for font styling, but use `align`,
 * `x` and `y` for text alignment.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the title style is given in the `.highcharts-
 * title` class.
 * 
 * @type {CSSObject}
 * @sample {highcharts} highcharts/title/style/ Custom color and weight
 * @sample {highcharts} highcharts/css/titles/ Styled mode
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-style/ Custom color and weight
 * @sample {highstock} highcharts/css/titles/ Styled mode
 * @sample {highmaps} highcharts/css/titles/ Styled mode
 * @default {highcharts} { "color": "#333333", "fontSize": "18px" }
 * @default {highstock} { "color": "#333333", "fontSize": "16px" }
 * @default {highmaps} { "color": "#333333", "fontSize": "18px" }
 * @product highcharts highstock highmaps
 * @todo Copy title.style docs to actual source code
 * @apioption title.style
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the text.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy title.useHTML docs to actual source code
 * @apioption title.useHTML
 */

/**
 * The vertical alignment of the title. Can be one of `"top"`, `"middle"`
 * and `"bottom"`. When a value is given, the title behaves as if [floating](#title.
 * floating) were `true`.
 * 
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @sample {highcharts} highcharts/title/verticalalign/ Chart title in bottom right corner
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-verticalalign/ Chart title in bottom right corner
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy title.verticalAlign docs to actual source code
 * @apioption title.verticalAlign
 */

/**
 * The x position of the title relative to the alignment within chart.
 * spacingLeft and chart.spacingRight.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/title/align/ Aligned to the plot area (x = 70px     = margin left - spacing left)
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-align/ Aligned to the plot area (x = 50px     = margin left - spacing left)
 * @default {all} 0
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy title.x docs to actual source code
 * @apioption title.x
 */

/**
 * The y position of the title relative to the alignment within [chart.
 * spacingTop](#chart.spacingTop) and [chart.spacingBottom](#chart.spacingBottom).
 *  By default it depends on the font size.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/title/y/ Title inside the plot area
 * @sample {highstock} highcharts/tree/master/samples/stock/chart/title-verticalalign/ Chart title in bottom right corner
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy title.y docs to actual source code
 * @apioption title.y
 */

/**
 * The color of the tooltip border. When `null`, the border takes the
 * color of the corresponding series or point.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/tooltip/bordercolor-default/ Follow series by default
 * @sample {highcharts} highcharts/tooltip/bordercolor-black/ Black border
 * @sample {highstock} highcharts/tree/master/samples/stock/tooltip/general/ Styled tooltip
 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/background-border/ Background and border demo
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.borderColor docs to actual source code
 * @apioption tooltip.borderColor
 */

/**
 * Since 4.1, the crosshair definitions are moved to the Axis object
 * in order for a better separation from the tooltip. See [xAxis.crosshair](#xAxis.
 * crosshair)<a>.</a>
 * 
 * @type {Mixed}
 * @deprecated
 * @sample {highcharts} highcharts/tooltip/crosshairs-x/ Enable a crosshair for the x value
 * @default {all} true
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.crosshairs docs to actual source code
 * @apioption tooltip.crosshairs
 */

/**
 * Whether the tooltip should follow the mouse as it moves across columns,
 * pie slices and other point types with an extent. By default it behaves
 * this way for scatter, bubble and pie series by override in the `plotOptions`
 * for those series types.
 * 
 * For touch moves to behave the same way, [followTouchMove](#tooltip.
 * followTouchMove) must be `true` also.
 * 
 * @type {Boolean}
 * @default {highcharts} false
 * @default {highstock} false
 * @default {highmaps} true
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.followPointer docs to actual source code
 * @apioption tooltip.followPointer
 */

/**
 * Whether the tooltip should follow the finger as it moves on a touch
 * device. If this is `true` and [chart.panning](#chart.panning) is
 * set,`followTouchMove` will take over one-finger touches, so the user
 * needs to use two fingers for zooming and panning.
 * 
 * @type {Boolean}
 * @default {highcharts} true
 * @default {highstock} true
 * @default {highmaps} false
 * @since 3.0.1
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.followTouchMove docs to actual source code
 * @apioption tooltip.followTouchMove
 */

/**
 * Callback function to format the text of the tooltip. Return false
 * to disable tooltip for a specific point on series.
 * 
 * A subset of HTML is supported. The HTML of the tooltip is parsed
 * and converted to SVG, therefore this isn't a complete HTML renderer.
 * The following tags are supported: `<b>`, `<strong>`, `<i>`, `<em>`,
 * `<br/>`, `<span>`. Spans can be styled with a `style` attribute,
 * but only text-related CSS that is shared with SVG is handled.
 * 
 * Since version 2.1 the tooltip can be shared between multiple series
 * through the `shared` option. The available data in the formatter
 * differ a bit depending on whether the tooltip is shared or not. In
 * a shared tooltip, all properties except `x`, which is common for
 * all points, are kept in an array, `this.points`.
 * 
 * Available data are:
 * 
 * <dl>
 * 
 * <dt>this.percentage (not shared) / this.points[i].percentage (shared)</dt>
 * 
 * <dd>Stacked series and pies only. The point's percentage of the total.
 * </dd>
 * 
 * <dt>this.point (not shared) / this.points[i].point (shared)</dt>
 * 
 * <dd>The point object. The point name, if defined, is available through
 * `this.point.name`.</dd>
 * 
 * <dt>this.points</dt>
 * 
 * <dd>In a shared tooltip, this is an array containing all other properties
 * for each point.</dd>
 * 
 * <dt>this.series (not shared) / this.points[i].series (shared)</dt>
 * 
 * <dd>The series object. The series name is available through `this.
 * series.name`.</dd>
 * 
 * <dt>this.total (not shared) / this.points[i].total (shared)</dt>
 * 
 * <dd>Stacked series only. The total value at this point's x value.
 * </dd>
 * 
 * <dt>this.x</dt>
 * 
 * <dd>The x value. This property is the same regardless of the tooltip
 * being shared or not.</dd>
 * 
 * <dt>this.y (not shared) / this.points[i].y (shared)</dt>
 * 
 * <dd>The y value.</dd>
 * 
 * </dl>
 * 
 * @type {Function}
 * @sample {highcharts} highcharts/tooltip/formatter-simple/ Simple string formatting
 * @sample {highcharts} highcharts/tooltip/formatter-shared/ Formatting with shared tooltip
 * @sample {highstock} highcharts/tree/master/samples/stock/tooltip/formatter/ Formatting with shared tooltip
 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/formatter/ String formatting
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.formatter docs to actual source code
 * @apioption tooltip.formatter
 */

/**
 * The number of milliseconds to wait until the tooltip is hidden when
 * mouse out from a point or chart.
 * 
 * @type {Number}
 * @default {all} 500
 * @since 3.0
 * @product highcharts highmaps
 * @todo Copy tooltip.hideDelay docs to actual source code
 * @apioption tooltip.hideDelay
 */

/**
 * A callback function for formatting the HTML output for a single point
 * in the tooltip. Like the `pointFormat` string, but with more flexibility.
 * 
 * @type {Function}
 * @context Point
 * @since 4.1.0
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.pointFormatter docs to actual source code
 * @apioption tooltip.pointFormatter
 */

/**
 * A callback function to place the tooltip in a default position. The
 * callback receives three parameters: `labelWidth`, `labelHeight` and
 * `point`, where point contains values for `plotX` and `plotY` telling
 * where the reference point is in the plot area. Add `chart.plotLeft`
 * and `chart.plotTop` to get the full coordinates.
 * 
 * The return should be an object containing x and y values, for example
 * `{ x: 100, y: 100 }`.
 * 
 * @type {Function}
 * @sample {highcharts} highcharts/tooltip/positioner/ A fixed tooltip position
 * @sample {highstock} highcharts/tree/master/samples/stock/tooltip/positioner/ A fixed tooltip position on top of the chart
 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/positioner/ A fixed tooltip position
 * @since 2.2.4
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.positioner docs to actual source code
 * @apioption tooltip.positioner
 */

/**
 * The name of a symbol to use for the border around the tooltip. In
 * Highcharts 3.x and less, the shape was `square`.
 * 
 * @type {String}
 * @default {all} callout
 * @since 4.0
 * @product highcharts highstock
 * @todo Copy tooltip.shape docs to actual source code
 * @apioption tooltip.shape
 */

/**
 * When the tooltip is shared, the entire plot area will capture mouse
 * movement or touch events. Tooltip texts for series types with ordered
 * data (not pie, scatter, flags etc) will be shown in a single bubble.
 * This is recommended for single series charts and for tablet/mobile
 * optimized charts.
 * 
 * See also [tooltip.split](#tooltip.split), that is better suited for
 * charts with many series, especially line-type series.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/tooltip/shared-false/ False by default
 * @sample {highcharts} highcharts/tooltip/shared-true/ True
 * @sample {highcharts} highcharts/tooltip/shared-x-crosshair/ True with x axis crosshair
 * @sample {highcharts} highcharts/tooltip/shared-true-mixed-types/ True with mixed series types
 * @default {highcharts} false
 * @default {highstock} true
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy tooltip.shared docs to actual source code
 * @apioption tooltip.shared
 */

/**
 * Split the tooltip into one label per series, with the header close
 * to the axis. This is recommended over [shared](#tooltip.shared) tooltips
 * for charts with multiple line series, generally making them easier
 * to read.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/tooltip/split/ Split tooltip
 * @sample {highstock} highcharts/tooltip/split/ Split tooltip
 * @sample {highmaps} highcharts/tooltip/split/ Split tooltip
 * @default {all} false
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.split docs to actual source code
 * @apioption tooltip.split
 */

/**
 * Use HTML to render the contents of the tooltip instead of SVG. Using
 * HTML allows advanced formatting like tables and images in the tooltip.
 * It is also recommended for rtl languages as it works around rtl
 * bugs in early Firefox.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/tooltip/footerformat/ A table for value alignment
 * @sample {highcharts} highcharts/tooltip/fullhtml/ Full HTML tooltip
 * @sample {highstock} highcharts/tooltip/footerformat/ A table for value alignment
 * @sample {highstock} highcharts/tooltip/fullhtml/ Full HTML tooltip
 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/usehtml/ Pure HTML tooltip
 * @default {all} false
 * @since 2.2
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.useHTML docs to actual source code
 * @apioption tooltip.useHTML
 */

/**
 * How many decimals to show in each series' y value. This is overridable
 * in each series' tooltip options object. The default is to preserve
 * all decimals.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highstock} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @since 2.2
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.valueDecimals docs to actual source code
 * @apioption tooltip.valueDecimals
 */

/**
 * A string to prepend to each series' y value. Overridable in each
 * series' tooltip options object.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highstock} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @since 2.2
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.valuePrefix docs to actual source code
 * @apioption tooltip.valuePrefix
 */

/**
 * A string to append to each series' y value. Overridable in each series'
 * tooltip options object.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highstock} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highmaps} highcharts/tree/master/samples/maps/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @since 2.2
 * @product highcharts highstock highmaps
 * @todo Copy tooltip.valueSuffix docs to actual source code
 * @apioption tooltip.valueSuffix
 */

/**
 * The format for the date in the tooltip header if the X axis is a
 * datetime axis. The default is a best guess based on the smallest
 * distance between points in the chart.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/tooltip/xdateformat/ A different format
 * @product highcharts highstock
 * @todo Copy tooltip.xDateFormat docs to actual source code
 * @apioption tooltip.xDateFormat
 */

/**
 * Whether to allow decimals in this axis' ticks. When counting integers,
 * like persons or hits on a web page, decimals should be avoided in
 * the labels.
 * 
 * @type {Boolean}
 * @see [minTickInterval](#xAxis.minTickInterval)
 * @sample {highcharts} highcharts/yaxis/allowdecimals-true/ True by default
 * @sample {highcharts} highcharts/yaxis/allowdecimals-false/ False
 * @sample {highstock} highcharts/yaxis/allowdecimals-true/ True by default
 * @sample {highstock} highcharts/yaxis/allowdecimals-false/ False
 * @default {all} true
 * @since 2.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.allowDecimals docs to actual source code
 * @apioption xAxis.allowDecimals
 */

/**
 * When using an alternate grid color, a band is painted across the
 * plot area between every other grid line.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/yaxis/alternategridcolor/ Alternate grid color on the Y axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/alternategridcolor/ Alternate grid color on the Y axis
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.alternateGridColor docs to actual source code
 * @apioption xAxis.alternateGridColor
 */

/**
 * If categories are present for the xAxis, names are used instead of
 * numbers for that axis. Since Highcharts 3.0, categories can also
 * be extracted by giving each point a [name](#series.data) and setting
 * axis [type](#xAxis.type) to `category`. However, if you have multiple
 * series, best practice remains defining the `categories` array.
 * 
 * Example:
 * 
 * <pre>categories: ['Apples', 'Bananas', 'Oranges']</pre>
 * 
 * Defaults to `null`
 * 
 * @type {Array<String>}
 * @sample {highcharts} highcharts/chart/reflow-true/ With
 * @sample {highcharts} highcharts/xaxis/categories/ Without
 * @product highcharts
 * @todo Copy xAxis.categories docs to actual source code
 * @apioption xAxis.categories
 */

/**
 * The highest allowed value for automatically computed axis extremes.
 * 
 * @type {Number}
 * @see [floor](#xAxis.floor)
 * @sample {highcharts} highcharts/yaxis/floor-ceiling/ Floor and ceiling
 * @sample {highstock} highcharts/yaxis/floor-ceiling/ Floor and ceiling
 * @since 4.0
 * @product highcharts highstock
 * @todo Copy xAxis.ceiling docs to actual source code
 * @apioption xAxis.ceiling
 */

/**
 * A class name that opens for styling the axis by CSS, especially in
 * Highcharts [styled mode](http://www.highcharts.com/docs/chart-design-
 * and-style/style-by-css). The class name is applied to group elements
 * for the grid, axis elements and labels.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/css/axis/ Multiple axes with separate styling
 * @sample {highstock} highcharts/css/axis/ Multiple axes with separate styling
 * @sample {highmaps} highcharts/css/axis/ Multiple axes with separate styling
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.className docs to actual source code
 * @apioption xAxis.className
 */

/**
 * _Requires Accessibility module_
 * 
 * Description of the axis to screen reader users.
 * 
 * @type {String}
 * @default {all} undefined
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.description docs to actual source code
 * @apioption xAxis.description
 */

/**
 * The lowest allowed value for automatically computed axis extremes.
 * 
 * @type {Number}
 * @see [ceiling](#yAxis.ceiling)
 * @sample {highcharts} highcharts/yaxis/floor-ceiling/ Floor and ceiling
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/lazy-loading/ Prevent negative stock price on Y axis
 * @default {all} null
 * @since 4.0
 * @product highcharts highstock
 * @todo Copy xAxis.floor docs to actual source code
 * @apioption xAxis.floor
 */

/**
 * The dash or dot style of the grid lines. For possible values, see
 * [this demonstration](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-
 * dashstyle-all/).
 * 
 * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/gridlinedashstyle/ Long dashes
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/gridlinedashstyle/ Long dashes
 * @default {all} Solid
 * @since 1.2
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.gridLineDashStyle docs to actual source code
 * @apioption xAxis.gridLineDashStyle
 */

/**
 * The width of the grid lines extending the ticks across the plot area.
 * 
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the stroke width is given in the `.highcharts-
 * grid-line` class.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/gridlinewidth/ 2px lines
 * @sample {highcharts} highcharts/css/axis-grid/ Styled mode
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/gridlinewidth/ 2px lines
 * @sample {highstock} highcharts/css/axis-grid/ Styled mode
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.gridLineWidth docs to actual source code
 * @apioption xAxis.gridLineWidth
 */

/**
 * The Z index of the grid lines.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/gridzindex/ A Z index of 4 renders the grid above the graph
 * @sample {highstock} highcharts/xaxis/gridzindex/ A Z index of 4 renders the grid above the graph
 * @default {all} 1
 * @product highcharts highstock
 * @todo Copy xAxis.gridZIndex docs to actual source code
 * @apioption xAxis.gridZIndex
 */

/**
 * An id for the axis. This can be used after render time to get a pointer
 * to the axis object through `chart.get()`.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/id/ Get the object
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/id/ Get the object
 * @default {all} null
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.id docs to actual source code
 * @apioption xAxis.id
 */

/**
 * Index of another axis that this axis is linked to. When an axis is
 * linked to a master axis, it will take the same extremes as the master,
 * but as assigned by min or max or by setExtremes. It can be used
 * to show additional info, or to ease reading the chart by duplicating
 * the scales.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/linkedto/ Different string formats of the same date
 * @sample {highcharts} highcharts/yaxis/linkedto/ Y values on both sides
 * @default {all} null
 * @since 2.0.2
 * @product highcharts highstock
 * @todo Copy xAxis.linkedTo docs to actual source code
 * @apioption xAxis.linkedTo
 */

/**
 * The maximum value of the axis. If `null`, the max value is automatically
 * calculated. If the `endOnTick` option is true, the `max` value might
 * be rounded up.
 * 
 * If a [tickAmount](#yAxis.tickAmount) is set, the axis may be extended
 * beyond the set max in order to reach the given number of ticks. The
 * same may happen in a chart with multiple axes, determined by [chart.
 * alignTicks](#chart), where a `tickAmount` is applied internally.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/max-200/ Y axis max of 200
 * @sample {highcharts} highcharts/yaxis/max-logarithmic/ Y axis max on logarithmic axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/min-max/ Fixed min and max
 * @sample {highmaps} highcharts/tree/master/samples/maps/axis/min-max/ Pre-zoomed to a specific area
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.max docs to actual source code
 * @apioption xAxis.max
 */

/**
 * Deprecated. Renamed to `minRange` as of Highcharts 2.2.
 * 
 * @type {Number}
 * @deprecated
 * @product highcharts highstock
 * @todo Copy xAxis.maxZoom docs to actual source code
 * @apioption xAxis.maxZoom
 */

/**
 * The minimum value of the axis. If `null` the min value is automatically
 * calculated. If the `startOnTick` option is true, the `min` value
 * might be rounded down.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/min-startontick-false/ -50 with startOnTick to false
 * @sample {highcharts} highcharts/yaxis/min-startontick-true/ -50 with startOnTick true by default
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/min-max/ Fixed min and max
 * @sample {highmaps} highcharts/tree/master/samples/maps/axis/min-max/ Pre-zoomed to a specific area
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.min docs to actual source code
 * @apioption xAxis.min
 */

/**
 * The minimum range to display on this axis. The entire axis will not
 * be allowed to span over a smaller interval than this. For example,
 * for a datetime axis the main unit is milliseconds. If minRange is
 * set to 3600000, you can't zoom in more than to one hour.
 * 
 * The default minRange for the x axis is five times the smallest interval
 * between any of the data points.
 * 
 * On a logarithmic axis, the unit for the minimum range is the power.
 * So a minRange of 1 means that the axis can be zoomed to 10-100,
 * 100-1000, 1000-10000 etc.
 * 
 * Note that the `minPadding`, `maxPadding`, `startOnTick` and `endOnTick`
 * settings also affect how the extremes of the axis are computed.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/minrange/ Minimum range of 5
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/minrange/ Max zoom of 6 months overrides user selections
 * @sample {highmaps} highcharts/tree/master/samples/maps/axis/minrange/ Minimum range of 1000
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.minRange docs to actual source code
 * @apioption xAxis.minRange
 */

/**
 * The minimum tick interval allowed in axis values. For example on
 * zooming in on an axis with daily data, this can be used to prevent
 * the axis from showing hours. Defaults to the closest distance between
 * two points on the axis.
 * 
 * @type {Number}
 * @since 2.3.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.minTickInterval docs to actual source code
 * @apioption xAxis.minTickInterval
 */

/**
 * The dash or dot style of the minor grid lines. For possible values,
 * see [this demonstration](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-
 * dashstyle-all/).
 * 
 * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/minorgridlinedashstyle/ Long dashes on minor grid lines
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/minorgridlinedashstyle/ Long dashes on minor grid lines
 * @default {all} Solid
 * @since 1.2
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.minorGridLineDashStyle docs to actual source code
 * @apioption xAxis.minorGridLineDashStyle
 */

/**
 * Tick interval in scale units for the minor ticks. On a linear axis,
 * if `"auto"`, the minor tick interval is calculated as a fifth of
 * the tickInterval. If `null`, minor ticks are not shown.
 * 
 * On logarithmic axes, the unit is the power of the value. For example,
 * setting the minorTickInterval to 1 puts one tick on each of 0.1,
 * 1, 10, 100 etc. Setting the minorTickInterval to 0.1 produces 9
 * ticks between 1 and 10, 10 and 100 etc. A minorTickInterval of "auto"
 * on a log axis results in a best guess, attempting to enter approximately
 * 5 minor ticks between each major tick.
 * 
 * If user settings dictate minor ticks to become too dense, they don't
 * make sense, and will be ignored to prevent performance problems.
 * 
 * On axes using [categories](#xAxis.categories), minor ticks are not
 * supported.
 * 
 * @type {String|Number}
 * @sample {highcharts} highcharts/yaxis/minortickinterval-null/ Null by default
 * @sample {highcharts} highcharts/yaxis/minortickinterval-auto/ "auto" on linear Y axis
 * @sample {highcharts} highcharts/yaxis/minortickinterval-5/ 5 units
 * @sample {highcharts} highcharts/yaxis/minortickinterval-log-auto/ "auto"
 * @sample {highcharts} highcharts/yaxis/minortickinterval-log/ 0.1
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/basic-line/ Null by default
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/minortickinterval-auto/ "auto"
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.minorTickInterval docs to actual source code
 * @apioption xAxis.minorTickInterval
 */

/**
 * The pixel width of the minor tick mark.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/minortickwidth/ 3px width
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/minorticks/ 1px width
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.minorTickWidth docs to actual source code
 * @apioption xAxis.minorTickWidth
 */

/**
 * The distance in pixels from the plot area to the axis line. A positive
 * offset moves the axis with it's line, labels and ticks away from
 * the plot area. This is typically used when two or more axes are displayed
 * on the same side of the plot. With multiple axes the offset is dynamically
 * adjusted to avoid collision, this can be overridden by setting offset
 * explicitly.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/offset/ Y axis offset of 70
 * @sample {highcharts} highcharts/yaxis/offset-centered/ Axes positioned in the center of the plot
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/offset/ Y axis offset by 70 px
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.offset docs to actual source code
 * @apioption xAxis.offset
 */

/**
 * Whether to display the axis on the opposite side of the normal. The
 * normal is on the left side for vertical axes and bottom for horizontal,
 * so the opposite sides will be right and top respectively. This is
 * typically used with dual or multiple axes.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/yaxis/opposite/ Secondary Y axis opposite
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/opposite/ Y axis on left side
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.opposite docs to actual source code
 * @apioption xAxis.opposite
 */

/**
 * Whether to reverse the axis so that the highest number is closest
 * to the origin. If the chart is inverted, the x axis is reversed by
 * default.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/yaxis/reversed/ Reversed Y axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/reversed/ Reversed Y axis
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.reversed docs to actual source code
 * @apioption xAxis.reversed
 */

/**
 * Whether to show the axis line and title when the axis has no data.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/yaxis/showempty/ When clicking the legend to hide series, one axis preserves line and title, the other doesn't
 * @sample {highstock} highcharts/yaxis/showempty/ When clicking the legend to hide series, one axis preserves line and title, the other doesn't
 * @default {all} true
 * @since 1.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.showEmpty docs to actual source code
 * @apioption xAxis.showEmpty
 */

/**
 * Whether to show the first tick label.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/showfirstlabel-false/ Set to false on X axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/showfirstlabel/ Labels below plot lines on Y axis
 * @default {all} true
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.showFirstLabel docs to actual source code
 * @apioption xAxis.showFirstLabel
 */

/**
 * Whether to show the last tick label.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/showlastlabel-true/ Set to true on X axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/showfirstlabel/ Labels below plot lines on Y axis
 * @default {all} true
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.showLastLabel docs to actual source code
 * @apioption xAxis.showLastLabel
 */

/**
 * A soft maximum for the axis. If the series data maximum is less than
 * this, the axis will stay at this maximum, but if the series data
 * maximum is higher, the axis will flex to show all data.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @since 5.0.1
 * @product highcharts
 * @todo Copy xAxis.softMax docs to actual source code
 * @apioption xAxis.softMax
 */

/**
 * A soft minimum for the axis. If the series data minimum is greater
 * than this, the axis will stay at this minimum, but if the series
 * data minimum is lower, the axis will flex to show all data.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @sample {highstock} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @sample {highmaps} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @since 5.0.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.softMin docs to actual source code
 * @apioption xAxis.softMin
 */

/**
 * The amount of ticks to draw on the axis. This opens up for aligning
 * the ticks of multiple charts or panes within a chart. This option
 * overrides the `tickPixelInterval` option.
 * 
 * This option only has an effect on linear axes. Datetime, logarithmic
 * or category axes are not affected.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/tickamount/ 8 ticks on Y axis
 * @sample {highstock} highcharts/yaxis/tickamount/ 8 ticks on Y axis
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy xAxis.tickAmount docs to actual source code
 * @apioption xAxis.tickAmount
 */

/**
 * The interval of the tick marks in axis units. When `null`, the tick
 * interval is computed to approximately follow the [tickPixelInterval](#xAxis.
 * tickPixelInterval) on linear and datetime axes. On categorized axes,
 * a `null` tickInterval will default to 1, one category. Note that
 * datetime axes are based on milliseconds, so for example an interval
 * of one day is expressed as `24 * 3600 * 1000`.
 * 
 * On logarithmic axes, the tickInterval is based on powers, so a tickInterval
 * of 1 means one tick on each of 0.1, 1, 10, 100 etc. A tickInterval
 * of 2 means a tick of 0.1, 10, 1000 etc. A tickInterval of 0.2 puts
 * a tick on 0.1, 0.2, 0.4, 0.6, 0.8, 1, 2, 4, 6, 8, 10, 20, 40 etc.
 * 
 * 
 * If the tickInterval is too dense for labels to be drawn, Highcharts
 * may remove ticks.
 * 
 * If the chart has multiple axes, the [alignTicks](#chart.alignTicks)
 * option may interfere with the `tickInterval` setting.
 * 
 * @type {Number}
 * @see [tickPixelInterval](#xAxis.tickPixelInterval), [tickPositions](#xAxis.
 * tickPositions), [tickPositioner](#xAxis.tickPositioner)
 * @sample {highcharts} highcharts/xaxis/tickinterval-5/ Tick interval of 5 on a linear axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/tickinterval/ Tick interval of 0.01 on Y axis
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.tickInterval docs to actual source code
 * @apioption xAxis.tickInterval
 */

/**
 * A callback function returning array defining where the ticks are
 * laid out on the axis. This overrides the default behaviour of [tickPixelInterval](#xAxis.
 * tickPixelInterval) and [tickInterval](#xAxis.tickInterval). The automatic
 * tick positions are accessible through `this.tickPositions` and can
 * be modified by the callback.
 * 
 * @type {Function}
 * @see [tickPositions](#xAxis.tickPositions)
 * @sample {highcharts} highcharts/xaxis/tickpositions-tickpositioner/ Demo of tickPositions and tickPositioner
 * @sample {highstock} highcharts/xaxis/tickpositions-tickpositioner/ Demo of tickPositions and tickPositioner
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.tickPositioner docs to actual source code
 * @apioption xAxis.tickPositioner
 */

/**
 * An array defining where the ticks are laid out on the axis. This
 * overrides the default behaviour of [tickPixelInterval](#xAxis.tickPixelInterval)
 * and [tickInterval](#xAxis.tickInterval).
 * 
 * @type {Array<Number>}
 * @see [tickPositioner](#xAxis.tickPositioner)
 * @sample {highcharts} highcharts/xaxis/tickpositions-tickpositioner/ Demo of tickPositions and tickPositioner
 * @sample {highstock} highcharts/xaxis/tickpositions-tickpositioner/ Demo of tickPositions and tickPositioner
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.tickPositions docs to actual source code
 * @apioption xAxis.tickPositions
 */

/**
 * The pixel width of the major tick marks.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the stroke width is given in the `.highcharts-
 * tick` class.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/tickwidth/ 10 px width
 * @sample {highcharts} highcharts/css/axis-grid/ Styled mode
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/ticks/ Formatted ticks on X axis
 * @sample {highstock} highcharts/css/axis-grid/ Styled mode
 * @default {highcharts} 1
 * @default {highstock} 1
 * @default {highmaps} 0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.tickWidth docs to actual source code
 * @apioption xAxis.tickWidth
 */

/**
 * Applies only when the axis `type` is `category`. When `uniqueNames`
 * is true, points are placed on the X axis according to their names.
 * If the same point name is repeated in the same or another series,
 * the point is placed on the same X position as other points of the
 * same name. When `uniqueNames` is false, the points are laid out in
 * increasing X positions regardless of their names, and the X axis
 * category will take the name of the last point in each position.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/uniquenames-true/ True by default
 * @sample {highcharts} highcharts/xaxis/uniquenames-false/ False
 * @default {all} true
 * @since 4.2.7
 * @product highcharts
 * @todo Copy xAxis.uniqueNames docs to actual source code
 * @apioption xAxis.uniqueNames
 */

/**
 * Datetime axis only. An array determining what time intervals the
 * ticks are allowed to fall on. Each array item is an array where the
 * first value is the time unit and the second value another array of
 * allowed multiples. Defaults to:
 * 
 * <pre>units: [[
 * 'millisecond', // unit name
 * [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
 * ], [
 * 'second',
 * [1, 2, 5, 10, 15, 30]
 * ], [
 * 'minute',
 * [1, 2, 5, 10, 15, 30]
 * ], [
 * 'hour',
 * [1, 2, 3, 4, 6, 8, 12]
 * ], [
 * 'day',
 * [1]
 * ], [
 * 'week',
 * [1]
 * ], [
 * 'month',
 * [1, 3, 6]
 * ], [
 * 'year',
 * null
 * ]]</pre>
 * 
 * @type {Array}
 * @product highcharts highstock
 * @todo Copy xAxis.units docs to actual source code
 * @apioption xAxis.units
 */

/**
 * Whether axis, including axis title, line, ticks and labels, should
 * be visible.
 * 
 * @type {Boolean}
 * @default {all} true
 * @since 4.1.9
 * @product highcharts highstock
 * @todo Copy xAxis.visible docs to actual source code
 * @apioption xAxis.visible
 */

/**
 * An array defining breaks in the axis, the sections defined will be
 * left out and all the points shifted closer to each other. Requires
 * that the broken-axis.js module is loaded.
 * 
 * @type {Array}
 * @sample {highcharts} highcharts/axisbreak/break-simple/ Simple break
 * @sample {highcharts} highcharts/axisbreak/break-visualized/ Advanced with callback
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/intraday-breaks/ Break on nights and weekends
 * @sample {highstock} highcharts/axisbreak/break-visualized/ Broken Y axis
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy xAxis.breaks docs to actual source code
 * @apioption xAxis.breaks
 */

/**
 * A number indicating how much space should be left between the start
 * and the end of the break. The break size is given in axis units,
 * so for instance on a `datetime` axis, a break size of 3600000 would
 * indicate the equivalent of an hour.
 * 
 * @type {Number}
 * @default {all} 0
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy xAxis.breaks.breakSize docs to actual source code
 * @apioption xAxis.breaks.breakSize
 */

/**
 * The point where the break starts.
 * 
 * @type {Number}
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy xAxis.breaks.from docs to actual source code
 * @apioption xAxis.breaks.from
 */

/**
 * Defines an interval after which the break appears again. By default
 * the breaks do not repeat.
 * 
 * @type {Number}
 * @default {all} 0
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy xAxis.breaks.repeat docs to actual source code
 * @apioption xAxis.breaks.repeat
 */

/**
 * The point where the break ends.
 * 
 * @type {Number}
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy xAxis.breaks.to docs to actual source code
 * @apioption xAxis.breaks.to
 */

/**
 * Configure a crosshair that follows either the mouse pointer or the
 * hovered point.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the crosshairs are styled in the `.highcharts-
 * crosshair`, `.highcharts-crosshair-thin` or `.highcharts-xaxis-category`
 * classes.
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/xaxis/crosshair-both/ Crosshair on both axes
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/crosshairs-xy/ Crosshair on both axes
 * @sample {highmaps} highcharts/xaxis/crosshair-both/ Crosshair on both axes
 * @default {all} false
 * @since 4.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.crosshair docs to actual source code
 * @apioption xAxis.crosshair
 */

/**
 * A class name for the crosshair, especially as a hook for styling.
 * 
 * @type {String}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.crosshair.className docs to actual source code
 * @apioption xAxis.crosshair.className
 */

/**
 * The color of the crosshair. Defaults to `#cccccc` for numeric and
 * datetime axes, and `rgba(204,214,235,0.25)` for category axes, where
 * the crosshair by default highlights the whole category.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/xaxis/crosshair-customized/ Customized crosshairs
 * @sample {highstock} highcharts/xaxis/crosshair-customized/ Customized crosshairs
 * @sample {highmaps} highcharts/xaxis/crosshair-customized/ Customized crosshairs
 * @default {all} #cccccc
 * @since 4.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.crosshair.color docs to actual source code
 * @apioption xAxis.crosshair.color
 */

/**
 * The dash style for the crosshair. See [series.dashStyle](#plotOptions.
 * series.dashStyle) for possible values.
 * 
 * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/crosshair-dotted/ Dotted crosshair
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/crosshair-dashed/ Dashed X axis crosshair
 * @sample {highmaps} highcharts/xaxis/crosshair-dotted/ Dotted crosshair
 * @default {all} Solid
 * @since 4.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.crosshair.dashStyle docs to actual source code
 * @apioption xAxis.crosshair.dashStyle
 */

/**
 * Whether the crosshair should snap to the point or follow the pointer
 * independent of points.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/crosshair-snap-false/ True by default
 * @sample {highstock} highcharts/xaxis/crosshair-snap-false/ True by default
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/latlon-advanced/ Snap is false
 * @default {all} true
 * @since 4.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.crosshair.snap docs to actual source code
 * @apioption xAxis.crosshair.snap
 */

/**
 * The pixel width of the crosshair. Defaults to 1 for numeric or datetime
 * axes, and for one category width for category axes.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/crosshair-customized/ Customized crosshairs
 * @sample {highstock} highcharts/xaxis/crosshair-customized/ Customized crosshairs
 * @sample {highmaps} highcharts/xaxis/crosshair-customized/ Customized crosshairs
 * @default {all} 1
 * @since 4.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.crosshair.width docs to actual source code
 * @apioption xAxis.crosshair.width
 */

/**
 * The Z index of the crosshair. Higher Z indices allow drawing the
 * crosshair on top of the series or behind the grid lines.
 * 
 * @type {Number}
 * @default {all} 2
 * @since 4.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.crosshair.zIndex docs to actual source code
 * @apioption xAxis.crosshair.zIndex
 */

/**
 * Event handlers for the axis.
 * 
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.events docs to actual source code
 * @apioption xAxis.events
 */

/**
 * An event fired after the breaks have rendered.
 * 
 * @type {Function}
 * @see [breaks](#xAxis.breaks)
 * @sample {highcharts} highcharts/axisbreak/break-event// AfterBreak Event
 * @since 4.1.0
 * @product highcharts
 * @todo Copy xAxis.events.afterBreaks docs to actual source code
 * @apioption xAxis.events.afterBreaks
 */

/**
 * As opposed to the `setExtremes` event, this event fires after the
 * final min and max values are computed and corrected for `minRange`.
 * 
 * 
 * Fires when the minimum and maximum is set for the axis, either by
 * calling the `.setExtremes()` method or by selecting an area in the
 * chart. One parameter, `event`, is passed to the function. This contains
 * common event information based on jQuery or MooTools depending on
 * which library is used as the base for Highcharts.
 * 
 * The new user set minimum and maximum values can be found by `event.
 * min` and `event.max`. These reflect the axis minimum and maximum
 * in axis values. The actual data extremes are found in `event.dataMin`
 * and `event.dataMax`.
 * 
 * @type {Function}
 * @context Axis
 * @since 2.3
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.events.afterSetExtremes docs to actual source code
 * @apioption xAxis.events.afterSetExtremes
 */

/**
 * An event fired when a break from this axis occurs on a point.
 * 
 * @type {Function}
 * @see [breaks](#xAxis.breaks)
 * @context Axis
 * @sample {highcharts} highcharts/axisbreak/break-visualized/ Visualization of a Break
 * @since 4.1.0
 * @product highcharts
 * @todo Copy xAxis.events.pointBreak docs to actual source code
 * @apioption xAxis.events.pointBreak
 */

/**
 * An event fired when a point falls inside a break from this axis.
 * 
 * @type {Function}
 * @context Axis
 * @product highcharts highstock
 * @todo Copy xAxis.events.pointInBreak docs to actual source code
 * @apioption xAxis.events.pointInBreak
 */

/**
 * Fires when the minimum and maximum is set for the axis, either by
 * calling the `.setExtremes()` method or by selecting an area in the
 * chart. One parameter, `event`, is passed to the function. This contains
 * common event information based on jQuery or MooTools depending on
 * which library is used as the base for Highcharts.
 * 
 * The new user set minimum and maximum values can be found by `event.
 * min` and `event.max`. These reflect the axis minimum and maximum
 * in data values. When an axis is zoomed all the way out from the "Reset
 * zoom" button, `event.min` and `event.max` are null, and the new extremes
 * are set based on `this.dataMin` and `this.dataMax`.
 * 
 * @type {Function}
 * @context Axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/events-setextremes/ Log new extremes on x axis
 * @since 1.2.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.events.setExtremes docs to actual source code
 * @apioption xAxis.events.setExtremes
 */

/**
 * What part of the string the given position is anchored to. If `left`,
 * the left side of the string is at the axis position. Can be one
 * of `"left"`, `"center"` or `"right"`. Defaults to an intelligent
 * guess based on which side of the chart the axis is on and the rotation
 * of the label.
 * 
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/labels-align-left/ Left
 * @sample {highcharts} highcharts/xaxis/labels-align-right/ Right
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.align docs to actual source code
 * @apioption xAxis.labels.align
 */

/**
 * For horizontal axes, the allowed degrees of label rotation to prevent
 * overlapping labels. If there is enough space, labels are not rotated.
 * As the chart gets narrower, it will start rotating the labels -45
 * degrees, then remove every second label and try again with rotations
 * 0 and -45 etc. Set it to `false` to disable rotation, which will
 * cause the labels to word-wrap if possible.
 * 
 * @type {Array<Number>}
 * @sample {highcharts} highcharts/xaxis/labels-autorotation-default/ Default auto rotation of 0 or -45
 * @sample {highcharts} highcharts/xaxis/labels-autorotation-0-90/ Custom graded auto rotation
 * @sample {highstock} highcharts/xaxis/labels-autorotation-default/ Default auto rotation of 0 or -45
 * @sample {highstock} highcharts/xaxis/labels-autorotation-0-90/ Custom graded auto rotation
 * @default {all} [-45]
 * @since 4.1.0
 * @product highcharts highstock
 * @todo Copy xAxis.labels.autoRotation docs to actual source code
 * @apioption xAxis.labels.autoRotation
 */

/**
 * When each category width is more than this many pixels, we don't
 * apply auto rotation. Instead, we lay out the axis label with word
 * wrap. A lower limit makes sense when the label contains multiple
 * short words that don't extend the available horizontal space for
 * each label.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-autorotationlimit/ Lower limit
 * @default {all} 80
 * @since 4.1.5
 * @product highcharts
 * @todo Copy xAxis.labels.autoRotationLimit docs to actual source code
 * @apioption xAxis.labels.autoRotationLimit
 */

/**
 * Polar charts only. The label's pixel distance from the perimeter
 * of the plot area.
 * 
 * @type {Number}
 * @default {all} 15
 * @product highcharts
 * @todo Copy xAxis.labels.distance docs to actual source code
 * @apioption xAxis.labels.distance
 */

/**
 * A [format string](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting) for the axis label.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/labels-format/ Add units to Y axis label
 * @sample {highstock} highcharts/yaxis/labels-format/ Add units to Y axis label
 * @default {all} {value}
 * @since 3.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.format docs to actual source code
 * @apioption xAxis.labels.format
 */

/**
 * Callback JavaScript function to format the label. The value is given
 * by `this.value`. Additional properties for `this` are `axis`, `chart`,
 * `isFirst` and `isLast`. The value of the default label formatter
 * can be retrieved by calling `this.axis.defaultLabelFormatter.call(this)`
 * within the function.
 * 
 * Defaults to:
 * 
 * <pre>function() {
 * return this.value;
 * }</pre>
 * 
 * @type {Function}
 * @sample {highcharts} highcharts/xaxis/labels-formatter-linked/ Linked category names
 * @sample {highcharts} highcharts/xaxis/labels-formatter-extended/ Modified numeric labels
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/labels-formatter/ Added units on Y axis
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.formatter docs to actual source code
 * @apioption xAxis.labels.formatter
 */

/**
 * How to handle overflowing labels on horizontal axis. Can be undefined,
 * `false` or `"justify"`. By default it aligns inside the chart area.
 * If "justify", labels will not render outside the plot area. If `false`,
 * it will not be aligned at all. If there is room to move it, it will
 * be aligned to the edge, else it will be removed.
 * 
 * @validvalue [null, "justify"]
 * @type {String}
 * @deprecated
 * @since 2.2.5
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.overflow docs to actual source code
 * @apioption xAxis.labels.overflow
 */

/**
 * The pixel padding for axis labels, to ensure white space between
 * them.
 * 
 * @type {Number}
 * @default {all} 5
 * @product highcharts
 * @todo Copy xAxis.labels.padding docs to actual source code
 * @apioption xAxis.labels.padding
 */

/**
 * Whether to reserve space for the labels. This can be turned off when
 * for example the labels are rendered inside the plot area instead
 * of outside.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/labels-reservespace/ No reserved space, labels inside plot
 * @default {all} true
 * @since 4.1.10
 * @product highcharts
 * @todo Copy xAxis.labels.reserveSpace docs to actual source code
 * @apioption xAxis.labels.reserveSpace
 */

/**
 * Rotation of the labels in degrees.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-rotation/ X axis labels rotated 90°
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.rotation docs to actual source code
 * @apioption xAxis.labels.rotation
 */

/**
 * Horizontal axes only. The number of lines to spread the labels over
 * to make room or tighter labels. .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-staggerlines/ Show labels over two lines
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/labels-staggerlines/ Show labels over two lines
 * @default {all} null
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.staggerLines docs to actual source code
 * @apioption xAxis.labels.staggerLines
 */

/**
 * To show only every _n_'th label on the axis, set the step to _n_.
 * Setting the step to 2 shows every other label.
 * 
 * By default, the step is calculated automatically to avoid overlap.
 * To prevent this, set it to 1\. This usually only happens on a category
 * axis, and is often a sign that you have chosen the wrong axis type.
 * Read more at [Axis docs](http://www.highcharts.com/docs/chart-concepts/axes)
 * => What axis should I use?
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-step/ Showing only every other axis label on a categorized x axis
 * @sample {highcharts} highcharts/xaxis/labels-step-auto/ Auto steps on a category axis
 * @default {all} null
 * @since 2.1
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.step docs to actual source code
 * @apioption xAxis.labels.step
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the labels.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.useHTML docs to actual source code
 * @apioption xAxis.labels.useHTML
 */

/**
 * The y position offset of the label relative to the tick position
 * on the axis. The default makes it adapt to the font size on bottom
 * axis.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-x/ Y axis labels placed on grid lines
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.y docs to actual source code
 * @apioption xAxis.labels.y
 */

/**
 * The Z index for the axis labels.
 * 
 * @type {Number}
 * @default {all} 7
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.labels.zIndex docs to actual source code
 * @apioption xAxis.labels.zIndex
 */

/**
 * An array of colored bands stretching across the plot area marking
 * an interval on the axis.
 * 
 * In a gauge, a plot band on the Y axis (value axis) will stretch along
 * the perimeter of the gauge.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the plot bands are styled by the `.highcharts-
 * plot-band` class in addition to the `className` option.
 * 
 * @type {Array<Object>}
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands docs to actual source code
 * @apioption xAxis.plotBands
 */

/**
 * Border color for the plot band. Also requires `borderWidth` to be
 * set.
 * 
 * @type {Color}
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.borderColor docs to actual source code
 * @apioption xAxis.plotBands.borderColor
 */

/**
 * Border width for the plot band. Also requires `borderColor` to be
 * set.
 * 
 * @type {Number}
 * @default {all} 0
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.borderWidth docs to actual source code
 * @apioption xAxis.plotBands.borderWidth
 */

/**
 * A custom class name, in addition to the default `highcharts-plot-
 * band`, to apply to each individual band.
 * 
 * @type {String}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.plotBands.className docs to actual source code
 * @apioption xAxis.plotBands.className
 */

/**
 * The color of the plot band.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/xaxis/plotbands-color/ Color band
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotbands/ Plot band on Y axis
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.color docs to actual source code
 * @apioption xAxis.plotBands.color
 */

/**
 * An object defining mouse events for the plot band. Supported properties
 * are `click`, `mouseover`, `mouseout`, `mousemove`.
 * 
 * @type {Object}
 * @context PlotLineOrBand
 * @sample {highcharts} highcharts/xaxis/plotbands-events/ Mouse events demonstrated
 * @since 1.2
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.events docs to actual source code
 * @apioption xAxis.plotBands.events
 */

/**
 * The start position of the plot band in axis units.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-color/ Datetime axis
 * @sample {highcharts} highcharts/xaxis/plotbands-from/ Categorized axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotbands/ Plot band on Y axis
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.from docs to actual source code
 * @apioption xAxis.plotBands.from
 */

/**
 * An id used for identifying the plot band in Axis.removePlotBand.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotbands-id/ Remove plot band by id
 * @sample {highstock} highcharts/xaxis/plotbands-id/ Remove plot band by id
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.id docs to actual source code
 * @apioption xAxis.plotBands.id
 */

/**
 * The end position of the plot band in axis units.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-color/ Datetime axis
 * @sample {highcharts} highcharts/xaxis/plotbands-from/ Categorized axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotbands/ Plot band on Y axis
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.to docs to actual source code
 * @apioption xAxis.plotBands.to
 */

/**
 * The z index of the plot band within the chart, relative to other
 * elements. Using the same z index as another element may give unpredictable
 * results, as the last rendered element will be on top. Values from
 * 0 to 20 make sense.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-color/ Behind plot lines by default
 * @sample {highcharts} highcharts/xaxis/plotbands-zindex/ Above plot lines
 * @sample {highcharts} highcharts/xaxis/plotbands-zindex-above-series/ Above plot lines and series
 * @default {all} null
 * @since 1.2
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.zIndex docs to actual source code
 * @apioption xAxis.plotBands.zIndex
 */

/**
 * Text labels for the plot bands
 * 
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label docs to actual source code
 * @apioption xAxis.plotBands.label
 */

/**
 * Horizontal alignment of the label. Can be one of "left", "center"
 * or "right".
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-align/ Aligned to the right
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotbands-label/ Plot band with labels
 * @default {all} center
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.align docs to actual source code
 * @apioption xAxis.plotBands.label.align
 */

/**
 * Rotation of the text label in degrees .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/ Vertical text
 * @default {all} 0
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.rotation docs to actual source code
 * @apioption xAxis.plotBands.label.rotation
 */

/**
 * CSS styles for the text label.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the labels are styled by the `.highcharts-plot-
 * band-label` class.
 * 
 * @type {Object}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-style/ Blue and bold label
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.style docs to actual source code
 * @apioption xAxis.plotBands.label.style
 */

/**
 * The string text itself. A subset of HTML is supported.
 * 
 * @type {String}
 * @since 2.1
 * @product highcharts
 * @todo Copy xAxis.plotBands.label.text docs to actual source code
 * @apioption xAxis.plotBands.label.text
 */

/**
 * The text alignment for the label. While `align` determines where
 * the texts anchor point is placed within the plot band, `textAlign`
 * determines how the text is aligned against its anchor point. Possible
 * values are "left", "center" and "right". Defaults to the same as
 * the `align` option.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/ Vertical text in center position but text-aligned left
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.textAlign docs to actual source code
 * @apioption xAxis.plotBands.label.textAlign
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the labels.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 3.0.3
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.useHTML docs to actual source code
 * @apioption xAxis.plotBands.label.useHTML
 */

/**
 * Vertical alignment of the label relative to the plot band. Can be
 * one of "top", "middle" or "bottom".
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-verticalalign/ Vertically centered label
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotbands-label/ Plot band with labels
 * @default {all} top
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.verticalAlign docs to actual source code
 * @apioption xAxis.plotBands.label.verticalAlign
 */

/**
 * Horizontal position relative the alignment. Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-align/ Aligned 10px from the right edge
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotbands-label/ Plot band with labels
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.x docs to actual source code
 * @apioption xAxis.plotBands.label.x
 */

/**
 * Vertical position of the text baseline relative to the alignment.
 *  Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-y/ Label on x axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotbands-label/ Plot band with labels
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotBands.label.y docs to actual source code
 * @apioption xAxis.plotBands.label.y
 */

/**
 * An array of lines stretching across the plot area, marking a specific
 * value on one of the axes.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the plot lines are styled by the `.highcharts-
 * plot-line` class in addition to the `className` option.
 * 
 * @type {Array<Object>}
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines docs to actual source code
 * @apioption xAxis.plotLines
 */

/**
 * A custom class name, in addition to the default `highcharts-plot-
 * line`, to apply to each individual line.
 * 
 * @type {String}
 * @since 5.0.0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.plotLines.className docs to actual source code
 * @apioption xAxis.plotLines.className
 */

/**
 * The color of the line.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/xaxis/plotlines-color/ A red line from X axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotlines/ Plot line on Y axis
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.color docs to actual source code
 * @apioption xAxis.plotLines.color
 */

/**
 * The dashing or dot style for the plot line. For possible values see
 * [this overview](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-
 * dashstyle-all/).
 * 
 * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-dashstyle/ Dash and dot pattern
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotlines/ Plot line on Y axis
 * @default {all} Solid
 * @since 1.2
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.dashStyle docs to actual source code
 * @apioption xAxis.plotLines.dashStyle
 */

/**
 * An object defining mouse events for the plot line. Supported properties
 * are `click`, `mouseover`, `mouseout`, `mousemove`.
 * 
 * @type {Object}
 * @context PlotLineOrBand
 * @sample {highcharts} highcharts/xaxis/plotlines-events/ Mouse events demonstrated
 * @since 1.2
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.events docs to actual source code
 * @apioption xAxis.plotLines.events
 */

/**
 * An id used for identifying the plot line in Axis.removePlotLine.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-id/ Remove plot line by id
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.id docs to actual source code
 * @apioption xAxis.plotLines.id
 */

/**
 * The position of the line in axis units.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-color/ Between two categories on X axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotlines/ Plot line on Y axis
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.value docs to actual source code
 * @apioption xAxis.plotLines.value
 */

/**
 * The width or thickness of the plot line.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-color/ 2px wide line from X axis
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotlines/ Plot line on Y axis
 * @default {all} null
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.width docs to actual source code
 * @apioption xAxis.plotLines.width
 */

/**
 * The z index of the plot line within the chart.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-zindex-behind/ Behind plot lines by default
 * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above/ Above plot lines
 * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above-all/ Above plot lines and series
 * @default {all} null
 * @since 1.2
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.zIndex docs to actual source code
 * @apioption xAxis.plotLines.zIndex
 */

/**
 * Text labels for the plot bands
 * 
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label docs to actual source code
 * @apioption xAxis.plotLines.label
 */

/**
 * Horizontal alignment of the label. Can be one of "left", "center"
 * or "right".
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/ Aligned to the right
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotlines/ Plot line on Y axis
 * @default {all} left
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.align docs to actual source code
 * @apioption xAxis.plotLines.label.align
 */

/**
 * Rotation of the text label in degrees. Defaults to 0 for horizontal
 * plot lines and 90 for vertical lines.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/ Slanted text
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.rotation docs to actual source code
 * @apioption xAxis.plotLines.label.rotation
 */

/**
 * CSS styles for the text label.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the labels are styled by the `.highcharts-plot-
 * band-label` class.
 * 
 * @type {Object}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-style/ Blue and bold label
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.style docs to actual source code
 * @apioption xAxis.plotLines.label.style
 */

/**
 * The text itself. A subset of HTML is supported.
 * 
 * @type {String}
 * @since 2.1
 * @product highcharts
 * @todo Copy xAxis.plotLines.label.text docs to actual source code
 * @apioption xAxis.plotLines.label.text
 */

/**
 * The text alignment for the label. While `align` determines where
 * the texts anchor point is placed within the plot band, `textAlign`
 * determines how the text is aligned against its anchor point. Possible
 * values are "left", "center" and "right". Defaults to the same as
 * the `align` option.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-textalign/ Text label in bottom position
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.textAlign docs to actual source code
 * @apioption xAxis.plotLines.label.textAlign
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the labels.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 3.0.3
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.useHTML docs to actual source code
 * @apioption xAxis.plotLines.label.useHTML
 */

/**
 * Vertical alignment of the label relative to the plot band. Can be
 * one of "top", "middle" or "bottom".
 * 
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/ Vertically centered label
 * @default {highcharts} top
 * @default {highstock} "top"
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.verticalAlign docs to actual source code
 * @apioption xAxis.plotLines.label.verticalAlign
 */

/**
 * Horizontal position relative the alignment. Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/ Aligned 10px from the right edge
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotlines/ Plot line on Y axis
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.x docs to actual source code
 * @apioption xAxis.plotLines.label.x
 */

/**
 * Vertical position of the text baseline relative to the alignment.
 *  Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-y/ Label below the plot line
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/plotlines/ Plot line on Y axis
 * @since 2.1
 * @product highcharts highstock
 * @todo Copy xAxis.plotLines.label.y docs to actual source code
 * @apioption xAxis.plotLines.label.y
 */

/**
 * Deprecated. Set the `text` to `null` to disable the title.
 * 
 * @type {String}
 * @deprecated
 * @default {all} middle
 * @product highcharts
 * @todo Copy xAxis.title.enabled docs to actual source code
 * @apioption xAxis.title.enabled
 */

/**
 * The pixel distance between the axis labels or line and the title.
 *  Defaults to 0 for horizontal axes, 10 for vertical
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/title-margin/ Y axis title margin of 60
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.title.margin docs to actual source code
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
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.title.offset docs to actual source code
 * @apioption xAxis.title.offset
 */

/**
 * Whether to reserve space for the title when laying out the axis.
 * 
 * @type {Boolean}
 * @default {all} true
 * @since 5.0.11
 * @product highcharts highstock
 * @todo Copy xAxis.title.reserveSpace docs to actual source code
 * @apioption xAxis.title.reserveSpace
 */

/**
 * The rotation of the text in degrees. 0 is horizontal, 270 is vertical
 * reading from bottom to top.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/title-offset/ Horizontal
 * @default {all} 0
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.title.rotation docs to actual source code
 * @apioption xAxis.title.rotation
 */

/**
 * The actual text of the axis title. It can contain basic HTML text
 * markup like <b>, <i> and spans with style.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/title-text/ Custom HTML
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/title-text/ Titles for both axes
 * @default {all} null
 * @product highcharts highstock highmaps
 * @todo Copy xAxis.title.text docs to actual source code
 * @apioption xAxis.title.text
 */

/**
 * Horizontal pixel offset of the title position.
 * 
 * @type {Number}
 * @default {all} 0
 * @since 4.1.6
 * @product highcharts highstock
 * @todo Copy xAxis.title.x docs to actual source code
 * @apioption xAxis.title.x
 */

/**
 * Vertical pixel offset of the title position.
 * 
 * @type {Number}
 * @product highcharts highstock
 * @todo Copy xAxis.title.y docs to actual source code
 * @apioption xAxis.title.y
 */

/**
 * In a polar chart, this is the angle of the Y axis in degrees, where
 * 0 is up and 90 is right. The angle determines the position of the
 * axis line and the labels, though the coordinate system is unaffected.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/angle/ Dual axis polar chart
 * @default {all} 0
 * @since 4.2.7
 * @product highcharts
 * @todo Copy yAxis.angle docs to actual source code
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
 * @default {all} null
 * @product highcharts
 * @todo Copy yAxis.gridLineInterpolation docs to actual source code
 * @apioption yAxis.gridLineInterpolation
 */

/**
 * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
 * to represent the maximum value of the Y axis.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/ Min and max colors
 * @default {all} #003399
 * @since 4.0
 * @product highcharts
 * @todo Copy yAxis.maxColor docs to actual source code
 * @apioption yAxis.maxColor
 */

/**
 * The minimum value of the axis. If `null` the min value is automatically
 * calculated.
 * 
 * If the `startOnTick` option is true (default), the `min` value might
 * be rounded down.
 * 
 * The automatically calculated minimum value is also affected by [floor](#yAxis.
 * floor), [softMin](#yAxis.softMin), [minPadding](#yAxis.minPadding),
 * [minRange](#yAxis.minRange) as well as [series.threshold](#plotOptions.
 * series.threshold) and [series.softThreshold](#plotOptions.series.
 * softThreshold).
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/min-startontick-false/ -50 with startOnTick to false
 * @sample {highcharts} highcharts/yaxis/min-startontick-true/ -50 with startOnTick true by default
 * @sample {highstock} highcharts/yaxis/min-startontick-false/ -50 with startOnTick to false
 * @sample {highstock} highcharts/yaxis/min-startontick-true/ -50 with startOnTick true by default
 * @product highcharts highstock
 * @todo Copy yAxis.min docs to actual source code
 * @apioption yAxis.min
 */

/**
 * Solid gauge only. Unless [stops](#yAxis.stops) are set, the color
 * to represent the minimum value of the Y axis.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/yaxis/mincolor-maxcolor/ Min and max color
 * @default {all} #e6ebf5
 * @since 4.0
 * @product highcharts
 * @todo Copy yAxis.minColor docs to actual source code
 * @apioption yAxis.minColor
 */

/**
 * If `true`, the first series in a stack will be drawn on top in a
 * positive, non-reversed Y axis. If `false`, the first series is in
 * the base of the stack.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/yaxis/reversedstacks-false/ Non-reversed stacks
 * @sample {highstock} highcharts/yaxis/reversedstacks-false/ Non-reversed stacks
 * @default {all} true
 * @since 3.0.10
 * @product highcharts highstock
 * @todo Copy yAxis.reversedStacks docs to actual source code
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
 * @todo Copy yAxis.stops docs to actual source code
 * @apioption yAxis.stops
 */

/**
 * The pixel width of the major tick marks.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/tickwidth/ 10 px width
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/ticks/ Formatted ticks on X axis
 * @default {all} 0
 * @product highcharts highstock
 * @todo Copy yAxis.tickWidth docs to actual source code
 * @apioption yAxis.tickWidth
 */

/**
 * @extends xAxis.events
 * @product highcharts highstock
 * @todo Copy yAxis.events docs to actual source code
 * @apioption yAxis.events
 */

/**
 * What part of the string the given position is anchored to. Can be
 * one of `"left"`, `"center"` or `"right"`. The exact position also
 * depends on the `labels.x` setting. Angular gauges and solid gauges
 * defaults to `center`.
 * 
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/labels-align-left/ "left"
 * @default {highcharts} right
 * @default {highstock} left
 * @default {highmaps} right
 * @product highcharts highstock highmaps
 * @todo Copy yAxis.labels.align docs to actual source code
 * @apioption yAxis.labels.align
 */

/**
 * Angular gauges and solid gauges only. The label's pixel distance
 * from the perimeter of the plot area.
 * 
 * @type {Number}
 * @default {all} -25
 * @product highcharts
 * @todo Copy yAxis.labels.distance docs to actual source code
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
 * @product highcharts highstock highmaps
 * @todo Copy yAxis.labels.y docs to actual source code
 * @apioption yAxis.labels.y
 */

/**
 * An array of objects defining plot bands on the Y axis.
 * 
 * @type {Array<Object>}
 * @extends xAxis.plotBands
 * @product highcharts highstock
 * @todo Copy yAxis.plotBands docs to actual source code
 * @apioption yAxis.plotBands
 */

/**
 * In a gauge chart, this option determines the inner radius of the
 * plot band that stretches along the perimeter. It can be given as
 * a percentage string, like `"100%"`, or as a pixel number, like `100`.
 * By default, the inner radius is controlled by the [thickness](#yAxis.
 * plotBands.thickness) option.
 * 
 * @type {Number|String}
 * @sample {highcharts} highcharts/xaxis/plotbands-gauge Gauge plot band
 * @default {all} null
 * @since 2.3
 * @product highcharts
 * @todo Copy yAxis.plotBands.innerRadius docs to actual source code
 * @apioption yAxis.plotBands.innerRadius
 */

/**
 * In a gauge chart, this option determines the outer radius of the
 * plot band that stretches along the perimeter. It can be given as
 * a percentage string, like `"100%"`, or as a pixel number, like `100`.
 * 
 * @type {Number|String}
 * @sample {highcharts} highcharts/xaxis/plotbands-gauge Gauge plot band
 * @default {all} 100%
 * @since 2.3
 * @product highcharts
 * @todo Copy yAxis.plotBands.outerRadius docs to actual source code
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
 * @default {all} 10
 * @since 2.3
 * @product highcharts
 * @todo Copy yAxis.plotBands.thickness docs to actual source code
 * @apioption yAxis.plotBands.thickness
 */

/**
 * An array of objects representing plot lines on the X axis
 * 
 * @type {Array<Object>}
 * @extends xAxis.plotLines
 * @product highcharts
 * @todo Copy yAxis.plotLines docs to actual source code
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
 * @todo Copy yAxis.stackLabels.align docs to actual source code
 * @apioption yAxis.stackLabels.align
 */

/**
 * A [format string](http://docs.highcharts.com/#formatting) for the
 * data label. Available variables are the same as for `formatter`.
 * 
 * @type {String}
 * @default {all} {total}
 * @since 3.0.2
 * @product highcharts highstock
 * @todo Copy yAxis.stackLabels.format docs to actual source code
 * @apioption yAxis.stackLabels.format
 */

/**
 * Rotation of the labels in degrees.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/stacklabels-rotation/ Labels rotated 45°
 * @default {all} 0
 * @since 2.1.5
 * @product highcharts
 * @todo Copy yAxis.stackLabels.rotation docs to actual source code
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
 * @todo Copy yAxis.stackLabels.textAlign docs to actual source code
 * @apioption yAxis.stackLabels.textAlign
 */

/**
 * Whether to [use HTML](http://docs.highcharts.com/#formatting$html)
 * to render the labels.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 3.0
 * @product highcharts highstock
 * @todo Copy yAxis.stackLabels.useHTML docs to actual source code
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
 * @todo Copy yAxis.stackLabels.verticalAlign docs to actual source code
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
 * @todo Copy yAxis.stackLabels.x docs to actual source code
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
 * @todo Copy yAxis.stackLabels.y docs to actual source code
 * @apioption yAxis.stackLabels.y
 */

/**
 * The pixel distance between the axis labels and the title. Positive
 * values are outside the axis line, negative are inside.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/title-margin/ Y axis title margin of 60
 * @default {all} 40
 * @product highcharts highstock highmaps
 * @todo Copy yAxis.title.margin docs to actual source code
 * @apioption yAxis.title.margin
 */

/**
 * The Z axis or depth axis for 3D plots.
 * 
 * See [the Axis object](#Axis) for programmatic access to the axis.
 * 
 * @extends xAxis
 * @excluding breaks, crosshair, lineColor, lineWidth, nameToX, showEmpty
 * @sample {highcharts} highcharts/3d/scatter-zaxis-categories/ Z-Axis with Categories
 * @sample {highcharts} highcharts/3d/scatter-zaxis-grid/ Z-Axis with styling
 * @since 5.0.0
 * @product highcharts
 * @todo Copy zAxis docs to actual source code
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
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/lazy-loading/ Set to false with async data loading
 * @default {all} true
 * @product highstock
 * @todo Copy navigator.adaptToUpdatedData docs to actual source code
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
 * @default {all} 0
 * @product highstock
 * @todo Copy navigator.baseSeries docs to actual source code
 * @apioption navigator.baseSeries
 */

/**
 * Enable or disable the navigator.
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/navigator/enabled/ Disable the navigator
 * @default {all} true
 * @product highstock
 * @todo Copy navigator.enabled docs to actual source code
 * @apioption navigator.enabled
 */

/**
 * When the chart is inverted, whether to draw the navigator on the
 * opposite side.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 5.0.8
 * @product highstock
 * @todo Copy navigator.opposite docs to actual source code
 * @apioption navigator.opposite
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.candlestick.borderColor docs to actual source code
 * @apioption plotOptions.candlestick.borderColor
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.candlestick.borderRadius docs to actual source code
 * @apioption plotOptions.candlestick.borderRadius
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.candlestick.borderWidth docs to actual source code
 * @apioption plotOptions.candlestick.borderWidth
 */

/**
 * The specific line color for up candle sticks. The default is to inherit
 * the general `lineColor` setting.
 * 
 * @type {Color}
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/candlestick-linecolor/ Candlestick line colors
 * @default {all} null
 * @since 1.3.6
 * @product highstock
 * @todo Copy plotOptions.candlestick.upLineColor docs to actual source code
 * @apioption plotOptions.candlestick.upLineColor
 */

/**
 * The method of approximation inside a group. When for example 30 days
 * are grouped into one month, this determines what value should represent
 * the group. Possible values are "average", "open", "high", "low",
 * "close" and "sum". For OHLC and candlestick series the approximation
 * is "ohlc" by default, which finds the open, high, low and close values
 * within all the grouped data.
 * 
 * Custom aggregate methods can be added by assigning a callback function
 * as the approximation. This function takes a numeric array as the
 * argument and should return a single numeric value or `null`. Note
 * that the numeric array will never contain null values, only true
 * numbers. Instead, if null values are present in the raw data, the
 * numeric array will have an `.hasNulls` property set to `true`. For
 * single-value data sets the data is available in the first argument
 * of the callback function. For OHLC data sets, all the open values
 * are in the first argument, all high values in the second etc.
 * 
 * .
 * 
 * @type {String|Function}
 * @default {all} ohlc
 * @product highstock
 * @todo Copy plotOptions.candlestick.dataGrouping.approximation docs to actual source code
 * @apioption plotOptions.candlestick.dataGrouping.approximation
 */

/**
 * @extends plotOptions.series.dataGrouping
 * @product highstock
 * @todo Copy plotOptions.column.dataGrouping docs to actual source code
 * @apioption plotOptions.column.dataGrouping
 */

/**
 * The approximate pixel width of each group. If for example a series
 * with 30 points is displayed over a 600 pixel wide plot area, no grouping
 * is performed. If however the series contains so many points that
 * the spacing is less than the groupPixelWidth, Highcharts will try
 * to group it into appropriate groups so that each is more or less
 * two pixels wide. Defaults to `10`.
 * 
 * @type {Number}
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-datagrouping-grouppixelwidth/ Two series with the same data density but different groupPixelWidth
 * @default {all} 10
 * @product highstock
 * @todo Copy plotOptions.column.dataGrouping.groupPixelWidth docs to actual source code
 * @apioption plotOptions.column.dataGrouping.groupPixelWidth
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.animation docs to actual source code
 * @apioption plotOptions.flags.animation
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.borderColor docs to actual source code
 * @apioption plotOptions.flags.borderColor
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.borderRadius docs to actual source code
 * @apioption plotOptions.flags.borderRadius
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.borderWidth docs to actual source code
 * @apioption plotOptions.flags.borderWidth
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.colorByPoint docs to actual source code
 * @apioption plotOptions.flags.colorByPoint
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.dashStyle docs to actual source code
 * @apioption plotOptions.flags.dashStyle
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.dataGrouping docs to actual source code
 * @apioption plotOptions.flags.dataGrouping
 */

/**
 * The color of the line/border of the flag.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the stroke is set in the `.highcharts-flag-series
 * .highcharts-point` rule.
 * 
 * @type {Color}
 * @default {all} #000000
 * @product highstock
 * @todo Copy plotOptions.flags.lineColor docs to actual source code
 * @apioption plotOptions.flags.lineColor
 */

/**
 * In case the flag is placed on a series, on what point key to place
 * it. Line and columns have one key, `y`. In range or OHLC-type series,
 * however, the flag can optionally be placed on the `open`, `high`,
 *  `low` or `close` key.
 * 
 * @validvalue ["y", "open", "high", "low", "close"]
 * @type {String}
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/flags-onkey/ Range series, flag on high
 * @default {all} y
 * @since 4.2.2
 * @product highstock
 * @todo Copy plotOptions.flags.onKey docs to actual source code
 * @apioption plotOptions.flags.onKey
 */

/**
 * The id of the series that the flags should be drawn on. If no id
 * is given, the flags are drawn on the x axis.
 * 
 * @type {String}
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/flags/ Flags on series and on x axis
 * @default {all} undefined
 * @product highstock
 * @todo Copy plotOptions.flags.onSeries docs to actual source code
 * @apioption plotOptions.flags.onSeries
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.pointPadding docs to actual source code
 * @apioption plotOptions.flags.pointPadding
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.pointWidth docs to actual source code
 * @apioption plotOptions.flags.pointWidth
 */

/**
 * The text to display on each flag. This can be defined on series level,
 *  or individually for each point. Defaults to `"A"`.
 * 
 * @type {Text}
 * @default {all} "A"
 * @product highstock
 * @todo Copy plotOptions.flags.title docs to actual source code
 * @apioption plotOptions.flags.title
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.flags.turboThreshold docs to actual source code
 * @apioption plotOptions.flags.turboThreshold
 */

/**
 * Whether to use HTML to render the flag texts. Using HTML allows for
 * advanced formatting, images and reliable bi-directional text rendering.
 * Note that exported images won't respect the HTML, and that HTML
 * won't respect Z-index settings.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 1.3
 * @product highstock
 * @todo Copy plotOptions.flags.useHTML docs to actual source code
 * @apioption plotOptions.flags.useHTML
 */

/**
 * The SVG value used for the `stroke-linecap` and `stroke-linejoin`
 * of a line graph. Round means that lines are rounded in the ends and
 * bends.
 * 
 * @validvalue ["round", "butt", "square"]
 * @type {String}
 * @default {all} round
 * @since 3.0.7
 * @product highstock
 * @todo Copy plotOptions.line.linecap docs to actual source code
 * @apioption plotOptions.line.linecap
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.ohlc.borderColor docs to actual source code
 * @apioption plotOptions.ohlc.borderColor
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.ohlc.borderRadius docs to actual source code
 * @apioption plotOptions.ohlc.borderRadius
 */

/**
 * N/A
 * 
 * @product highstock
 * @todo Copy plotOptions.ohlc.borderWidth docs to actual source code
 * @apioption plotOptions.ohlc.borderWidth
 */

/**
 * Line color for up points.
 * 
 * @type {Color}
 * @product highstock
 * @todo Copy plotOptions.ohlc.upColor docs to actual source code
 * @apioption plotOptions.ohlc.upColor
 */

/**
 * The approximate pixel width of each group. If for example a series
 * with 30 points is displayed over a 600 pixel wide plot area, no grouping
 * is performed. If however the series contains so many points that
 * the spacing is less than the groupPixelWidth, Highcharts will try
 * to group it into appropriate groups so that each is more or less
 * two pixels wide. Defaults to `5`.
 * 
 * @type {Number}
 * @default {all} 5
 * @product highstock
 * @todo Copy plotOptions.ohlc.dataGrouping.groupPixelWidth docs to actual source code
 * @apioption plotOptions.ohlc.dataGrouping.groupPixelWidth
 */

/**
 * @extends plotOptions.series.dataLabels
 * @product highstock
 * @todo Copy plotOptions.scatter.dataLabels docs to actual source code
 * @apioption plotOptions.scatter.dataLabels
 */

/**
 * Compare the values of the series against the first non-null, non-
 * zero value in the visible range. The y axis will show percentage
 * or absolute change depending on whether `compare` is set to `"percent"`
 * or `"value"`. When this is applied to multiple series, it allows
 * comparing the development of the series against each other.
 * 
 * @type {String}
 * @see [compareBase](#plotOptions.series.compareBase), [Axis.setCompare()](#Axis.
 * setCompare())
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-compare-percent/ Percent
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-compare-value/ Value
 * @default {all} undefined
 * @since 1.0.1
 * @product highstock
 * @todo Copy plotOptions.series.compare docs to actual source code
 * @apioption plotOptions.series.compare
 */

/**
 * When [compare](#plotOptions.series.compare) is `percent`, this option
 * dictates whether to use 0 or 100 as the base of comparison.
 * 
 * @validvalue [0, 100]
 * @type {Number}
 * @sample {highstock} / Compare base is 100
 * @default {all} 0
 * @since 5.0.6
 * @product highstock
 * @todo Copy plotOptions.series.compareBase docs to actual source code
 * @apioption plotOptions.series.compareBase
 */

/**
 * Defines when to display a gap in the graph. A gap size of 5 means
 * that if the distance between two points is greater than five times
 * that of the two closest points, the graph will be broken.
 * 
 * In practice, this option is most often used to visualize gaps in
 * time series. In a stock chart, intraday data is available for daytime
 * hours, while gaps will appear in nights and weekends.
 * 
 * @type {Number}
 * @see [xAxis.breaks](#xAxis.breaks)
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-gapsize/ Setting the gap size to 2 introduces gaps for weekends in daily datasets.
 * @default {all} 0
 * @product highstock
 * @todo Copy plotOptions.series.gapSize docs to actual source code
 * @apioption plotOptions.series.gapSize
 */

/**
 * The sequential index of the series within the legend.
 * 
 * @type {Number}
 * @default {all} 0
 * @product highstock
 * @todo Copy plotOptions.series.legendIndex docs to actual source code
 * @apioption plotOptions.series.legendIndex
 */

/**
 * Options for the corresponding navigator series if `showInNavigator`
 * is `true` for this series. Available options are the same as any
 * series, documented at [plotOptions](#plotOptions.series) and [series](#series).
 * 
 * 
 * These options are merged with options in [navigator.series](#navigator.
 * series), and will take precedence if the same option is defined both
 * places.
 * 
 * @type {Object}
 * @see [navigator.series](#navigator.series)
 * @default {all} undefined
 * @since 5.0.0
 * @product highstock
 * @todo Copy plotOptions.series.navigatorOptions docs to actual source code
 * @apioption plotOptions.series.navigatorOptions
 */

/**
 * Whether or not to show the series in the navigator. Takes precedence
 * over [navigator.baseSeries](#navigator.baseSeries) if defined.
 * 
 * @type {Boolean}
 * @default {all} undefined
 * @since 5.0.0
 * @product highstock
 * @todo Copy plotOptions.series.showInNavigator docs to actual source code
 * @apioption plotOptions.series.showInNavigator
 */

/**
 * Data grouping is the concept of sampling the data values into larger
 * blocks in order to ease readability and increase performance of the
 * JavaScript charts. Highstock by default applies data grouping when
 * the points become closer than a certain pixel value, determined by
 * the `groupPixelWidth` option.
 * 
 * If data grouping is applied, the grouping information of grouped
 * points can be read from the [Point.dataGroup](#Point.dataGroup).
 * 
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping docs to actual source code
 * @apioption plotOptions.series.dataGrouping
 */

/**
 * The method of approximation inside a group. When for example 30 days
 * are grouped into one month, this determines what value should represent
 * the group. Possible values are "average", "averages", "open", "high",
 * "low", "close" and "sum". For OHLC and candlestick series the approximation
 * is "ohlc" by default, which finds the open, high, low and close values
 * within all the grouped data. For ranges, the approximation is "range",
 * which finds the low and high values. For multi-dimensional data,
 * like ranges and OHLC, "averages" will compute the average for each
 * dimension.
 * 
 * Custom aggregate methods can be added by assigning a callback function
 * as the approximation. This function takes a numeric array as the
 * argument and should return a single numeric value or `null`. Note
 * that the numeric array will never contain null values, only true
 * numbers. Instead, if null values are present in the raw data, the
 * numeric array will have an `.hasNulls` property set to `true`. For
 * single-value data sets the data is available in the first argument
 * of the callback function. For OHLC data sets, all the open values
 * are in the first argument, all high values in the second etc.
 * 
 * Since v4.2.7, grouping meta data is available in the approximation
 * callback from `this.dataGroupInfo`. It can be used to extract information
 * from the raw data.
 * 
 * Defaults to `average` for line-type series, `sum` for columns, `range`
 * for range series and `ohlc` for OHLC and candlestick.
 * 
 * @validvalue ["average", "averages", "open", "high", "low", "close", "sum"]
 * @type {String|Function}
 * @sample {highstock} highcharts/tree/master/samples/stock/plotoptions/series-datagrouping-approximation Approximation callback with custom data
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping.approximation docs to actual source code
 * @apioption plotOptions.series.dataGrouping.approximation
 */

/**
 * Datetime formats for the header of the tooltip in a stock chart.
 * The format can vary within a chart depending on the currently selected
 * time range and the current data grouping.
 * 
 * The default formats are:
 * 
 * <pre>{
 * millisecond: ['%A, %b %e, %H:%M:%S.%L', '%A, %b %e, %H:%M:%S.%L',
 * '-%H:%M:%S.%L'],
 * second: ['%A, %b %e, %H:%M:%S', '%A, %b %e, %H:%M:%S', '-%H:%M:%S'],
 * 
 * minute: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
 * hour: ['%A, %b %e, %H:%M', '%A, %b %e, %H:%M', '-%H:%M'],
 * day: ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
 * week: ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
 * 
 * month: ['%B %Y', '%B', '-%B %Y'],
 * year: ['%Y', '%Y', '-%Y']
 * }</pre>
 * 
 * For each of these array definitions, the first item is the format
 * used when the active time span is one unit. For instance, if the
 * current data applies to one week, the first item of the week array
 * is used. The second and third items are used when the active time
 * span is more than two units. For instance, if the current data applies
 * to two weeks, the second and third item of the week array are used,
 *  and applied to the start and end date of the time span.
 * 
 * @type {Object}
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping.dateTimeLabelFormats docs to actual source code
 * @apioption plotOptions.series.dataGrouping.dateTimeLabelFormats
 */

/**
 * Enable or disable data grouping.
 * 
 * @type {Boolean}
 * @default {all} true
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping.enabled docs to actual source code
 * @apioption plotOptions.series.dataGrouping.enabled
 */

/**
 * When data grouping is forced, it runs no matter how small the intervals
 * are. This can be handy for example when the sum should be calculated
 * for values appearing at random times within each hour.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping.forced docs to actual source code
 * @apioption plotOptions.series.dataGrouping.forced
 */

/**
 * The approximate pixel width of each group. If for example a series
 * with 30 points is displayed over a 600 pixel wide plot area, no grouping
 * is performed. If however the series contains so many points that
 * the spacing is less than the groupPixelWidth, Highcharts will try
 * to group it into appropriate groups so that each is more or less
 * two pixels wide. If multiple series with different group pixel widths
 * are drawn on the same x axis, all series will take the greatest width.
 * For example, line series have 2px default group width, while column
 * series have 10px. If combined, both the line and the column will
 * have 10px by default.
 * 
 * @type {Number}
 * @default {all} 2
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping.groupPixelWidth docs to actual source code
 * @apioption plotOptions.series.dataGrouping.groupPixelWidth
 */

/**
 * Normally, a group is indexed by the start of that group, so for example
 * when 30 daily values are grouped into one month, that month's x value
 * will be the 1st of the month. This apparently shifts the data to
 * the left. When the smoothed option is true, this is compensated for.
 * The data is shifted to the middle of the group, and min and max
 * values are preserved. Internally, this is used in the Navigator series.
 * 
 * @type {Boolean}
 * @default {all} false
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping.smoothed docs to actual source code
 * @apioption plotOptions.series.dataGrouping.smoothed
 */

/**
 * An array determining what time intervals the data is allowed to be
 * grouped to. Each array item is an array where the first value is
 * the time unit and the second value another array of allowed multiples.
 * Defaults to:
 * 
 * <pre>units: [[
 * 'millisecond', // unit name
 * [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
 * ], [
 * 'second',
 * [1, 2, 5, 10, 15, 30]
 * ], [
 * 'minute',
 * [1, 2, 5, 10, 15, 30]
 * ], [
 * 'hour',
 * [1, 2, 3, 4, 6, 8, 12]
 * ], [
 * 'day',
 * [1]
 * ], [
 * 'week',
 * [1]
 * ], [
 * 'month',
 * [1, 3, 6]
 * ], [
 * 'year',
 * null
 * ]]</pre>
 * 
 * @type {Array}
 * @product highstock
 * @todo Copy plotOptions.series.dataGrouping.units docs to actual source code
 * @apioption plotOptions.series.dataGrouping.units
 */

/**
 * Whether to enable all buttons from the start. By default buttons
 * are only enabled if the corresponding time range exists on the X
 * axis, but enabling all buttons allows for dynamically loading different
 * time ranges.
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/allbuttonsenabled-true/ All buttons enabled
 * @default {all} false
 * @since 2.0.3
 * @product highstock
 * @todo Copy rangeSelector.allButtonsEnabled docs to actual source code
 * @apioption rangeSelector.allButtonsEnabled
 */

/**
 * A fixed pixel position for the buttons. Supports two properties,
 * `x` and `y`.``
 * 
 * @type {Object}
 * @product highstock
 * @todo Copy rangeSelector.buttonPosition docs to actual source code
 * @apioption rangeSelector.buttonPosition
 */

/**
 * The space in pixels between the buttons in the range selector.
 * 
 * @type {Number}
 * @default {all} 0
 * @product highstock
 * @todo Copy rangeSelector.buttonSpacing docs to actual source code
 * @apioption rangeSelector.buttonSpacing
 */

/**
 * Enable or disable the range selector.
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/enabled/ Disable the range selector
 * @default {all} true
 * @product highstock
 * @todo Copy rangeSelector.enabled docs to actual source code
 * @apioption rangeSelector.enabled
 */

/**
 * The border color of the date input boxes.
 * 
 * @type {Color}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/styling/ Styling the buttons and inputs
 * @default {all} #cccccc
 * @since 1.3.7
 * @product highstock
 * @todo Copy rangeSelector.inputBoxBorderColor docs to actual source code
 * @apioption rangeSelector.inputBoxBorderColor
 */

/**
 * The pixel height of the date input boxes.
 * 
 * @type {Number}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/styling/ Styling the buttons and inputs
 * @default {all} 17
 * @since 1.3.7
 * @product highstock
 * @todo Copy rangeSelector.inputBoxHeight docs to actual source code
 * @apioption rangeSelector.inputBoxHeight
 */

/**
 * CSS for the container DIV holding the input boxes. Deprecated as
 * of 1.2.5\. Use [inputPosition](#rangeSelector.inputPosition) instead.
 * 
 * @type {CSSObject}
 * @deprecated
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/styling/ Styling the buttons and inputs
 * @product highstock
 * @todo Copy rangeSelector.inputBoxStyle docs to actual source code
 * @apioption rangeSelector.inputBoxStyle
 */

/**
 * The pixel width of the date input boxes.
 * 
 * @type {Number}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/styling/ Styling the buttons and inputs
 * @default {all} 90
 * @since 1.3.7
 * @product highstock
 * @todo Copy rangeSelector.inputBoxWidth docs to actual source code
 * @apioption rangeSelector.inputBoxWidth
 */

/**
 * The date format in the input boxes when not selected for editing.
 *  Defaults to `%b %e, %Y`.
 * 
 * @type {String}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/input-format/ Milliseconds in the range selector
 * @default {all} %b %e %Y,
 * @product highstock
 * @todo Copy rangeSelector.inputDateFormat docs to actual source code
 * @apioption rangeSelector.inputDateFormat
 */

/**
 * A custom callback function to parse values entered in the input boxes
 * and return a valid JavaScript time as milliseconds since 1970.
 * 
 * @type {Function}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/input-format/ Milliseconds in the range selector
 * @since 1.3.3
 * @product highstock
 * @todo Copy rangeSelector.inputDateParser docs to actual source code
 * @apioption rangeSelector.inputDateParser
 */

/**
 * The date format in the input boxes when they are selected for editing.
 * This must be a format that is recognized by JavaScript Date.parse.
 * 
 * @type {String}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/input-format/ Milliseconds in the range selector
 * @default {all} %Y-%m-%d
 * @product highstock
 * @todo Copy rangeSelector.inputEditDateFormat docs to actual source code
 * @apioption rangeSelector.inputEditDateFormat
 */

/**
 * Enable or disable the date input boxes. Defaults to enabled when
 * there is enough space, disabled if not (typically mobile).
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/input-datepicker/ Extending the input with a jQuery UI datepicker
 * @product highstock
 * @todo Copy rangeSelector.inputEnabled docs to actual source code
 * @apioption rangeSelector.inputEnabled
 */

/**
 * CSS for the HTML inputs in the range selector.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the inputs are styled by the `.highcharts-range-
 * input text` rule in SVG mode, and `input.highcharts-range-selector`
 * when active.
 * 
 * @type {CSSObject}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/styling/ Styling the buttons and inputs
 * @product highstock
 * @todo Copy rangeSelector.inputStyle docs to actual source code
 * @apioption rangeSelector.inputStyle
 */

/**
 * The index of the button to appear pre-selected.
 * 
 * @type {Number}
 * @default {all} undefined
 * @product highstock
 * @todo Copy rangeSelector.selected docs to actual source code
 * @apioption rangeSelector.selected
 */

/**
 * An array of configuration objects for the buttons.
 * 
 * Defaults to
 * 
 * <pre>buttons: [{
 * type: 'month',
 * count: 1,
 * text: '1m'
 * }, {
 * type: 'month',
 * count: 3,
 * text: '3m'
 * }, {
 * type: 'month',
 * count: 6,
 * text: '6m'
 * }, {
 * type: 'ytd',
 * text: 'YTD'
 * }, {
 * type: 'year',
 * count: 1,
 * text: '1y'
 * }, {
 * type: 'all',
 * text: 'All'
 * }]</pre>
 * 
 * @type {Array<Object>}
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/datagrouping/ Data grouping by buttons
 * @product highstock
 * @todo Copy rangeSelector.buttons docs to actual source code
 * @apioption rangeSelector.buttons
 */

/**
 * How many units of the defined type the button should span. If `type`
 * is "month" and `count` is 3, the button spans three months.
 * 
 * @type {Number}
 * @default {all} 1
 * @product highstock
 * @todo Copy rangeSelector.buttons.count docs to actual source code
 * @apioption rangeSelector.buttons.count
 */

/**
 * A custom data grouping object for each button.
 * 
 * @type {Object}
 * @see [series.dataGrouping](#plotOptions.series.dataGrouping)
 * @sample {highstock} highcharts/tree/master/samples/stock/rangeselector/datagrouping/ Data grouping by range selector buttons
 * @product highstock
 * @todo Copy rangeSelector.buttons.dataGrouping docs to actual source code
 * @apioption rangeSelector.buttons.dataGrouping
 */

/**
 * The text for the button itself.
 * 
 * @type {String}
 * @product highstock
 * @todo Copy rangeSelector.buttons.text docs to actual source code
 * @apioption rangeSelector.buttons.text
 */

/**
 * Defined the time span for the button. Can be one of `"millisecond",
 * "second", "minute", "hour", "day", "week", "month", "ytd", "all"`.
 * 
 * @validvalue ["millisecond", "second", "minute", "day", "week", "month", "ytd", "all"]
 * @type {String}
 * @product highstock
 * @todo Copy rangeSelector.buttons.type docs to actual source code
 * @apioption rangeSelector.buttons.type
 */

/**
 * Enable or disable the scrollbar.
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/scrollbar/enabled/ Disable the scrollbar, only use navigator
 * @default {all} true
 * @product highstock
 * @todo Copy scrollbar.enabled docs to actual source code
 * @apioption scrollbar.enabled
 */

/**
 * Whether to show or hide the scrollbar when the scrolled content is
 * zoomed out to it full extent.
 * 
 * @type {Boolean}
 * @default {all} true
 * @product highstock
 * @todo Copy scrollbar.showFull docs to actual source code
 * @apioption scrollbar.showFull
 */

/**
 * The corner radius of the border of the scrollbar track.
 * 
 * @type {Number}
 * @sample {highstock} highcharts/tree/master/samples/stock/scrollbar/style/ Scrollbar styling
 * @default {all} 0
 * @product highstock
 * @todo Copy scrollbar.trackBorderRadius docs to actual source code
 * @apioption scrollbar.trackBorderRadius
 */

/**
 * @extends plotOptions.area.dataGrouping
 * @product highstock
 * @todo Copy series.area.dataGrouping docs to actual source code
 * @apioption series.area.dataGrouping
 */

/**
 * @extends plotOptions.arearange.dataGrouping
 * @product highstock
 * @todo Copy series.arearange.dataGrouping docs to actual source code
 * @apioption series.arearange.dataGrouping
 */

/**
 * @extends plotOptions.areaspline.dataGrouping
 * @product highstock
 * @todo Copy series.areaspline.dataGrouping docs to actual source code
 * @apioption series.areaspline.dataGrouping
 */

/**
 * @extends plotOptions.areasplinerange.dataGrouping
 * @product highstock
 * @todo Copy series.areasplinerange.dataGrouping docs to actual source code
 * @apioption series.areasplinerange.dataGrouping
 */

/**
 * A `candlestick` series. If the [type](#series<candlestick>.type)
 * option is not specified, it is inherited from [chart.type](#chart.
 * type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * candlestick](#plotOptions.candlestick).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.candlestick
 * @excluding dataParser,dataURL
 * @product highstock
 * @todo Copy series.candlestick docs to actual source code
 * @apioption series.candlestick
 */

/**
 * An array of data points for the series. For the `candlestick` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 5 or 4 values. In this case, the values
 * correspond to `x,open,high,low,close`. If the first value is a string,
 * it is applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 4\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 7, 2, 0, 4],
 * [1, 1, 4, 2, 8],
 * [2, 3, 3, 9, 3]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<candlestick>.
 * turboThreshold), this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * open: 9,
 * high: 2,
 * low: 4,
 * close: 6,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * open: 1,
 * high: 4,
 * low: 7,
 * close: 7,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<ohlc>.data
 * @excluding y
 * @product highstock
 * @todo Copy series.candlestick.data docs to actual source code
 * @apioption series.candlestick.data
 */

/**
 * @extends plotOptions.candlestick.states
 * @product highstock
 * @todo Copy series.candlestick.data.marker.states docs to actual source code
 * @apioption series.candlestick.data.marker.states
 */

/**
 * @extends plotOptions.candlestick.dataGrouping
 * @product highstock
 * @todo Copy series.candlestick.dataGrouping docs to actual source code
 * @apioption series.candlestick.dataGrouping
 */

/**
 * @extends plotOptions.candlestick.dataLabels
 * @product highstock
 * @todo Copy series.candlestick.dataLabels docs to actual source code
 * @apioption series.candlestick.dataLabels
 */

/**
 * @extends plotOptions.candlestick.events
 * @product highstock
 * @todo Copy series.candlestick.events docs to actual source code
 * @apioption series.candlestick.events
 */

/**
 * @extends plotOptions.candlestick.marker
 * @product highstock
 * @todo Copy series.candlestick.marker docs to actual source code
 * @apioption series.candlestick.marker
 */

/**
 * @extends plotOptions.candlestick.point
 * @product highstock
 * @todo Copy series.candlestick.point docs to actual source code
 * @apioption series.candlestick.point
 */

/**
 * @extends plotOptions.candlestick.states
 * @product highstock
 * @todo Copy series.candlestick.states docs to actual source code
 * @apioption series.candlestick.states
 */

/**
 * @extends plotOptions.candlestick.tooltip
 * @product highstock
 * @todo Copy series.candlestick.tooltip docs to actual source code
 * @apioption series.candlestick.tooltip
 */

/**
 * @extends plotOptions.candlestick.zones
 * @product highstock
 * @todo Copy series.candlestick.zones docs to actual source code
 * @apioption series.candlestick.zones
 */

/**
 * @extends plotOptions.column.dataGrouping
 * @product highstock
 * @todo Copy series.column.dataGrouping docs to actual source code
 * @apioption series.column.dataGrouping
 */

/**
 * @extends plotOptions.columnrange.dataGrouping
 * @product highstock
 * @todo Copy series.columnrange.dataGrouping docs to actual source code
 * @apioption series.columnrange.dataGrouping
 */

/**
 * A `flags` series. If the [type](#series<flags>.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * flags](#plotOptions.flags).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.flags
 * @excluding dataParser,dataURL
 * @product highstock
 * @todo Copy series.flags docs to actual source code
 * @apioption series.flags
 */

/**
 * An array of data points for the series. For the `flags` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<flags>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * title: "A",
 * text: "First event"
 * }, {
 * x: 1,
 * title: "B",
 * text: "Second event"
 *     }]</pre>
 * 
 * @type {Array<Object>}
 * @extends series<line>.data
 * @excluding y,dataLabels,marker,name
 * @product highstock
 * @todo Copy series.flags.data docs to actual source code
 * @apioption series.flags.data
 */

/**
 * The fill color of an individual flag. By default it inherits from
 * the series color.
 * 
 * @type {Color}
 * @product highstock
 * @todo Copy series.flags.data.fillColor docs to actual source code
 * @apioption series.flags.data.fillColor
 */

/**
 * The longer text to be shown in the flag's tooltip.
 * 
 * @type {String}
 * @product highstock
 * @todo Copy series.flags.data.text docs to actual source code
 * @apioption series.flags.data.text
 */

/**
 * The short text to be shown on the flag.
 * 
 * @type {String}
 * @product highstock
 * @todo Copy series.flags.data.title docs to actual source code
 * @apioption series.flags.data.title
 */

/**
 * @extends plotOptions.flags.states
 * @product highstock
 * @todo Copy series.flags.data.marker.states docs to actual source code
 * @apioption series.flags.data.marker.states
 */

/**
 * @extends plotOptions.flags.dataGrouping
 * @product highstock
 * @todo Copy series.flags.dataGrouping docs to actual source code
 * @apioption series.flags.dataGrouping
 */

/**
 * @extends plotOptions.flags.dataLabels
 * @product highstock
 * @todo Copy series.flags.dataLabels docs to actual source code
 * @apioption series.flags.dataLabels
 */

/**
 * @extends plotOptions.flags.events
 * @product highstock
 * @todo Copy series.flags.events docs to actual source code
 * @apioption series.flags.events
 */

/**
 * @extends plotOptions.flags.marker
 * @product highstock
 * @todo Copy series.flags.marker docs to actual source code
 * @apioption series.flags.marker
 */

/**
 * @extends plotOptions.flags.point
 * @product highstock
 * @todo Copy series.flags.point docs to actual source code
 * @apioption series.flags.point
 */

/**
 * @extends plotOptions.flags.states
 * @product highstock
 * @todo Copy series.flags.states docs to actual source code
 * @apioption series.flags.states
 */

/**
 * @extends plotOptions.flags.tooltip
 * @product highstock
 * @todo Copy series.flags.tooltip docs to actual source code
 * @apioption series.flags.tooltip
 */

/**
 * @extends plotOptions.flags.zones
 * @product highstock
 * @todo Copy series.flags.zones docs to actual source code
 * @apioption series.flags.zones
 */

/**
 * @extends plotOptions.line.dataGrouping
 * @product highstock
 * @todo Copy series.line.dataGrouping docs to actual source code
 * @apioption series.line.dataGrouping
 */

/**
 * A `ohlc` series. If the [type](#series<ohlc>.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * ohlc](#plotOptions.ohlc).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.ohlc
 * @excluding dataParser,dataURL
 * @product highstock
 * @todo Copy series.ohlc docs to actual source code
 * @apioption series.ohlc
 */

/**
 * An array of data points for the series. For the `ohlc` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of arrays with 5 or 4 values. In this case, the values
 * correspond to `x,open,high,low,close`. If the first value is a string,
 * it is applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 4\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 * 
 * <pre>data: [
 * [0, 6, 5, 6, 7],
 * [1, 9, 4, 8, 2],
 * [2, 6, 3, 4, 10]
 * ]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<ohlc>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * open: 3,
 * high: 4,
 * low: 5,
 * close: 2,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * open: 4,
 * high: 3,
 * low: 6,
 * close: 7,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array>}
 * @extends series<arearange>.data
 * @excluding y,marker
 * @product highstock
 * @todo Copy series.ohlc.data docs to actual source code
 * @apioption series.ohlc.data
 */

/**
 * The closing value of each data point.
 * 
 * @type {Number}
 * @product highstock
 * @todo Copy series.ohlc.data.close docs to actual source code
 * @apioption series.ohlc.data.close
 */

/**
 * The opening value of each data point.
 * 
 * @type {Number}
 * @product highstock
 * @todo Copy series.ohlc.data.open docs to actual source code
 * @apioption series.ohlc.data.open
 */

/**
 * @extends plotOptions.ohlc.states
 * @product highstock
 * @todo Copy series.ohlc.data.marker.states docs to actual source code
 * @apioption series.ohlc.data.marker.states
 */

/**
 * @extends plotOptions.ohlc.dataGrouping
 * @product highstock
 * @todo Copy series.ohlc.dataGrouping docs to actual source code
 * @apioption series.ohlc.dataGrouping
 */

/**
 * @extends plotOptions.ohlc.dataLabels
 * @product highstock
 * @todo Copy series.ohlc.dataLabels docs to actual source code
 * @apioption series.ohlc.dataLabels
 */

/**
 * @extends plotOptions.ohlc.events
 * @product highstock
 * @todo Copy series.ohlc.events docs to actual source code
 * @apioption series.ohlc.events
 */

/**
 * @extends plotOptions.ohlc.marker
 * @product highstock
 * @todo Copy series.ohlc.marker docs to actual source code
 * @apioption series.ohlc.marker
 */

/**
 * @extends plotOptions.ohlc.point
 * @product highstock
 * @todo Copy series.ohlc.point docs to actual source code
 * @apioption series.ohlc.point
 */

/**
 * @extends plotOptions.ohlc.states
 * @product highstock
 * @todo Copy series.ohlc.states docs to actual source code
 * @apioption series.ohlc.states
 */

/**
 * @extends plotOptions.ohlc.tooltip
 * @product highstock
 * @todo Copy series.ohlc.tooltip docs to actual source code
 * @apioption series.ohlc.tooltip
 */

/**
 * @extends plotOptions.ohlc.zones
 * @product highstock
 * @todo Copy series.ohlc.zones docs to actual source code
 * @apioption series.ohlc.zones
 */

/**
 * @extends plotOptions.polygon.dataGrouping
 * @product highstock
 * @todo Copy series.polygon.dataGrouping docs to actual source code
 * @apioption series.polygon.dataGrouping
 */

/**
 * @extends plotOptions.scatter.dataGrouping
 * @product highstock
 * @todo Copy series.scatter.dataGrouping docs to actual source code
 * @apioption series.scatter.dataGrouping
 */

/**
 * @extends plotOptions.spline.dataGrouping
 * @product highstock
 * @todo Copy series.spline.dataGrouping docs to actual source code
 * @apioption series.spline.dataGrouping
 */

/**
 * How many decimals to show for the `point.change` value when the `series.
 * compare` option is set. This is overridable in each series' tooltip
 * options object. The default is to preserve all decimals.
 * 
 * @type {Number}
 * @since 1.0.1
 * @product highstock
 * @todo Copy tooltip.changeDecimals docs to actual source code
 * @apioption tooltip.changeDecimals
 */

/**
 * In an ordinal axis, the points are equally spaced in the chart regardless
 * of the actual time or x distance between them. This means that missing
 * data for nights or weekends will not take up space in the chart.
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/ordinal-true/ True by default
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/ordinal-false/ False
 * @default {all} true
 * @since 1.1
 * @product highstock
 * @todo Copy xAxis.ordinal docs to actual source code
 * @apioption xAxis.ordinal
 */

/**
 * The zoomed range to display when only defining one or none of `min`
 * or `max`. For example, to show the latest month, a range of one month
 * can be set.
 * 
 * @type {Number}
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/range/ Setting a zoomed range when the rangeSelector      is disabled
 * @default {all} undefined
 * @product highstock
 * @todo Copy xAxis.range docs to actual source code
 * @apioption xAxis.range
 */

/**
 * A label on the axis next to the crosshair.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the label is styled with the `.highcharts-crosshair-
 * label` class.
 * 
 * @type {Object}
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/crosshair-label/ Crosshair labels
 * @sample {highstock} highcharts/css/crosshair-label/ Style mode
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label docs to actual source code
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
 * @todo Copy xAxis.crosshair.label.align docs to actual source code
 * @apioption xAxis.crosshair.label.align
 */

/**
 * The background color for the label. Defaults to the related series
 * color, or `#666666` if that is not available.
 * 
 * @type {Color}
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.backgroundColor docs to actual source code
 * @apioption xAxis.crosshair.label.backgroundColor
 */

/**
 * The border color for the crosshair label
 * 
 * @type {Color}
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.borderColor docs to actual source code
 * @apioption xAxis.crosshair.label.borderColor
 */

/**
 * The border corner radius of the crosshair label.
 * 
 * @type {Number}
 * @default {all} 3
 * @since 2.1.10
 * @product highstock
 * @todo Copy xAxis.crosshair.label.borderRadius docs to actual source code
 * @apioption xAxis.crosshair.label.borderRadius
 */

/**
 * The border width for the crosshair label.
 * 
 * @type {Number}
 * @default {all} 0
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.borderWidth docs to actual source code
 * @apioption xAxis.crosshair.label.borderWidth
 */

/**
 * A format string for the crosshair label. Defaults to `{value}` for
 * numeric axes and `{value:%b %d, %Y}` for datetime axes.
 * 
 * @type {String}
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.format docs to actual source code
 * @apioption xAxis.crosshair.label.format
 */

/**
 * Formatter function for the label text.
 * 
 * @type {Function}
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.formatter docs to actual source code
 * @apioption xAxis.crosshair.label.formatter
 */

/**
 * Padding inside the crosshair label.
 * 
 * @type {Number}
 * @default {all} 8
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.padding docs to actual source code
 * @apioption xAxis.crosshair.label.padding
 */

/**
 * The shape to use for the label box.
 * 
 * @type {String}
 * @default {all} callout
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.shape docs to actual source code
 * @apioption xAxis.crosshair.label.shape
 */

/**
 * Text styles for the crosshair label.
 * 
 * @type {CSS}
 * @default {all} { "color": "white", "fontWeight": "normal", "fontSize": "11px", "textAlign": "center" }
 * @since 2.1
 * @product highstock
 * @todo Copy xAxis.crosshair.label.style docs to actual source code
 * @apioption xAxis.crosshair.label.style
 */

/**
 * Horizontal axis only. When `staggerLines` is not set, `maxStaggerLines`
 * defines how many lines the axis is allowed to add to automatically
 * avoid overlapping X labels. Set to `1` to disable overlap detection.
 * 
 * @type {Number}
 * @deprecated
 * @default {all} 5
 * @since 1.3.3
 * @product highstock highmaps
 * @todo Copy xAxis.labels.maxStaggerLines docs to actual source code
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
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/candlestick-and-volume/ Percentage height panes
 * @default {all} null
 * @product highstock
 * @todo Copy yAxis.height docs to actual source code
 * @apioption yAxis.height
 */

/**
 * Whether to display the axis on the opposite side of the normal. The
 * normal is on the left side for vertical axes and bottom for horizontal,
 * so the opposite sides will be right and top respectively. In Highstock
 * 1.x, the Y axis was placed on the left side by default.
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/xaxis/opposite/ Y axis on left side
 * @default {all} true
 * @product highstock
 * @todo Copy yAxis.opposite docs to actual source code
 * @apioption yAxis.opposite
 */

/**
 * A soft maximum for the axis. If the series data maximum is greater
 * than this, the axis will stay at this maximum, but if the series
 * data maximum is higher, the axis will flex to show all data.
 * 
 * @type {Number}
 * @sample {highstock} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @sample {highmaps} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @since 5.0.1
 * @product highstock highmaps
 * @todo Copy yAxis.softMax docs to actual source code
 * @apioption yAxis.softMax
 */

/**
 * A soft minimum for the axis. If the series data minimum is greater
 * than this, the axis will stay at this minimum, but if the series
 * data minimum is lower, the axis will flex to show all data.
 * 
 * @type {Number}
 * @sample {highstock} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @sample {highmaps} highcharts/yaxis/softmin-softmax/ Soft min and max
 * @since 5.0.1
 * @product highstock highmaps
 * @todo Copy yAxis.softMin docs to actual source code
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
 * @sample {highstock} highcharts/tree/master/samples/stock/demo/candlestick-and-volume/ Percentage height panes
 * @default {all} null
 * @product highstock
 * @todo Copy yAxis.top docs to actual source code
 * @apioption yAxis.top
 */

/**
 * An optional scrollbar to display on the Y axis in response to limiting
 * the minimum an maximum of the axis values.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), all the presentational options for the scrollbar
 * are replaced by the classes `.highcharts-scrollbar-thumb`, `.highcharts-
 * scrollbar-arrow`, `.highcharts-scrollbar-button`, `.highcharts-scrollbar-
 * rifles` and `.highcharts-scrollbar-track`.
 * 
 * @extends scrollbar
 * @excluding height
 * @sample {highstock} highcharts/tree/master/samples/stock/yaxis/scrollbar/ Scrollbar on the Y axis
 * @since 4.2.6
 * @product highstock
 * @todo Copy yAxis.scrollbar docs to actual source code
 * @apioption yAxis.scrollbar
 */

/**
 * Enable the scrollbar on the Y axis.
 * 
 * @type {Boolean}
 * @sample {highstock} highcharts/tree/master/samples/stock/yaxis/scrollbar/ Enabled on Y axis
 * @default {all} false
 * @since 4.2.6
 * @product highstock
 * @todo Copy yAxis.scrollbar.enabled docs to actual source code
 * @apioption yAxis.scrollbar.enabled
 */

/**
 * Pixel margin between the scrollbar and the axis elements.
 * 
 * @type {Number}
 * @default {all} 10
 * @since 4.2.6
 * @product highstock
 * @todo Copy yAxis.scrollbar.margin docs to actual source code
 * @apioption yAxis.scrollbar.margin
 */

/**
 * Whether to show the scrollbar when it is fully zoomed out at max
 * range. Setting it to `false` on the Y axis makes the scrollbar stay
 * hidden until the user zooms in, like common in browsers.
 * 
 * @type {Boolean}
 * @default {all} true
 * @since 4.2.6
 * @product highstock
 * @todo Copy yAxis.scrollbar.showFull docs to actual source code
 * @apioption yAxis.scrollbar.showFull
 */

/**
 * The width of a vertical scrollbar or height of a horizontal scrollbar.
 *  Defaults to 20 on touch devices.
 * 
 * @type {Number}
 * @default {all} 14
 * @since 4.2.6
 * @product highstock
 * @todo Copy yAxis.scrollbar.size docs to actual source code
 * @apioption yAxis.scrollbar.size
 */

/**
 * Z index of the scrollbar elements.
 * 
 * @type {Number}
 * @default {all} 3
 * @since 4.2.6
 * @product highstock
 * @todo Copy yAxis.scrollbar.zIndex docs to actual source code
 * @apioption yAxis.scrollbar.zIndex
 */

/**
 * Default `mapData` for all series. If set to a string, it functions
 * as an index into the `Highcharts.maps` array. Otherwise it is interpreted
 * as map data.
 * 
 * @type {String|Object|Array<Object>}
 * @see [mapData](#series<map>.mapData)
 * @default {all} undefined
 * @since 5.0.0
 * @product highmaps
 * @todo Copy chart.map docs to actual source code
 * @apioption chart.map
 */

/**
 * Set lat/lon transformation definitions for the chart. If not defined,
 *  these are extracted from the map data.
 * 
 * @type {Object}
 * @default {all} undefined
 * @since 5.0.0
 * @product highmaps
 * @todo Copy chart.mapTransforms docs to actual source code
 * @apioption chart.mapTransforms
 */

/**
 * @type {Boolean}
 * @default {all} true
 * @product highmaps
 * @todo Copy colorAxis.allowDecimals docs to actual source code
 * @apioption colorAxis.allowDecimals
 */

/**
 * Determines how to set each data class' color if no individual color
 * is set. The default value, `tween`, computes intermediate colors
 * between `minColor` and `maxColor`. The other possible value, `category`,
 * pulls colors from the global or chart specific [colors](#colors)
 * array.
 * 
 * @validvalue ["tween", "category"]
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/coloraxis/dataclasscolor/ Category colors
 * @default {all} tween
 * @product highmaps
 * @todo Copy colorAxis.dataClassColor docs to actual source code
 * @apioption colorAxis.dataClassColor
 */

/**
 * Color of the grid lines extending from the axis across the gradient.
 * 
 * @type {Color}
 * @sample {highmaps} highcharts/tree/master/samples/maps/coloraxis/gridlines/ Grid lines demonstrated
 * @default {all} #e6e6e6
 * @product highmaps
 * @todo Copy colorAxis.gridLineColor docs to actual source code
 * @apioption colorAxis.gridLineColor
 */

/**
 * The maximum value of the axis in terms of map point values. If `null`,
 * the max value is automatically calculated. If the `endOnTick` option
 * is true, the max value might be rounded up.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/coloraxis/gridlines/ Explicit min and max to reduce the effect of outliers
 * @product highmaps
 * @todo Copy colorAxis.max docs to actual source code
 * @apioption colorAxis.max
 */

/**
 * The minimum value of the axis in terms of map point values. If `null`,
 * the min value is automatically calculated. If the `startOnTick`
 * option is true, the min value might be rounded down.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/coloraxis/gridlines/ Explicit min and max to reduce the effect of outliers
 * @product highmaps
 * @todo Copy colorAxis.min docs to actual source code
 * @apioption colorAxis.min
 */

/**
 * Whether to reverse the axis so that the highest number is closest
 * to the origin. Defaults to `false` in a horizontal legend and `true`
 * in a vertical legend, where the smallest value starts on top.
 * 
 * @type {Boolean}
 * @product highmaps
 * @todo Copy colorAxis.reversed docs to actual source code
 * @apioption colorAxis.reversed
 */

/**
 * Color stops for the gradient of a scalar color axis. Use this in
 * cases where a linear gradient between a `minColor` and `maxColor`
 * is not sufficient. The stops is an array of tuples, where the first
 * item is a float between 0 and 1 assigning the relative position in
 * the gradient, and the second item is the color.
 * 
 * @type {Array<Array>}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/heatmap/ Heatmap with three color stops
 * @product highmaps
 * @todo Copy colorAxis.stops docs to actual source code
 * @apioption colorAxis.stops
 */

/**
 * The interval of the tick marks in axis units. When `null`, the tick
 * interval is computed to approximately follow the `tickPixelInterval`.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy colorAxis.tickInterval docs to actual source code
 * @apioption colorAxis.tickInterval
 */

/**
 * The type of interpolation to use for the color axis. Can be `linear`
 * or `logarithmic`.
 * 
 * @validvalue ["linear", "logarithmic"]
 * @type {String}
 * @default {all} linear
 * @product highmaps
 * @todo Copy colorAxis.type docs to actual source code
 * @apioption colorAxis.type
 */

/**
 * An array of data classes or ranges for the choropleth map. If none
 * given, the color axis is scalar and values are distributed as a gradient
 * between the minimum and maximum colors.
 * 
 * @type {Array<Object>}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/data-class-ranges/ Multiple ranges
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/data-class-two-ranges/ Two ranges
 * @product highmaps
 * @todo Copy colorAxis.dataClasses docs to actual source code
 * @apioption colorAxis.dataClasses
 */

/**
 * The color of each data class. If not set, the color is pulled from
 * the global or chart-specific [colors](#colors) array.
 * 
 * @type {Color}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/data-class-two-ranges/ Explicit colors
 * @product highmaps
 * @todo Copy colorAxis.dataClasses.color docs to actual source code
 * @apioption colorAxis.dataClasses.color
 */

/**
 * The start of the value range that the data class represents, relating
 * to the point value.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy colorAxis.dataClasses.from docs to actual source code
 * @apioption colorAxis.dataClasses.from
 */

/**
 * The name of the data class as it appears in the legend. If no name
 * is given, it is automatically created based on the `from` and `to`
 * values. For full programmatic control, [legend.labelFormatter](#legend.
 * labelFormatter) can be used. In the formatter, `this.from` and `this.
 * to` can be accessed.
 * 
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/coloraxis/dataclasses-name/ Named data classes
 * @sample {highmaps} highcharts/tree/master/samples/maps/coloraxis/dataclasses-labelformatter/ Formatted data classes
 * @product highmaps
 * @todo Copy colorAxis.dataClasses.name docs to actual source code
 * @apioption colorAxis.dataClasses.name
 */

/**
 * The end of the value range that the data class represents, relating
 * to the point value.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy colorAxis.dataClasses.to docs to actual source code
 * @apioption colorAxis.dataClasses.to
 */

/**
 * Credits for map source to be concatenated with conventional credit
 * text. By default this is a format string that collects copyright
 * information from the map if available.
 * 
 * @type {String}
 * @see [mapTextFull](#credits.mapTextFull), [text](#credits.text)
 * @default {all} \u00a9 <a href="{geojson.copyrightUrl}">{geojson.copyrightShort}</a>
 * @since 4.2.2
 * @product highmaps
 * @todo Copy credits.mapText docs to actual source code
 * @apioption credits.mapText
 */

/**
 * Detailed credits for map source to be displayed on hover of credits
 * text. By default this is a format string that collects copyright
 * information from the map if available.
 * 
 * @type {String}
 * @see [mapText](#credits.mapText), [text](#credits.text)
 * @default {all} {geojson.copyright}
 * @since 4.2.2
 * @product highmaps
 * @todo Copy credits.mapTextFull docs to actual source code
 * @apioption credits.mapTextFull
 */

/**
 * The title appearing on hovering the zoom in button. The text itself
 * defaults to "+" and can be changed in the button options.
 * 
 * @type {String}
 * @default {all} Zoom in
 * @product highmaps
 * @todo Copy lang.zoomIn docs to actual source code
 * @apioption lang.zoomIn
 */

/**
 * The title appearing on hovering the zoom out button. The text itself
 * defaults to "-" and can be changed in the button options.
 * 
 * @type {String}
 * @default {all} Zoom out
 * @product highmaps
 * @todo Copy lang.zoomOut docs to actual source code
 * @apioption lang.zoomOut
 */

/**
 * Whether to enable navigation buttons. By default it inherits the
 * [enabled](#mapNavigation.enabled) setting.
 * 
 * @type {Boolean}
 * @product highmaps
 * @todo Copy mapNavigation.enableButtons docs to actual source code
 * @apioption mapNavigation.enableButtons
 */

/**
 * Enables zooming in on an area on double clicking in the map. By default
 * it inherits the [enabled](#mapNavigation.enabled) setting.
 * 
 * @type {Boolean}
 * @product highmaps
 * @todo Copy mapNavigation.enableDoubleClickZoom docs to actual source code
 * @apioption mapNavigation.enableDoubleClickZoom
 */

/**
 * Whether to zoom in on an area when that area is double clicked.
 * 
 * @type {Boolean}
 * @sample {highmaps} highcharts/tree/master/samples/maps/mapnavigation/doubleclickzoomto/ Enable double click zoom to
 * @default {all} false
 * @product highmaps
 * @todo Copy mapNavigation.enableDoubleClickZoomTo docs to actual source code
 * @apioption mapNavigation.enableDoubleClickZoomTo
 */

/**
 * Enables zooming by mouse wheel. By default it inherits the [enabled](#mapNavigation.
 * enabled) setting.
 * 
 * @type {Boolean}
 * @product highmaps
 * @todo Copy mapNavigation.enableMouseWheelZoom docs to actual source code
 * @apioption mapNavigation.enableMouseWheelZoom
 */

/**
 * Whether to enable multitouch zooming. Note that if the chart covers
 * the viewport, this prevents the user from using multitouch and touchdrag
 * on the web page, so you should make sure the user is not trapped
 * inside the chart. By default it inherits the [enabled](#mapNavigation.
 * enabled) setting.
 * 
 * @type {Boolean}
 * @product highmaps
 * @todo Copy mapNavigation.enableTouchZoom docs to actual source code
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
 * @default {all} false
 * @product highmaps
 * @todo Copy mapNavigation.enabled docs to actual source code
 * @apioption mapNavigation.enabled
 */

/**
 * Options for the zoom in button
 * 
 * @type {Object}
 * @extends mapNavigation.buttonOptions
 * @product highmaps
 * @todo Copy mapNavigation.buttons. docs to actual source code
 * @apioption mapNavigation.buttons.
 */

/**
 * Whether to allow pointer interaction like tooltips and mouse events
 * on null points.
 * 
 * @type {Boolean}
 * @default {all} false
 * @since 4.2.7
 * @product highmaps
 * @todo Copy plotOptions.map.nullInteraction docs to actual source code
 * @apioption plotOptions.map.nullInteraction
 */

/**
 * The main color of the series. This color affects both the fill and
 * the stroke of the bubble. For enhanced control, use `marker` options.
 * 
 * @type {Color}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/mapbubble-color/ Pink bubbles
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.color docs to actual source code
 * @apioption plotOptions.mapbubble.color
 */

/**
 * Whether to display negative sized bubbles. The threshold is given
 * by the [zThreshold](#plotOptions.bubble.zThreshold) option, and negative
 * bubbles can be visualized by setting [negativeColor](#plotOptions.
 * bubble.negativeColor).
 * 
 * @type {Boolean}
 * @default {all} true
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.displayNegative docs to actual source code
 * @apioption plotOptions.mapbubble.displayNegative
 */

/**
 * Maximum bubble size. Bubbles will automatically size between the
 * `minSize` and `maxSize` to reflect the `z` value of each bubble.
 * Can be either pixels (when no unit is given), or a percentage of
 * the smallest one of the plot width and height.
 * 
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/map-bubble/ Bubble size
 * @default {all} 20%
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.maxSize docs to actual source code
 * @apioption plotOptions.mapbubble.maxSize
 */

/**
 * Minimum bubble size. Bubbles will automatically size between the
 * `minSize` and `maxSize` to reflect the `z` value of each bubble.
 * Can be either pixels (when no unit is given), or a percentage of
 * the smallest one of the plot width and height.
 * 
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/map-bubble/ Bubble size
 * @default {all} 8
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.minSize docs to actual source code
 * @apioption plotOptions.mapbubble.minSize
 */

/**
 * When a point's Z value is below the [zThreshold](#plotOptions.bubble.
 * zThreshold) setting, this color is used.
 * 
 * @type {Color}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/mapbubble-negativecolor/ Negative color below a threshold
 * @default {all} null
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.negativeColor docs to actual source code
 * @apioption plotOptions.mapbubble.negativeColor
 */

/**
 * Whether the bubble's value should be represented by the area or the
 * width of the bubble. The default, `area`, corresponds best to the
 * human perception of the size of each bubble.
 * 
 * @validvalue ["area", "width"]
 * @type {String}
 * @default {all} area
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.sizeBy docs to actual source code
 * @apioption plotOptions.mapbubble.sizeBy
 */

/**
 * When this is true, the absolute value of z determines the size of
 * the bubble. This means that with the default `zThreshold` of 0, a
 * bubble of value -1 will have the same size as a bubble of value 1,
 * while a bubble of value 0 will have a smaller size according to
 * `minSize`.
 * 
 * @type {Boolean}
 * @sample {highmaps} highcharts/plotoptions/bubble-sizebyabsolutevalue/ Size by absolute value, various thresholds
 * @default {all} false
 * @since 1.1.9
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.sizeByAbsoluteValue docs to actual source code
 * @apioption plotOptions.mapbubble.sizeByAbsoluteValue
 */

/**
 * The minimum for the Z value range. Defaults to the highest Z value
 * in the data.
 * 
 * @type {Number}
 * @see [zMax](#plotOptions.mapbubble.zMin)
 * @sample {highmaps} highcharts/plotoptions/bubble-zmin-zmax/ Z has a possible range of 0-100
 * @default {all} null
 * @since 1.0.3
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.zMax docs to actual source code
 * @apioption plotOptions.mapbubble.zMax
 */

/**
 * The minimum for the Z value range. Defaults to the lowest Z value
 * in the data.
 * 
 * @type {Number}
 * @see [zMax](#plotOptions.mapbubble.zMax)
 * @sample {highmaps} highcharts/plotoptions/bubble-zmin-zmax/ Z has a possible range of 0-100
 * @default {all} null
 * @since 1.0.3
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.zMin docs to actual source code
 * @apioption plotOptions.mapbubble.zMin
 */

/**
 * When [displayNegative](#plotOptions.bubble.displayNegative) is `false`,
 * bubbles with lower Z values are skipped. When `displayNegative`
 * is `true` and a [negativeColor](#plotOptions.bubble.negativeColor)
 * is given, points with lower Z is colored.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/mapbubble-negativecolor/ Negative color below a threshold
 * @default {all} 0
 * @product highmaps
 * @todo Copy plotOptions.mapbubble.zThreshold docs to actual source code
 * @apioption plotOptions.mapbubble.zThreshold
 */

/**
 * Whether all areas of the map defined in `mapData` should be rendered.
 * If `true`, areas which don't correspond to a data point, are rendered
 * as `null` points. If `false`, those areas are skipped.
 * 
 * @type {Boolean}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-allareas-false/ All areas set to false
 * @default {all} true
 * @product highmaps
 * @todo Copy plotOptions.series.allAreas docs to actual source code
 * @apioption plotOptions.series.allAreas
 */

/**
 * The border color of the map areas.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the border stroke is given in the `.highcharts-
 * point` class.
 * 
 * @type {Color}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-border/ Borders demo
 * @default {all} #cccccc
 * @product highmaps
 * @todo Copy plotOptions.series.borderColor docs to actual source code
 * @apioption plotOptions.series.borderColor
 */

/**
 * The border width of each map area.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the border stroke width is given in the `.highcharts-
 * point` class.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-border/ Borders demo
 * @default {all} 1
 * @product highmaps
 * @todo Copy plotOptions.series.borderWidth docs to actual source code
 * @apioption plotOptions.series.borderWidth
 */

/**
 * Set this option to `false` to prevent a series from connecting to
 * the global color axis. This will cause the series to have its own
 * legend item.
 * 
 * @type {Boolean}
 * @default {all} undefined
 * @product highmaps
 * @todo Copy plotOptions.series.colorAxis docs to actual source code
 * @apioption plotOptions.series.colorAxis
 */

/**
 * What property to join the `mapData` to the value data. For example,
 * if joinBy is "code", the mapData items with a specific code is merged
 * into the data with the same code. For maps loaded from GeoJSON, the
 * keys may be held in each point's `properties` object.
 * 
 * The joinBy option can also be an array of two values, where the first
 * points to a key in the `mapData`, and the second points to another
 * key in the `data`.
 * 
 * When joinBy is `null`, the map items are joined by their position
 * in the array, which performs much better in maps with many data points.
 * This is the recommended option if you are printing more than a thousand
 * data points and have a backend that can preprocess the data into
 * a parallel array of the mapData.
 * 
 * @type {String|Array<String>}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-border/ Joined by "code"
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/geojson/ GeoJSON joined by an array
 * @sample {highmaps} highcharts/tree/master/samples/maps/series/joinby-null/ Simple data joined by null
 * @product highmaps
 * @todo Copy plotOptions.series.joinBy docs to actual source code
 * @apioption plotOptions.series.joinBy
 */

/**
 * Define the z index of the series.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy plotOptions.series.zIndex docs to actual source code
 * @apioption plotOptions.series.zIndex
 */

/**
 * The border color of the point in this state.
 * 
 * @type {Color}
 * @product highmaps
 * @todo Copy plotOptions.series.states.hover.borderColor docs to actual source code
 * @apioption plotOptions.series.states.hover.borderColor
 */

/**
 * The border width of the point in this state
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy plotOptions.series.states.hover.borderWidth docs to actual source code
 * @apioption plotOptions.series.states.hover.borderWidth
 */

/**
 * The relative brightness of the point when hovered, relative to the
 * normal point color.
 * 
 * @type {Number}
 * @default {all} 0.2
 * @product highmaps
 * @todo Copy plotOptions.series.states.hover.brightness docs to actual source code
 * @apioption plotOptions.series.states.hover.brightness
 */

/**
 * The color of the shape in this state
 * 
 * @type {Color}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-states-hover/ Hover options
 * @product highmaps
 * @todo Copy plotOptions.series.states.hover.color docs to actual source code
 * @apioption plotOptions.series.states.hover.color
 */

/**
 * Overrides for the normal state
 * 
 * @type {Object}
 * @product highmaps
 * @todo Copy plotOptions.series.states.normal docs to actual source code
 * @apioption plotOptions.series.states.normal
 */

/**
 * Animation options for the fill color when returning from hover state
 * to normal state. The animation adds some latency in order to reduce
 * the effect of flickering when hovering in and out of for example
 * an uneven coastline.
 * 
 * @type {Object|Boolean}
 * @sample {highmaps} highcharts/tree/master/samples/maps/plotoptions/series-states-animation-false/ No animation of fill color
 * @default {all} true
 * @product highmaps
 * @todo Copy plotOptions.series.states.normal.animation docs to actual source code
 * @apioption plotOptions.series.states.normal.animation
 */

/**
 * An array of objects containing a `path` definition and optionally
 * a code or property to join in the data as per the `joinBy` option.
 * 
 * @type {Array<Object>}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/category-map/ Map data and joinBy
 * @product highmaps
 * @todo Copy series.mapData docs to actual source code
 * @apioption series.mapData
 */

/**
 * Individual color for the point. By default the color is either used
 * to denote the value, or pulled from the global `colors` array.
 * 
 * @type {Color}
 * @default {all} undefined
 * @product highmaps
 * @todo Copy series.map.data.color docs to actual source code
 * @apioption series.map.data.color
 */

/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](#plotOptions.series.
 * dataLabels)
 * 
 * @type {Object}
 * @sample {highmaps} highcharts/tree/master/samples/maps/series/data-datalabels/ Disable data labels for individual areas
 * @product highmaps
 * @todo Copy series.map.data.dataLabels docs to actual source code
 * @apioption series.map.data.dataLabels
 */

/**
 * The `id` of a series in the [drilldown.series](#drilldown.series)
 * array to use for a drilldown for this point.
 * 
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/map-drilldown/ Basic drilldown
 * @product highmaps
 * @todo Copy series.map.data.drilldown docs to actual source code
 * @apioption series.map.data.drilldown
 */

/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 * 
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/series/data-id/ Highlight a point by id
 * @product highmaps
 * @todo Copy series.map.data.id docs to actual source code
 * @apioption series.map.data.id
 */

/**
 * When data labels are laid out on a map, Highmaps runs a simplified
 * algorithm to detect collision. When two labels collide, the one with
 * the lowest rank is hidden. By default the rank is computed from the
 * area.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy series.map.data.labelrank docs to actual source code
 * @apioption series.map.data.labelrank
 */

/**
 * The latitude of the point. Must be combined with the `lon` option
 * to work. Overrides `x` and `y` values.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/mappoint-latlon/ Point position by lat/lon
 * @since 1.1.0
 * @product highmaps
 * @todo Copy series.mappoint.data.lat docs to actual source code
 * @apioption series.mappoint.data.lat
 */

/**
 * The longitude of the point. Must be combined with the `lon` option
 * to work. Overrides `x` and `y` values.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/mappoint-latlon/ Point position by lat/lon
 * @since 1.1.0
 * @product highmaps
 * @todo Copy series.mappoint.data.lon docs to actual source code
 * @apioption series.mappoint.data.lon
 */

/**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleX can be defined
 * there.
 * 
 * @type {Number}
 * @default {all} 0.5
 * @product highmaps
 * @todo Copy series.map.data.middleX docs to actual source code
 * @apioption series.map.data.middleX
 */

/**
 * The relative mid point of an area, used to place the data label.
 * Ranges from 0 to 1\. When `mapData` is used, middleY can be defined
 * there.
 * 
 * @type {Number}
 * @default {all} 0.5
 * @product highmaps
 * @todo Copy series.map.data.middleY docs to actual source code
 * @apioption series.map.data.middleY
 */

/**
 * The name of the point as shown in the legend, tooltip, dataLabel
 * etc.
 * 
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/series/data-datalabels/ Point names
 * @product highmaps
 * @todo Copy series.map.data.name docs to actual source code
 * @apioption series.map.data.name
 */

/**
 * For map and mapline series types, the SVG path for the shape. For
 * compatibily with old IE, not all SVG path definitions are supported,
 * but M, L and C operators are safe.
 * 
 * To achieve a better separation between the structure and the data,
 * it is recommended to use `mapData` to define that paths instead
 * of defining them on the data points themselves.
 * 
 * @type {String}
 * @sample {highmaps} highcharts/tree/master/samples/maps/series/data-path/ Paths defined in data
 * @product highmaps
 * @todo Copy series.map.data.path docs to actual source code
 * @apioption series.map.data.path
 */

/**
 * The numeric value of the data point.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy series.map.data.value docs to actual source code
 * @apioption series.map.data.value
 */

/**
 * The x coordinate of the point in terms of the map path coordinates.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/mapline-mappoint/ Map point demo
 * @product highmaps
 * @todo Copy series.mappoint.data.x docs to actual source code
 * @apioption series.mappoint.data.x
 */

/**
 * The x coordinate of the point in terms of the map path coordinates.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/mapline-mappoint/ Map point demo
 * @product highmaps
 * @todo Copy series.mappoint.data.y docs to actual source code
 * @apioption series.mappoint.data.y
 */

/**
 * While the `x` and `y` values of the bubble are determined by the
 * underlying map, the `z` indicates the actual value that gives the
 * size of the bubble.
 * 
 * @type {Number}
 * @sample {highmaps} highcharts/tree/master/samples/maps/demo/map-bubble/ Bubble
 * @product highmaps
 * @todo Copy series.mapbubble.data.z docs to actual source code
 * @apioption series.mapbubble.data.z
 */

/**
 * Individual point events
 * 
 * @extends plotOptions.series.point.events
 * @product highmaps
 * @todo Copy series.map.data.events docs to actual source code
 * @apioption series.map.data.events
 */

/**
 * The x coordinate of the point.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy series.heatmap.data.x docs to actual source code
 * @apioption series.heatmap.data.x
 */

/**
 * The y coordinate of the point.
 * 
 * @type {Number}
 * @product highmaps
 * @todo Copy series.heatmap.data.y docs to actual source code
 * @apioption series.heatmap.data.y
 */

/**
 * A `map` series. If the [type](#series<map>.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * map](#plotOptions.map).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.map
 * @excluding dataParser,dataURL
 * @product highmaps
 * @todo Copy series.map docs to actual source code
 * @apioption series.map
 */

/**
 * An array of data points for the series. For the `map` series type,
 * points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `value` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `[hc-key, value]`. Example:
 * 
 * <pre>data: [['us-ny', 0], ['us-mi', 5], ['us-tx', 3], ['us-ak',
 * 5]]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<map>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * value: 6,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * value: 6,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object>}
 * @product highmaps
 * @todo Copy series.map.data docs to actual source code
 * @apioption series.map.data
 */

/**
 * @extends plotOptions.map.states
 * @product highmaps
 * @todo Copy series.map.data.marker.states docs to actual source code
 * @apioption series.map.data.marker.states
 */

/**
 * @extends plotOptions.map.dataLabels
 * @product highmaps
 * @todo Copy series.map.dataLabels docs to actual source code
 * @apioption series.map.dataLabels
 */

/**
 * @extends plotOptions.map.events
 * @product highmaps
 * @todo Copy series.map.events docs to actual source code
 * @apioption series.map.events
 */

/**
 * @extends plotOptions.map.marker
 * @product highmaps
 * @todo Copy series.map.marker docs to actual source code
 * @apioption series.map.marker
 */

/**
 * @extends plotOptions.map.point
 * @product highmaps
 * @todo Copy series.map.point docs to actual source code
 * @apioption series.map.point
 */

/**
 * @extends plotOptions.map.states
 * @product highmaps
 * @todo Copy series.map.states docs to actual source code
 * @apioption series.map.states
 */

/**
 * @extends plotOptions.map.tooltip
 * @product highmaps
 * @todo Copy series.map.tooltip docs to actual source code
 * @apioption series.map.tooltip
 */

/**
 * @extends plotOptions.map.zones
 * @product highmaps
 * @todo Copy series.map.zones docs to actual source code
 * @apioption series.map.zones
 */

/**
 * A `mapbubble` series. If the [type](#series<mapbubble>.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 * 
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * mapbubble](#plotOptions.mapbubble).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.mapbubble
 * @excluding dataParser,dataURL
 * @product highmaps
 * @todo Copy series.mapbubble docs to actual source code
 * @apioption series.mapbubble
 */

/**
 * An array of data points for the series. For the `mapbubble` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `z` options. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<mapbubble>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * z: 9,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * z: 10,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Number>}
 * @extends series<mappoint>.data
 * @excluding labelrank,middleX,middleY,path,value,x,y,lat,lon
 * @product highmaps
 * @todo Copy series.mapbubble.data docs to actual source code
 * @apioption series.mapbubble.data
 */

/**
 * @extends plotOptions.mapbubble.states
 * @product highmaps
 * @todo Copy series.mapbubble.data.marker.states docs to actual source code
 * @apioption series.mapbubble.data.marker.states
 */

/**
 * @extends plotOptions.mapbubble.dataLabels
 * @product highmaps
 * @todo Copy series.mapbubble.dataLabels docs to actual source code
 * @apioption series.mapbubble.dataLabels
 */

/**
 * @extends plotOptions.mapbubble.events
 * @product highmaps
 * @todo Copy series.mapbubble.events docs to actual source code
 * @apioption series.mapbubble.events
 */

/**
 * @extends plotOptions.mapbubble.marker
 * @product highmaps
 * @todo Copy series.mapbubble.marker docs to actual source code
 * @apioption series.mapbubble.marker
 */

/**
 * @extends plotOptions.mapbubble.point
 * @product highmaps
 * @todo Copy series.mapbubble.point docs to actual source code
 * @apioption series.mapbubble.point
 */

/**
 * @extends plotOptions.mapbubble.states
 * @product highmaps
 * @todo Copy series.mapbubble.states docs to actual source code
 * @apioption series.mapbubble.states
 */

/**
 * @extends plotOptions.mapbubble.tooltip
 * @product highmaps
 * @todo Copy series.mapbubble.tooltip docs to actual source code
 * @apioption series.mapbubble.tooltip
 */

/**
 * @extends plotOptions.mapbubble.zones
 * @product highmaps
 * @todo Copy series.mapbubble.zones docs to actual source code
 * @apioption series.mapbubble.zones
 */

/**
 * A `mapline` series. If the [type](#series<mapline>.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * mapline](#plotOptions.mapline).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.mapline
 * @excluding dataParser,dataURL
 * @product highmaps
 * @todo Copy series.mapline docs to actual source code
 * @apioption series.mapline
 */

/**
 * @extends plotOptions.mapline.states
 * @product highmaps
 * @todo Copy series.mapline.data.marker.states docs to actual source code
 * @apioption series.mapline.data.marker.states
 */

/**
 * @extends plotOptions.mapline.dataLabels
 * @product highmaps
 * @todo Copy series.mapline.dataLabels docs to actual source code
 * @apioption series.mapline.dataLabels
 */

/**
 * @extends plotOptions.mapline.events
 * @product highmaps
 * @todo Copy series.mapline.events docs to actual source code
 * @apioption series.mapline.events
 */

/**
 * @extends plotOptions.mapline.marker
 * @product highmaps
 * @todo Copy series.mapline.marker docs to actual source code
 * @apioption series.mapline.marker
 */

/**
 * @extends plotOptions.mapline.point
 * @product highmaps
 * @todo Copy series.mapline.point docs to actual source code
 * @apioption series.mapline.point
 */

/**
 * @extends plotOptions.mapline.states
 * @product highmaps
 * @todo Copy series.mapline.states docs to actual source code
 * @apioption series.mapline.states
 */

/**
 * @extends plotOptions.mapline.tooltip
 * @product highmaps
 * @todo Copy series.mapline.tooltip docs to actual source code
 * @apioption series.mapline.tooltip
 */

/**
 * @extends plotOptions.mapline.zones
 * @product highmaps
 * @todo Copy series.mapline.zones docs to actual source code
 * @apioption series.mapline.zones
 */

/**
 * A `mappoint` series. If the [type](#series<mappoint>.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 * 
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [pointOptions.series](#pointOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * mappoint](#plotOptions.mappoint).
 * 
 * @type {Array<Object>}
 * @extends series,plotOptions.mappoint
 * @excluding dataParser,dataURL
 * @product highmaps
 * @todo Copy series.mappoint docs to actual source code
 * @apioption series.mappoint
 */

/**
 * An array of data points for the series. For the `mappoint` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 * 
 * <pre>data: [0, 5, 3, 5]</pre>
 * 
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 * 
 * <pre>data: [
 * [0, 1],
 * [1, 8],
 * [2, 7]
 * ]</pre>
 * 
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series<mappoint>.turboThreshold),
 * this option is not available.
 * 
 * <pre>data: [{
 * x: 1,
 * y: 7,
 * name: "Point2",
 * color: "#00FF00"
 * }, {
 * x: 1,
 * y: 4,
 * name: "Point1",
 * color: "#FF00FF"
 *     }]</pre>
 * 
 * @type {Array<Object|Array|Number>}
 * @extends series<map>.data
 * @excluding labelrank,middleX,middleY,path,value
 * @product highmaps
 * @todo Copy series.mappoint.data docs to actual source code
 * @apioption series.mappoint.data
 */

/**
 * @extends plotOptions.mappoint.states
 * @product highmaps
 * @todo Copy series.mappoint.data.marker.states docs to actual source code
 * @apioption series.mappoint.data.marker.states
 */

/**
 * @extends plotOptions.mappoint.dataLabels
 * @product highmaps
 * @todo Copy series.mappoint.dataLabels docs to actual source code
 * @apioption series.mappoint.dataLabels
 */

/**
 * @extends plotOptions.mappoint.events
 * @product highmaps
 * @todo Copy series.mappoint.events docs to actual source code
 * @apioption series.mappoint.events
 */

/**
 * @extends plotOptions.mappoint.marker
 * @product highmaps
 * @todo Copy series.mappoint.marker docs to actual source code
 * @apioption series.mappoint.marker
 */

/**
 * @extends plotOptions.mappoint.point
 * @product highmaps
 * @todo Copy series.mappoint.point docs to actual source code
 * @apioption series.mappoint.point
 */

/**
 * @extends plotOptions.mappoint.states
 * @product highmaps
 * @todo Copy series.mappoint.states docs to actual source code
 * @apioption series.mappoint.states
 */

/**
 * @extends plotOptions.mappoint.tooltip
 * @product highmaps
 * @todo Copy series.mappoint.tooltip docs to actual source code
 * @apioption series.mappoint.tooltip
 */

/**
 * @extends plotOptions.mappoint.zones
 * @product highmaps
 * @todo Copy series.mappoint.zones docs to actual source code
 * @apioption series.mappoint.zones
 */