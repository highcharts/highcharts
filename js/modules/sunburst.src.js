/**
 * (c) 2016 Highsoft AS
 * Authors: Jon Arild Nygard
 *
 * License: www.highcharts.com/license
 *
 * This is an experimental Highcharts module which enables visualization
 * of a word cloud.
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Series.js';
import './treemap.src.js';

/**
 * Default options for the Sunburst series.
 */
var sunburstOptions = {

};

/**
 * Properties of the Sunburst series.
 */
var sunburstSeries = {

};

/**
 * Assemble the Sunburst series type.
 */
H.seriesType('sunburst', 'treemap', sunburstOptions, sunburstSeries);
