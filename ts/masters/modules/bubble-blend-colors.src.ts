/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/bubble-blend-colors
 * @requires highcharts
 *
 * Blend colors composition for bubble series
 *
 * (c) 2010-2022
 *
 * License: www.highcharts.com/license
 */
'use strict';
import BubbleBlendColors from '../../Extensions/BubbleBlendColors.js';

const G: AnyRecord = Highcharts;

BubbleBlendColors.compose(G.seriesTypes.bubble);
