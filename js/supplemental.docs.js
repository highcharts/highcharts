/*
   This file contains things that are referrenced in the old API dump,
   which can't be found in the source code.
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
 * @default false
 * @since 4.1.8
 * @apioption exporting.allowHTML
 */

/**
 * Additional chart options to be merged into an exported chart. For
 * example, a common use case is to add data labels to improve readability
 * of the exported chart, or to add a printer-friendly color scheme.
 * 
 * @type {Object}
 * @sample {highcharts} highcharts/exporting/chartoptions-data-labels/ Added data labels
 * @sample {highstock} highcharts/exporting/chartoptions-data-labels/ Added data labels
 * @default null
 * @apioption exporting.chartOptions
 */

/**
 * Whether to enable the exporting module. Disabling the module will
 * hide the context button, but API methods will still be available.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/exporting/enabled-false/ Exporting module is loaded but disabled
 * @sample {highstock} highcharts/exporting/enabled-false/ Exporting module is loaded but disabled
 * @default true
 * @since 2.0
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
 * @default undefined
 * @since 5.0.0
 * @apioption exporting.error
 */

/**
 * Whether or not to fall back to the export server if the offline-exporting
 * module is unable to export the chart on the client side.
 * 
 * @type {Boolean}
 * @default true
 * @since 4.1.8
 * @apioption exporting.fallbackToExportServer
 */

/**
 * The filename, without extension, to use for the exported chart.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/exporting/filename/ Custom file name
 * @sample {highstock} highcharts/exporting/filename/ Custom file name
 * @default chart
 * @since 2.0
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
 * @default https://code.highcharts.com/{version}/lib
 * @since 5.0.0
 * @apioption exporting.libURL
 */

/**
 * Analogous to [sourceWidth](#exporting.sourceWidth)
 * 
 * @type {Number}
 * @since 3.0
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
 * @sample {highmaps} maps/exporting/sourcewidth/ Source size demo
 * @since 3.0
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
 * @default undefined
 * @since 2.0
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
 * @apioption exporting.buttons.contextButton.onclick
 */

/**
 * See [navigation.buttonOptions](#navigation.buttonOptions) => symbolFill.
 * 
 * @type {Color}
 * @default #666666
 * @since 2.0
 * @apioption exporting.buttons.contextButton.symbolFill
 */

/**
 * The horizontal position of the button relative to the `align` option.
 * 
 * @type {Number}
 * @default -10
 * @since 2.0
 * @apioption exporting.buttons.contextButton.x
 */

/**
 * A custom `Date` class for advanced date handling. For example, [JDate](https://github.
 * com/tahajahangir/jdate) can be hooked in to handle Jalali dates.
 * 
 * @type {Object}
 * @since 4.0.4
 * @product highcharts highstock
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
 * @default http://code.highcharts.com/{version}/modules/canvas-tools.js
 * @product highcharts highmaps
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
 * @default undefined
 * @since 5.0.7
 * @product highcharts highstock
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
 * @default 0
 * @since 3.0.8
 * @product highcharts highstock
 * @apioption global.timezoneOffset
 */

/**
 * A HTML label that can be positioned anywhere in the chart area.
 * 
 * @type {Array<Object>}
 * @apioption labels.items
 */

/**
 * Inner HTML or text for the label.
 * 
 * @type {String}
 * @apioption labels.items.html
 */

/**
 * CSS styles for each label. To position the label, use left and top
 * like this:
 * 
 * <pre>style: {
 *     left: '100px',
 *     top: '100px'
 * }</pre>
 * 
 * @type {CSSObject}
 * @apioption labels.items.style
 */

/**
 * Exporting module menu. The tooltip title for the context menu holding
 * print and export menu items.
 * 
 * @type {String}
 * @default Chart context menu
 * @since 3.0
 * @apioption lang.contextButtonTitle
 */

/**
 * Exporting module only. The text for the JPEG download menu item.
 * 
 * @type {String}
 * @default Download JPEG image
 * @since 2.0
 * @apioption lang.downloadJPEG
 */

/**
 * Exporting module only. The text for the PDF download menu item.
 * 
 * @type {String}
 * @default Download PDF document
 * @since 2.0
 * @apioption lang.downloadPDF
 */

/**
 * Exporting module only. The text for the PNG download menu item.
 * 
 * @type {String}
 * @default Download PNG image
 * @since 2.0
 * @apioption lang.downloadPNG
 */

/**
 * Exporting module only. The text for the SVG download menu item.
 * 
 * @type {String}
 * @default Download SVG vector image
 * @since 2.0
 * @apioption lang.downloadSVG
 */

/**
 * The text for the button that appears when drilling down, linking
 * back to the parent series. The parent series' name is inserted for
 * `{series.name}`.
 * 
 * @type {String}
 * @default Back to {series.name}
 * @since 3.0.8
 * @product highcharts highmaps
 * @apioption lang.drillUpText
 */

/**
 * What to show in a date field for invalid dates. Defaults to an empty
 * string.
 * 
 * @type {String}
 * @since 4.1.8
 * @product highcharts highstock
 * @apioption lang.invalidDate
 */

/**
 * The text to display when the chart contains no data. Requires the
 * no-data module, see [noData](#noData).
 * 
 * @type {String}
 * @default No data to display
 * @since 3.0.8
 * @product highcharts
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
 * @default 1000
 * @since 5.0.3
 * @apioption lang.numericSymbolMagnitude
 */

/**
 * Exporting module only. The text for the menu item to print the chart.
 * 
 * @type {String}
 * @default Print chart
 * @since 3.0.1
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
 * @sample {highstock} stock/legend/align/ Various legend options
 * @sample {highmaps} maps/legend/border-background/ Border and background options
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
 * @sample {highstock} stock/legend/align/ Various legend options
 * @sample {highmaps} maps/legend/border-background/ Border and background options
 * @default 0
 * @apioption legend.borderWidth
 */

