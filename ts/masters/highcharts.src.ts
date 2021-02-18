/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts
 *
 * (c) 2009-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../Core/Globals.js';
import Utilities from '../Core/Utilities.js';
import AST from '../Core/Renderer/HTML/AST.js';
import '../Core/Renderer/SVG/SVGRenderer.js';
import '../Core/Renderer/HTML/HTMLElement.js';
import '../Core/Renderer/HTML/HTMLRenderer.js';
import '../Core/Axis/Axis.js';
import '../Core/Axis/DateTimeAxis.js';
import '../Core/Axis/LogarithmicAxis.js';
import '../Core/Axis/PlotLineOrBand.js';
import '../Core/Tooltip.js';
import '../Core/Pointer.js';
import '../Core/MSPointer.js';
import '../Core/Legend.js';
import '../Core/Chart/Chart.js';
import '../Extensions/ScrollablePlotArea.js';
import '../Extensions/Stacking.js';
import Series from '../Core/Series/Series.js';
import '../Series/Line/LineSeries.js';
import '../Series/Area/AreaSeries.js';
import '../Series/Spline/SplineSeries.js';
import '../Series/AreaSpline/AreaSplineSeries.js';
import '../Series/Column/ColumnSeries.js';
import '../Series/Bar/BarSeries.js';
import '../Series/Scatter/ScatterSeries.js';
import '../Series/Pie/PieSeries.js';
import '../Core/Series/DataLabels.js';
import '../Extensions/OverlappingDataLabels.js';
import '../Core/Responsive.js';

// Utilities
(Highcharts as any).addEvent = Utilities.addEvent;
(Highcharts as any).arrayMax = Utilities.arrayMax;
(Highcharts as any).arrayMin = Utilities.arrayMin;
(Highcharts as any).attr = Utilities.attr;
(Highcharts as any).clearTimeout = Utilities.clearTimeout;
(Highcharts as any).correctFloat = Utilities.correctFloat;
(Highcharts as any).createElement = Utilities.createElement;
(Highcharts as any).css = Utilities.css;
(Highcharts as any).defined = Utilities.defined;
(Highcharts as any).destroyObjectProperties = Utilities.destroyObjectProperties;
(Highcharts as any).discardElement = Utilities.discardElement;
(Highcharts as any).erase = Utilities.erase;
(Highcharts as any).error = Utilities.error;
(Highcharts as any).extend = Utilities.extend;
(Highcharts as any).extendClass = Utilities.extendClass;
(Highcharts as any).find = Utilities.find;
(Highcharts as any).fireEvent = Utilities.fireEvent;
(Highcharts as any).format = Utilities.format;
(Highcharts as any).getMagnitude = Utilities.getMagnitude;
(Highcharts as any).getStyle = Utilities.getStyle;
(Highcharts as any).inArray = Utilities.inArray;
(Highcharts as any).isArray = Utilities.isArray;
(Highcharts as any).isClass = Utilities.isClass;
(Highcharts as any).isDOMElement = Utilities.isDOMElement;
(Highcharts as any).isFunction = Utilities.isFunction;
(Highcharts as any).isNumber = Utilities.isNumber;
(Highcharts as any).isObject = Utilities.isObject;
(Highcharts as any).isString = Utilities.isString;
(Highcharts as any).keys = Utilities.keys;
(Highcharts as any).merge = Utilities.merge;
(Highcharts as any).normalizeTickInterval = Utilities.normalizeTickInterval;
(Highcharts as any).numberFormat = Utilities.numberFormat;
(Highcharts as any).objectEach = Utilities.objectEach;
(Highcharts as any).offset = Utilities.offset;
(Highcharts as any).pad = Utilities.pad;
(Highcharts as any).pick = Utilities.pick;
(Highcharts as any).pInt = Utilities.pInt;
(Highcharts as any).relativeLength = Utilities.relativeLength;
(Highcharts as any).removeEvent = Utilities.removeEvent;
(Highcharts as any).splat = Utilities.splat;
(Highcharts as any).stableSort = Utilities.stableSort;
(Highcharts as any).syncTimeout = Utilities.syncTimeout;
(Highcharts as any).timeUnits = Utilities.timeUnits;
(Highcharts as any).uniqueKey = Utilities.uniqueKey;
(Highcharts as any).useSerialIds = Utilities.useSerialIds;
(Highcharts as any).wrap = Utilities.wrap;

// Classes
(Highcharts as any).AST = AST;
(Highcharts as any).Series = Series;

export default Highcharts;
