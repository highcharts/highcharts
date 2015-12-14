// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2009-2014 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = root.document ?
        	factory(root) : 
            factory;
    } else {
        root.Highcharts = factory();
    }
}(typeof window !== 'undefined' ? window : this, function (w) {