/**
 * When the legend is floating, the plot area ignores it and is allowed
 * to be placed below it.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/legend/floating-false/ False by default
 * @sample {highcharts} highcharts/legend/floating-true/ True
 * @sample {highmaps} maps/legend/alignment/ Floating legend
 * @default false
 * @since 2.1
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
 * @apioption legend.itemDistance
 */

/**
 * The pixel bottom margin for each legend item.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highstock} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highmaps} maps/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @default 0
 * @since 2.2.0
 * @apioption legend.itemMarginBottom
 */

/**
 * The pixel top margin for each legend item.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highstock} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highmaps} maps/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @default 0
 * @since 2.2.0
 * @apioption legend.itemMarginTop
 */

/**
 * The width for each legend item. This is useful in a horizontal layout
 * with many items when you want the items to align vertically. .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/itemwidth-default/ Null by default
 * @sample {highcharts} highcharts/legend/itemwidth-80/ 80 for aligned legend items
 * @default null
 * @since 2.0
 * @apioption legend.itemWidth
 */

/**
 * A [format string](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting) for each legend label. Available variables
 * relates to properties on the series, or the point in case of pies.
 * 
 * @type {String}
 * @default {name}
 * @since 1.3
 * @apioption legend.labelFormat
 */

/**
 * Line height for the legend items. Deprecated as of 2.1\. Instead,
 * the line height for each item can be set using itemStyle.lineHeight,
 * and the padding between items using itemMarginTop and itemMarginBottom.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/lineheight/ Setting padding
 * @default 16
 * @since 2.0
 * @product highcharts
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
 * @default 12
 * @since 2.1
 * @apioption legend.margin
 */

/**
 * Maximum pixel height for the legend. When the maximum height is extended,
 *  navigation will show.
 * 
 * @type {Number}
 * @default undefined
 * @since 2.3.0
 * @apioption legend.maxHeight
 */

/**
 * The inner padding of the legend box.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highstock} highcharts/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @sample {highmaps} maps/legend/padding-itemmargin/ Padding and item margins demonstrated
 * @default 8
 * @since 2.2.0
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
 * @default false
 * @since 1.2.5
 * @apioption legend.reversed
 */

/**
 * Whether to show the symbol on the right side of the text rather than
 * the left side. This is common in Arabic and Hebraic.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/legend/rtl/ Symbol to the right
 * @default false
 * @since 2.2
 * @product highcharts highmaps
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
 * @apioption legend.style
 */



/**
 * @since next
 * @product highcharts
 * @apioption legend.keyboardNavigation
 */

/**
 * Enable/disable keyboard navigation for the legend. Requires the Accessibility
 * module.
 * 
 * @type {Boolean}
 * @see [accessibility.keyboardNavigation](#accessibility.keyboardNavigation.
 * enabled)
 * @default true
 * @since next
 * @product highcharts
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
 * @default true
 * @since 2.2.4
 * @apioption legend.navigation.animation
 */

/**
 * The pixel size of the up and down arrows in the legend paging navigation.
 *  .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @sample {highstock} highcharts/legend/navigation/ Legend page navigation demonstrated
 * @default 12
 * @since 2.2.4
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
 * @default true
 * @since 4.2.4
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
 * @apioption legend.navigation.style
 */

/**
 * A text or HTML string for the title.
 * 
 * @type {String}
 * @default null
 * @since 3.0
 * @apioption legend.title.text
 */


/**
 * Alignment for the buttons.
 * 
 * @validvalue ["left", "center", "right"]
 * @type {String}
 * @sample {highcharts} highcharts/navigation/buttonoptions-align/ Center aligned
 * @sample {highstock} highcharts/navigation/buttonoptions-align/ Center aligned
 * @sample {highmaps} highcharts/navigation/buttonoptions-align/ Center aligned
 * @default right
 * @since 2.0
 * @apioption navigation.buttonOptions.align
 */

/**
 * Whether to enable buttons.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/navigation/buttonoptions-enabled/ Exporting module loaded but buttons disabled
 * @sample {highstock} highcharts/navigation/buttonoptions-enabled/ Exporting module loaded but buttons disabled
 * @sample {highmaps} highcharts/navigation/buttonoptions-enabled/ Exporting module loaded but buttons disabled
 * @default true
 * @since 2.0
 * @apioption navigation.buttonOptions.enabled
 */

/**
 * Pixel height of the buttons.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default 20
 * @since 2.0
 * @apioption navigation.buttonOptions.height
 */

/**
 * The pixel size of the symbol on the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default 14
 * @since 2.0
 * @apioption navigation.buttonOptions.symbolSize
 */

/**
 * The x position of the center of the symbol inside the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default 12.5
 * @since 2.0
 * @apioption navigation.buttonOptions.symbolX
 */

/**
 * The y position of the center of the symbol inside the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default 10.5
 * @since 2.0
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
 * @default null
 * @since 3.0
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
 * @default top
 * @since 2.0
 * @apioption navigation.buttonOptions.verticalAlign
 */

/**
 * The pixel width of the button.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highstock} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @sample {highmaps} highcharts/navigation/buttonoptions-height/ Bigger buttons
 * @default 24
 * @since 2.0
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
 * @default 0
 * @since 2.0
 * @apioption navigation.buttonOptions.y
 */

/**
 * An object of additional SVG attributes for the no-data label.
 * 
 * @type {Object}
 * @since 3.0.8
 * @product highcharts highstock
 * @apioption noData.attr
 */

/**
 * Whether to insert the label as HTML, or as pseudo-HTML rendered with
 * SVG.
 * 
 * @type {Boolean}
 * @default false
 * @since 4.1.10
 * @product highcharts highstock
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
 * @apioption pane.endAngle
 */

