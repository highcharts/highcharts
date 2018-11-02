/**
* (c) 2016 Highsoft AS
* Authors: Jon Arild Nygard
*
* License: www.highcharts.com/license
*
* This is an experimental Highcharts module which enables visualization
* of a Venn Diagram.
*/
'use strict';
import H from '../parts/Globals.js';
import '../parts/Series.js';
var seriesType = H.seriesType;

var vennOptions = {
};

var vennSeries = {
};

var vennPoint = {
};

seriesType('venn', 'line', vennOptions, vennSeries, vennPoint);
