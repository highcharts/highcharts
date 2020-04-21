/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Axis from '../parts/Axis.js';
import Tick from '../parts/Tick.js';
import TreeGridAxis from './TreeGridAxis.js';
import TreeGridTick from './TreeGridTick.js';
import './GridAxis.js';
import '../modules/broken-axis.src.js';
/* eslint-disable valid-jsdoc */
TreeGridAxis.compose(Axis);
TreeGridTick.compose(Tick);