/**
 * The class name for this background.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/css/pane/ Panes styled by CSS
 * @sample {highstock} highcharts/css/pane/ Panes styled by CSS
 * @sample {highmaps} highcharts/css/pane/ Panes styled by CSS
 * @default highcharts-pane
 * @since 5.0.0
 * @apioption pane.background.className
 */













































































































































































/**
 * Allows setting a set of rules to apply for different screen or chart
 * sizes. Each rule specifies additional chart options.
 * 
 * @sample {highcharts} highcharts/responsive/axis/ Axis
 * @sample {highcharts} highcharts/responsive/legend/ Legend
 * @sample {highcharts} highcharts/responsive/classname/ Class name
 * @sample {highstock} stock/demo/responsive/ Stock chart
 * @sample {highstock} highcharts/responsive/axis/ Axis
 * @sample {highstock} highcharts/responsive/legend/ Legend
 * @sample {highstock} highcharts/responsive/classname/ Class name
 * @sample {highmaps} highcharts/responsive/axis/ Axis
 * @sample {highmaps} highcharts/responsive/legend/ Legend
 * @sample {highmaps} highcharts/responsive/classname/ Class name
 * @since 5.0.0
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
 * @apioption responsive.rules.chartOptions
 */

/**
 * Under which conditions the rule applies.
 * 
 * @type {Object}
 * @since 5.0.0
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
 * @apioption responsive.rules.condition.callback
 */

/**
 * The responsive rule applies if the chart height is less than this.
 * 
 * @type {Number}
 * @since 5.0.0
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
 * @apioption responsive.rules.condition.maxWidth
 */

/**
 * The responsive rule applies if the chart height is greater than this.
 * 
 * @type {Number}
 * @default 0
 * @since 5.0.0
 * @apioption responsive.rules.condition.minHeight
 */

/**
 * The responsive rule applies if the chart width is greater than this.
 * 
 * @type {Number}
 * @default 0
 * @since 5.0.0
 * @apioption responsive.rules.condition.minWidth
 */





































































































/**
 * When the subtitle is floating, the plot area will not move to make
 * space for it.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/subtitle/floating/ Floating title and subtitle
 * @sample {highstock} stock/chart/subtitle-footnote Footnote floating at bottom right of plot area
 * @default false
 * @since 2.1
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
 * @sample {highstock} stock/chart/subtitle-style Custom color and weight
 * @sample {highstock} highcharts/css/titles/ Styled mode
 * @sample {highmaps} highcharts/css/titles/ Styled mode
 * @default { "color": "#666666" }
 * @apioption subtitle.style
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the text.
 * 
 * @type {Boolean}
 * @default false
 * @apioption subtitle.useHTML
 */

/**
 * The vertical alignment of the title. Can be one of "top", "middle"
 * and "bottom". When a value is given, the title behaves as floating.
 * 
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @sample {highcharts} highcharts/subtitle/verticalalign/ Footnote at the bottom right of plot area
 * @sample {highstock} stock/chart/subtitle-footnote Footnote at the bottom right of plot area
 * @default  
 * @since 2.1
 * @apioption subtitle.verticalAlign
 */

/**
 * The x position of the subtitle relative to the alignment within chart.
 * spacingLeft and chart.spacingRight.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/subtitle/align/ Footnote at right of plot area
 * @sample {highstock} stock/chart/subtitle-footnote Footnote at the bottom right of plot area
 * @default 0
 * @since 2.0
 * @apioption subtitle.x
 */

/**
 * The y position of the subtitle relative to the alignment within chart.
 * spacingTop and chart.spacingBottom. By default the subtitle is laid
 * out below the title unless the title is floating.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/subtitle/verticalalign/ Footnote at the bottom right of plot area
 * @sample {highstock} stock/chart/subtitle-footnote Footnote at the bottom right of plot area
 * @default {highcharts}  null
 * @default {highstock}  null
 * @default {highmaps}  
 * @since 2.0
 * @apioption subtitle.y
 */

/**
 * When the title is floating, the plot area will not move to make space
 * for it.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/chart/zoomtype-none/ False by default
 * @sample {highcharts} highcharts/title/floating/ True - title on top of the plot area
 * @sample {highstock} stock/chart/title-floating/ True - title on top of the plot area
 * @default false
 * @since 2.1
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
 * @sample {highstock} stock/chart/title-style/ Custom color and weight
 * @sample {highstock} highcharts/css/titles/ Styled mode
 * @sample {highmaps} highcharts/css/titles/ Styled mode
 * @default {highcharts} { "color": "#333333", "fontSize": "18px" }
 * @default {highstock} { "color": "#333333", "fontSize": "16px" }
 * @default {highmaps} { "color": "#333333", "fontSize": "18px" }
 * @apioption title.style
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the text.
 * 
 * @type {Boolean}
 * @default false
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
 * @sample {highstock} stock/chart/title-verticalalign/ Chart title in bottom right corner
 * @since 2.1
 * @apioption title.verticalAlign
 */

/**
 * The x position of the title relative to the alignment within chart.
 * spacingLeft and chart.spacingRight.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/title/align/ Aligned to the plot area (x = 70px     = margin left - spacing left)
 * @sample {highstock} stock/chart/title-align/ Aligned to the plot area (x = 50px     = margin left - spacing left)
 * @default 0
 * @since 2.0
 * @apioption title.x
 */

/**
 * The y position of the title relative to the alignment within [chart.
 * spacingTop](#chart.spacingTop) and [chart.spacingBottom](#chart.spacingBottom).
 *  By default it depends on the font size.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/title/y/ Title inside the plot area
 * @sample {highstock} stock/chart/title-verticalalign/ Chart title in bottom right corner
 * @since 2.0
 * @apioption title.y
 */

