/*hcParts = {
	parts: [*/

/*jslint node: true, white: true */
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
			{name: 'Tick', component: 'Core', group: "Core"},
			{name: 'StackItem', component: 'Core', group: "Core"},
			{name: 'Axis', component: 'Core', group: "Core"},
			{name: 'Tooltip', component: 'Core', group: "Core"},
			{name: 'Pointer', component: 'Core', group: "Core"},
			{name: 'Legend', component: 'Core', group: "Core"},
			{name: 'Chart', component: 'Core', group: "Core"},
			{name: 'Series', component: 'Core', group: "Core"},
			

			/* RENDERERS */
			{name: 'VMLRenderer', component: 'VMLRenderer', group: "Renderers", depends: {component: ['Core']}},
			{name: 'CanVGRenderer', component: 'CanVGRenderer', group: "Renderers", depends: {component: ['Core']}},
		
			/* FEATURES */
			{name: 'PlotLineOrBand', component: 'PlotLineOrBand', group: "Features", depends: {component: ['Core']}},
			{name: 'LogarithmicAxis', component: 'LogarithmicAxis', group: "Features", depends: {component: ['Axis']}},
			{name: 'DateTimeAxis', component: 'DateTimeAxis', group: "Features", depends: { component: ['Core']}},

			/* MIXINS WITH SEPARATE PARTFILES */
			{name: 'CenteredSeriesMixin'},

			/* SERIETYPES */
			{name: 'LineSeries', component: 'LineSeries', group: "SerieTypes", depends: {component: ['Core']}},			
			{name: 'AreaSeries', component: 'AreaSeries', group: "SerieTypes", depends: {component: ['Core']}},
			{name: 'SplineSeries', component: 'SplineSeries', group: "SerieTypes", depends: {component: ['Core']}},
			{name: 'AreaSplineSeries', component: 'AreaSplineSeries', group: "SerieTypes", depends: {component: ['Core', 'AreaSeries','SplineSeries']}},
			{name: 'ColumnSeries', component: 'ColumnSeries', group: "SerieTypes", depends: {component: ['Core']}},
			{name: 'BarSeries', component: 'BarSeries', group: "SerieTypes", depends: {component: ['Core','ColumnSeries']}},
			{name: 'ScatterSeries', component: 'ScatterSeries', group: "SerieTypes", depends: {component: ['Core','ColumnSeries']}},
			{name: 'PieSeries', component: 'PieSeries', group: "SerieTypes", depends: {component: ['Core'], name: ['CenteredSeriesMixin']}},
			{name: 'ColumnRangeSeries', component: 'ColumnRangeSeries', group: 'SerieTypes', depends: {component: ['Core']}},


			/* STOCK */
			{name: 'DataGrouping', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
			{name: 'OHLCSeries', component: 'OHLC', group: 'Stock', depends: {component: ['Stock', 'ColumnSeries']}},
			{name: 'CandlestickSeries', component: 'Candlestick', group: 'Stock', depends: {component: ['Stock','OHLC', 'ColumnSeries']}},
			{name: 'FlagsSeries', component: 'Flags', group: 'Stock', depends: {component: ['Stock','ColumnSeries']}},
			{name: 'Scroller', component: 'Stock', group: 'Stock', depends: {component: ['Core','LineSeries']}},
			{name: 'RangeSelector', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
			{name: 'StockNavigation', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
			{name: 'StockChart', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},
			{name: 'OrdinalAxis', component: 'Stock', group: 'Stock', depends: {component: ['Core']}},

			{name: 'Facade', component: 'Core', group: "Core"},

			/* EXTRAS */
			{name: 'AreaRangeSeries', component: 'AreaRangeSeries', group: "Extra\'s", depends: {component: ['ColumnSeries', 'AreaSeries']}},
			{name: 'AreaSplineRangeSeries', component: 'AreaSplineRangeSeries', group: "Extra\'s", depends: {component: ['AreaRangeSeries', 'SplineSeries']}},
			{name: 'GaugeSeries', component: 'Gauge', group: 'Extra\'s', depends: {component: ['Core','PieSeries','LineSeries'], name: ['RadialAxis', 'Pane']}},
			{name: 'Polar', component: 'Polar', group: 'Extra\'s', depends: {component: ['Core'], name: ['RadialAxis', 'Pane']}},
			{name: 'BubbleSeries', component: 'BubbleSeries', group: "Extra\'s", depends: {component: ['Core', 'ScatterSeries']}},
			{name: 'BoxPlotSeries', component: 'BoxPlotSeries', group: "Extra\'s", depends: {component: ['ColumnSeries']}},
			{name: 'ErrorBarSeries', component: 'ErrorBarSeries', group: "Extra\'s", depends: {component: ['BoxPlotSeries']}},
			{name: 'WaterfallSeries', component: 'WaterfallSeries', group: "Extra\'s", depends: {component: ['ColumnSeries']}},
			{name: 'RadialAxis', depends: {name: ['CenteredSeriesMixin']}},
			{name: 'Pane'}
		],

		groups: {
			'Core': { description: 'This is the description for Core group', depends: {component: ['LineSeries']}},
			'Stock': { description: 'This is the description for Stock'},
			'SerieTypes': { description: 'This is the description for SerieTypes group'},
			'Extra\'s': { description: 'This is the description for Extra\'s group'},
			'Features': { description: 'This is the description for the Features group'},
			'Renderers': { description: 'This is the description for the Renderers group'}
		},

		components: {
			'Core': { description: 'This is the description for Core'},
			'Stock': { description: 'This is the description for Stock'},
			'Stock serieTypes': { description:  'This is the description for Stock SerieTypes'},
			'SerieTypes': { description:  'This is the description for SerieTypes'},
			'Gauge': { description:  'This is a components description'},
			'Polar': { description:  'This is a components description'},
			'LineSeries': { description:  'CORE .. This is a components description'},
			'AreaSeries': { description:  'This is a components description'},
			'SplineSeries': { description:  'This is a components description'},
			'ColumnSeries': { description:  'This is a components description'},
			'BarSeries': { description:  'This is a components description'},
			'ScatterSeries': { description:  'This is a components description'},
			'PieSeries': { description:  'This is a components description'},
			'AreaRangeSeries': { description:  'This is a components description'},
			'AreaSplineSeries': { description:  'This is a components description'},
			'ColumnRangeSeries': { description:  'This is a components description'}
		}
	};
