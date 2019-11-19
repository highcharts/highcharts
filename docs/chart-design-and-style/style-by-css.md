Style by CSS
===

Highcharts optionally features _styled mode_, where the graphic design is clearly separated from the chart functionality.

When the [chart.styledMode](https://api.highcharts.com/highcharts/chart.styledMode) option is `true`, no presentational attributes (like `fill`, `stroke`, font styles etc.) are applied to the chart SVG. Instead, the design is applied purely by CSS.

Highcharts comes with a default CSS file, [css/highcharts.css](https://code.highcharts.com/css/highcharts.css), which is built from [SCSS](https://github.com/highcharts/highcharts/blob/master/css/highcharts.scss).

To customize your styles, you can [create your own themes with SCSS](https://www.highcharts.com/docs/chart-design-and-style/custom-themes-in-styled-mode), or just add your own individual CSS rules. See our [CodePen boilerplate](https://codepen.io/anon/pen/eQyawK) to experiment with the default SCSS.

### Upgrade note

Prior to Highcharts v7, styled mode was served as a separate set of files. Instead of an option `chart.styledMode`, styled mode was enabled by loading files from the `/js/` folder on `code.highcharts.com`, in the zip file and in the npm package. These files are no longer maintained.

WHAT CSS RULES APPLY
--------------------

Depending on how you prefer to work, you can use the browser's developer console to select SVG elements in the chart and see what CSS rules apply to it. But beware that (as of 2016) Firefox does this best. Chrome and Safari doesn't show all affected rules for SVG elements.

In addition to these, most elements, especially those where you can add multiple items, like axes, series, points etc, have a _className_ option. Use this to apply specific styling. An example can be seen for [axis styling](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/axis/).

The following is an overview of what CSS rules are internally set on the Highcharts SVG elements and how to use them. 

    
    .highcharts-area

The area under an area series. Use the parent item, ._highcharts-series_ including series type, index or individual class name, to identify specific series. Replaces [plotOptions.area.fillColor](https://api.highcharts.com/highcharts/plotOptions.area.fillColor) and [plotOptions.area.fillOpacity](https://api.highcharts.com/highcharts/plotOptions.area.fillOpacity).

    
    .highcharts-axis

The top group for axis. In addition to this class name, the group will have _.highcharts-xaxis_, _.highcharts-yaxis_ or _.highcharts-coloraxis_ class names. A custom class name can be set by the _className_ option. For individually styling other axis elements, use the top group to differentiate.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/axis/).

    
    .highcharts-axis-labels

Replaces [axis.labels.style](https://api.highcharts.com/highcharts/xAxis.labels.style). Use _.highcharts-xaxis_ / _.highcharts-yaxis_ parent items or className options to distinguish axes.

    
    .highcharts-axis-title

Text styles for the axis title. Replaces [axis.title.style](https://api.highcharts.com/highcharts/xAxis.title.style).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/axis/).

    
    .highcharts-background

A rectangle for the chart background. Use it to set background fills or strokes. Replaces [chart.backgroundColor](https://api.highcharts.com/highcharts/chart.backgroundColor), [chart.borderColor](https://api.highcharts.com/highcharts/chart.borderColor) and [chart.borderWidth](https://api.highcharts.com/highcharts/chart.borderWidth) options. Backgrounds can also be set on the container div, but in that  they will not be part of the exported chart.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/chart-border-background/).

    
    .highcharts-boxplot-series  
    .highcharts-boxplot-box  
    .highcharts-boxplot-median  
    .highcharts-boxplot-stem  
    .highcharts-boxplot-whisker

The various graphic items for box plot series. The box, median, stem and whisker are nested inside the series group. Replaces colors, stroke widths and dash style options for box plots.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/boxplot/).

    
    .highcharts-button

Used for the wrapping group of the exporting button, range selector buttons in Highstock etc.

    
    .highcharts-button-symbol

The symbol for the exporting button, can be used to set stroke and fill etc. 

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/exporting-style/).

    
    .highcharts-candlestick-series .highcharts-point-up  
    .highcharts-candlestick-series .highcharts-point-down

Rules to differentiate between up or down points in Highstock candlesticks.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/candlestick/).

    
    .highcharts-color-{n}

Colors used for series, or individual points when [colorByPoint](https://api.highcharts.com/highcharts/plotOptions.column.colorByPoint) is set, typically for pie charts etc. Each such color rule sets the fill and stroke to a default color in _highcharts.css_, then these properties may be overridden by more specific rules, for example for a common stroke on pies. The best place to set your own custom colors is by modifying highcharts.css/highcharts.scss, otherwise the strokes and fills must be set more specifically. Replaces [colors](https://api.highcharts.com/highcharts/colors).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/colors/).

    
    .highcharts-contextbutton

The context button with a burger menu for the exporting module. Replaces visual options for [exporting.buttons.contextButton](https://api.highcharts.com/highcharts/exporting.buttons.contextButton) and [navigation.buttonOptions.theme](https://api.highcharts.com/highcharts/navigation.buttonOptions.theme).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/exporting-style/).

    
    .highcharts-credits

The credits label, normally found in the lower right corner of the chart. Replaces [credits.style](https://api.highcharts.com/highcharts/credits.style) and more.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/credits/). 

    
    .highcharts-crosshair

Styles for the crosshair extending from the axis to the currently highlighted point. Styling can also be differentiated by _.highcharts-crosshair-category_ or _.highcharts-crosshair-thin_.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/crosshairs/).

    
    .highcharts-crosshair-label

The label next to the crosshair in Highstock. 

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/crosshair-label/).

    
    .highcharts-data-label

The data label. Use _.highcharts-data-label-box_ to style the border or background, and _.highcharts-data-label text_ for text styling. Use the _dataLabels.className_ option to set specific class names for individual items. Replaces background, border, color and style options for [series.dataLabels](https://api.highcharts.com/highcharts/plotOptions.series.dataLabels).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/series-datalabels/).

    
    .highcharts-drilldown-axis-label

Styles for a drillable category axis label. Replaces [drilldown.activeAxisLabelStyle](https://api.highcharts.com/highcharts/drilldown.activeAxisLabelStyle).

    
    .highcharts-drilldown-data-label text

Styles for a drillable data label. Replaces [drilldown.activeDataLabelStyle](https://api.highcharts.com/highcharts/drilldown.activeDataLabelStyle).

    
    .highcharts-drillup-button

Styles for the drill-up button. Replaces [drilldown.drillUpButton.theme](https://api.highcharts.com/highcharts/drilldown.drillUpButton.theme).

    
    .highcharts-gauge-series .highcharts-dial  
    .highcharts-gauge-series .highcharts-pivot

Styles for the dial and pivot of gauge series. Replaces border and background options for [plotOptions.gauge.dial](https://api.highcharts.com/highcharts/plotOptions.gauge.dial) and [plotOptions.gauge.pivot](https://api.highcharts.com/highcharts/plotOptions.gauge.pivot).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/gauge/).  

    
    .highcharts-graph

The graph of a line or line-like series. Use the parent item, ._highcharts-series_ including series type, index or individual class name, to identify specific series. Replaces [plotOptions.series.color](https://api.highcharts.com/highcharts/plotOptions.series.color), [plotOptions.series.lineWidth](https://api.highcharts.com/highcharts/plotOptions.series.lineWidth), [plotOptions.series.dashStyle](https://api.highcharts.com/highcharts/plotOptions.series.dashStyle).

    
    .highcharts-grid-line

Styling for grid lines. Replaces [gridLineWidth](https://api.highcharts.com/highcharts/xAxis.gridLineWidth) and [gridLineColor](https://api.highcharts.com/highcharts/xAxis.gridLineColor).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/axis-grid/).

    
    .highcharts-halo

The halo appearing around the hovered point.

    
    .highcharts-legend-box

The box and border for the legend. Replaces [legend.backgroundColor](https://api.highcharts.com/highcharts/legend.backgroundColor), [legend.borderColor](https://api.highcharts.com/highcharts/legend.borderColor) and [legend.borderWidth](https://api.highcharts.com/highcharts/legend.borderWidth).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/legend/).

    
    .highcharts-legend-item

Styles for each individual legend item. Replaces [legend.itemStyle](https://api.highcharts.com/highcharts/legend.itemStyle), and [legend.itemHoverStyle](https://api.highcharts.com/highcharts/legend.itemHoverStyle) when the _:hover_ pseudo-class is added.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/legend/).

    
    .highcharts-legend-item-hidden

A legend item for a hidden series or point. Replaces [legend.itemHiddenStyle](https://api.highcharts.com/highcharts/legend.itemHiddenStyle).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/legend/).

    
    .highcharts-legend-navigation

Styles for the navigation part of the legend, the arrow up and down and the text _x/n_. Use this to set text styles. Replaces [legend.navigation.style](https://api.highcharts.com/highcharts/legend.navigation.style).

    
    .highcharts-legend-nav-active

The active arrow of the legend navigation. Replaces [legend.navigation.activeColor](https://api.highcharts.com/highcharts/legend.navigation.activeColor).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/legend/).

    
    .highcharts-legend-nav-inactive

The inactive arrow of the legend navigation. Replaces [legend.navigation.inactiveColor](https://api.highcharts.com/highcharts/legend.navigation.inactiveColor).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/legend/).

    
    .highcharts-legend-title

The legend title. Use this CSS rule for text styling. Replaces [legend.title.style](https://api.highcharts.com/highcharts/legend.title.style).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/legend/).

    
    .highcharts-loading

The loading overlay. Replaces [loading.style](https://api.highcharts.com/highcharts/loading.style) as well of the show and hide duration.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/loading/).

    
    .highcharts-loading-inner

The inner div of the loading label. Replaces [loading.labelStyle](https://api.highcharts.com/highcharts/loading.labelStyle).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/loading/).

    
    .highcharts-minor-grid-line

Replaces [axis.minorGridLineColor](https://api.highcharts.com/highcharts/xAxis.minorGridLineColor) and [axis.minorGridLineWidth](https://api.highcharts.com/highcharts/xAxis.minorGridLineWidth).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/axis-grid/).

    
    .highcharts-navigator-handle  
    .highcharts-navigator-handle-left  
    .highcharts-navigator-handle-left

Fills and strokes for the navigator handles in Highstock. Replaces [navigator.handles.backgroundColor](https://api.highcharts.com/highstock#navigator.handles.backgroundColor) and [navigator.handles.borderColor](https://api.highcharts.com/highstock#navigator.handles.borderColor).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/stock-navigator/).

    
    .highcharts-navigator-mask-outside  
    .highcharts-navigator-mask-inside

Styles for the navigator mask in Highstock, the shaded element that shows the selected area. Replaces [navigator.maskFill](https://api.highcharts.com/highstock#navigator.maskFill).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/stock-navigator/).

    
    .highcharts-navigator-outline

Styles for the Highstock navigator outline, a path element that highlights the zoomed area. Replaces [navigator.outlineColor](https://api.highcharts.com/highstock#navigator.outlineColor) and [navigator.outlineWidth](https://api.highcharts.com/highstock#navigator.outlineWidth).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/stock-navigator/).

    
    .highcharts-navigator-series

Styles for the navigator series in Highstock. Replaces options like lineWidth, fillOpacity and color for the navigator series.

    
    .highcharts-negative

A class given to negative parts of the graph, area and individual points if the [negativeColor ](https://api.highcharts.com/highcharts/plotOptions.series.negativeColor)option is set to true. 

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/series-negative-color/).

    
    .highcharts-no-data

Styles for the label shown when no data is present in the chart (requires the _no-data-to-display_ module). Replaces [noData.style](https://api.highcharts.com/highcharts/noData.style).

    
    .highcharts-null-point

Styles for null points in maps or heat maps. Replaces [plotOptions.map.nullColor](https://api.highcharts.com/highmaps#plotOptions.map.nullColor).

    
    .highcharts-ohlc-series .highcharts-point-up  
    .highcharts-ohlc-series .highcharts-point-down

Rules to differentiate between up or down points in Highstock OHLC series.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/ohlc/).

    
    .highcharts-pane

For pane backgrounds in radial charts. Replaces backgrounds and borders under the [pane.background](https://api.highcharts.com/highcharts/pane.background) option set.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/pane/).

    
    .highcharts-plot-background

A rectangle for setting fills on the plot area. Unlike _.highcharts-plot-border_, this element is drawn behind the grid, so it shouldn't be used to give the plot area a stroke.  Replaces [chart.plotBackgroundColor](https://api.highcharts.com/highcharts/chart.plotBackgroundColor).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/chart-plotarea/).

    
    .highcharts-point  
    .highcharts-point-hover  
    .highcharts-point-select

Styles for each point. Use the parent item, ._highcharts-series_ including series type, index or individual class name, to identify specific series. Use an individual _className_ option for each point to style single points.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/series-marker/).

    
    .highcharts-menu

The container of the context menu. Replaces [navigation.menuStyle](https://api.highcharts.com/highcharts/navigation.menuStyle).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/exporting-style/).

    
    .highcharts-menu-item

The list items in the context menu. Replaces [navigation.menuItemStyle](https://api.highcharts.com/highcharts/navigation.menuItemStyle). Use the _:hover_ pseudo-class to replace [navigation.menuItemHoverStyle](https://api.highcharts.com/highcharts/navigation.menuItemHoverStyle).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/exporting-style/).

    
    .highcharts-plot-band

Style the plot bands. Use the _className_ option on each band to distinguish them. Replaces color and border options for the plot band.

    
    .highcharts-plot-band-label

Style the plot band labels. Use the className option on each band to distinguish them. Replaces the [plotBands.label.style](https://api.highcharts.com/highcharts/xAxis.plotBands.label.style) option.

    
    .highcharts-plot-border

A rectangle for setting a stroke on the plot area. Unlike _.highcharts-plot-background_, this element is drawn in front of the grid. Replaces [chart.plotBorderColor](https://api.highcharts.com/highcharts/chart.plotBorderColor) and [chart.plotBorderWidth](https://api.highcharts.com/highcharts/chart.plotBorderWidth).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/chart-plotarea/).

  
 

    
    .highcharts-plot-line

Style the plot lines. Use the _className_ option on each line to distinguish them. Replaces color, dashStyle and width options for the plot line.

    
    .highcharts-plot-line-label

Style the plot line labels. Use the _className_ option on each line to distinguish them. Replaces the [plotLines.label.style](https://api.highcharts.com/highcharts/xAxis.plotLines.label.style) option.

    
    .highcharts-range-input text

Text styling for the range selector input boxes in Highstock. Use _input.highcharts-range-selector_ for the HTML input (when the boxes are active). Replaces [rangeSelector.inputStyle](https://api.highcharts.com/highstock#rangeSelector.inputStyle).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/stock-navigator/).

    
    .highcharts-range-label

Styles for the Highstock range selector labels saying "Zoom", "From" and "To". Replaces [rangeSelector.labelStyle](https://api.highcharts.com/highstock#rangeSelector.labelStyle).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/stock-navigator/).

    
    .highcharts-range-selector-buttons

Top level group for the Highstock range selector buttons. Replaces [rangeSelector.buttonTheme](https://api.highcharts.com/highstock#rangeSelector.buttonTheme).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/stock-navigator/).

    
    .highcharts-root

Matches the root _svg_ element of the chart. Use this to set styles that should be inherited by all elements, like _font-family_ or other text styles. 

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/chart/).

    
    .highcharts-scrollbar  
    .highcharts-scrollbar-arrow  
    .highcharts-scrollbar-button  
    .highcharts-scrollbar-rifles  
    .highcharts-scrollbar-thumb  
    .highcharts-scrollbar-track

Styles for the Highstock scrollbar. The thumb is the actual bar. The buttons are in each end, and each has an arrow inside it. The rifles are the small strokes on the center of the bar.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/chart/).

    
    .highcharts-series

General styling for all series. To apply styling to only a specific series type, you can define CSS rules for _.highcharts-{type}-series_, for example _.highcharts-area-series_ or _.highcharts-bar-series_. To make specific styling for one single series, you can define CSS rules for _.highcharts-series-{n}_ where _n_ is the index, or give the series a _className_ option.

Live demo of [cursor](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/series-cursor/), [dashstyle](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/series-dashstyle/), [pie series](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/pie-point/), [polygon series](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/polygon/), [waterfall series](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/waterfall/).

    
    .highcharts-selection-marker

The rectangle that appears when mouse-dragging for zooming. Replaces [chart.selectionMarkerFill](https://api.highcharts.com/highcharts/chart.selectionMarkerFill).

    
    .highcharts-stack-label

Text styles for stack labels. Replaces [yAxis.stackLabels.style](https://api.highcharts.com/highcharts/yAxis.stackLabels.style).

    
    .highcharts-subtitle

Text styles for the subtitle. Replaces [subtitle.style](https://api.highcharts.com/highcharts/subtitle.style).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/titles/).

    
    .highcharts-tick

Styles for the tick marks along the axis. Replaces [axis.tickColor](https://api.highcharts.com/highcharts/xAxis.tickColor) and [axis.tickWidth](https://api.highcharts.com/highcharts/xAxis.tickWidth). Use _.highcharts-xaxis_ / _.highcharts-yaxis_ parent items or className options to distinguish axes.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/axis-grid/).

  
 

    
    .highcharts-title

Text styles for the title. Replaces [title.style](https://api.highcharts.com/highcharts/title.style).

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/titles/).

  
 

    
    .highcharts-tooltip  
    .highcharts-tooltip-box  
    .highcharts-tooltip text
    .highcharts-tooltip-header

Styles for the tooltip. The tooltip box is the shape or path where the background and border can be set. Text styles should be applied to the text element.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/tooltip-border-background/).

    
    .highcharts-zone-{n}

When [zones](https://api.highcharts.com/highcharts/plotOptions.series.zones) are applied, each zone is given a class name with its index. A custom _className_ option can also be set in the zone options. Replaces the color, dashStyle and fillColor options for zones.

[View live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/css/color-zones/).