/**
 * The color of the tooltip border. When `null`, the border takes the
 * color of the corresponding series or point.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/tooltip/bordercolor-default/ Follow series by default
 * @sample {highcharts} highcharts/tooltip/bordercolor-black/ Black border
 * @sample {highstock} stock/tooltip/general/ Styled tooltip
 * @sample {highmaps} maps/tooltip/background-border/ Background and border demo
 * @default null
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
 * @default true
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
 * @apioption tooltip.followTouchMove
 */

/**
 * Callback function to format the text of the tooltip from scratch. Return
 * `false` to disable tooltip for a specific point on series.
 * 
 * A subset of HTML is supported. Unless `useHTML` is true, the HTML of the
 * tooltip is parsed and converted to SVG, therefore this isn't a complete HTML
 * renderer. The following tags are supported: `<b>`, `<strong>`, `<i>`, `<em>`,
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
 * <dd>The series object. The series name is available through
 * `this.series.name`.</dd>
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
 * @sample {highstock} stock/tooltip/formatter/ Formatting with shared tooltip
 * @sample {highmaps} maps/tooltip/formatter/ String formatting
 * @apioption tooltip.formatter
 */

/**
 * The number of milliseconds to wait until the tooltip is hidden when
 * mouse out from a point or chart.
 * 
 * @type {Number}
 * @default 500
 * @since 3.0
 * @product highcharts highmaps
 * @apioption tooltip.hideDelay
 */

/**
 * A callback function for formatting the HTML output for a single point
 * in the tooltip. Like the `pointFormat` string, but with more flexibility.
 * 
 * @type {Function}
 * @context Point
 * @since 4.1.0
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
 * @sample {highstock} stock/tooltip/positioner/ A fixed tooltip position on top of the chart
 * @sample {highmaps} maps/tooltip/positioner/ A fixed tooltip position
 * @since 2.2.4
 * @apioption tooltip.positioner
 */

/**
 * The name of a symbol to use for the border around the tooltip.
 * 
 * @type {String}
 * @default callout
 * @validvalues ["callout", "square"]
 * @since 4.0
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
 * @default false
 * @since 5.0.0
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
 * @sample {highmaps} maps/tooltip/usehtml/ Pure HTML tooltip
 * @default false
 * @since 2.2
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
 * @sample {highmaps} maps/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @since 2.2
 * @apioption tooltip.valueDecimals
 */

/**
 * A string to prepend to each series' y value. Overridable in each
 * series' tooltip options object.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highstock} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highmaps} maps/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @since 2.2
 * @apioption tooltip.valuePrefix
 */

/**
 * A string to append to each series' y value. Overridable in each series'
 * tooltip options object.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highstock} highcharts/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @sample {highmaps} maps/tooltip/valuedecimals/ Set decimals, prefix and suffix for the value
 * @since 2.2
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
 * @default true
 * @since 2.0
 * @apioption xAxis.allowDecimals
 */

/**
 * When using an alternate grid color, a band is painted across the
 * plot area between every other grid line.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/yaxis/alternategridcolor/ Alternate grid color on the Y axis
 * @sample {highstock} stock/xaxis/alternategridcolor/ Alternate grid color on the Y axis
 * @default null
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
 * @apioption xAxis.className
 */

/**
 * _Requires Accessibility module_
 * 
 * Description of the axis to screen reader users.
 * 
 * @type {String}
 * @default undefined
 * @since 5.0.0
 * @apioption xAxis.description
 */

/**
 * The lowest allowed value for automatically computed axis extremes.
 * 
 * @type {Number}
 * @see [ceiling](#yAxis.ceiling)
 * @sample {highcharts} highcharts/yaxis/floor-ceiling/ Floor and ceiling
 * @sample {highstock} stock/demo/lazy-loading/ Prevent negative stock price on Y axis
 * @default null
 * @since 4.0
 * @product highcharts highstock
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
 * @sample {highstock} stock/xaxis/gridlinedashstyle/ Long dashes
 * @default Solid
 * @since 1.2
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
 * @sample {highstock} stock/xaxis/gridlinewidth/ 2px lines
 * @sample {highstock} highcharts/css/axis-grid/ Styled mode
 * @default 0
 * @apioption xAxis.gridLineWidth
 */

/**
 * The Z index of the grid lines.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/gridzindex/ A Z index of 4 renders the grid above the graph
 * @sample {highstock} highcharts/xaxis/gridzindex/ A Z index of 4 renders the grid above the graph
 * @default 1
 * @product highcharts highstock
 * @apioption xAxis.gridZIndex
 */

/**
 * An id for the axis. This can be used after render time to get a pointer
 * to the axis object through `chart.get()`.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/id/ Get the object
 * @sample {highstock} stock/xaxis/id/ Get the object
 * @default null
 * @since 1.2.0
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
 * @default null
 * @since 2.0.2
 * @product highcharts highstock
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
 * @sample {highstock} stock/xaxis/min-max/ Fixed min and max
 * @sample {highmaps} maps/axis/min-max/ Pre-zoomed to a specific area
 * @apioption xAxis.max
 */

