/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/annotations
 * @requires highcharts
 *
 * Annotations module
 *
 * (c) 2009-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Annotation from '../../Extensions/Annotations/Annotation.js';
import NavigationBindings from '../../Extensions/Annotations/NavigationBindings.js';
const G: AnyRecord = Highcharts;
if (!G.NavigationBindings) {
    G.NavigationBindings = NavigationBindings;
}
if (!G.Annotation) {
    G.Annotation = Annotation;
    Annotation.compose(G.Chart, G.NavigationBindings, G.Pointer, G.SVGRenderer);
}
export default Highcharts;
