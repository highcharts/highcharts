/*jslint node: true, white: true */
'use strict';
var HighchartsConfig = {
		parts: [
		/* CORE */
			{name: 'Globals', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Utilities', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'PathAnimation', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'JQueryAdapter', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Adapters', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Options', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Color', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'SvgRenderer', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Tick', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'StackItem', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Axis', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Tooltip', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Pointer', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Legend', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Chart', component: 'Core', group: "Core", baseUrl: 'parts'},
			{name: 'Series', component: 'Core', group: "Core", baseUrl: 'parts'},
			

			/* RENDERERS */
			{name: 'VMLRenderer', component: 'VMLRenderer', group: "Renderers", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'CanVGRenderer', component: 'CanVGRenderer', group: "Renderers", depends: {component: ['Core']}, baseUrl: 'parts'},
		
			/* FEATURES */			
			{name: 'PlotLineOrBand', component: 'PlotLineOrBand', group: "Features", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'LogarithmicAxis', component: 'LogarithmicAxis', group: "Features", depends: {component: ['Axis']}, baseUrl: 'parts'},
			{name: 'DateTimeAxis', component: 'DateTimeAxis', group: "Features", depends: { component: ['Core']}, baseUrl: 'parts'},

			/* SERIETYPES */
			{name: 'LineSeries', component: 'LineSeries', group: "SerieTypes", depends: {component: ['Core']}, baseUrl: 'parts'},			
			{name: 'AreaSeries', component: 'AreaSeries', group: "SerieTypes", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'SplineSeries', component: 'SplineSeries', group: "SerieTypes", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'AreaSplineSeries', component: 'AreaSplineSeries', group: "SerieTypes", depends: {component: ['Core', 'AreaSeries','SplineSeries']}, baseUrl: 'parts'},
			{name: 'ColumnSeries', component: 'ColumnSeries', group: "SerieTypes", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'BarSeries', component: 'BarSeries', group: "SerieTypes", depends: {component: ['Core','ColumnSeries']}, baseUrl: 'parts'},
			{name: 'ScatterSeries', component: 'ScatterSeries', group: "SerieTypes", depends: {component: ['Core','ColumnSeries']}, baseUrl: 'parts'},
			{name: 'PieSeries', component: 'PieSeries', group: "SerieTypes", depends: {component: ['Core'], name: ['CenteredSeriesMixin']}, baseUrl: 'parts'},
			{name: 'ColumnRangeSeries', component: 'ColumnRangeSeries', group: 'SerieTypes', depends: {component: ['Core']}, baseUrl: 'parts'},


			/* STOCK */
			{name: 'DataGrouping', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'OHLCSeries', component: 'OHLC', group: 'Stock', depends: {component: ['Stock', 'ColumnSeries']}, baseUrl: 'parts'},
			{name: 'CandlestickSeries', component: 'Candlestick', group: 'Stock', depends: {component: ['Stock','OHLC', 'ColumnSeries']}, baseUrl: 'parts'},
			{name: 'FlagsSeries', component: 'Flags', group: 'Stock', depends: {component: ['Stock','ColumnSeries']}, baseUrl: 'parts'},
			{name: 'Scroller', component: 'Stock', group: 'Stock', depends: {component: ['Core','LineSeries']}, baseUrl: 'parts'},
			{name: 'RangeSelector', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'StockNavigation', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'StockChart', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'OrdinalAxis', component: 'Stock', group: 'Stock', depends: {component: ['Core']}, baseUrl: 'parts'},

			{name: 'Facade', component: 'Core', group: "Core", baseUrl: 'parts'},

			/* EXTRAS */
			{name: 'AreaRangeSeries', component: 'AreaRangeSeries', group: "Extra\'s", depends: {component: ['ColumnSeries', 'AreaSeries']}, baseUrl: 'parts-more'},
			{name: 'AreaSplineRangeSeries', component: 'AreaSplineRangeSeries', group: "Extra\'s", depends: {component: ['AreaRangeSeries', 'SplineSeries']}, baseUrl: 'parts-more'},
			{name: 'GaugeSeries', component: 'Gauge', group: 'Extra\'s', depends: {component: ['Core','PieSeries','LineSeries'], name: ['RadialAxis', 'Pane']}, baseUrl: 'parts-more'},
			{name: 'Polar', component: 'Polar', group: 'Extra\'s', depends: {component: ['Core'], name: ['RadialAxis', 'Pane']}, baseUrl: 'parts-more'},
			{name: 'BubbleSeries', component: 'BubbleSeries', group: "Extra\'s", depends: {component: ['Core', 'ScatterSeries']}, baseUrl: 'parts-more'},
			{name: 'BoxPlotSeries', component: 'BoxPlotSeries', group: "Extra\'s", depends: {component: ['ColumnSeries']}, baseUrl: 'parts-more'},
			{name: 'ErrorBarSeries', component: 'ErrorBarSeries', group: "Extra\'s", depends: {component: ['BoxPlotSeries']}, baseUrl: 'parts-more'},
			{name: 'WaterfallSeries', component: 'WaterfallSeries', group: "Extra\'s", depends: {component: ['ColumnSeries']}, baseUrl: 'parts-more'},
			{name: 'RadialAxis', depends: {name: ['CenteredSeriesMixin']}, baseUrl: 'parts-more'},
			{name: 'Pane', baseUrl: 'parts-more'},
			{name: 'DataLabels', component: 'DataLabels', group: "Features", depends: {component: ['Core']}, baseUrl: 'parts'},
			{name: 'funnel.src', component: 'Funnel', group: "Modules", depends: {component: ['Core']}, baseUrl: 'modules'},
		],

		groups: {
			'Core': { description: 'This is the description for Core group', depends: {component: ['LineSeries']}},
			'Stock': { description: 'This is the description for Stock'},
			'SerieTypes': { description: 'This is the description for SerieTypes group'},
			'Extra\'s': { description: 'This is the description for Extra\'s group'},
			'Features': { description: 'This is the description for the Features group'},
			'Renderers': { description: 'This is the description for the Renderers group'},
			'Modules':  { description: 'This is the description for the Modules group'}
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
			'ColumnRangeSeries': { description:  'This is a components description'},
			'Funnel': {description: 'THis is a description for Funnel'}
		}
	};