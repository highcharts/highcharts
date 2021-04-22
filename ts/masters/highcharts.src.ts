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
import Options from '../Core/Options.js';
import Fx from '../Core/Animation/Fx.js';
import Animation from '../Core/Animation/AnimationUtilities.js';
import AST from '../Core/Renderer/HTML/AST.js';
import FormatUtilities from '../Core/FormatUtilities.js';
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
G.Fx = Fx;
G.Series = Series;
// Format Utilities
G.dateFormat = FormatUtilities.dateFormat;
G.format = FormatUtilities.format;
G.numberFormat = FormatUtilities.numberFormat;
// Options
G.defaultOptions = Options.defaultOptions;
G.getOptions = Options.getOptions;
G.time = Options.defaultTime;
G.setOptions = Options.setOptions;
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
export default G;