/**
 * Deprecated. Use `minRange` instead.
 * 
 * @type {Number}
 * @deprecated
 * @product highcharts highstock
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
 * @sample {highstock} stock/xaxis/min-max/ Fixed min and max
 * @sample {highmaps} maps/axis/min-max/ Pre-zoomed to a specific area
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
 * @sample {highstock} stock/xaxis/minrange/ Max zoom of 6 months overrides user selections
 * @sample {highmaps} maps/axis/minrange/ Minimum range of 1000
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
 * @sample {highstock} stock/xaxis/minorgridlinedashstyle/ Long dashes on minor grid lines
 * @default Solid
 * @since 1.2
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
 * @productdesc {highcharts}
 * On axes using [categories](#xAxis.categories), minor ticks are not
 * supported.
 * 
 * @type {String|Number}
 * @sample {highcharts} highcharts/yaxis/minortickinterval-null/ Null by default
 * @sample {highcharts} highcharts/yaxis/minortickinterval-auto/ "auto" on linear Y axis
 * @sample {highcharts} highcharts/yaxis/minortickinterval-5/ 5 units
 * @sample {highcharts} highcharts/yaxis/minortickinterval-log-auto/ "auto"
 * @sample {highcharts} highcharts/yaxis/minortickinterval-log/ 0.1
 * @sample {highstock} stock/demo/basic-line/ Null by default
 * @sample {highstock} stock/xaxis/minortickinterval-auto/ "auto"
 * @apioption xAxis.minorTickInterval
 */

/**
 * The pixel width of the minor tick mark.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/yaxis/minortickwidth/ 3px width
 * @sample {highstock} stock/xaxis/minorticks/ 1px width
 * @default 0
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
 * @sample {highstock} stock/xaxis/offset/ Y axis offset by 70 px
 * @default 0
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
 * @sample {highstock} stock/xaxis/opposite/ Y axis on left side
 * @default false
 * @apioption xAxis.opposite
 */

/**
 * Whether to reverse the axis so that the highest number is closest
 * to the origin. If the chart is inverted, the x axis is reversed by
 * default.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/yaxis/reversed/ Reversed Y axis
 * @sample {highstock} stock/xaxis/reversed/ Reversed Y axis
 * @default false
 * @apioption xAxis.reversed
 */

/**
 * Whether to show the axis line and title when the axis has no data.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/yaxis/showempty/ When clicking the legend to hide series, one axis preserves line and title, the other doesn't
 * @sample {highstock} highcharts/yaxis/showempty/ When clicking the legend to hide series, one axis preserves line and title, the other doesn't
 * @default true
 * @since 1.1
 * @apioption xAxis.showEmpty
 */

/**
 * Whether to show the first tick label.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/showfirstlabel-false/ Set to false on X axis
 * @sample {highstock} stock/xaxis/showfirstlabel/ Labels below plot lines on Y axis
 * @default true
 * @apioption xAxis.showFirstLabel
 */

/**
 * Whether to show the last tick label.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/showlastlabel-true/ Set to true on X axis
 * @sample {highstock} stock/xaxis/showfirstlabel/ Labels below plot lines on Y axis
 * @default true
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
 * @sample {highstock} stock/xaxis/tickinterval/ Tick interval of 0.01 on Y axis
 * @default null
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
 * @sample {highstock} stock/xaxis/ticks/ Formatted ticks on X axis
 * @sample {highstock} highcharts/css/axis-grid/ Styled mode
 * @default {highcharts} 1
 * @default {highstock} 1
 * @default {highmaps} 0
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
 * @default true
 * @since 4.2.7
 * @product highcharts
 * @apioption xAxis.uniqueNames
 */

/**
 * Datetime axis only. An array determining what time intervals the
 * ticks are allowed to fall on. Each array item is an array where the
 * first value is the time unit and the second value another array of
 * allowed multiples. Defaults to:
 * 
 * <pre>units: [[
 *     'millisecond', // unit name
 *     [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
 * ], [
 *     'second',
 *     [1, 2, 5, 10, 15, 30]
 * ], [
 *     'minute',
 *     [1, 2, 5, 10, 15, 30]
 * ], [
 *     'hour',
 *     [1, 2, 3, 4, 6, 8, 12]
 * ], [
 *     'day',
 *     [1]
 * ], [
 *     'week',
 *     [1]
 * ], [
 *     'month',
 *     [1, 3, 6]
 * ], [
 *     'year',
 *     null
 * ]]</pre>
 * 
 * @type {Array}
 * @product highcharts highstock
 * @apioption xAxis.units
 */

/**
 * Whether axis, including axis title, line, ticks and labels, should
 * be visible.
 * 
 * @type {Boolean}
 * @default true
 * @since 4.1.9
 * @product highcharts highstock
 * @apioption xAxis.visible
 */

/**
 * An array defining breaks in the axis, the sections defined will be
 * left out and all the points shifted closer to each other.
 * 
 * @productdesc {highcharts}
 * Requires that the broken-axis.js module is loaded.
 * 
 * @type {Array}
 * @sample {highcharts} highcharts/axisbreak/break-simple/ Simple break
 * @sample {highcharts} highcharts/axisbreak/break-visualized/ Advanced with callback
 * @sample {highstock} stock/demo/intraday-breaks/ Break on nights and weekends
 * @sample {highstock} highcharts/axisbreak/break-visualized/ Broken Y axis
 * @since 4.1.0
 * @product highcharts highstock
 * @apioption xAxis.breaks
 */

/**
 * A number indicating how much space should be left between the start
 * and the end of the break. The break size is given in axis units,
 * so for instance on a `datetime` axis, a break size of 3600000 would
 * indicate the equivalent of an hour.
 * 
 * @type {Number}
 * @default 0
 * @since 4.1.0
 * @product highcharts highstock
 * @apioption xAxis.breaks.breakSize
 */

/**
 * The point where the break starts.
 * 
 * @type {Number}
 * @since 4.1.0
 * @product highcharts highstock
 * @apioption xAxis.breaks.from
 */

/**
 * Defines an interval after which the break appears again. By default
 * the breaks do not repeat.
 * 
 * @type {Number}
 * @default 0
 * @since 4.1.0
 * @product highcharts highstock
 * @apioption xAxis.breaks.repeat
 */

