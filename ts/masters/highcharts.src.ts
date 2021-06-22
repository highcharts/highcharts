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
import DefaultOptions from '../Core/DefaultOptions.js';
import Fx from '../Core/Animation/Fx.js';
import Animation from '../Core/Animation/AnimationUtilities.js';
import AST from '../Core/Renderer/HTML/AST.js';
import FormatUtilities from '../Core/FormatUtilities.js';
import SVGElement from '../Core/Renderer/SVG/SVGElement.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import HTMLElement from '../Core/Renderer/HTML/HTMLElement.js';
import HTMLRenderer from '../Core/Renderer/HTML/HTMLRenderer.js';
import Axis from '../Core/Axis/Axis.js';
import DateTimeAxis from '../Core/Axis/DateTimeAxis.js';
import LogarithmicAxis from '../Core/Axis/LogarithmicAxis.js';
import PlotLineOrBand from '../Core/Axis/PlotLineOrBand.js';
import Tick from '../Core/Axis/Tick.js';
import Tooltip from '../Core/Tooltip.js';
import Point from '../Core/Series/Point.js';
import Pointer from '../Core/Pointer.js';
import MSPointer from '../Core/MSPointer.js';
import Legend from '../Core/Legend.js';
import Chart from '../Core/Chart/Chart.js';
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
import Responsive from '../Core/Responsive.js';
import Color from '../Core/Color/Color.js';
import Time from '../Core/Time.js';
const G: AnyRecord = Highcharts;
// Animation
G.animate = Animation.animate;
G.animObject = Animation.animObject;
G.getDeferredAnimation = Animation.getDeferredAnimation;
G.setAnimation = Animation.setAnimation;
G.stop = Animation.stop;
G.timers = Fx.timers;
// Classes
G.AST = AST;
G.Axis = Axis;
G.Chart = Chart;
G.chart = Chart.chart;
G.Fx = Fx;
G.Legend = Legend;
G.PlotLineOrBand = PlotLineOrBand;
G.Point = Point;
G.Pointer = (MSPointer.isRequired() ? MSPointer : Pointer);
G.Series = Series;
G.SVGElement = SVGElement;
G.SVGRenderer = SVGRenderer;
G.Tick = Tick;
G.Time = Time;
G.Tooltip = Tooltip;
// Color
G.Color = Color;
G.color = Color.parse;
// Compositions
HTMLRenderer.compose(SVGRenderer);
HTMLElement.compose(SVGElement);
// DefaultOptions
G.defaultOptions = DefaultOptions.defaultOptions;
G.getOptions = DefaultOptions.getOptions;
G.time = DefaultOptions.defaultTime;
G.setOptions = DefaultOptions.setOptions;
// Format Utilities
G.dateFormat = FormatUtilities.dateFormat;
G.format = FormatUtilities.format;
G.numberFormat = FormatUtilities.numberFormat;
// Utilities
G.addEvent = Utilities.addEvent;
G.arrayMax = Utilities.arrayMax;
G.arrayMin = Utilities.arrayMin;
G.attr = Utilities.attr;
G.clearTimeout = Utilities.clearTimeout;
G.correctFloat = Utilities.correctFloat;
G.createElement = Utilities.createElement;
G.css = Utilities.css;
G.defined = Utilities.defined;
G.destroyObjectProperties = Utilities.destroyObjectProperties;
G.discardElement = Utilities.discardElement;
G.erase = Utilities.erase;
G.error = Utilities.error;
G.extend = Utilities.extend;
G.extendClass = Utilities.extendClass;
G.find = Utilities.find;
G.fireEvent = Utilities.fireEvent;
G.getMagnitude = Utilities.getMagnitude;
G.getStyle = Utilities.getStyle;
G.inArray = Utilities.inArray;
G.isArray = Utilities.isArray;
G.isClass = Utilities.isClass;
G.isDOMElement = Utilities.isDOMElement;
G.isFunction = Utilities.isFunction;
G.isNumber = Utilities.isNumber;
G.isObject = Utilities.isObject;
G.isString = Utilities.isString;
G.keys = Utilities.keys;
G.merge = Utilities.merge;
G.normalizeTickInterval = Utilities.normalizeTickInterval;
G.objectEach = Utilities.objectEach;
G.offset = Utilities.offset;
G.pad = Utilities.pad;
G.pick = Utilities.pick;
G.pInt = Utilities.pInt;
G.relativeLength = Utilities.relativeLength;
G.removeEvent = Utilities.removeEvent;
G.splat = Utilities.splat;
G.stableSort = Utilities.stableSort;
G.syncTimeout = Utilities.syncTimeout;
G.timeUnits = Utilities.timeUnits;
G.uniqueKey = Utilities.uniqueKey;
G.useSerialIds = Utilities.useSerialIds;
G.wrap = Utilities.wrap;
// Compositions
DateTimeAxis.compose(Axis);
LogarithmicAxis.compose(Axis);
Responsive.compose(Chart);
// Default Export
export default G;
