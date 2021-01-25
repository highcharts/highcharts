/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts
 *
 * (c) 2009-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../Core/Globals.js';
import Utilities from '../Core/Utilities.js';
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
Highcharts.addEvent = Utilities.addEvent;
Highcharts.arrayMax = Utilities.arrayMax;
Highcharts.arrayMin = Utilities.arrayMin;
Highcharts.attr = Utilities.attr;
Highcharts.clearTimeout = Utilities.clearTimeout;
Highcharts.correctFloat = Utilities.correctFloat;
Highcharts.createElement = Utilities.createElement;
Highcharts.css = Utilities.css;
Highcharts.defined = Utilities.defined;
Highcharts.destroyObjectProperties = Utilities.destroyObjectProperties;
Highcharts.discardElement = Utilities.discardElement;
Highcharts.erase = Utilities.erase;
Highcharts.error = Utilities.error;
Highcharts.extend = Utilities.extend;
Highcharts.extendClass = Utilities.extendClass;
Highcharts.find = Utilities.find;
Highcharts.fireEvent = Utilities.fireEvent;
Highcharts.format = Utilities.format;
Highcharts.getMagnitude = Utilities.getMagnitude;
Highcharts.getStyle = Utilities.getStyle;
Highcharts.inArray = Utilities.inArray;
Highcharts.isArray = Utilities.isArray;
Highcharts.isClass = Utilities.isClass;
Highcharts.isDOMElement = Utilities.isDOMElement;
Highcharts.isFunction = Utilities.isFunction;
Highcharts.isNumber = Utilities.isNumber;
Highcharts.isObject = Utilities.isObject;
Highcharts.isString = Utilities.isString;
Highcharts.keys = Utilities.keys;
Highcharts.merge = Utilities.merge;
Highcharts.normalizeTickInterval = Utilities.normalizeTickInterval;
Highcharts.numberFormat = Utilities.numberFormat;
Highcharts.objectEach = Utilities.objectEach;
Highcharts.offset = Utilities.offset;
Highcharts.pad = Utilities.pad;
Highcharts.pick = Utilities.pick;
Highcharts.pInt = Utilities.pInt;
Highcharts.relativeLength = Utilities.relativeLength;
Highcharts.removeEvent = Utilities.removeEvent;
Highcharts.splat = Utilities.splat;
Highcharts.stableSort = Utilities.stableSort;
Highcharts.syncTimeout = Utilities.syncTimeout;
Highcharts.timeUnits = Utilities.timeUnits;
Highcharts.uniqueKey = Utilities.uniqueKey;
Highcharts.useSerialIds = Utilities.useSerialIds;
Highcharts.wrap = Utilities.wrap;
Highcharts.Series = Series;
export default Highcharts;