/**
 * The point where the break ends.
 * 
 * @type {Number}
 * @since 4.1.0
 * @product highcharts highstock
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
 * @productdesc {highstock}
 * In Highstock, bu default, the crosshair is enabled on the X axis and
 * disabled on the Y axis.
 * 
 * @type {Boolean|Object}
 * @sample {highcharts} highcharts/xaxis/crosshair-both/ Crosshair on both axes
 * @sample {highstock} stock/xaxis/crosshairs-xy/ Crosshair on both axes
 * @sample {highmaps} highcharts/xaxis/crosshair-both/ Crosshair on both axes
 * @default false
 * @since 4.1
 * @apioption xAxis.crosshair
 */

/**
 * A class name for the crosshair, especially as a hook for styling.
 * 
 * @type {String}
 * @since 5.0.0
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
 * @default #cccccc
 * @since 4.1
 * @apioption xAxis.crosshair.color
 */

/**
 * The dash style for the crosshair. See [series.dashStyle](#plotOptions.
 * series.dashStyle) for possible values.
 * 
 * @validvalue ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/crosshair-dotted/ Dotted crosshair
 * @sample {highstock} stock/xaxis/crosshair-dashed/ Dashed X axis crosshair
 * @sample {highmaps} highcharts/xaxis/crosshair-dotted/ Dotted crosshair
 * @default Solid
 * @since 4.1
 * @apioption xAxis.crosshair.dashStyle
 */

/**
 * Whether the crosshair should snap to the point or follow the pointer
 * independent of points.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/crosshair-snap-false/ True by default
 * @sample {highstock} highcharts/xaxis/crosshair-snap-false/ True by default
 * @sample {highmaps} maps/demo/latlon-advanced/ Snap is false
 * @default true
 * @since 4.1
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
 * @default 1
 * @since 4.1
 * @apioption xAxis.crosshair.width
 */

/**
 * The Z index of the crosshair. Higher Z indices allow drawing the
 * crosshair on top of the series or behind the grid lines.
 * 
 * @type {Number}
 * @default 2
 * @since 4.1
 * @apioption xAxis.crosshair.zIndex
 */

/**
 * Event handlers for the axis.
 * 
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
 * @apioption xAxis.events.afterBreaks
 */

/**
 * As opposed to the `setExtremes` event, this event fires after the
 * final min and max values are computed and corrected for `minRange`.
 * 
 * 
 * Fires when the minimum and maximum is set for the axis, either by
 * calling the `.setExtremes()` method or by selecting an area in the
 * chart. One parameter, `event`, is passed to the function, containing common event information.
 * 
 * The new user set minimum and maximum values can be found by `event.
 * min` and `event.max`. These reflect the axis minimum and maximum
 * in axis values. The actual data extremes are found in `event.dataMin`
 * and `event.dataMax`.
 * 
 * @type {Function}
 * @context Axis
 * @since 2.3
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
 * @apioption xAxis.events.pointBreak
 */

/**
 * An event fired when a point falls inside a break from this axis.
 * 
 * @type {Function}
 * @context Axis
 * @product highcharts highstock
 * @apioption xAxis.events.pointInBreak
 */

/**
 * Fires when the minimum and maximum is set for the axis, either by
 * calling the `.setExtremes()` method or by selecting an area in the
 * chart. One parameter, `event`, is passed to the function, containing common event information.
 * 
 * The new user set minimum and maximum values can be found by `event.
 * min` and `event.max`. These reflect the axis minimum and maximum
 * in data values. When an axis is zoomed all the way out from the "Reset
 * zoom" button, `event.min` and `event.max` are null, and the new extremes
 * are set based on `this.dataMin` and `this.dataMax`.
 * 
 * @type {Function}
 * @context Axis
 * @sample {highstock} stock/xaxis/events-setextremes/ Log new extremes on x axis
 * @since 1.2.0
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
 * @default [-45]
 * @since 4.1.0
 * @product highcharts highstock
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
 * @default 80
 * @since 4.1.5
 * @product highcharts
 * @apioption xAxis.labels.autoRotationLimit
 */

/**
 * Polar charts only. The label's pixel distance from the perimeter
 * of the plot area.
 * 
 * @type {Number}
 * @default 15
 * @product highcharts
 * @apioption xAxis.labels.distance
 */

/**
 * A [format string](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting) for the axis label.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/yaxis/labels-format/ Add units to Y axis label
 * @sample {highstock} highcharts/yaxis/labels-format/ Add units to Y axis label
 * @default {value}
 * @since 3.0
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
 *     return this.value;
 * }</pre>
 * 
 * @type {Function}
 * @sample {highcharts} highcharts/xaxis/labels-formatter-linked/ Linked category names
 * @sample {highcharts} highcharts/xaxis/labels-formatter-extended/ Modified numeric labels
 * @sample {highstock} stock/xaxis/labels-formatter/ Added units on Y axis
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
 * @apioption xAxis.labels.overflow
 */

/**
 * The pixel padding for axis labels, to ensure white space between
 * them.
 * 
 * @type {Number}
 * @default 5
 * @product highcharts
 * @apioption xAxis.labels.padding
 */

/**
 * Whether to reserve space for the labels. This can be turned off when
 * for example the labels are rendered inside the plot area instead
 * of outside.
 * 
 * @type {Boolean}
 * @sample {highcharts} highcharts/xaxis/labels-reservespace/ No reserved space, labels inside plot
 * @default true
 * @since 4.1.10
 * @product highcharts
 * @apioption xAxis.labels.reserveSpace
 */

/**
 * Rotation of the labels in degrees.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-rotation/ X axis labels rotated 90°
 * @default 0
 * @apioption xAxis.labels.rotation
 */

/**
 * Horizontal axes only. The number of lines to spread the labels over
 * to make room or tighter labels. .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-staggerlines/ Show labels over two lines
 * @sample {highstock} stock/xaxis/labels-staggerlines/ Show labels over two lines
 * @default null
 * @since 2.1
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
 * @default null
 * @since 2.1
 * @apioption xAxis.labels.step
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the labels.
 * 
 * @type {Boolean}
 * @default false
 * @apioption xAxis.labels.useHTML
 */

