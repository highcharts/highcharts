/*
*  This file contains things that are referrenced in the old API dump, which   *
*  can't be found in the source code. All items here should be moved over to   *
*  the appropriate location in the source.                                     *
*******************************************************************************/

/* eslint max-len: 0 */

































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












































