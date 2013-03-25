/*jslint node: true */
'use strict';
var HighchartsConfig = {
	parts: [
		/* CORE */
		{name: 'Globals', component: 'Core', group: "Core"},
		{name: 'Utilities', component: 'Core', group: "Core"},
		{name: 'PathAnimation', component: 'Core', group: "Core"},
		{name: 'JQueryAdapter', component: 'Core', group: "Core"},
		{name: 'Adapters', component: 'Core', group: "Core"},
		{name: 'Options', component: 'Core', group: "Core"},
		{name: 'Color', component: 'Core', group: "Core"},
		{name: 'SvgRenderer', component: 'Core', group: "Core"},
		{name: 'VMLRenderer', component: 'VMLRenderer', group: "Renderers"},
		{name: 'CanVGRenderer', component: 'CanVGRenderer', group: "Renderers"},
		{name: 'Tick', component: 'Core', group: "Core"},
		{name: 'StackItem', component: 'Core', group: "Core"},
		{name: 'Axis', component: 'Core', group: "Core"},
		{name: 'Tooltip', component: 'Core', group: "Core"},
		{name: 'Pointer', component: 'Core', group: "Core"},
		{name: 'Legend', component: 'Core', group: "Core"},
		{name: 'Chart', component: 'Core', group: "Core"},
		{name: 'Series', component: 'Core', group: "Core"},

		/* SERIETYPES */
		{name: 'LineSeries', component: 'LineSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'AreaSeries', component: 'AreaSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'SplineSeries', component: 'SplineSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'AreaSplineSeries', component: 'AreaSplineSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'ColumnSeries', component: 'ColumnSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'BarSeries', component: 'BarSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'Scatter', component: 'ScatterSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'PieSeries', component: 'PieSeries', group: "SerieTypes", depends: {component: ['Core']}},
		{name: 'AreaRangeSeries', component: 'AreaRangeSeries', group: 'SerieTypes', depends: {component: ['Core'], name: ['RadialAxis', 'Pane']}},
		{name: 'AreaSplineRangeSeries', component: 'AreaSplineRangeSeries', group: 'SerieTypes', depends: {component: ['Core']}},
		{name: 'ColumnRangeSeries', component: 'ColumnRangeSeries', group: 'SerieTypes', depends: {component: ['Core']}},

		/* STOCK */
		{name: 'DataGrouping', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
		{name: 'OHLCSeries', component: 'Stock seriestypes', group: 'Stock', depends: {component: ['Stock']}},
		{name: 'CandlestickSeries', component: 'Stock seriestypes', group: 'Stock', depends: {component: ['Stock']}},
		{name: 'FlagsSeries', component: 'Stock seriestypes', group: 'Stock', depends: {component: ['Stock']}},
		{name: 'Scroller', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
		{name: 'RangeSelector', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
		{name: 'StockNavigation', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
		{name: 'StockChart', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
		{name: 'OrdinalAxis', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},


		{name: 'Facade', component: 'Core', group: "Core"},

		/* EXTRAS */
		{name: 'Gauge', component: 'Gauge', group: 'Extra\'s', depends: {component: ['Core'], name: ['RadialAxis', 'Pane']}},
		{name: 'Polar', component: 'Polar', group: 'Extra\'s', depends: {component: ['Core'], name: ['RadialAxis', 'Pane']}},

		{name: 'RadialAxis'},
		{name: 'Pane'}

	],

	groups: {
		'Core': 'This is the description for Core',
		'Stock': 'This is the description for Stock',
		'SerieTypes': 'This is the description for SerieTypes',
		'Extra\'s': 'This is the description for Extra\'s'
	},

	components: {
		'Core': 'This is the description for Core',
		'Stock': 'This is the description for Stock',
		'Stock serieTypes': 'This is the description for Stock SerieTypes',
		'SerieTypes': 'This is the description for SerieTypes',
		'Gauge': 'This is a components description',
		'Polar': 'This is a components description',
		'LineSeries': 'This is a components description',
		'AreaSeries': 'This is a components description',
		'SplineSeries': 'This is a components description',
		'ColumnSeries': 'This is a components description',
		'BarSeries': 'This is a components description',
		'ScatterSeries': 'This is a components description',
		'PieSeries': 'This is a components description',
		'AreaRangeSeries': 'This is a components description',
		'AreaSplineSeries': 'This is a components description',
		'ColumnRangeSeries': 'This is a components description'
	}
};