/**
 * The y position offset of the label relative to the tick position
 * on the axis. The default makes it adapt to the font size on bottom
 * axis.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/labels-x/ Y axis labels placed on grid lines
 * @default null
 * @apioption xAxis.labels.y
 */

/**
 * The Z index for the axis labels.
 * 
 * @type {Number}
 * @default 7
 * @apioption xAxis.labels.zIndex
 */

/**
 * An array of colored bands stretching across the plot area marking
 * an interval on the axis.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the plot bands are styled by the `.highcharts-
 * plot-band` class in addition to the `className` option.
 *
 * @productdesc {highcharts}
 * In a gauge, a plot band on the Y axis (value axis) will stretch along
 * the perimeter of the gauge.
 * 
 * @type {Array<Object>}
 * @product highcharts highstock
 * @apioption xAxis.plotBands
 */

/**
 * Border color for the plot band. Also requires `borderWidth` to be
 * set.
 * 
 * @type {Color}
 * @default null
 * @product highcharts highstock
 * @apioption xAxis.plotBands.borderColor
 */

/**
 * Border width for the plot band. Also requires `borderColor` to be
 * set.
 * 
 * @type {Number}
 * @default 0
 * @product highcharts highstock
 * @apioption xAxis.plotBands.borderWidth
 */

/**
 * A custom class name, in addition to the default `highcharts-plot-
 * band`, to apply to each individual band.
 * 
 * @type {String}
 * @since 5.0.0
 * @apioption xAxis.plotBands.className
 */

/**
 * The color of the plot band.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/xaxis/plotbands-color/ Color band
 * @sample {highstock} stock/xaxis/plotbands/ Plot band on Y axis
 * @default null
 * @product highcharts highstock
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
 * @apioption xAxis.plotBands.events
 */

/**
 * The start position of the plot band in axis units.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-color/ Datetime axis
 * @sample {highcharts} highcharts/xaxis/plotbands-from/ Categorized axis
 * @sample {highstock} stock/xaxis/plotbands/ Plot band on Y axis
 * @default null
 * @product highcharts highstock
 * @apioption xAxis.plotBands.from
 */

/**
 * An id used for identifying the plot band in Axis.removePlotBand.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotbands-id/ Remove plot band by id
 * @sample {highstock} highcharts/xaxis/plotbands-id/ Remove plot band by id
 * @default null
 * @product highcharts highstock
 * @apioption xAxis.plotBands.id
 */

/**
 * The end position of the plot band in axis units.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-color/ Datetime axis
 * @sample {highcharts} highcharts/xaxis/plotbands-from/ Categorized axis
 * @sample {highstock} stock/xaxis/plotbands/ Plot band on Y axis
 * @default null
 * @product highcharts highstock
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
 * @default null
 * @since 1.2
 * @product highcharts highstock
 * @apioption xAxis.plotBands.zIndex
 */

/**
 * Text labels for the plot bands
 * 
 * @product highcharts highstock
 * @apioption xAxis.plotBands.label
 */

/**
 * Horizontal alignment of the label. Can be one of "left", "center"
 * or "right".
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-align/ Aligned to the right
 * @sample {highstock} stock/xaxis/plotbands-label/ Plot band with labels
 * @default center
 * @since 2.1
 * @product highcharts highstock
 * @apioption xAxis.plotBands.label.align
 */

/**
 * Rotation of the text label in degrees .
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-rotation/ Vertical text
 * @default 0
 * @since 2.1
 * @product highcharts highstock
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
 * @apioption xAxis.plotBands.label.style
 */

/**
 * The string text itself. A subset of HTML is supported.
 * 
 * @type {String}
 * @since 2.1
 * @product highcharts
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
 * @apioption xAxis.plotBands.label.textAlign
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the labels.
 * 
 * @type {Boolean}
 * @default false
 * @since 3.0.3
 * @product highcharts highstock
 * @apioption xAxis.plotBands.label.useHTML
 */

/**
 * Vertical alignment of the label relative to the plot band. Can be
 * one of "top", "middle" or "bottom".
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-verticalalign/ Vertically centered label
 * @sample {highstock} stock/xaxis/plotbands-label/ Plot band with labels
 * @default top
 * @since 2.1
 * @product highcharts highstock
 * @apioption xAxis.plotBands.label.verticalAlign
 */

/**
 * Horizontal position relative the alignment. Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-align/ Aligned 10px from the right edge
 * @sample {highstock} stock/xaxis/plotbands-label/ Plot band with labels
 * @since 2.1
 * @product highcharts highstock
 * @apioption xAxis.plotBands.label.x
 */

/**
 * Vertical position of the text baseline relative to the alignment.
 *  Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotbands-label-y/ Label on x axis
 * @sample {highstock} stock/xaxis/plotbands-label/ Plot band with labels
 * @since 2.1
 * @product highcharts highstock
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
 * @apioption xAxis.plotLines
 */

/**
 * A custom class name, in addition to the default `highcharts-plot-
 * line`, to apply to each individual line.
 * 
 * @type {String}
 * @since 5.0.0
 * @apioption xAxis.plotLines.className
 */

/**
 * The color of the line.
 * 
 * @type {Color}
 * @sample {highcharts} highcharts/xaxis/plotlines-color/ A red line from X axis
 * @sample {highstock} stock/xaxis/plotlines/ Plot line on Y axis
 * @default null
 * @product highcharts highstock
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
 * @sample {highstock} stock/xaxis/plotlines/ Plot line on Y axis
 * @default Solid
 * @since 1.2
 * @product highcharts highstock
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
 * @apioption xAxis.plotLines.events
 */

