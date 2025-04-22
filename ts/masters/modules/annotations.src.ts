/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/annotations
 * @requires highcharts
 *
 * Annotations module
 *
 * (c) 2009-2025 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Annotation from '../../Extensions/Annotations/Annotation.js';
import NavigationBindings from '../../Extensions/Annotations/NavigationBindings.js';
const G: AnyRecord = Highcharts;
G.Annotation = G.Annotation || Annotation;
G.NavigationBindings = G.NavigationBindings || NavigationBindings;
G.Annotation.compose(G.Chart, G.NavigationBindings, G.Pointer, G.SVGRenderer);
export default Highcharts;
