/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts-autoload
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from './highcharts.src.js';
import Loader from '../Extensions/Autoload/Loader.js';
/*
@todo: Move this to a separate file that is loaded only if no autoload `script`
tags are found in the document, or create a separate
`highcharts-autoload-esm.js` bundle.
if (typeof import === 'function') {
    Loader.setRootFromURL(import.meta.url);
}
*/
Highcharts.Loader = Loader;
export default Highcharts;