/**
 * An id used for identifying the plot line in Axis.removePlotLine.
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-id/ Remove plot line by id
 * @default null
 * @product highcharts highstock
 * @apioption xAxis.plotLines.id
 */

/**
 * The position of the line in axis units.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-color/ Between two categories on X axis
 * @sample {highstock} stock/xaxis/plotlines/ Plot line on Y axis
 * @default null
 * @product highcharts highstock
 * @apioption xAxis.plotLines.value
 */

/**
 * The width or thickness of the plot line.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-color/ 2px wide line from X axis
 * @sample {highstock} stock/xaxis/plotlines/ Plot line on Y axis
 * @default null
 * @product highcharts highstock
 * @apioption xAxis.plotLines.width
 */

/**
 * The z index of the plot line within the chart.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-zindex-behind/ Behind plot lines by default
 * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above/ Above plot lines
 * @sample {highcharts} highcharts/xaxis/plotlines-zindex-above-all/ Above plot lines and series
 * @default null
 * @since 1.2
 * @product highcharts highstock
 * @apioption xAxis.plotLines.zIndex
 */

/**
 * Text labels for the plot bands
 * 
 * @product highcharts highstock
 * @apioption xAxis.plotLines.label
 */

/**
 * Horizontal alignment of the label. Can be one of "left", "center"
 * or "right".
 * 
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/ Aligned to the right
 * @sample {highstock} stock/xaxis/plotlines/ Plot line on Y axis
 * @default left
 * @since 2.1
 * @product highcharts highstock
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
 * @apioption xAxis.plotLines.label.rotation
 */

/**
 * CSS styles for the text label.
 * 
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the labels are styled by the
 * `.highcharts-plot-line-label` class.
 * 
 * @type {Object}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-style/ Blue and bold label
 * @since 2.1
 * @product highcharts highstock
 * @apioption xAxis.plotLines.label.style
 */

/**
 * The text itself. A subset of HTML is supported.
 * 
 * @type {String}
 * @since 2.1
 * @product highcharts
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
 * @apioption xAxis.plotLines.label.textAlign
 */

/**
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
 * and-string-formatting#html) to render the labels.
 * 
 * @type {Boolean}
 * @default false
 * @since 3.0.3
 * @product highcharts highstock
 * @apioption xAxis.plotLines.label.useHTML
 */

/**
 * Vertical alignment of the label relative to the plot line. Can be
 * one of "top", "middle" or "bottom".
 * 
 * @validvalue ["top", "middle", "bottom"]
 * @type {String}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-verticalalign-middle/ Vertically centered label
 * @default {highcharts} top
 * @default {highstock} "top"
 * @since 2.1
 * @product highcharts highstock
 * @apioption xAxis.plotLines.label.verticalAlign
 */

/**
 * Horizontal position relative the alignment. Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-align-right/ Aligned 10px from the right edge
 * @sample {highstock} stock/xaxis/plotlines/ Plot line on Y axis
 * @since 2.1
 * @product highcharts highstock
 * @apioption xAxis.plotLines.label.x
 */

/**
 * Vertical position of the text baseline relative to the alignment.
 *  Default varies by orientation.
 * 
 * @type {Number}
 * @sample {highcharts} highcharts/xaxis/plotlines-label-y/ Label below the plot line
 * @sample {highstock} stock/xaxis/plotlines/ Plot line on Y axis
 * @since 2.1
 * @product highcharts highstock
 * @apioption xAxis.plotLines.label.y
 */

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
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-
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
 * @apioption yAxis.min
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
 * @apioption yAxis.labels.align
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
 * By default, the inner radius is controlled by the [thickness](#yAxis.
 * plotBands.thickness) option.
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
 * @product highcharts
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
 * Whether to [use HTML](http://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
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
 * See [the Axis object](#Axis) for programmatic access to the axis.
 * 
 * @extends xAxis
 * @excluding breaks, crosshair, lineColor, lineWidth, nameToX, showEmpty
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
 * A fixed pixel position for the buttons. Supports two properties,
 * `x` and `y`.``
 * 
 * @type {Object}
 * @product highstock
 * @apioption rangeSelector.buttonPosition
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
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the inputs are styled by the `.highcharts-range-
 * input text` rule in SVG mode, and `input.highcharts-range-selector`
 * when active.
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
 * A custom data grouping object for each button.
 * 
 * @type {Object}
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
 * Defined the time span for the button. Can be one of `"millisecond",
 * "second", "minute", "hour", "day", "week", "month", "ytd", "all"`.
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
 * How many decimals to show for the `point.change` value when the `series.
 * compare` option is set. This is overridable in each series' tooltip
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
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), the label is styled with the `.highcharts-crosshair-
 * label` class.
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
 * Whether to display the axis on the opposite side of the normal. The
 * normal is on the left side for vertical axes and bottom for horizontal,
 * so the opposite sides will be right and top respectively. In Highstock
 * 1.x, the Y axis was placed on the left side by default.
 * 
 * @type {Boolean}
 * @sample {highstock} stock/xaxis/opposite/ Y axis on left side
 * @default true
 * @product highstock
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
 * In [styled mode](http://www.highcharts.com/docs/chart-design-and-
 * style/style-by-css), all the presentational options for the scrollbar
 * are replaced by the classes `.highcharts-scrollbar-thumb`, `.highcharts-
 * scrollbar-arrow`, `.highcharts-scrollbar-button`, `.highcharts-scrollbar-
 * rifles` and `.highcharts-scrollbar-track`.
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
 * @type {String|Object|Array<Object>}
 * @see [mapData](#series<map>.mapData)
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
 * Enables zooming by mouse wheel. By default it inherits the [enabled](#mapNavigation.
 * enabled) setting.
 * 
 * @type {Boolean}
 * @product highmaps
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












































